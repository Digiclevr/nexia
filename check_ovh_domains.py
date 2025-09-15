#!/usr/bin/env python3
"""
Script de vérification des domaines OVH en renouvellement manuel
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

def check_ovh_domains():
    """Vérifie les domaines OVH en renouvellement manuel"""
    
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
        
        # 2. Vérifier le statut de renouvellement pour chaque domaine
        manual_renewal_count = 0
        manual_renewal_domains = []
        
        for domain in domains:
            print(f"📋 Vérification : {domain}")
            
            # Récupérer les infos de service
            service_url = f"{base_url}/domain/{domain}/serviceInfos"
            timestamp = str(int(time.time()))
            signature = ovh_signature(app_secret, consumer_key, "GET", service_url, "", timestamp)
            
            headers['X-Ovh-Timestamp'] = timestamp
            headers['X-Ovh-Signature'] = signature
            
            service_response = requests.get(service_url, headers=headers)
            
            if service_response.status_code == 200:
                service_info = service_response.json()
                renew_type = service_info.get('renew', {}).get('automatic', None)
                
                if not renew_type:  # Renouvellement manuel
                    manual_renewal_count += 1
                    manual_renewal_domains.append({
                        'domain': domain,
                        'expiration': service_info.get('expiration'),
                        'status': service_info.get('status')
                    })
                    print(f"  ⚠️  MANUEL - Expire : {service_info.get('expiration')}")
                else:
                    print(f"  ✅ AUTO")
            else:
                print(f"  ❌ Erreur pour {domain}")
            
            # Pause pour éviter rate limiting
            time.sleep(0.2)
        
        # 3. Résumé
        print("\n" + "="*50)
        print(f"📊 RÉSULTATS :")
        print(f"Total domaines : {len(domains)}")
        print(f"Renouvellement MANUEL : {manual_renewal_count}")
        print(f"Renouvellement AUTO : {len(domains) - manual_renewal_count}")
        
        if manual_renewal_domains:
            print("\n🚨 DOMAINES EN RENOUVELLEMENT MANUEL :")
            for domain_info in manual_renewal_domains:
                print(f"  • {domain_info['domain']} - Expire : {domain_info['expiration']}")
        
    except Exception as e:
        print(f"❌ Erreur : {e}")

if __name__ == "__main__":
    check_ovh_domains()