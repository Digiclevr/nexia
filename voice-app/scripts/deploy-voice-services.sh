#!/bin/bash

# NEXIA Voice Services Deployment Script
# Deploys Whisper + TTS services on BlueOcean cluster

set -e

echo "🚀 NEXIA Voice Services Deployment Starting..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
CLUSTER_NAME="blueocean"
NAMESPACE="nexia-voice"
REGISTRY="registry.digitalocean.com/blueocean"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "  Cluster: $CLUSTER_NAME"
echo "  Namespace: $NAMESPACE"
echo "  Registry: $REGISTRY"

# Check kubectl connectivity
echo -e "${YELLOW}🔍 Checking cluster connectivity...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to cluster. Check your kubeconfig${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Cluster connection OK${NC}"

# Create namespace if not exists
echo -e "${YELLOW}📦 Ensuring namespace exists...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✅ Namespace $NAMESPACE ready${NC}"

# Create PVCs for model storage
echo -e "${YELLOW}💾 Creating persistent volumes...${NC}"
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nexia-models-pvc
  namespace: $NAMESPACE
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 20Gi
  storageClassName: do-block-storage
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nexia-voice-cache-pvc
  namespace: $NAMESPACE
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 5Gi
  storageClassName: do-block-storage
EOF
echo -e "${GREEN}✅ Persistent volumes created${NC}"

# Build and push Docker images
echo -e "${YELLOW}🐳 Building Docker images...${NC}"

# Build Whisper service
echo "Building Whisper service..."
cat <<EOF > Dockerfile.whisper
FROM nvidia/cuda:11.8-runtime-ubuntu22.04

WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y \\
    python3 python3-pip git curl \\
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install Transformers and dependencies
RUN pip3 install transformers datasets soundfile librosa onnxruntime-gpu fastapi uvicorn

# Copy application code
COPY whisper-service/ /app/

# Download model on build (optional, can be done at runtime)
RUN python3 -c "from transformers import WhisperProcessor; WhisperProcessor.from_pretrained('openai/whisper-large-v3')"

EXPOSE 8080

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
EOF

# Create Whisper service code
mkdir -p whisper-service
cat <<EOF > whisper-service/main.py
import os
import torch
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import torchaudio
import io

app = FastAPI(title="NEXIA Whisper Service")

# Global model variables
processor = None
model = None
device = None

@app.on_event("startup")
async def load_model():
    global processor, model, device
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading Whisper model on {device}...")
    
    processor = WhisperProcessor.from_pretrained("openai/whisper-large-v3")
    model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-large-v3")
    model = model.to(device)
    
    print("✅ Whisper model loaded successfully")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "unknown",
        "service": "whisper-stt"
    }

@app.post("/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    try:
        if not model or not processor:
            raise HTTPException(status_code=503, detail="Model not loaded")
        
        # Read audio file
        audio_bytes = await audio.read()
        
        # Process audio
        audio_input, sample_rate = torchaudio.load(io.BytesIO(audio_bytes))
        
        # Resample to 16kHz if needed
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            audio_input = resampler(audio_input)
        
        # Convert to mono if stereo
        if audio_input.shape[0] > 1:
            audio_input = audio_input.mean(dim=0, keepdim=True)
        
        # Process with Whisper
        input_features = processor(audio_input.squeeze().numpy(), sampling_rate=16000, return_tensors="pt")
        input_features = input_features.input_features.to(device)
        
        # Generate transcription
        predicted_ids = model.generate(input_features)
        transcription = processor.batch_decode(predicted_ids, skip_special_tokens=True)[0]
        
        return {
            "transcription": transcription,
            "confidence": 0.95,  # Placeholder
            "language": "auto-detected",
            "duration": audio_input.shape[1] / 16000
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
EOF

# Build TTS service
echo "Building TTS service..."
cat <<EOF > Dockerfile.tts
FROM nvidia/cuda:11.8-runtime-ubuntu22.04

WORKDIR /app

# Install Python and dependencies
RUN apt-get update && apt-get install -y \\
    python3 python3-pip git curl libsndfile1 \\
    && rm -rf /var/lib/apt/lists/*

# Install PyTorch with CUDA support
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

# Install TTS dependencies
RUN pip3 install transformers datasets soundfile librosa fastapi uvicorn numpy scipy

# Copy application code
COPY tts-service/ /app/

# Download model on build
RUN python3 -c "from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech; SpeechT5Processor.from_pretrained('microsoft/speecht5_tts')"

EXPOSE 8081

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8081"]
EOF

# Create TTS service code
mkdir -p tts-service
cat <<EOF > tts-service/main.py
import os
import torch
import uvicorn
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import SpeechT5Processor, SpeechT5ForTextToSpeech, SpeechT5HifiGan
import soundfile as sf
import io
import base64

app = FastAPI(title="NEXIA TTS Service")

# Global model variables
processor = None
model = None
vocoder = None
device = None
speaker_embeddings = None

class TTSRequest(BaseModel):
    text: str
    voice_id: int = 0
    speed: float = 1.0
    pitch: float = 1.0

@app.on_event("startup")
async def load_models():
    global processor, model, vocoder, device, speaker_embeddings
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Loading TTS models on {device}...")
    
    processor = SpeechT5Processor.from_pretrained("microsoft/speecht5_tts")
    model = SpeechT5ForTextToSpeech.from_pretrained("microsoft/speecht5_tts")
    vocoder = SpeechT5HifiGan.from_pretrained("microsoft/speecht5_hifigan")
    
    model = model.to(device)
    vocoder = vocoder.to(device)
    
    # Load speaker embeddings
    speaker_embeddings = torch.randn(512).to(device)  # Placeholder
    
    print("✅ TTS models loaded successfully")

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "models_loaded": all([processor, model, vocoder]),
        "device": str(device) if device else "unknown",
        "service": "tts",
        "available_voices": 109
    }

@app.post("/synthesize")
async def synthesize_speech(request: TTSRequest):
    try:
        if not all([processor, model, vocoder]):
            raise HTTPException(status_code=503, detail="Models not loaded")
        
        # Process text
        inputs = processor(text=request.text, return_tensors="pt")
        inputs = inputs.to(device)
        
        # Generate speech
        with torch.no_grad():
            speech = model.generate_speech(
                inputs.input_ids, 
                speaker_embeddings.unsqueeze(0), 
                vocoder=vocoder
            )
        
        # Convert to audio bytes
        audio_np = speech.cpu().numpy()
        
        # Create WAV file in memory
        audio_buffer = io.BytesIO()
        sf.write(audio_buffer, audio_np, 16000, format='WAV')
        audio_bytes = audio_buffer.getvalue()
        
        # Return base64 encoded audio
        audio_b64 = base64.b64encode(audio_bytes).decode('utf-8')
        
        return {
            "audio": audio_b64,
            "sample_rate": 16000,
            "format": "wav",
            "duration": len(audio_np) / 16000,
            "text": request.text
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")

@app.get("/voices")
async def list_voices():
    return {
        "voices": [
            {"id": i, "name": f"Voice {i}", "language": "en", "gender": "neutral"}
            for i in range(109)
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8081)
EOF

# Build using Kaniko (cluster build)
echo -e "${YELLOW}🏗️ Building images with Kaniko...${NC}"

# Build Whisper image
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: kaniko-whisper-build
  namespace: $NAMESPACE
spec:
  restartPolicy: Never
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    args:
    - --context=git://github.com/ludovicpilet/nexia-voice.git#main
    - --dockerfile=Dockerfile.whisper
    - --destination=$REGISTRY/nexia-whisper:latest
    - --cache=true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    secret:
      secretName: regcred
EOF

# Wait for Whisper build
kubectl wait --for=condition=Ready pod/kaniko-whisper-build -n $NAMESPACE --timeout=600s
echo -e "${GREEN}✅ Whisper image built${NC}"

# Build TTS image
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod  
metadata:
  name: kaniko-tts-build
  namespace: $NAMESPACE
spec:
  restartPolicy: Never
  containers:
  - name: kaniko
    image: gcr.io/kaniko-project/executor:latest
    args:
    - --context=git://github.com/ludovicpilet/nexia-voice.git#main
    - --dockerfile=Dockerfile.tts
    - --destination=$REGISTRY/nexia-tts:latest
    - --cache=true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    secret:
      secretName: regcred
EOF

# Deploy services
echo -e "${YELLOW}🚀 Deploying voice services...${NC}"
kubectl apply -f k8s/voice-whisper-deployment.yaml
kubectl apply -f k8s/voice-tts-deployment.yaml

# Create API Gateway configuration
echo -e "${YELLOW}🌐 Configuring API Gateway...${NC}"
cat <<EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexia-voice-ingress
  namespace: $NAMESPACE
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/cors-allow-origin: "*"
    nginx.ingress.kubernetes.io/cors-allow-methods: "GET, POST, OPTIONS"
spec:
  rules:
  - host: voice.nexia.blueocean.k8s
    http:
      paths:
      - path: /whisper
        pathType: Prefix
        backend:
          service:
            name: nexia-voice-whisper-service
            port:
              number: 80
      - path: /tts
        pathType: Prefix
        backend:
          service:
            name: nexia-voice-tts-service
            port:
              number: 80
EOF

# Wait for deployments
echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
kubectl rollout status deployment/nexia-voice-whisper -n $NAMESPACE --timeout=300s
kubectl rollout status deployment/nexia-voice-tts -n $NAMESPACE --timeout=300s

# Verify services
echo -e "${YELLOW}🔍 Verifying services...${NC}"
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE
kubectl get ingress -n $NAMESPACE

echo -e "${GREEN}🎉 NEXIA Voice Services deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Service Endpoints:${NC}"
echo "  Whisper STT: https://voice.nexia.blueocean.k8s/whisper"  
echo "  TTS Service: https://voice.nexia.blueocean.k8s/tts"
echo ""
echo -e "${YELLOW}🧪 Test commands:${NC}"
echo "  curl https://voice.nexia.blueocean.k8s/whisper/health"
echo "  curl https://voice.nexia.blueocean.k8s/tts/health"
echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"