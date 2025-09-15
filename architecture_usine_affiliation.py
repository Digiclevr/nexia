import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, ConnectionPatch
import numpy as np

# Configuration de la figure
fig, ax = plt.subplots(1, 1, figsize=(16, 12))
ax.set_xlim(0, 16)
ax.set_ylim(0, 12)
ax.axis('off')

# Couleurs par catégorie
colors = {
    'ai': '#E3F2FD',         # Bleu clair pour IA
    'cms': '#F3E5F5',        # Violet clair pour CMS
    'infra': '#E8F5E8',      # Vert clair pour Infrastructure
    'money': '#FFF3E0',      # Orange clair pour Monétisation
    'security': '#FCE4EC',   # Rose clair pour Sécurité
    'social': '#F1F8E9',     # Vert lime pour Social
    'analytics': '#E0F2F1'   # Turquoise pour Analytics
}

def create_box(ax, x, y, width, height, text, color, text_size=9):
    """Créer une boîte avec texte"""
    box = FancyBboxPatch(
        (x, y), width, height,
        boxstyle="round,pad=0.1",
        facecolor=color,
        edgecolor='black',
        linewidth=1.5
    )
    ax.add_patch(box)
    
    # Ajouter le texte centré
    ax.text(x + width/2, y + height/2, text, 
           ha='center', va='center', fontsize=text_size, 
           weight='bold', wrap=True)

def create_arrow(ax, x1, y1, x2, y2, color='black', style='-'):
    """Créer une flèche entre deux points"""
    arrow = ConnectionPatch((x1, y1), (x2, y2), "data", "data",
                          arrowstyle="->", shrinkA=5, shrinkB=5,
                          mutation_scale=20, fc=color, ec=color,
                          linestyle=style, linewidth=2)
    ax.add_patch(arrow)

# Titre principal
ax.text(8, 11.5, "🏭 USINE À SITES D'AFFILIATION", 
        ha='center', va='center', fontsize=18, weight='bold')
ax.text(8, 11, "Architecture OSS pour 230 domaines", 
        ha='center', va='center', fontsize=12, style='italic')

# === LAYER 1: VEILLE & IDEATION ===
create_box(ax, 0.5, 9.5, 2.5, 1, "AGENT VEILLE IA\nSERP/Trends\nOpportunités", colors['ai'])
create_box(ax, 3.5, 9.5, 2.5, 1, "AGENT BRIEF\nH1/H2/FAQ\nSources primaires", colors['ai'])

# === LAYER 2: PRODUCTION CONTENU ===
create_box(ax, 0.5, 8, 2, 1, "✍️ AGENT\nRÉDACTION\n3k+ mots", colors['ai'])
create_box(ax, 3, 8, 2, 1, "🎯 AGENT SEO\nTitle/Meta\nSchema JSON-LD", colors['ai'])
create_box(ax, 5.5, 8, 2, 1, "✅ AGENT QA\nE-E-A-T Score\nFact-check", colors['ai'])

# === LAYER 3: HUB CENTRAL ===
create_box(ax, 1, 6.5, 3, 1, "💾 STRAPI HEADLESS\nMulti-tenant CMS\nAPI-first", colors['cms'])
create_box(ax, 4.5, 6.5, 2.5, 1, "📊 DIRECTUS\nData structurées\nKPI/Comparatifs", colors['cms'])

# === LAYER 4: ORCHESTRATION ===
create_box(ax, 8, 8.5, 3, 1.5, "🤖 n8n WORKFLOWS\nChef d'orchestre\nAutomation 24/7", colors['infra'], 10)
create_box(ax, 11.5, 8.5, 2.5, 1.5, "🧠 LANGGRAPH\nAgents IA\nState Machine", colors['ai'], 9)

# === LAYER 5: GÉNÉRATION SITES ===
create_box(ax, 8, 6.5, 2.5, 1, "🌐 NEXT.JS SSG\n230 domaines\nStatique", colors['infra'])
create_box(ax, 11, 6.5, 2, 1, "☁️ KINSTA\nHébergement\nStatic", colors['infra'])
create_box(ax, 13.5, 6.5, 2, 1, "🛡️ CLOUDFLARE\nCDN/WAF\nWildcard", colors['security'])

# === LAYER 6: MONÉTISATION ===
create_box(ax, 8, 4.5, 1.8, 1, "💰 AFFILIATION\nImpact/Awin\n60% CA", colors['money'], 8)
create_box(ax, 10, 4.5, 1.8, 1, "📢 PUBLICITÉ\nAdSense/Ezoic\n5% CA", colors['money'], 8)
create_box(ax, 12, 4.5, 1.8, 1, "🏠 LOCATION\nSous-domaines\n25% CA", colors['money'], 8)
create_box(ax, 14, 4.5, 1.8, 1, "📈 UPSELL\nGiveaways\n10% CA", colors['money'], 8)

# === LAYER 7: REPURPOSING & EMAIL ===
create_box(ax, 0.5, 4.5, 2.5, 1, "📱 REPURPOSE\nCarrousel/Thread\nShorts YouTube", colors['social'])
create_box(ax, 3.5, 4.5, 2, 1, "🔗 SHLINK\nURLs courtes\nTracking UTM", colors['social'])
create_box(ax, 0.5, 3, 2, 1, "📧 LISTMONK\nNewsletters\nSegments", colors['social'])
create_box(ax, 3, 3, 2, 1, "💾 MINIO\nGiveaways\nAssets", colors['infra'])

# === LAYER 8: ANALYTICS ===
create_box(ax, 8, 2.5, 2, 1, "📊 POSTHOG\nEvents/Funnels\nBehavior", colors['analytics'], 8)
create_box(ax, 10.5, 2.5, 2, 1, "📈 PLAUSIBLE\nWeb Analytics\nPrivacy-first", colors['analytics'], 8)
create_box(ax, 13, 2.5, 2.5, 1, "📋 GRAFANA\nDashboards\nAlertes", colors['analytics'], 8)

# === LAYER 9: INFRASTRUCTURE ===
create_box(ax, 8, 0.5, 2, 1, "🗄️ POSTGRESQL\nCentral DB\nMulti-tenant", colors['infra'], 8)
create_box(ax, 10.5, 0.5, 2, 1, "⚡ REDIS\nCache/Queues\nSessions", colors['infra'], 8)
create_box(ax, 13, 0.5, 2.5, 1, "☸️ KUBERNETES\nDigitalOcean\nCluster BlueOcean", colors['infra'], 8)

# === SÉCURITÉ & CONTRÔLE ===
create_box(ax, 0.5, 1.5, 2, 1, "🛡️ KONG\nGateway/WAF\nRate-limiting", colors['security'], 8)
create_box(ax, 3, 1.5, 2, 1, "🔐 KEYCLOAK\nSSO/Auth\nRôles", colors['security'], 8)

# === FLÈCHES PRINCIPALES (workflow) ===
# Veille → Brief
create_arrow(ax, 3, 10, 3.5, 10, 'blue')

# Brief → Rédaction
create_arrow(ax, 4.75, 9.5, 1.5, 9, 'blue')

# Rédaction → SEO → QA
create_arrow(ax, 2.5, 8.5, 3, 8.5, 'blue')
create_arrow(ax, 5, 8.5, 5.5, 8.5, 'blue')

# QA → Strapi
create_arrow(ax, 6, 8, 2.5, 7.5, 'purple')

# Strapi → n8n
create_arrow(ax, 4, 7, 8, 8.5, 'green')

# n8n → Next.js
create_arrow(ax, 9.5, 8.5, 9.25, 7.5, 'green')

# Next.js → Kinsta → Cloudflare
create_arrow(ax, 10.5, 7, 11, 7, 'gray')
create_arrow(ax, 13, 7, 13.5, 7, 'gray')

# n8n → Repurposing
create_arrow(ax, 8, 9, 3, 5.5, 'orange', '--')

# n8n → Email
create_arrow(ax, 8, 8.5, 2.5, 4, 'orange', '--')

# Cloudflare → Monétisation
create_arrow(ax, 14.5, 6.5, 11, 5.5, 'gold')

# === LÉGENDE ===
legend_y = 0.2
ax.text(0.5, legend_y, "🎯 FLUX PRINCIPAL", fontsize=10, weight='bold', color='blue')
ax.text(3, legend_y, "🔄 ORCHESTRATION", fontsize=10, weight='bold', color='green')
ax.text(5.5, legend_y, "📱 REPURPOSING", fontsize=10, weight='bold', color='orange')
ax.text(8, legend_y, "💰 MONÉTISATION", fontsize=10, weight='bold', color='gold')

# === ANNOTATIONS SPÉCIALES ===
# Politique noindex par défaut
ax.text(14, 8.5, "noindex\npar défaut", ha='center', va='center', 
        fontsize=8, style='italic', 
        bbox=dict(boxstyle="round,pad=0.2", facecolor='yellow', alpha=0.7))

# Multi-tenant
ax.text(2.5, 5.8, "Multi-tenant\nCloisonnement", ha='center', va='center', 
        fontsize=8, style='italic',
        bbox=dict(boxstyle="round,pad=0.2", facecolor='lightblue', alpha=0.7))

plt.tight_layout()
plt.savefig('/Users/ludovicpilet/PROJECTS/NEXIA/architecture_usine_affiliation.png', 
            dpi=300, bbox_inches='tight', facecolor='white')
plt.show()

print("✅ Schéma d'architecture généré : architecture_usine_affiliation.png")