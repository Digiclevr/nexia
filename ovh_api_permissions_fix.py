#!/usr/bin/env python3
"""
Solution pour diagnostiquer et corriger les permissions API OVH
Basé sur les recherches web - erreur 403 "This call has not been granted"
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

def diagnose_api_permissions():
    """Diagnostique les permissions API OVH actuelles"""
    
    app_key = os.getenv('OVH_APP_KEY')
    app_secret = os.getenv('OVH_APP_SECRET')
    consumer_key = os.getenv('OVH_CONSUMER_KEY')
    
    if not all([app_key, app_secret, consumer_key]):
        print("❌ Credentials OVH manquants !")
        return
    
    base_url = "https://eu.api.ovh.com/1.0"
    
    print("🔍 DIAGNOSTIC DES PERMISSIONS API OVH")
    print("=" * 50)
    
    # Test 1: Vérifier les permissions actuelles
    print("1. Test des permissions actuelles...")
    
    # Test /me pour vérifier la validité de base
    url = f"{base_url}/me"
    timestamp = str(int(time.time()))
    signature = ovh_signature(app_secret, consumer_key, "GET", url, "", timestamp)
    
    headers = {
        'X-Ovh-Application': app_key,
        'X-Ovh-Consumer': consumer_key,
        'X-Ovh-Timestamp': timestamp,
        'X-Ovh-Signature': signature,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("   ✅ Credentials de base valides")
            me_info = response.json()
            print(f"   📋 Compte: {me_info.get('nichandle', 'N/A')}")
        else:
            print(f"   ❌ Erreur credentials de base: {response.status_code}")
            print(f"   📝 {response.text}")
            return
    except Exception as e:
        print(f"   ❌ Erreur connexion: {e}")
        return
    
    print("\n2. Test des permissions de lecture domaines...")
    
    # Test lecture liste domaines
    url = f"{base_url}/domain"
    timestamp = str(int(time.time()))
    signature = ovh_signature(app_secret, consumer_key, "GET", url, "", timestamp)
    headers['X-Ovh-Timestamp'] = timestamp
    headers['X-Ovh-Signature'] = signature
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            domains = response.json()
            print(f"   ✅ Lecture domaines OK - {len(domains)} domaines")
        else:
            print(f"   ❌ Erreur lecture domaines: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return
    
    print("\n3. Test permissions d'écriture sur un domaine...")
    
    # Tester sur le premier domaine de la liste
    test_domain = domains[0] if domains else None
    if not test_domain:
        print("   ❌ Aucun domaine disponible pour test")
        return
    
    print(f"   🎯 Test sur: {test_domain}")
    
    # Test lecture serviceInfos
    url = f"{base_url}/domain/{test_domain}/serviceInfos"
    timestamp = str(int(time.time()))
    signature = ovh_signature(app_secret, consumer_key, "GET", url, "", timestamp)
    headers['X-Ovh-Timestamp'] = timestamp
    headers['X-Ovh-Signature'] = signature
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            print("   ✅ Lecture serviceInfos OK")
            service_info = response.json()
        else:
            print(f"   ❌ Erreur lecture serviceInfos: {response.status_code}")
            return
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
        return
    
    # Test écriture (simulation)
    print("   🧪 Test simulation écriture...")
    
    # Créer une modification factice pour tester les droits
    current_renew = service_info.get('renew', {})
    test_data = {"renew": current_renew}  # Même valeur = pas de changement réel
    
    url = f"{base_url}/domain/{test_domain}/serviceInfos"
    body = json.dumps(test_data)
    timestamp = str(int(time.time()))
    signature = ovh_signature(app_secret, consumer_key, "PUT", url, body, timestamp)
    headers['X-Ovh-Timestamp'] = timestamp
    headers['X-Ovh-Signature'] = signature
    
    try:
        response = requests.put(url, headers=headers, data=body)
        if response.status_code == 200:
            print("   ✅ Permissions d'écriture OK")
        elif response.status_code == 403:
            print("   ❌ PROBLÈME IDENTIFIÉ: Permissions d'écriture manquantes")
            print("   📝 Erreur 403: This call has not been granted")
        else:
            print(f"   ⚠️  Réponse inattendue: {response.status_code}")
            print(f"   📝 {response.text}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")
    
    print("\n" + "=" * 50)
    print("🔧 SOLUTION RECOMMANDÉE:")
    print("1. Allez sur: https://eu.api.ovh.com/createToken")
    print("2. Ajoutez ces permissions:")
    print("   • GET    /domain/*")
    print("   • PUT    /domain/*/serviceInfos")
    print("   • POST   /domain/*")
    print("   • GET    /me")
    print("3. Générez un nouveau CONSUMER_KEY")
    print("4. Remplacez le CONSUMER_KEY actuel")

def generate_new_consumer_key():
    """Guide pour générer un nouveau consumer key avec les bonnes permissions"""
    
    app_key = os.getenv('OVH_APP_KEY')
    app_secret = os.getenv('OVH_APP_SECRET')
    
    if not all([app_key, app_secret]):
        print("❌ APP_KEY et APP_SECRET requis")
        return
    
    print("🔑 GÉNÉRATION NOUVEAU CONSUMER KEY")
    print("=" * 50)
    
    # Définir les permissions requises
    permissions = {
        "accessRules": [
            {"method": "GET", "path": "/me"},
            {"method": "GET", "path": "/domain/*"},
            {"method": "PUT", "path": "/domain/*/serviceInfos"},
            {"method": "POST", "path": "/domain/*"}
        ]
    }
    
    url = "https://eu.api.ovh.com/1.0/auth/credential"
    headers = {
        'X-Ovh-Application': app_key,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers, json=permissions)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Nouveau Consumer Key généré !")
            print(f"🔑 Consumer Key: {result.get('consumerKey')}")
            print(f"🔗 URL de validation: {result.get('validationUrl')}")
            print("\nÉtapes suivantes:")
            print("1. Ouvrez l'URL de validation dans votre navigateur")
            print("2. Connectez-vous à votre compte OVH")
            print("3. Validez les permissions")
            print("4. Remplacez votre CONSUMER_KEY par le nouveau")
        else:
            print(f"❌ Erreur: {response.status_code}")
            print(f"📝 {response.text}")
    
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🤖 DIAGNOSTIC ET CORRECTION PERMISSIONS OVH API")
    print("=" * 60)
    
    choice = input("Choisir une action:\n1. Diagnostic permissions\n2. Générer nouveau Consumer Key\nChoix (1/2): ")
    
    if choice == "1":
        diagnose_api_permissions()
    elif choice == "2":
        generate_new_consumer_key()
    else:
        print("❌ Choix invalide")