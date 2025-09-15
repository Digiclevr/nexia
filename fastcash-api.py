#!/usr/bin/env python3
"""
FASTCASH API - Direct PostgreSQL Integration
Contourne les problèmes Docker Mautic en accédant directement à PostgreSQL
"""

import psycopg2
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional

class FastCashAPI:
    def __init__(self):
        self.conn = psycopg2.connect(
            host="postgres-central.platform.svc.cluster.local",
            port=5432,
            database="fastcash_mautic",
            user="mautic_unified",
            password="mautic-postgres-2025"
        )
        self.cursor = self.conn.cursor()
        
    def initialize_fastcash_schema(self):
        """Initialise le schéma FASTCASH dans PostgreSQL"""
        
        # Table des prospects avec scoring de crise
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS fastcash_prospects (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                company VARCHAR(255),
                firstname VARCHAR(100),
                lastname VARCHAR(100),
                linkedin_url VARCHAR(500),
                
                -- Scores FASTCASH
                crisis_score INTEGER DEFAULT 0,           -- 0-100: niveau de crise détecté
                reliability_score INTEGER DEFAULT 50,     -- 0-100: fiabilité client
                urgency_level VARCHAR(20) DEFAULT 'STANDARD', -- EXPRESS_2H, RUSH_6H, STANDARD_24H, ECO_48H
                
                -- Pricing dynamique
                quoted_price DECIMAL(10,2),
                pricing_tier VARCHAR(20),
                
                -- Métadonnées
                source VARCHAR(100) DEFAULT 'linkedin_sales_nav',
                alert_keywords TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Statut FASTCASH
                status VARCHAR(50) DEFAULT 'detected',     -- detected, contacted, quoted, converted, closed
                conversion_probability DECIMAL(5,2) DEFAULT 0.00
            );
        """)
        
        # Table des alertes LinkedIn Sales Navigator
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS fastcash_linkedin_alerts (
                id SERIAL PRIMARY KEY,
                alert_name VARCHAR(255) NOT NULL,
                keywords TEXT NOT NULL,
                icp_category VARCHAR(100),                 -- Email Marketing, SaaS Growth, SEO, etc.
                search_criteria JSON,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_triggered TIMESTAMP
            );
        """)
        
        # Table des workflows automatisés
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS fastcash_workflows (
                id SERIAL PRIMARY KEY,
                prospect_id INTEGER REFERENCES fastcash_prospects(id),
                workflow_type VARCHAR(50),                 -- crisis_detection, pricing_calculation, outreach
                status VARCHAR(50) DEFAULT 'pending',      -- pending, running, completed, failed
                parameters JSON,
                result JSON,
                executed_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Table des prix dynamiques
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS fastcash_pricing_tiers (
                id SERIAL PRIMARY KEY,
                tier_name VARCHAR(50) UNIQUE NOT NULL,
                delivery_time VARCHAR(20) NOT NULL,
                base_price DECIMAL(10,2) NOT NULL,
                crisis_multiplier DECIMAL(4,2) DEFAULT 1.0,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE
            );
        """)
        
        self.conn.commit()
        print("✅ Schéma FASTCASH initialisé dans PostgreSQL")
        
    def insert_pricing_tiers(self):
        """Insère les niveaux de prix FASTCASH"""
        tiers = [
            ('EXPRESS_2H', '2 heures', 1200.00, 2.0, 'Solution ultra-rapide pour crises majeures'),
            ('RUSH_6H', '6 heures', 900.00, 1.5, 'Intervention rapide sous 6h'),
            ('STANDARD_24H', '24 heures', 600.00, 1.0, 'Délai standard 24h'),
            ('ECO_48H', '48 heures', 450.00, 0.8, 'Solution économique 48h')
        ]
        
        for tier_name, delivery_time, base_price, multiplier, description in tiers:
            self.cursor.execute("""
                INSERT INTO fastcash_pricing_tiers (tier_name, delivery_time, base_price, crisis_multiplier, description)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (tier_name) DO UPDATE SET
                    delivery_time = EXCLUDED.delivery_time,
                    base_price = EXCLUDED.base_price,
                    crisis_multiplier = EXCLUDED.crisis_multiplier,
                    description = EXCLUDED.description
            """, (tier_name, delivery_time, base_price, multiplier, description))
            
        self.conn.commit()
        print("✅ Niveaux de prix FASTCASH configurés")
        
    def insert_linkedin_alerts(self):
        """Configure les 15 alertes LinkedIn Sales Navigator pour détection de crise"""
        alerts = [
            {
                'alert_name': 'Email Marketing Crisis - Revenue Drop',
                'keywords': 'email marketing revenue drop crisis urgent help',
                'icp_category': 'Email Marketing',
                'search_criteria': {
                    'job_titles': ['Marketing Director', 'Email Marketing Manager', 'Growth Marketing'],
                    'company_size': '51-200,201-500',
                    'industries': ['Marketing and Advertising', 'SaaS', 'E-commerce']
                }
            },
            {
                'alert_name': 'SaaS Growth Stagnation',
                'keywords': 'saas growth stagnation plateau user acquisition problem',
                'icp_category': 'SaaS Growth',
                'search_criteria': {
                    'job_titles': ['Head of Growth', 'VP Growth', 'Growth Manager'],
                    'company_size': '11-50,51-200',
                    'industries': ['Computer Software', 'SaaS', 'Technology']
                }
            },
            {
                'alert_name': 'SEO Traffic Collapse',
                'keywords': 'seo traffic drop google penalty algorithm update crisis',
                'icp_category': 'SEO Agencies',
                'search_criteria': {
                    'job_titles': ['SEO Manager', 'Digital Marketing Director', 'SEO Specialist'],
                    'company_size': '2-10,11-50',
                    'industries': ['Marketing and Advertising', 'Digital Marketing']
                }
            },
            {
                'alert_name': 'E-commerce Conversion Crisis',
                'keywords': 'ecommerce conversion rate drop sales declining urgent',
                'icp_category': 'E-commerce',
                'search_criteria': {
                    'job_titles': ['E-commerce Manager', 'Digital Marketing Manager', 'CRO Manager'],
                    'company_size': '11-50,51-200',
                    'industries': ['Retail', 'E-commerce', 'Consumer Goods']
                }
            },
            {
                'alert_name': 'Lead Generation Emergency',
                'keywords': 'lead generation crisis pipeline empty sales declining',
                'icp_category': 'Lead Generation',
                'search_criteria': {
                    'job_titles': ['Sales Director', 'Marketing Director', 'Lead Generation Manager'],
                    'company_size': '51-200,201-500',
                    'industries': ['Sales', 'Marketing and Advertising', 'Business Services']
                }
            }
        ]
        
        # Ajouter 10 alertes supplémentaires pour atteindre 15 total
        additional_alerts = [
            {
                'alert_name': 'Startup Funding Crisis',
                'keywords': 'startup funding crisis runway burn rate urgent',
                'icp_category': 'Startups',
                'search_criteria': {
                    'job_titles': ['Founder', 'CEO', 'Co-founder'],
                    'company_size': '2-10,11-50',
                    'industries': ['Venture Capital', 'Technology', 'SaaS']
                }
            },
            {
                'alert_name': 'Marketing Budget Crisis',
                'keywords': 'marketing budget cut crisis reduce spending urgent',
                'icp_category': 'Marketing Teams',
                'search_criteria': {
                    'job_titles': ['CMO', 'Marketing Director', 'VP Marketing'],
                    'company_size': '201-500,501-1000',
                    'industries': ['Marketing and Advertising', 'SaaS', 'Technology']
                }
            },
            {
                'alert_name': 'Digital Transformation Urgency',
                'keywords': 'digital transformation urgent crisis behind competitors',
                'icp_category': 'Enterprise',
                'search_criteria': {
                    'job_titles': ['CTO', 'Digital Transformation Manager', 'VP Technology'],
                    'company_size': '501-1000,1001-5000',
                    'industries': ['Technology', 'Financial Services', 'Manufacturing']
                }
            },
            {
                'alert_name': 'Customer Churn Emergency',
                'keywords': 'customer churn crisis retention rate urgent help',
                'icp_category': 'SaaS',
                'search_criteria': {
                    'job_titles': ['Customer Success Manager', 'VP Customer Success', 'Retention Manager'],
                    'company_size': '51-200,201-500',
                    'industries': ['Computer Software', 'SaaS', 'Technology']
                }
            },
            {
                'alert_name': 'Website Performance Crisis',
                'keywords': 'website down performance crisis urgent fix needed',
                'icp_category': 'Technical',
                'search_criteria': {
                    'job_titles': ['CTO', 'DevOps Manager', 'Technical Director'],
                    'company_size': '11-50,51-200',
                    'industries': ['Technology', 'Computer Software', 'Internet']
                }
            },
            {
                'alert_name': 'Social Media Crisis Management',
                'keywords': 'social media crisis reputation management urgent response',
                'icp_category': 'Brand Management',
                'search_criteria': {
                    'job_titles': ['Brand Manager', 'Social Media Manager', 'Communications Director'],
                    'company_size': '51-200,201-500',
                    'industries': ['Marketing and Advertising', 'Public Relations', 'Media']
                }
            },
            {
                'alert_name': 'Sales Team Performance Crisis',
                'keywords': 'sales team performance crisis quota miss urgent training',
                'icp_category': 'Sales Organizations',
                'search_criteria': {
                    'job_titles': ['Sales Director', 'VP Sales', 'Sales Manager'],
                    'company_size': '51-200,201-500',
                    'industries': ['Sales', 'Business Services', 'Software']
                }
            },
            {
                'alert_name': 'Product Launch Emergency',
                'keywords': 'product launch crisis delay urgent marketing support',
                'icp_category': 'Product Management',
                'search_criteria': {
                    'job_titles': ['Product Manager', 'VP Product', 'Product Marketing Manager'],
                    'company_size': '11-50,51-200',
                    'industries': ['Technology', 'SaaS', 'Consumer Goods']
                }
            },
            {
                'alert_name': 'Competitive Threat Response',
                'keywords': 'competitor threat crisis market share urgent response',
                'icp_category': 'Strategy',
                'search_criteria': {
                    'job_titles': ['CEO', 'Strategy Director', 'Business Development Manager'],
                    'company_size': '201-500,501-1000',
                    'industries': ['Technology', 'SaaS', 'Business Services']
                }
            },
            {
                'alert_name': 'Regulatory Compliance Crisis',
                'keywords': 'compliance crisis regulatory urgent legal risk',
                'icp_category': 'Compliance',
                'search_criteria': {
                    'job_titles': ['Compliance Manager', 'Legal Director', 'Risk Manager'],
                    'company_size': '501-1000,1001-5000',
                    'industries': ['Financial Services', 'Healthcare', 'Technology']
                }
            }
        ]
        
        all_alerts = alerts + additional_alerts
        
        for alert in all_alerts:
            self.cursor.execute("""
                INSERT INTO fastcash_linkedin_alerts (alert_name, keywords, icp_category, search_criteria)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                alert['alert_name'],
                alert['keywords'],
                alert['icp_category'],
                json.dumps(alert['search_criteria'])
            ))
            
        self.conn.commit()
        print(f"✅ {len(all_alerts)} alertes LinkedIn Sales Navigator configurées")
        
    def calculate_crisis_score(self, keywords: str, company_context: str = "") -> int:
        """Calcule le score de crise basé sur les mots-clés détectés"""
        crisis_keywords = {
            'urgent': 30,
            'crisis': 25,
            'emergency': 25,
            'critical': 20,
            'immediate': 20,
            'asap': 15,
            'help': 10,
            'problem': 10,
            'issue': 8,
            'trouble': 8,
            'declining': 15,
            'drop': 12,
            'failing': 18,
            'broken': 15,
            'stuck': 10
        }
        
        score = 0
        keywords_lower = keywords.lower()
        
        for keyword, points in crisis_keywords.items():
            if keyword in keywords_lower:
                score += points
                
        # Bonus pour contexte d'entreprise
        if any(word in company_context.lower() for word in ['startup', 'scale-up']):
            score += 10
            
        return min(score, 100)  # Cap à 100
        
    def calculate_dynamic_pricing(self, crisis_score: int, urgency_level: str, 
                                reliability_score: int) -> Dict:
        """Calcule le prix dynamique basé sur le niveau de crise"""
        
        # Récupérer les tarifs de base
        self.cursor.execute("""
            SELECT base_price, crisis_multiplier 
            FROM fastcash_pricing_tiers 
            WHERE tier_name = %s AND is_active = TRUE
        """, (urgency_level,))
        
        result = self.cursor.fetchone()
        if not result:
            return {'error': 'Pricing tier not found'}
            
        base_price, crisis_multiplier = result
        
        # Calculs de prix dynamique
        crisis_factor = 1 + (crisis_score / 100) * 0.5  # Max +50% pour crise maximale
        reliability_factor = 0.8 + (reliability_score / 100) * 0.4  # 80% à 120% selon fiabilité
        
        final_price = float(base_price) * crisis_multiplier * crisis_factor * reliability_factor
        
        return {
            'base_price': float(base_price),
            'crisis_score': crisis_score,
            'crisis_factor': crisis_factor,
            'reliability_factor': reliability_factor,
            'final_price': round(final_price, 2),
            'urgency_level': urgency_level
        }
        
    def add_prospect(self, email: str, company: str, firstname: str = "", 
                    lastname: str = "", linkedin_url: str = "", 
                    alert_keywords: str = "") -> Dict:
        """Ajoute un nouveau prospect avec scoring automatique"""
        
        crisis_score = self.calculate_crisis_score(alert_keywords, company)
        reliability_score = 50  # Score par défaut, à ajuster selon historique
        
        # Déterminer le niveau d'urgence suggéré basé sur le score de crise
        if crisis_score >= 80:
            urgency_level = 'EXPRESS_2H'
        elif crisis_score >= 60:
            urgency_level = 'RUSH_6H'
        elif crisis_score >= 30:
            urgency_level = 'STANDARD_24H'
        else:
            urgency_level = 'ECO_48H'
            
        pricing = self.calculate_dynamic_pricing(crisis_score, urgency_level, reliability_score)
        
        try:
            self.cursor.execute("""
                INSERT INTO fastcash_prospects 
                (email, company, firstname, lastname, linkedin_url, crisis_score, 
                 reliability_score, urgency_level, quoted_price, pricing_tier, 
                 alert_keywords, conversion_probability)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                email, company, firstname, lastname, linkedin_url,
                crisis_score, reliability_score, urgency_level,
                pricing.get('final_price', 0), urgency_level,
                alert_keywords, crisis_score * 0.8  # Probabilité de conversion
            ))
            
            prospect_id = self.cursor.fetchone()[0]
            self.conn.commit()
            
            return {
                'prospect_id': prospect_id,
                'crisis_score': crisis_score,
                'pricing': pricing,
                'status': 'success'
            }
            
        except psycopg2.IntegrityError:
            self.conn.rollback()
            return {'error': 'Prospect already exists', 'status': 'error'}
            
    def get_fastcash_dashboard(self) -> Dict:
        """Retourne les métriques du dashboard FASTCASH"""
        
        # Prospects par niveau de crise
        self.cursor.execute("""
            SELECT urgency_level, COUNT(*), AVG(crisis_score), SUM(quoted_price)
            FROM fastcash_prospects 
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY urgency_level
        """)
        
        urgency_stats = {}
        for row in self.cursor.fetchall():
            urgency_stats[row[0]] = {
                'count': row[1],
                'avg_crisis_score': float(row[2]) if row[2] else 0,
                'total_quoted': float(row[3]) if row[3] else 0
            }
            
        # Revenue potentiel
        self.cursor.execute("""
            SELECT SUM(quoted_price * conversion_probability / 100) as potential_revenue
            FROM fastcash_prospects 
            WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        """)
        
        potential_revenue = self.cursor.fetchone()[0] or 0
        
        return {
            'urgency_distribution': urgency_stats,
            'potential_revenue_30d': float(potential_revenue),
            'active_alerts': 15,
            'total_prospects': sum(s['count'] for s in urgency_stats.values())
        }

def main():
    """Initialise le système FASTCASH"""
    print("🚀 Initialisation du système FASTCASH...")
    
    api = FastCashAPI()
    api.initialize_fastcash_schema()
    api.insert_pricing_tiers()
    api.insert_linkedin_alerts()
    
    # Test avec un prospect exemple
    prospect_result = api.add_prospect(
        email="crisis.manager@urgentcompany.com",
        company="UrgentCompany SaaS",
        firstname="Crisis",
        lastname="Manager",
        linkedin_url="https://linkedin.com/in/crisis-manager",
        alert_keywords="urgent crisis saas growth stagnation immediate help needed"
    )
    
    print(f"✅ Prospect test ajouté: {prospect_result}")
    
    # Afficher le dashboard
    dashboard = api.get_fastcash_dashboard()
    print(f"📊 Dashboard FASTCASH: {json.dumps(dashboard, indent=2)}")
    
    print("\n🎯 Système FASTCASH opérationnel!")
    print("📧 Prêt pour 24-48H de génération de cash en mode crise")

if __name__ == "__main__":
    main()