#!/usr/bin/env python3
"""
FASTCASH API Server - Dynamic Pricing & Crisis Detection
Compatible avec l'écosystème Kubernetes PostgreSQL existant
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import json
import uuid
from datetime import datetime
import re
from typing import Dict, List, Optional

app = Flask(__name__)
CORS(app)

class FastCashAPI:
    def __init__(self):
        # Configuration pour accès via port-forward kubectl
        self.db_config = {
            'host': 'localhost',  # Via kubectl port-forward 
            'port': 5433,         # Port-forward PostgreSQL
            'database': 'mautic_unified',
            'user': 'mautic_unified', 
            'password': 'mautic-postgres-2025'
        }
        
    def get_db_connection(self):
        """Établit la connexion à PostgreSQL via port-forward"""
        try:
            return psycopg2.connect(**self.db_config)
        except Exception as e:
            print(f"Erreur connexion DB: {e}")
            # Fallback : essayer connexion directe cluster
            try:
                return psycopg2.connect(
                    host='postgres-central.platform.svc.cluster.local',
                    port=5432,
                    database='mautic_unified',
                    user='mautic_unified',
                    password='mautic-postgres-2025'
                )
            except Exception as e2:
                raise Exception(f"Connexion DB impossible: {e2}")
    
    def calculate_crisis_score(self, alert_keywords: str, company_context: str = "") -> int:
        """Calcule le score de crise basé sur les mots-clés LinkedIn"""
        crisis_keywords = {
            'urgent': 30, 'crisis': 25, 'emergency': 25, 'critical': 20,
            'immediate': 20, 'asap': 15, 'declining': 15, 'failing': 18,
            'broken': 15, 'stuck': 10, 'help': 10, 'problem': 10,
            'issue': 8, 'trouble': 8, 'drop': 12, 'collapse': 20,
            'stagnation': 12, 'plateau': 10, 'runway': 25, 'funding': 15,
            'penalty': 22, 'churn': 18, 'budget cut': 20, 'quota miss': 15
        }
        
        score = 0
        text = (alert_keywords + " " + company_context).lower()
        
        for keyword, points in crisis_keywords.items():
            if keyword in text:
                score += points
                
        # Bonus contexte entreprise
        if any(word in text for word in ['startup', 'scale-up', 'early stage']):
            score += 10
            
        return min(score, 100)
    
    def calculate_dynamic_pricing(self, crisis_score: int, urgency_level: str, 
                                reliability_score: int = 50) -> Dict:
        """Calcule le prix dynamique FASTCASH"""
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        # Récupérer tarif de base
        cursor.execute("""
            SELECT base_price FROM public.fastcash_pricing 
            WHERE tier_name = %s
        """, (urgency_level,))
        
        result = cursor.fetchone()
        if not result:
            return {'error': 'Pricing tier not found'}
            
        base_price = float(result[0])
        
        # Calcul pricing dynamique
        crisis_factor = 1 + (crisis_score / 100) * 0.8  # Max +80% pour crise
        reliability_factor = 0.7 + (reliability_score / 100) * 0.6  # 70-130%
        
        # Multiplicateurs urgence
        urgency_multipliers = {
            'EXPRESS_2H': 2.0,
            'RUSH_6H': 1.5, 
            'STANDARD_24H': 1.0,
            'ECO_48H': 0.8
        }
        
        urgency_mult = urgency_multipliers.get(urgency_level, 1.0)
        final_price = base_price * urgency_mult * crisis_factor * reliability_factor
        
        conn.close()
        
        return {
            'base_price': base_price,
            'crisis_score': crisis_score,
            'crisis_factor': round(crisis_factor, 2),
            'reliability_factor': round(reliability_factor, 2),
            'urgency_multiplier': urgency_mult,
            'final_price': round(final_price, 2),
            'urgency_level': urgency_level,
            'savings_vs_express': round(1200 * 2.0 - final_price, 2) if urgency_level != 'EXPRESS_2H' else 0
        }

# Routes API FASTCASH
fastcash = FastCashAPI()

@app.route('/api/fastcash/pricing', methods=['POST'])
def calculate_pricing():
    """API: Calcul pricing dynamique"""
    data = request.json
    
    crisis_score = fastcash.calculate_crisis_score(
        data.get('alert_keywords', ''),
        data.get('company_context', '')
    )
    
    # Auto-détection niveau urgence selon score crise
    if crisis_score >= 80:
        urgency_level = 'EXPRESS_2H'
    elif crisis_score >= 60:
        urgency_level = 'RUSH_6H'
    elif crisis_score >= 30:
        urgency_level = 'STANDARD_24H'
    else:
        urgency_level = 'ECO_48H'
        
    # Override si spécifié
    urgency_level = data.get('urgency_level', urgency_level)
    
    pricing = fastcash.calculate_dynamic_pricing(
        crisis_score,
        urgency_level, 
        data.get('reliability_score', 50)
    )
    
    return jsonify({
        'status': 'success',
        'crisis_score': crisis_score,
        'recommended_urgency': urgency_level,
        'pricing': pricing,
        'next_actions': {
            'send_quote': crisis_score >= 40,
            'immediate_outreach': crisis_score >= 70,
            'executive_escalation': crisis_score >= 85
        }
    })

@app.route('/api/fastcash/prospect', methods=['POST'])
def add_prospect():
    """API: Ajouter nouveau prospect avec scoring automatique"""
    data = request.json
    
    required_fields = ['email', 'company']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields: email, company'}), 400
    
    try:
        conn = fastcash.get_db_connection()
        cursor = conn.cursor()
        
        # Calcul scoring automatique
        crisis_score = fastcash.calculate_crisis_score(
            data.get('alert_keywords', ''),
            data.get('company', '')
        )
        
        # Niveau urgence auto
        if crisis_score >= 80:
            urgency_level = 'EXPRESS_2H'
        elif crisis_score >= 60:
            urgency_level = 'RUSH_6H' 
        elif crisis_score >= 30:
            urgency_level = 'STANDARD_24H'
        else:
            urgency_level = 'ECO_48H'
            
        # Calcul prix
        pricing = fastcash.calculate_dynamic_pricing(crisis_score, urgency_level)
        
        # Insertion en base
        cursor.execute("""
            INSERT INTO public.fastcash_leads 
            (email, company, firstname, lastname, crisis_score, reliability_score,
             urgency_level, quoted_price, source_alert)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            data['email'],
            data['company'],
            data.get('firstname', ''),
            data.get('lastname', ''),
            crisis_score,
            data.get('reliability_score', 50),
            urgency_level,
            pricing.get('final_price', 0),
            data.get('alert_keywords', '')
        ))
        
        prospect_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'prospect_id': prospect_id,
            'crisis_score': crisis_score,
            'urgency_level': urgency_level,
            'pricing': pricing,
            'immediate_action_required': crisis_score >= 70
        })
        
    except psycopg2.IntegrityError:
        return jsonify({'error': 'Prospect already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fastcash/dashboard', methods=['GET'])
def get_dashboard():
    """API: Dashboard métriques FASTCASH"""
    try:
        conn = fastcash.get_db_connection()
        cursor = conn.cursor()
        
        # Stats par urgence
        cursor.execute("""
            SELECT urgency_level, COUNT(*), AVG(crisis_score), SUM(quoted_price)
            FROM public.fastcash_leads 
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            GROUP BY urgency_level
        """)
        
        urgency_stats = {}
        for row in cursor.fetchall():
            urgency_stats[row[0]] = {
                'count': row[1],
                'avg_crisis_score': round(float(row[2]) if row[2] else 0, 1),
                'total_quoted': round(float(row[3]) if row[3] else 0, 2)
            }
        
        # Revenue potentiel pondéré 
        cursor.execute("""
            SELECT 
                COUNT(*) as total_prospects,
                SUM(quoted_price) as max_revenue,
                SUM(quoted_price * crisis_score / 100.0) as probable_revenue,
                AVG(crisis_score) as avg_crisis_score
            FROM public.fastcash_leads 
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
        """)
        
        stats = cursor.fetchone()
        
        # Top prospects actifs
        cursor.execute("""
            SELECT email, company, crisis_score, urgency_level, quoted_price
            FROM public.fastcash_leads 
            WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
            AND crisis_score >= 50
            ORDER BY crisis_score DESC, quoted_price DESC
            LIMIT 5
        """)
        
        hot_prospects = []
        for row in cursor.fetchall():
            hot_prospects.append({
                'email': row[0],
                'company': row[1], 
                'crisis_score': row[2],
                'urgency_level': row[3],
                'quoted_price': float(row[4]) if row[4] else 0
            })
            
        conn.close()
        
        return jsonify({
            'status': 'success',
            'period': '7 days',
            'urgency_distribution': urgency_stats,
            'revenue_projections': {
                'total_prospects': stats[0] or 0,
                'max_potential': round(float(stats[1]) if stats[1] else 0, 2),
                'probable_weighted': round(float(stats[2]) if stats[2] else 0, 2),
                'avg_crisis_score': round(float(stats[3]) if stats[3] else 0, 1)
            },
            'hot_prospects': hot_prospects,
            'alerts_configured': 15,
            'last_updated': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fastcash/outreach', methods=['POST'])
def generate_outreach():
    """API: Générer email outreach personnalisé selon crise"""
    data = request.json
    
    crisis_score = data.get('crisis_score', 0)
    company = data.get('company', '')
    urgency_level = data.get('urgency_level', 'STANDARD_24H')
    quoted_price = data.get('quoted_price', 600)
    
    # Template selon niveau de crise
    if crisis_score >= 80:
        subject = f"🚨 URGENT - Solution immédiate pour {company}"
        template = "crisis_urgent"
        urgency_text = "situation critique nécessite une intervention immédiate"
    elif crisis_score >= 60:
        subject = f"⚡ Intervention rapide pour {company} - 6H"  
        template = "crisis_moderate"
        urgency_text = "situation préoccupante nécessite une action rapide"
    elif crisis_score >= 30:
        subject = f"🎯 Solution {company} - 24H"
        template = "standard"
        urgency_text = "opportunité d'amélioration identifiée"
    else:
        subject = f"💡 Optimisation {company} - 48H"
        template = "eco"
        urgency_text = "potentiel d'optimisation détecté"
    
    email_body = f"""Bonjour,

J'ai détecté que {company} fait face à une {urgency_text}.

En tant que spécialiste des interventions crisis marketing, je peux vous proposer une solution adaptée :

🎯 **Niveau d'intervention** : {urgency_level.replace('_', ' ')}
💰 **Investment** : {quoted_price}€ 
⚡ **Délai** : {"2 heures" if urgency_level == "EXPRESS_2H" else "6 heures" if urgency_level == "RUSH_6H" else "24 heures" if urgency_level == "STANDARD_24H" else "48 heures"}

Cette analyse est basée sur des signaux détectés via LinkedIn Sales Navigator (score crise: {crisis_score}/100).

Disponible pour un brief de 15min aujourd'hui si la situation l'exige.

Cordialement,
[Votre nom]
Expert Crisis Marketing & Growth Hacking"""

    return jsonify({
        'status': 'success',
        'subject': subject,
        'body': email_body,
        'template': template,
        'send_priority': 'immediate' if crisis_score >= 70 else 'high' if crisis_score >= 50 else 'normal',
        'follow_up_hours': 2 if crisis_score >= 80 else 24 if crisis_score >= 60 else 72
    })

@app.route('/api/fastcash/webhook/linkedin', methods=['POST'])
def linkedin_webhook():
    """Webhook pour réception automatique alertes LinkedIn via Zapier/Make"""
    data = request.json
    
    # Parser email alerte LinkedIn
    email_content = data.get('email_content', '')
    
    # Extraction données (exemple basique - à adapter selon format LinkedIn)
    email_match = re.search(r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})', email_content)
    company_match = re.search(r'Company:\s*([^\n]+)', email_content)
    
    if email_match:
        prospect_data = {
            'email': email_match.group(1),
            'company': company_match.group(1) if company_match else 'Unknown Company',
            'alert_keywords': email_content,
            'source': 'linkedin_sales_navigator_webhook'
        }
        
        # Ajouter prospect automatiquement
        return add_prospect()
    
    return jsonify({'status': 'no_email_found'})

@app.route('/api/fastcash/pricing/tiers', methods=['GET'])
def get_pricing_tiers():
    """API: Récupérer tous les niveaux de prix FASTCASH"""
    try:
        conn = fastcash.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT tier_name, delivery_time, base_price, description
            FROM public.fastcash_pricing 
            ORDER BY base_price DESC
        """)
        
        tiers = []
        for row in cursor.fetchall():
            tiers.append({
                'tier_name': row[0],
                'delivery_time': row[1],
                'base_price': float(row[2]),
                'description': row[3]
            })
            
        conn.close()
        
        return jsonify({
            'status': 'success',
            'pricing_tiers': tiers
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/fastcash/health', methods=['GET'])
def health_check():
    """Health check API"""
    try:
        conn = fastcash.get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        conn.close()
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'version': '1.0',
            'timestamp': datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("🚀 FASTCASH API Server - Crisis Detection & Dynamic Pricing")
    print("📊 Endpoints disponibles:")
    print("  POST /api/fastcash/pricing - Calcul prix dynamique")
    print("  POST /api/fastcash/prospect - Ajout prospect")
    print("  GET  /api/fastcash/dashboard - Métriques dashboard")
    print("  POST /api/fastcash/outreach - Génération email")
    print("  POST /api/fastcash/webhook/linkedin - Webhook LinkedIn")
    print("  GET  /api/fastcash/health - Health check")
    print("  GET  /api/fastcash/pricing/tiers - Niveaux de prix")
    print()
    print("💡 Avant démarrage: kubectl port-forward -n platform postgres-central-0 5433:5432")
    print()
    
    app.run(debug=True, host='0.0.0.0', port=5000)