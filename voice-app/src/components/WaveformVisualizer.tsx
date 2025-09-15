import React, { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  isRecording: boolean;
  audioStream: MediaStream | null;
  level: number;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isRecording,
  audioStream,
  level
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  const [bars] = useState<number[]>(Array(32).fill(0));

  useEffect(() => {
    if (isRecording && audioStream) {
      setupAudioAnalysis();
    } else {
      cleanupAudioAnalysis();
    }

    return () => cleanupAudioAnalysis();
  }, [isRecording, audioStream]);

  const setupAudioAnalysis = () => {
    if (!audioStream) return;

    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      const source = audioContextRef.current.createMediaStreamSource(audioStream);
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      
      startVisualization();
    } catch (error) {
      console.error('Failed to setup audio analysis:', error);
    }
  };

  const cleanupAudioAnalysis = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = undefined;
    }
  };

  const startVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current || !dataArrayRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bars.length;
      const centerY = canvas.height / 2;
      
      // Draw waveform bars
      for (let i = 0; i < bars.length; i++) {
        const barHeight = isRecording 
          ? (dataArrayRef.current[i] || 0) / 255 * (canvas.height * 0.8)
          : Math.sin(Date.now() * 0.01 + i * 0.5) * 20 + 10;
        
        bars[i] = barHeight;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (isRecording) {
          gradient.addColorStop(0, '#3b82f6');
          gradient.addColorStop(0.5, '#06b6d4');
          gradient.addColorStop(1, '#8b5cf6');
        } else {
          gradient.addColorStop(0, '#475569');
          gradient.addColorStop(1, '#1e293b');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth + 1,
          centerY - barHeight / 2,
          barWidth - 2,
          barHeight
        );
      }
      
      // Add glow effect when recording
      if (isRecording) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#3b82f6';
        
        // Redraw with glow
        for (let i = 0; i < bars.length; i++) {
          const barHeight = bars[i];
          ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
          ctx.fillRect(
            i * barWidth + 1,
            centerY - barHeight / 2,
            barWidth - 2,
            barHeight
          );
        }
        
        ctx.shadowBlur = 0;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Fallback visualization when no audio stream
  useEffect(() => {
    if (!isRecording && !audioStream) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / bars.length;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < bars.length; i++) {
          const barHeight = Math.sin(Date.now() * 0.005 + i * 0.3) * 15 + 5;
          
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, '#374151');
          gradient.addColorStop(1, '#1f2937');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(
            i * barWidth + 1,
            centerY - barHeight / 2,
            barWidth - 2,
            barHeight
          );
        }
        
        if (!isRecording) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [isRecording, audioStream]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        width={300}
        height={80}
        className="rounded-lg bg-slate-900/50 border border-slate-700/50"
      />
      
      {/* Status indicator */}
      <div className="flex items-center space-x-2 text-xs">
        <div className={`
          w-2 h-2 rounded-full transition-all duration-300
          ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}
        `} />
        <span className={`
          transition-colors duration-300
          ${isRecording ? 'text-red-400' : 'text-slate-500'}
        `}>
          {isRecording ? 'Recording...' : 'Ready'}
        </span>
      </div>
    </div>
  );
};

export default WaveformVisualizer;