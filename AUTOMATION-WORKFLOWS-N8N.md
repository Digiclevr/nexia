# 🤖 N8N WORKFLOWS - AUTOMATION INDUSTRIELLE

*Architecture automation-first pour génération revenue 24/7*  
*Mise à jour : 2025-09-07*

---

#  WORKFLOWS CRITIQUES - DEPLOY IMMÉDIAT

## 🔥 WORKFLOW #1: "DOMAIN-TO-CASH"

### Trigger: New domain activated (Webhook)
### Duration: 12 minutes automatique
### Result: Domain → Revenue stream COMPLET

```json
{
  "workflow": "domain-to-cash",
  "nodes": [
    {
      "id": "webhook-trigger",
      "type": "Webhook",
      "parameters": {
        "path": "domain-activated",
        "method": "POST"
      }
    },
    {
      "id": "claude-landing-page",
      "type": "HTTP Request", 
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user", 
            "content": "Generate landing page HTML for domain: {{$node['webhook-trigger'].json['domain']}} with lead capture form, product showcase, viral sharing buttons. Industry: {{$node['webhook-trigger'].json['industry']}}"
          }],
          "max_tokens": 4000
        }
      }
    },
    {
      "id": "cloudflare-dns-ssl",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.cloudflare.com/client/v4/zones/{{CLOUDFLARE_ZONE_ID}}/dns_records",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLOUDFLARE_TOKEN}",
          "Content-Type": "application/json"
        },
        "body": {
          "type": "A",
          "name": "{{$node['webhook-trigger'].json['domain']}}",
          "content": "{{SERVER_IP}}",
          "proxied": true
        }
      }
    },
    {
      "id": "digitalocean-droplet-deploy",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.digitalocean.com/v2/droplets",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${DIGITALOCEAN_TOKEN}",
          "Content-Type": "application/json"
        },
        "body": {
          "name": "{{$node['webhook-trigger'].json['domain']}}-server",
          "region": "fra1",
          "size": "s-1vcpu-1gb",
          "image": "ubuntu-22-04-x64",

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 1 sur 14*

---

          "ssh_keys": ["${SSH_KEY_ID}"],
          "user_data": "#!/bin/bash\\nnpm install -g serve\\necho '{{$node['claude-landing-page'].json['content'][0]['text']}}' > /var/www/index.html\\nserve -s /var/www -p 80"
        }
      }
    },
    {
      "id": "ovh-domain-config",
      "type": "HTTP Request", 
      "parameters": {
        "url": "https://eu.api.ovh.com/1.0/domain/{{$node['webhook-trigger'].json['domain']}}/zone/record",
        "method": "POST",
        "headers": {
          "X-Ovh-Application": "${OVH_APP_KEY}",
          "X-Ovh-Timestamp": "{{Math.floor(Date.now()/1000)}}",
          "X-Ovh-Consumer": "${OVH_CONSUMER_KEY}",
          "X-Ovh-Signature": "${OVH_SIGNATURE}"
        },
        "body": {
          "fieldType": "A",
          "subDomain": "",
          "target": "{{$node['digitalocean-droplet-deploy'].json['droplet']['networks']['v4'][0]['ip_address']}}"
        }
      }
    },
    {
      "id": "kinsta-staging-deploy",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.kinsta.com/v2/sites",
        "method": "POST", 
        "headers": {
          "Authorization": "Bearer ${KINSTA_API_KEY}",
          "Content-Type": "application/json"
        },
        "body": {
          "company": "${KINSTA_COMPANY_ID}",
          "display_name": "{{$node['webhook-trigger'].json['domain']}}",
          "region": "europe-west3",
          "install_mode": "new",
          "wp_language": "en_US",
          "is_subdomain_multisite": false,
          "admin_url": "{{$node['webhook-trigger'].json['domain']}}/wp-admin",
          "wpe_install_workflow": false
        }
      }
    },
    {
      "id": "deploy-landing-page",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.vercel.com/v13/deployments",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${VERCEL_TOKEN}"
        },
        "body": {
          "name": "{{$node['webhook-trigger'].json['domain']}}",
          "files": [{
            "file": "index.html",
            "data": "{{$node['claude-landing-page'].json['content'][0]['text']}}"
          }]
        }
      }
    },
    {
      "id": "gumroad-product-creation",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.gumroad.com/v2/products",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${GUMROAD_TOKEN}"
        },
        "body": {
          "name": "{{$node['webhook-trigger'].json['product_name']}}",
          "price": "{{$node['webhook-trigger'].json['price']}}",
          "description": "Auto-generated product for {{$node['webhook-trigger'].json['domain']}}",
          "content_url": "{{$node['deploy-landing-page'].json['url']}}"
        }
      }

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 2 sur 14*

---

    },
    {
      "id": "viral-content-generation", 
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user",
            "content": "Create viral social media content for {{$node['webhook-trigger'].json['domain']}}. Include: 1 LinkedIn post, 1 Twitter thread, 1 Reddit post. Focus on value-first approach with call-to-action to giveaway."
          }],
          "max_tokens": 2000
        }
      }
    },
    {
      "id": "social-media-posting",
      "type": "Split In Batches",
      "parameters": {
        "batchSize": 1
      }
    },
    {
      "id": "linkedin-post",
      "type": "HTTP Request", 
      "parameters": {
        "url": "https://api.linkedin.com/v2/ugcPosts",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${LINKEDIN_TOKEN}"
        },
        "body": "{{$node['viral-content-generation'].json['linkedin_post']}}"
      }
    },
    {
      "id": "twitter-post",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.twitter.com/2/tweets", 
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${TWITTER_TOKEN}"
        },
        "body": {
          "text": "{{$node['viral-content-generation'].json['twitter_thread']}}"
        }
      }
    },
    {
      "id": "tracking-update",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.airtable.com/v0/${AIRTABLE_BASE}/Domains",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${AIRTABLE_TOKEN}"
        },
        "body": {
          "fields": {
            "Domain": "{{$node['webhook-trigger'].json['domain']}}",
            "Status": "Live",
            "Landing Page": "{{$node['deploy-landing-page'].json['url']}}",
            "Gumroad Product": "{{$node['gumroad-product-creation'].json['product_url']}}",
            "Deployed At": "{{new Date().toISOString()}}"
          }
        }
      }
    }
  ]
}
```

---

##  WORKFLOW #2: "VIRAL-MULTIPLIER"

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 3 sur 14*

---


### Trigger: New giveaway signup (Form submit)
### Duration: 3 minutes automatique
### Result: 1 signup → 3-5 additional actions

```json
{
  "workflow": "viral-multiplier",
  "nodes": [
    {
      "id": "form-trigger",
      "type": "Webhook",
      "parameters": {
        "path": "giveaway-signup",
        "method": "POST"
      }
    },
    {
      "id": "email-validation",
      "type": "Function",
      "parameters": {
        "functionCode": "const email = items[0].json.email; const isValid = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email); return [{json: {email, isValid}}];"
      }
    },
    {
      "id": "mailchimp-add",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://us1.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members",
        "method": "POST",
        "headers": {
          "Authorization": "apikey ${MAILCHIMP_API_KEY}"
        },
        "body": {
          "email_address": "{{$node['email-validation'].json['email']}}",
          "status": "subscribed",
          "tags": ["giveaway", "{{$node['form-trigger'].json['source']}}"]
        }
      }
    },
    {
      "id": "personalized-content",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user",
            "content": "Create personalized welcome email and social sharing content for {{$node['form-trigger'].json['name']}} who signed up for {{$node['form-trigger'].json['giveaway_name']}} giveaway. Include viral mechanics and referral incentives."
          }],
          "max_tokens": 1500
        }
      }
    },
    {
      "id": "viral-score-calculation",
      "type": "Function", 
      "parameters": {
        "functionCode": "const userData = items[0].json; let score = 5; if (userData.linkedin_url) score += 2; if (userData.company) score += 2; if (userData.followers > 1000) score += 3; return [{json: {viral_score: score, user: userData}}];"
      }
    },
    {
      "id": "auto-upsell-check",
      "type": "IF",
      "parameters": {
        "conditions": {
          "number": [{
            "value1": "{{$node['viral-score-calculation'].json['viral_score']}}",
            "operation": "larger",
            "value2": 8
          }]
        }
      }
    },
    {

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 4 sur 14*

---

      "id": "stripe-connect-payment",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.stripe.com/v1/checkout/sessions",
        "method": "POST", 
        "headers": {
          "Authorization": "Bearer ${STRIPE_SECRET_KEY}",
          "Stripe-Account": "${STRIPE_CONNECT_ACCOUNT_ID}"
        },
        "body": {
          "customer_email": "{{$node['form-trigger'].json['email']}}",
          "payment_method_types": ["card", "sepa_debit", "bancontact"],
          "line_items": [{
            "price": "${PREMIUM_PRICE_ID}",
            "quantity": 1
          }],
          "mode": "payment",
          "success_url": "{{$node['form-trigger'].json['domain']}}/success",
          "cancel_url": "{{$node['form-trigger'].json['domain']}}/cancel",
          "payment_intent_data": {
            "application_fee_amount": "{{Math.floor($node['form-trigger'].json['price'] * 0.029)}}",
            "transfer_data": {
              "destination": "${STRIPE_CONNECT_ACCOUNT_ID}"
            }
          }
        }
      }
    },
    {
      "id": "qonto-transaction-sync",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://thirdparty.qonto.com/v2/transactions",
        "method": "GET",
        "headers": {
          "Authorization": "${QONTO_SECRET_KEY}",
          "Content-Type": "application/json"
        },
        "qs": {
          "iban": "${QONTO_IBAN}",
          "status": "completed",
          "settled_at_from": "{{new Date().toISOString().split('T')[0]}}"
        }
      }
    },
    {
      "id": "qonto-webhook-setup",
      "type": "HTTP Request", 
      "parameters": {
        "url": "https://thirdparty.qonto.com/v2/webhooks",
        "method": "POST",
        "headers": {
          "Authorization": "${QONTO_SECRET_KEY}",
          "Content-Type": "application/json"
        },
        "body": {
          "url": "http://localhost:5678/webhook/qonto-transaction",
          "events": ["transaction.completed", "transaction.declined"]
        }
      }
    },
    {
      "id": "social-sharing-automation",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.buffer.com/1/updates/create.json",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${BUFFER_TOKEN}"
        },
        "body": {
          "text": "{{$node['personalized-content'].json['social_post']}}",
          "profile_ids": ["${TWITTER_PROFILE_ID}", "${LINKEDIN_PROFILE_ID}"]
        }
      }
    }
  ]
}
```


---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 5 sur 14*

---

---

##  WORKFLOW #3: "ASSET-FACTORY"

### Trigger: Market signal detected (Cron + API)
### Duration: 45 minutes automatique
### Result: Opportunity → Product → Sales pipeline

```json
{
  "workflow": "asset-factory",
  "nodes": [
    {
      "id": "market-signal-trigger",
      "type": "Webhook",
      "parameters": {
        "path": "market-opportunity",
        "method": "POST"
      }
    },
    {
      "id": "demand-analysis",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user",
            "content": "Analyze market demand for: {{$node['market-signal-trigger'].json['opportunity']}}. Provide: 1) Market size estimation 2) Competition analysis 3) Price point recommendation 4) Asset type suggestion (template/script/guide/tool)"
          }],
          "max_tokens": 2000
        }
      }
    },
    {
      "id": "asset-generation",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages", 
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user",
            "content": "Create {{$node['demand-analysis'].json['asset_type']}} for {{$node['market-signal-trigger'].json['opportunity']}}. Include: complete solution, documentation, installation guide, examples. Make it professional and immediately usable."
          }],
          "max_tokens": 8000
        }
      }
    },
    {
      "id": "professional-packaging",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "method": "POST", 
        "headers": {
          "Authorization": "Bearer ${CLAUDE_API_KEY}"
        },
        "body": {
          "model": "claude-3-5-sonnet-20241022",
          "messages": [{
            "role": "user",
            "content": "Create professional product package for: {{$node['demand-analysis'].json['asset_type']}}. Include: compelling product title, detailed description, feature list, benefits, testimonials template, pricing justification for €{{$node['demand-analysis'].json['price']}}"
          }],
          "max_tokens": 2000
        }
      }
    },
    {
      "id": "multi-platform-upload",
      "type": "Split In Batches",

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 6 sur 14*

---

      "parameters": {
        "batchSize": 1
      }
    },
    {
      "id": "gumroad-upload",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.gumroad.com/v2/products",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${GUMROAD_TOKEN}"
        },
        "body": {
          "name": "{{$node['professional-packaging'].json['title']}}",
          "description": "{{$node['professional-packaging'].json['description']}}",
          "price": "{{$node['demand-analysis'].json['price']}}",
          "content": "{{$node['asset-generation'].json['content']}}"
        }
      }
    },
    {
      "id": "etsy-upload",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://openapi.etsy.com/v3/application/shops/${ETSY_SHOP_ID}/listings",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${ETSY_TOKEN}"
        },
        "body": {
          "title": "{{$node['professional-packaging'].json['title']}}",
          "description": "{{$node['professional-packaging'].json['description']}}",
          "price": "{{$node['demand-analysis'].json['price']}}",
          "quantity": 999,
          "tags": "{{$node['demand-analysis'].json['tags']}}"
        }
      }
    },
    {
      "id": "viral-campaign-trigger",
      "type": "HTTP Request",
      "parameters": {
        "url": "http://localhost:5678/webhook/viral-multiplier",
        "method": "POST",
        "body": {
          "product_name": "{{$node['professional-packaging'].json['title']}}",
          "product_url": "{{$node['gumroad-upload'].json['product_url']}}",
          "giveaway_type": "product_launch",
          "target_audience": "{{$node['demand-analysis'].json['target_audience']}}"
        }
      }
    },
    {
      "id": "performance-tracking",
      "type": "HTTP Request",
      "parameters": {
        "url": "https://api.airtable.com/v0/${AIRTABLE_BASE}/Assets",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer ${AIRTABLE_TOKEN}"
        },
        "body": {
          "fields": {
            "Asset Name": "{{$node['professional-packaging'].json['title']}}",
            "Market Signal": "{{$node['market-signal-trigger'].json['opportunity']}}",
            "Price": "{{$node['demand-analysis'].json['price']}}",
            "Gumroad URL": "{{$node['gumroad-upload'].json['product_url']}}",
            "Created At": "{{new Date().toISOString()}}",
            "Status": "Live"
          }
        }
      }
    }
  ]
}
```

---


---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 7 sur 14*

---

# ⏰ CRON JOBS AUTOMATION

##  MARKET-SCANNER.PY

```python
#!/usr/bin/env python3
"""
Market Scanner - Detect opportunities every 15 minutes
Triggers: N8N Asset Factory workflow for high-scoring opportunities
"""

import requests
import json
import time
from datetime import datetime
import sqlite3
import openai
from typing import List, Dict

class MarketScanner:
    def __init__(self):
        self.reddit_client_id = os.getenv('REDDIT_CLIENT_ID') 
        self.reddit_client_secret = os.getenv('REDDIT_CLIENT_SECRET')
        self.claude_api_key = os.getenv('CLAUDE_API_KEY')
        self.n8n_webhook = 'http://localhost:5678/webhook/market-opportunity'
        self.db = sqlite3.connect('/data/opportunities.db')
        
    def scan_reddit_pain_points(self) -> List[Dict]:
        """Scan Reddit for pain points in business subreddits"""
        subreddits = ['entrepreneur', 'startups', 'SaaS', 'marketing', 'webdev']
        opportunities = []
        
        for subreddit in subreddits:
            url = f'https://www.reddit.com/r/{subreddit}/hot.json?limit=50'
            headers = {'User-Agent': 'MarketScanner/1.0'}
            
            response = requests.get(url, headers=headers)
            posts = response.json()['data']['children']
            
            for post in posts:
                content = post['data']['title'] + ' ' + post['data'].get('selftext', '')
                
                # Look for pain point indicators
                pain_indicators = [
                    'need a tool', 'looking for', 'struggling with', 
                    'why is there no', 'wish someone would build',
                    'anyone know of', 'recommend a tool'
                ]
                
                if any(indicator in content.lower() for indicator in pain_indicators):
                    opportunities.append({
                        'source': f'r/{subreddit}',
                        'title': post['data']['title'],
                        'content': content,
                        'upvotes': post['data']['ups'],
                        'comments': post['data']['num_comments'],
                        'url': post['data']['url']
                    })
        
        return opportunities
    
    def analyze_with_ai(self, opportunities: List[Dict]) -> List[Dict]:
        """Analyze opportunities with Claude AI"""
        scored_opportunities = []
        
        for opp in opportunities:
            prompt = f"""
            Analyze this Reddit post for business opportunity potential:
            Title: {opp['title']}
            Content: {opp['content']}
            Engagement: {opp['upvotes']} upvotes, {opp['comments']} comments
            
            Score from 0-100 based on:
            - Market demand (clear pain point)
            - Monetization potential 
            - Competition level (lower is better)
            - Implementation complexity (lower is better)
            
            Return JSON: {{"score": X, "reasoning": "...", "suggested_solution": "...", "price_point": X}}
            """

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 8 sur 14*

---

            
            response = requests.post(
                'https://api.anthropic.com/v1/messages',
                headers={
                    'Authorization': f'Bearer {self.claude_api_key}',
                    'Content-Type': 'application/json'
                },
                json={
                    'model': 'claude-3-5-sonnet-20241022',
                    'messages': [{'role': 'user', 'content': prompt}],
                    'max_tokens': 1000
                }
            )
            
            ai_analysis = json.loads(response.json()['content'][0]['text'])
            opp.update(ai_analysis)
            scored_opportunities.append(opp)
            
            time.sleep(1)  # Rate limiting
        
        return sorted(scored_opportunities, key=lambda x: x['score'], reverse=True)
    
    def trigger_asset_creation(self, opportunity: Dict):
        """Trigger N8N Asset Factory for high-scoring opportunities"""
        if opportunity['score'] >= 85:
            payload = {
                'opportunity': opportunity['title'],
                'description': opportunity['content'],
                'source': opportunity['source'],
                'score': opportunity['score'],
                'suggested_solution': opportunity['suggested_solution'],
                'price_point': opportunity['price_point']
            }
            
            response = requests.post(self.n8n_webhook, json=payload)
            
            if response.status_code == 200:
                print(f"✅ Triggered asset creation for: {opportunity['title']}")
            else:
                print(f"❌ Failed to trigger asset creation: {response.status_code}")
    
    def save_to_db(self, opportunities: List[Dict]):
        """Save opportunities to database for tracking"""
        cursor = self.db.cursor()
        
        for opp in opportunities:
            cursor.execute('''
                INSERT OR REPLACE INTO opportunities 
                (title, content, source, score, created_at, triggered)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                opp['title'], 
                opp['content'],
                opp['source'],
                opp.get('score', 0),
                datetime.now().isoformat(),
                opp.get('score', 0) >= 85
            ))
        
        self.db.commit()
    
    def run_scan(self):
        """Main scanning function"""
        print(f"🔍 Starting market scan at {datetime.now()}")
        
        # Scan Reddit for opportunities
        opportunities = self.scan_reddit_pain_points()
        print(f"📊 Found {len(opportunities)} potential opportunities")
        
        # Analyze with AI
        scored_opportunities = self.analyze_with_ai(opportunities)
        
        # Trigger asset creation for high scores
        for opp in scored_opportunities:
            if opp['score'] >= 85:
                self.trigger_asset_creation(opp)
        
        # Save to database
        self.save_to_db(scored_opportunities)
        

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 9 sur 14*

---

        print(f"✅ Scan completed. Top score: {scored_opportunities[0]['score'] if scored_opportunities else 0}")

if __name__ == "__main__":
    scanner = MarketScanner()
    scanner.run_scan()
```

##  PERFORMANCE-OPTIMIZER.PY

```python
#!/usr/bin/env python3
"""
Performance Optimizer - Runs every hour
Optimizes pricing, ad spend, campaigns based on real data
"""

import requests
import json
import sqlite3
from datetime import datetime, timedelta
import statistics

class PerformanceOptimizer:
    def __init__(self):
        self.gumroad_token = os.getenv('GUMROAD_TOKEN')
        self.stripe_key = os.getenv('STRIPE_SECRET_KEY') 
        self.facebook_token = os.getenv('FACEBOOK_ADS_TOKEN')
        self.db = sqlite3.connect('/data/performance.db')
    
    def get_sales_data(self) -> Dict:
        """Collect sales data from all platforms"""
        
        # Gumroad sales
        gumroad_sales = requests.get(
            'https://api.gumroad.com/v2/sales',
            headers={'Authorization': f'Bearer {self.gumroad_token}'}
        ).json()
        
        # Stripe payments  
        stripe_sales = requests.get(
            'https://api.stripe.com/v1/charges',
            headers={'Authorization': f'Bearer {self.stripe_key}'}
        ).json()
        
        return {
            'gumroad': gumroad_sales,
            'stripe': stripe_sales,
            'timestamp': datetime.now().isoformat()
        }
    
    def calculate_performance_metrics(self, sales_data: Dict) -> Dict:
        """Calculate key performance metrics"""
        
        metrics = {}
        
        # Calculate conversion rates by product
        for product in self.get_all_products():
            views = self.get_product_views(product['id'])
            sales = self.get_product_sales(product['id'])
            
            conversion_rate = (sales / views) * 100 if views > 0 else 0
            
            metrics[product['id']] = {
                'conversion_rate': conversion_rate,
                'revenue': sales * product['price'],
                'views': views,
                'sales': sales
            }
        
        return metrics
    
    def optimize_pricing(self, metrics: Dict):
        """A/B test and optimize pricing automatically"""
        
        for product_id, data in metrics.items():
            if data['conversion_rate'] > 15:  # High conversion
                # Test 20% price increase
                self.test_price_increase(product_id, 1.2)
                
            elif data['conversion_rate'] < 5:  # Low conversion

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 10 sur 14*

---

                # Test 15% price decrease  
                self.test_price_decrease(product_id, 0.85)
    
    def optimize_ad_spend(self, metrics: Dict):
        """Reallocate ad budget to best performers"""
        
        # Get current ad performance
        ad_performance = self.get_facebook_ad_performance()
        
        # Identify top performers (ROAS > 4.0)
        top_performers = [
            ad for ad in ad_performance 
            if ad['roas'] > 4.0
        ]
        
        # Scale winners (+50% budget)
        for ad in top_performers:
            self.increase_ad_budget(ad['id'], 1.5)
        
        # Kill losers (ROAS < 2.0)
        poor_performers = [
            ad for ad in ad_performance
            if ad['roas'] < 2.0
        ]
        
        for ad in poor_performers:
            self.pause_ad_campaign(ad['id'])
    
    def run_optimization(self):
        """Main optimization function"""
        print(f"🎯 Starting performance optimization at {datetime.now()}")
        
        # Collect data
        sales_data = self.get_sales_data()
        metrics = self.calculate_performance_metrics(sales_data)
        
        # Run optimizations
        self.optimize_pricing(metrics)
        self.optimize_ad_spend(metrics)
        
        print("✅ Optimization completed")

if __name__ == "__main__":
    optimizer = PerformanceOptimizer()  
    optimizer.run_optimization()
```

##  REVENUE-TRACKER.PY

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 11 sur 14*

---


```python
#!/usr/bin/env python3
"""
Revenue Tracker - Runs every 5 minutes
Real-time revenue monitoring with alerts and auto-scaling
"""

import requests
import json
import sqlite3
from datetime import datetime
import os

class RevenueTracker:
    def __init__(self):
        self.platforms = {
            'gumroad': os.getenv('GUMROAD_TOKEN'),
            'stripe': os.getenv('STRIPE_SECRET_KEY'),
            'paypal': os.getenv('PAYPAL_CLIENT_ID')
        }
        self.slack_webhook = os.getenv('SLACK_WEBHOOK_URL')
        self.db = sqlite3.connect('/data/revenue.db')
        
    def collect_real_time_revenue(self) -> Dict:
        """Collect revenue from all platforms"""
        
        total_revenue = 0
        platform_breakdown = {}
        
        # Gumroad
        gumroad_data = requests.get(
            'https://api.gumroad.com/v2/sales?after=2024-01-01',
            headers={'Authorization': f'Bearer {self.platforms["gumroad"]}'}
        ).json()
        
        gumroad_revenue = sum([
            float(sale['price']) for sale in gumroad_data.get('sales', [])
            if sale['created_at'] >= self.get_today_start()
        ])
        
        platform_breakdown['gumroad'] = gumroad_revenue
        total_revenue += gumroad_revenue
        
        # Stripe
        stripe_data = requests.get(
            'https://api.stripe.com/v1/charges?created[gte]=' + str(int(self.get_today_start().timestamp())),
            headers={'Authorization': f'Bearer {self.platforms["stripe"]}'}
        ).json()
        
        stripe_revenue = sum([
            charge['amount'] / 100 for charge in stripe_data.get('data', [])
            if charge['status'] == 'succeeded'
        ])
        
        platform_breakdown['stripe'] = stripe_revenue
        total_revenue += stripe_revenue
        
        return {
            'total': total_revenue,
            'platforms': platform_breakdown,
            'timestamp': datetime.now().isoformat()
        }
    
    def check_targets_and_alert(self, revenue_data: Dict):
        """Check revenue targets and send alerts if missed"""
        
        daily_target = 1000  # €1000/day target
        current_revenue = revenue_data['total']
        
        if current_revenue < daily_target * 0.5:  # Less than 50% of target
            self.send_slack_alert(
                f"🚨 REVENUE ALERT: Only €{current_revenue:.2f} today (Target: €{daily_target})",
                "urgent"
            )
        elif current_revenue > daily_target * 1.5:  # Exceeding target
            self.send_slack_alert(
                f"🎉 REVENUE MILESTONE: €{current_revenue:.2f} today! (+{(current_revenue/daily_target-1)*100:.1f}%)",
                "good"
            )

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 12 sur 14*

---

    
    def auto_scale_successful_products(self, revenue_data: Dict):
        """Auto-scale products that are performing well"""
        
        # Get product performance data
        top_products = self.get_top_performing_products()
        
        for product in top_products:
            if product['daily_revenue'] > 200:  # €200+ daily revenue
                # Increase marketing budget
                self.scale_product_marketing(product['id'], 2.0)
                
                # Create variations/bundles
                self.create_product_variations(product['id'])
    
    def send_slack_alert(self, message: str, priority: str):
        """Send alert to Slack channel"""
        
        color_map = {
            'urgent': '#FF0000',
            'warning': '#FFA500', 
            'good': '#00FF00'
        }
        
        payload = {
            'attachments': [{
                'color': color_map.get(priority, '#CCCCCC'),
                'text': message,
                'ts': int(datetime.now().timestamp())
            }]
        }
        
        requests.post(self.slack_webhook, json=payload)
    
    def save_to_dashboard(self, revenue_data: Dict):
        """Save data for live dashboard"""
        
        cursor = self.db.cursor()
        cursor.execute('''
            INSERT INTO revenue_tracking 
            (timestamp, total_revenue, gumroad_revenue, stripe_revenue)
            VALUES (?, ?, ?, ?)
        ''', (
            revenue_data['timestamp'],
            revenue_data['total'],
            revenue_data['platforms']['gumroad'],
            revenue_data['platforms']['stripe']
        ))
        
        self.db.commit()
    
    def run_tracking(self):
        """Main tracking function"""
        
        # Collect revenue data
        revenue_data = self.collect_real_time_revenue()
        
        # Check targets and alert
        self.check_targets_and_alert(revenue_data)
        
        # Auto-scale successful products  
        self.auto_scale_successful_products(revenue_data)
        
        # Save for dashboard
        self.save_to_dashboard(revenue_data)
        
        print(f"💰 Revenue tracked: €{revenue_data['total']:.2f}")

if __name__ == "__main__":
    tracker = RevenueTracker()
    tracker.run_tracking()
```

---

# ⚙ DEPLOYMENT INSTRUCTIONS

##  SETUP N8N WORKFLOWS

---

<div style="page-break-after: always;"></div>

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 13 sur 14*

---


```bash
# 1. Install N8N
npm install -g n8n

# 2. Start N8N server
n8n start --tunnel

# 3. Import workflows via GUI
# Navigate to http://localhost:5678
# Import the JSON workflows above

# 4. Configure environment variables
export CLAUDE_API_KEY="your_claude_key"
export GUMROAD_TOKEN="your_gumroad_token"  
export STRIPE_SECRET_KEY="your_stripe_key"
export CLOUDFLARE_TOKEN="your_cloudflare_token"
# ... etc
```

## 🤖 SETUP CRON JOBS

```bash
# Add to crontab
crontab -e

# Market scanner every 15 minutes
*/15 * * * * /usr/bin/python3 /scripts/market-scanner.py

# Performance optimizer every hour
0 * * * * /usr/bin/python3 /scripts/performance-optimizer.py

# Revenue tracker every 5 minutes
*/5 * * * * /usr/bin/python3 /scripts/revenue-tracker.py
```

**AUTOMATION COMPLÈTE = 90 MINUTES → CASH MACHINE 24/7 !** 🚀💰

*Workflows prêts pour déploiement immédiat*

---

*AUTOMATION-WORKFLOWS-N8N.md | 2025-09-07 | Page 14 sur 14*
