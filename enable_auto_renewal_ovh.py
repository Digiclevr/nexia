#!/usr/bin/env python3
"""
Script pour activer le renouvellement automatique sur TOUS les domaines OVH
⚠️  ATTENTION: Ce script modifie la configuration de renouvellement !
"""

import os
import requests
import hashlib
import time
import json

def ovh_signature(app_secret, consumer_key, method, url, body, timestamp):
    """Génère la signature OVH"""
    data = f"{app_secret}+{consumer_key}+{method}+{url}+{body}+{timestamp}"
    return "$1$" + hashlib.sha1(data.encode()).hexdigest()

def enable_auto_renewal_all_domains():
    """Active le renouvellement automatique pour TOUS les domaines OVH"""
    
    # Configuration API OVH
    app_key = os.getenv('OVH_APP_KEY')
    app_secret = os.getenv('OVH_APP_SECRET')
    consumer_key = os.getenv('OVH_CONSUMER_KEY')
    
    if not all([app_key, app_secret, consumer_key]):
        print("❌ Credentials OVH manquants !")
        print("Configurez : OVH_APP_KEY, OVH_APP_SECRET, OVH_CONSUMER_KEY")
        return
    
    base_url = "https://eu.api.ovh.com/1.0"
    
    try:
        # 1. Lister tous les domaines
        url = f"{base_url}/domain"
        timestamp = str(int(time.time()))
        signature = ovh_signature(app_secret, consumer_key, "GET", url, "", timestamp)
        
        headers = {
            'X-Ovh-Application': app_key,
            'X-Ovh-Consumer': consumer_key,
            'X-Ovh-Timestamp': timestamp,
            'X-Ovh-Signature': signature,
            'Content-Type': 'application/json'
        }
        
        print("🔍 Récupération de la liste des domaines...")
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"❌ Erreur API : {response.status_code}")
            print(response.text)
            return
        
        domains = response.json()
        print(f"✅ {len(domains)} domaines trouvés")
        
        # 2. Activation du renouvellement automatique pour chaque domaine
        success_count = 0
        error_count = 0
        already_auto_count = 0
        
        print("\n🔄 ACTIVATION RENOUVELLEMENT AUTOMATIQUE...")
        print("=" * 60)
        
        for i, domain in enumerate(domains, 1):
            print(f"[{i:3d}/{len(domains)}] 📋 {domain}")
            
            # D'abord vérifier le statut actuel
            service_url = f"{base_url}/domain/{domain}/serviceInfos"
            timestamp = str(int(time.time()))
            signature = ovh_signature(app_secret, consumer_key, "GET", service_url, "", timestamp)
            
            headers['X-Ovh-Timestamp'] = timestamp
            headers['X-Ovh-Signature'] = signature
            
            service_response = requests.get(service_url, headers=headers)
            
            if service_response.status_code != 200:
                print(f"        ❌ Erreur lecture statut")
                error_count += 1
                time.sleep(0.2)
                continue
            
            service_info = service_response.json()
            current_renew = service_info.get('renew', {})
            
            # Si déjà en automatique, on passe
            if current_renew.get('automatic'):
                print(f"        ✅ Déjà AUTO")
                already_auto_count += 1
                time.sleep(0.2)
                continue
            
            # Sinon, on active l'auto-renewal
            renew_data = {
                "automatic": True,
                "deleteAtExpiration": False,
                "forced": False,
                "period": None  # Période par défaut
            }
            
            # Mise à jour du renouvellement
            put_url = f"{base_url}/domain/{domain}/serviceInfos"
            body = json.dumps({"renew": renew_data})
            timestamp = str(int(time.time()))
            signature = ovh_signature(app_secret, consumer_key, "PUT", put_url, body, timestamp)
            
            headers['X-Ovh-Timestamp'] = timestamp
            headers['X-Ovh-Signature'] = signature
            
            put_response = requests.put(put_url, headers=headers, data=body)
            
            if put_response.status_code == 200:
                print(f"        🟢 MANUEL → AUTO ✅")
                success_count += 1
            else:
                print(f"        ❌ Erreur activation : {put_response.status_code}")
                if put_response.text:
                    print(f"        📝 {put_response.text[:100]}")
                error_count += 1
            
            # Pause pour éviter rate limiting
            time.sleep(0.3)
        
        # 3. Résumé final
        print("\n" + "="*60)
        print("📊 RÉSUMÉ FINAL :")
        print(f"Total domaines       : {len(domains)}")
        print(f"Déjà automatique     : {already_auto_count}")
        print(f"Activés avec succès  : {success_count}")
        print(f"Erreurs              : {error_count}")
        print(f"AUTO après operation : {already_auto_count + success_count}")
        
        if success_count > 0:
            print(f"\n🎉 {success_count} domaines passés en RENOUVELLEMENT AUTOMATIQUE !")
        
        if error_count > 0:
            print(f"\n⚠️  {error_count} domaines n'ont pas pu être modifiés")
            
    except Exception as e:
        print(f"❌ Erreur générale : {e}")

def confirmation_prompt():
    """Demande confirmation avant modification massive"""
    print("⚠️  ATTENTION - MODIFICATION MASSIVE")
    print("Ce script va activer le renouvellement automatique sur TOUS vos domaines OVH.")
    print("Cela peut représenter des coûts importants selon le nombre de domaines.")
    print("")
    
    response = input("Êtes-vous sûr de vouloir continuer ? (tapez 'OUI' pour confirmer): ")
    return response.upper() == 'OUI'

if __name__ == "__main__":
    print("🤖 ACTIVATION RENOUVELLEMENT AUTOMATIQUE - TOUS DOMAINES OVH")
    print("=" * 60)
    
    if confirmation_prompt():
        enable_auto_renewal_all_domains()
    else:
        print("❌ Opération annulée par l'utilisateur")