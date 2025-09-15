import React, { useState } from 'react';

const HelpPage = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isPricingAnalysisOpen, setIsPricingAnalysisOpen] = useState(false);

  const sections = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: 'home' },
    { id: 'business', title: 'Business Lines', icon: 'briefcase' },
    { id: 'tiers', title: 'Définition des Tiers', icon: 'users' },
    { id: 'apis', title: 'Configuration APIs', icon: 'settings' },
    { id: 'stripe', title: 'Stripe Integration', icon: 'credit-card' },
    { id: 'agents', title: 'Gestion des Agents', icon: 'bot' },
    { id: 'sessions', title: 'Sessions Business', icon: 'activity' },
    { id: 'validation', title: 'File de Validation', icon: 'check-circle' },
    { id: 'system', title: 'Monitoring Système', icon: 'monitor' },
    { id: 'security', title: 'Sécurité', icon: 'shield' },
    { id: 'troubleshooting', title: 'Dépannage', icon: 'tool' },
    { id: 'medias', title: 'Aide par Média', icon: 'share-2' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div>
            <h2>Vue d'ensemble du Dashboard</h2>
            <p>Ce dashboard pilote les 6 sessions du <strong>Business Plan Challenge</strong> de OnlyOneAPI, avec des agents spécialisés pour chaque activité.</p>
            
            <h3>Architecture du Système</h3>
            <div className="info-card">
              <h4>6 Sessions Business</h4>
              <ul>
                <li><strong>API Audits</strong> - €800/audit - AuditBot</li>
                <li><strong>Emergency Consulting</strong> - €300/h - CrisisBot</li>
                <li><strong>Founding Members</strong> - €497/mois - ContentBot</li>
                <li><strong>Technical Writing</strong> - €300/deliverable - TechWriterBot</li>
                <li><strong>Done-for-You</strong> - €1500+ projets - ArchitectBot</li>
                <li><strong>Giveaway Campaign</strong> - Acquisition - GiveawayBot</li>
              </ul>
            </div>

            <h3>Flux de Travail</h3>
            <ol>
              <li><strong>Configuration</strong> - APIs et agents configurés</li>
              <li><strong>Exécution</strong> - Scripts automatiques par session</li>
              <li><strong>Production</strong> - Contenu généré par les agents</li>
              <li><strong>Validation</strong> - Review humaine avant publication</li>
              <li><strong>Déploiement</strong> - Publication automatique</li>
            </ol>

            <div className="warning-card">
              <h4>Prérequis Critiques</h4>
              <p>Avant de démarrer, assurez-vous que:</p>
              <ul>
                <li>Toutes les APIs critiques sont configurées</li>
                <li>Les agents sont activés pour leurs sessions</li>
                <li>Les scripts de session sont fonctionnels</li>
              </ul>
            </div>
          </div>
        );

      case 'business':
        return (
          <div>
            <h2>Business Lines du Challenge</h2>
            <p>Le Business Plan Challenge de OnlyOneAPI comprend 6 business lines distinctes, chacune avec son propre modèle économique et ses objectifs spécifiques.</p>

            <div className="business-line-card">
              <h3>1. API Audits - €800/audit</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>Prix:</strong> €800 par audit complet</li>
                    <li><strong>Durée:</strong> 3-5 jours par audit</li>
                    <li><strong>Récurrence:</strong> Paiements uniques</li>
                    <li><strong>Objectif mensuel:</strong> 5-10 audits = €4,000-8,000</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus de vente</h4>
                  <ol>
                    <li>Prospection LinkedIn d'entreprises tech</li>
                    <li>Audit gratuit de 30 minutes pour qualifier</li>
                    <li>Proposition d'audit complet payant</li>
                    <li>Livraison rapport détaillé + recommandations</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> AuditBot | <strong>APIs:</strong> OpenAI, LinkedIn, SendGrid</p>
                  <p><strong>Stack:</strong> Postman, documentation tools, reporting templates</p>
                </div>
              </div>
            </div>

            <div className="business-line-card" style={{ position: 'relative' }}>
              <button 
                className="pricing-analysis-tag"
                onClick={() => setIsPricingAnalysisOpen(true)}
                title="Voir l'analyse tarifaire détaillée"
              >
                💰 Analyse Prix
              </button>
              <h3>2. Emergency Consulting - €300/heure</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>Prix:</strong> €300 par heure</li>
                    <li><strong>Minimum:</strong> 2 heures par mission</li>
                    <li><strong>Disponibilité:</strong> 24/7 pour vraies urgences</li>
                    <li><strong>Objectif mensuel:</strong> 20 heures = €6,000</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus d'intervention</h4>
                  <ol>
                    <li>Monitoring automatique des signaux d'urgence</li>
                    <li>Qualification rapide du problème (15 min gratuit)</li>
                    <li>Intervention payante immédiate</li>
                    <li>Rapport post-intervention + recommandations</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> CrisisBot | <strong>APIs:</strong> OpenAI, GitHub, Twitter</p>
                  <p><strong>Stack:</strong> Monitoring, alertes, communication rapide</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>3. Founding Members - €497/mois</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>Prix:</strong> €497 par mois (abonnement)</li>
                    <li><strong>Durée:</strong> Engagement 6-12 mois</li>
                    <li><strong>LTV:</strong> €3,000-6,000 par membre</li>
                    <li><strong>Objectif:</strong> 50 membres = €24,850/mois</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus d'acquisition</h4>
                  <ol>
                    <li>Contenu premium gratuit pour attirer l'audience</li>
                    <li>Webinaires et démos techniques</li>
                    <li>Proposition membership avec benefits exclusifs</li>
                    <li>Support communautaire et ressources privées</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> ContentBot | <strong>APIs:</strong> OpenAI, LinkedIn</p>
                  <p><strong>Stack:</strong> Community platform, payment recurring, content CMS</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>4. Technical Writing - €300/livrable</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>Prix:</strong> €300 par deliverable</li>
                    <li><strong>Types:</strong> Documentation, tutorials, articles</li>
                    <li><strong>Volume:</strong> 10-15 livrables/mois</li>
                    <li><strong>Objectif mensuel:</strong> €3,000-4,500</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus de production</h4>
                  <ol>
                    <li>Prospection clients ayant besoin de doc tech</li>
                    <li>Portfolio et templates prêts</li>
                    <li>Pricing basé sur complexité</li>
                    <li>Livraison rapide avec révisions incluses</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> TechWriterBot | <strong>APIs:</strong> OpenAI, Upwork</p>
                  <p><strong>Stack:</strong> Documentation tools, versioning, delivery platform</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>5. Done-for-You Services - €1500+</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>Prix:</strong> €1500-5000 par projet</li>
                    <li><strong>Durée:</strong> 2-6 semaines</li>
                    <li><strong>Acompte:</strong> 50% à la commande</li>
                    <li><strong>Objectif mensuel:</strong> 3-5 projets = €4,500-15,000</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus de livraison</h4>
                  <ol>
                    <li>Qualification des besoins et scope précis</li>
                    <li>Devis détaillé avec jalons</li>
                    <li>Architecture et développement</li>
                    <li>Livraison clé-en-main + formation</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> ArchitectBot | <strong>APIs:</strong> Calendly, Slack</p>
                  <p><strong>Stack:</strong> Project management, development tools, deployment</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>6. Giveaway Campaign - Lead Generation</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Modèle économique</h4>
                  <ul>
                    <li><strong>ROI:</strong> Support pour autres business lines</li>
                    <li><strong>Coût:</strong> €50-200 par campagne</li>
                    <li><strong>Leads:</strong> 100-500 prospects qualifiés</li>
                    <li><strong>Conversion:</strong> 2-5% vers services payants</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Processus de campagne</h4>
                  <ol>
                    <li>Création de ressources high-value (outils, templates)</li>
                    <li>Campagne virale sur réseaux sociaux</li>
                    <li>Collecte emails avec segmentation</li>
                    <li>Nurturing vers autres business lines</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Outils requis</h4>
                  <p><strong>Agent:</strong> GiveawayBot | <strong>APIs:</strong> Twitter, SendGrid</p>
                  <p><strong>Stack:</strong> Landing pages, email automation, analytics</p>
                </div>
              </div>
            </div>

            <h3>Synergie entre Business Lines</h3>
            <div className="synergy-info">
              <ul>
                <li><strong>Giveaway → Audits:</strong> Leads qualifiés pour audits gratuits</li>
                <li><strong>Audits → Consulting:</strong> Clients satisfaits pour urgences</li>
                <li><strong>Consulting → DFY:</strong> Projets plus gros identifiés</li>
                <li><strong>Tous → Founding:</strong> Clients récurrents vers membership</li>
                <li><strong>Expertise → Writing:</strong> Crédibilité pour rédaction tech</li>
              </ul>
            </div>
          </div>
        );

      case 'tiers':
        return (
          <div>
            <h2>Définition des Tiers OnlyOneAPI</h2>
            <p>OnlyOneAPI s'adresse à différents profils d'utilisateurs avec des besoins spécifiques. Notre offre SOLO cible principalement 3 types de profils indépendants.</p>

            <div className="info-card">
              <h3>Tier SOLO - Structure Tarifaire</h3>
              <div className="business-details">
                <ul>
                  <li><strong>Prix :</strong> $997 (83$/mois la première année)</li>
                  <li><strong>API Calls :</strong> 100K appels/mois</li>
                  <li><strong>Support :</strong> Support standard</li>
                  <li><strong>Endpoints Custom :</strong> 3 endpoints personnalisés</li>
                  <li><strong>SLA :</strong> 99.9% uptime garanti</li>
                </ul>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil 1 : Développeurs Indépendants</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Caractéristiques</h4>
                  <ul>
                    <li><strong>Activité :</strong> Développement freelance, projets clients</li>
                    <li><strong>Besoins :</strong> APIs fiables pour intégrations client</li>
                    <li><strong>Priorités :</strong> Documentation claire, support réactif</li>
                    <li><strong>Budget :</strong> Sensible au prix, ROI important</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Pain Points</h4>
                  <ul>
                    <li><strong>Complexité technique :</strong> Documentation API incomplète, intégrations qui prennent des semaines</li>
                    <li><strong>Coûts imprévisibles :</strong> APIs payantes qui explosent le budget client sans prévenir</li>
                    <li><strong>Support inexistant :</strong> Pas de réponse quand ça plante en production</li>
                    <li><strong>Fiabilité douteuse :</strong> Services qui tombent sans SLA, clients mécontents</li>
                    <li><strong>Maintenance cauchemar :</strong> Changements d'API qui cassent tout sans préavis</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Démographique</h4>
                  <ul>
                    <li><strong>Âge :</strong> 28-38 ans (millennial tech-savvy)</li>
                    <li><strong>Localisation :</strong> Grandes villes US/EU, remote-friendly</li>
                    <li><strong>Expérience :</strong> 5-12 ans en développement</li>
                    <li><strong>Formation :</strong> Mix école ingé + autodidacte + bootcamps</li>
                    <li><strong>Transition :</strong> Ex-employé tech → indépendant depuis 2-5 ans</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Économique</h4>
                  <ul>
                    <li><strong>Revenus annuels :</strong> $60K-$120K (variable selon projets)</li>
                    <li><strong>Budget tech mensuel :</strong> $200-$500 (outils + services)</li>
                    <li><strong>Cycle décision :</strong> Réfléchi (1-2 semaines d'évaluation)</li>
                    <li><strong>Seuil douleur prix :</strong> $200/mois max pour un outil</li>
                    <li><strong>ROI attendu :</strong> Récupération investissement &lt; 3 mois</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Stack Technique</h4>
                  <ul>
                    <li><strong>Langages :</strong> JavaScript/TypeScript, Python, occasionnel PHP</li>
                    <li><strong>Frontend :</strong> React, Vue.js, vanilla JS selon client</li>
                    <li><strong>Backend :</strong> Node.js, Express, APIs REST/GraphQL</li>
                    <li><strong>Outils actuels :</strong> Postman, GitHub, Vercel/Netlify</li>
                    <li><strong>Automatisation :</strong> Zapier basique, scripts custom</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Comportement Décisionnel</h4>
                  <ul>
                    <li><strong>Sources info :</strong> Dev Twitter, YouTube tutorials, Reddit r/webdev</li>
                    <li><strong>Influenceurs :</strong> Indie Hackers, Dev YouTubers, tech blogs</li>
                    <li><strong>Processus achat :</strong> Free trial obligatoire → test → achat</li>
                    <li><strong>Facteurs bloquants :</strong> Prix élevé, setup complexe, pas de trial</li>
                    <li><strong>Moment décision :</strong> Weekend planning ou entre 2 projets</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Objectifs & Motivations</h4>
                  <ul>
                    <li><strong>Ambition 1 an :</strong> Doubler tarif journalier + sélectionner clients</li>
                    <li><strong>Peur principale :</strong> Dépendance client unique, manquer opportunities</li>
                    <li><strong>Définition succès :</strong> $150K+/an avec 6 mois vacances</li>
                    <li><strong>Frustration #1 :</strong> Temps perdu sur tâches répétitives</li>
                    <li><strong>Rêve :</strong> Produits passifs + consulting premium</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Cas d'usage typiques</h4>
                  <ol>
                    <li>Applications mobiles pour clients</li>
                    <li>Sites web avec fonctionnalités avancées</li>
                    <li>Prototypes et MVPs</li>
                    <li>Intégrations API tierces</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Proposition de valeur</h4>
                  <p><strong>Bénéfice :</strong> Accès premium à 271+ endpoints à un prix accessible</p>
                  <p><strong>Différenciation :</strong> Intégration rapide &lt; 30 minutes, documentation complète</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil 2 : Indépendant Cherchant de l'Efficacité</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Caractéristiques</h4>
                  <ul>
                    <li><strong>Activité :</strong> Entrepreneur solo, consultant, coach</li>
                    <li><strong>Besoins :</strong> Optimisation temps, productivité maximale</li>
                    <li><strong>Priorités :</strong> Solutions clé-en-main, économie de temps</li>
                    <li><strong>Budget :</strong> Prêt à investir pour gagner du temps</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Pain Points</h4>
                  <ul>
                    <li><strong>Perte de temps énorme :</strong> Tâches manuelles répétitives qui mangent 50% de la journée</li>
                    <li><strong>Outils déconnectés :</strong> 10+ logiciels qui ne se parlent pas, saisies multiples</li>
                    <li><strong>Pas de vision globale :</strong> Données éparpillées, impossible de piloter efficacement</li>
                    <li><strong>Scaling impossible :</strong> Plus de clients = plus de chaos administratif</li>
                    <li><strong>Solutions trop chères :</strong> Enterprise tools à 500€/mois pour un solo entrepreneur</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Démographique</h4>
                  <ul>
                    <li><strong>Âge :</strong> 32-45 ans (expérience business + tech)</li>
                    <li><strong>Localisation :</strong> Moyennes villes, souvent remote/hybride</li>
                    <li><strong>Expérience :</strong> 8-20 ans, polyvalent business/tech</li>
                    <li><strong>Formation :</strong> Business school + formation tech continue</li>
                    <li><strong>Profil :</strong> Ex-manager/consultant → entrepreneur solo</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Économique</h4>
                  <ul>
                    <li><strong>Revenus annuels :</strong> $80K-$200K (business + consulting)</li>
                    <li><strong>Budget tech mensuel :</strong> $500-$1200 (investit dans l'efficacité)</li>
                    <li><strong>Cycle décision :</strong> Rapide si ROI évident (&lt; 1 semaine)</li>
                    <li><strong>Seuil douleur prix :</strong> $500/mois OK si ça fait gagner temps</li>
                    <li><strong>ROI attendu :</strong> 10h économisées/semaine minimum</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Stack Technique</h4>
                  <ul>
                    <li><strong>Niveau :</strong> Intermediate, préfère no-code/low-code</li>
                    <li><strong>Outils actuels :</strong> Notion, Airtable, Zapier, Calendly</li>
                    <li><strong>Automatisation :</strong> Zapier Pro, Integromat, workflows complexes</li>
                    <li><strong>CRM/Business :</strong> HubSpot, Pipedrive, outils tout-en-un</li>
                    <li><strong>Limite :</strong> Évite le code, veut des solutions plug-and-play</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Comportement Décisionnel</h4>
                  <ul>
                    <li><strong>Sources info :</strong> LinkedIn, podcasts business, webinaires</li>
                    <li><strong>Influenceurs :</strong> Entrepreneurs à succès, productivity gurus</li>
                    <li><strong>Processus achat :</strong> Demo → calcul ROI → achat rapide</li>
                    <li><strong>Facteurs bloquants :</strong> Setup compliqué, pas de support</li>
                    <li><strong>Moment décision :</strong> Quand débordé, besoin solution immédiate</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Objectifs & Motivations</h4>
                  <ul>
                    <li><strong>Ambition 1 an :</strong> Automatiser 80% des tâches, scale business</li>
                    <li><strong>Peur principale :</strong> Burn-out, ne pas suivre la croissance</li>
                    <li><strong>Définition succès :</strong> 4 jours/semaine, revenus x3</li>
                    <li><strong>Frustration #1 :</strong> Journées de 12h sur tâches peu importantes</li>
                    <li><strong>Rêve :</strong> Business qui tourne seul, liberté géographique</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Cas d'usage typiques</h4>
                  <ol>
                    <li>Automatisation de tâches répétitives</li>
                    <li>Outils de gestion business personnels</li>
                    <li>Intégrations entre outils existants</li>
                    <li>Tableaux de bord personnalisés</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Proposition de valeur</h4>
                  <p><strong>Bénéfice :</strong> ROI immédiat par gain de temps et efficacité</p>
                  <p><strong>Différenciation :</strong> Templates prêts à l'emploi, intégrations pré-configurées</p>
                </div>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil 3 : Indépendant Spécialisé Automatisations</h3>
              <div className="business-details">
                <div className="business-model">
                  <h4>Caractéristiques</h4>
                  <ul>
                    <li><strong>Activité :</strong> Expert en automatisation, consultant workflow</li>
                    <li><strong>Besoins :</strong> APIs robustes pour solutions client</li>
                    <li><strong>Priorités :</strong> Fiabilité, scalabilité, documentation technique</li>
                    <li><strong>Budget :</strong> Facturation client, investissement rentable</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Pain Points</h4>
                  <ul>
                    <li><strong>APIs limitées/instables :</strong> Clients demandent l'impossible avec des APIs fragiles</li>
                    <li><strong>Développement custom coûteux :</strong> Chaque intégration = semaines de dev spécifique</li>
                    <li><strong>Maintenance explosive :</strong> Client happy, puis ça casse, client furieux</li>
                    <li><strong>Pas de différenciation :</strong> Même galère que tous les concurrents</li>
                    <li><strong>Facturation compliquée :</strong> Difficile d'estimer le temps, projets qui dérapent</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Démographique</h4>
                  <ul>
                    <li><strong>Âge :</strong> 30-42 ans (expert technique + business acumen)</li>
                    <li><strong>Localisation :</strong> Tech hubs (SF, NYC, Austin) ou remote</li>
                    <li><strong>Expérience :</strong> 10-15 ans, spécialiste reconnu</li>
                    <li><strong>Formation :</strong> Ingénieur + certifications automation (UiPath, etc.)</li>
                    <li><strong>Statut :</strong> Consultant premium ou fondateur d'agence automation</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Profil Économique</h4>
                  <ul>
                    <li><strong>Revenus annuels :</strong> $150K-$400K (tarifs premium)</li>
                    <li><strong>Budget tech mensuel :</strong> $1000-$3000 (coût du business)</li>
                    <li><strong>Cycle décision :</strong> Technique (1 mois d'évaluation approfondie)</li>
                    <li><strong>Seuil douleur prix :</strong> $1000/mois acceptable si différenciant</li>
                    <li><strong>ROI attendu :</strong> Facturable à $200-400/h chez clients</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Stack Technique</h4>
                  <ul>
                    <li><strong>Expertise :</strong> Python, JavaScript, APIs REST/GraphQL mastery</li>
                    <li><strong>Platforms :</strong> Zapier Advanced, Make, n8n, UiPath, Automation Anywhere</li>
                    <li><strong>Infrastructure :</strong> AWS/Azure, Docker, CI/CD pipelines</li>
                    <li><strong>Business tools :</strong> Slack bots, custom dashboards, webhooks</li>
                    <li><strong>Différenciation :</strong> Développe ses propres outils et connectors</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Comportement Décisionnel</h4>
                  <ul>
                    <li><strong>Sources info :</strong> GitHub, tech conferences, communities spécialisées</li>
                    <li><strong>Influenceurs :</strong> Tech leaders, automation experts, open source maintainers</li>
                    <li><strong>Processus achat :</strong> POC complet → analyse technique → négociation</li>
                    <li><strong>Facteurs bloquants :</strong> API limits, documentation incomplète, pas d'enterprise features</li>
                    <li><strong>Moment décision :</strong> Préparation nouveaux projets clients (trimestriel)</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Objectifs & Motivations</h4>
                  <ul>
                    <li><strong>Ambition 1 an :</strong> Créer IP propriétaire, scale équipe à 5-10 personnes</li>
                    <li><strong>Peur principale :</strong> Commoditisation, concurrence low-cost</li>
                    <li><strong>Définition succès :</strong> Recognition expert + $500K ARR récurrent</li>
                    <li><strong>Frustration #1 :</strong> Clients qui ne comprennent pas la valeur technique</li>
                    <li><strong>Rêve :</strong> Plateforme SaaS propriétaire + thought leadership</li>
                  </ul>
                </div>
                <div className="business-process">
                  <h4>Cas d'usage typiques</h4>
                  <ol>
                    <li>Workflows automatisés complexes</li>
                    <li>Intégrations multi-services pour clients</li>
                    <li>Solutions no-code/low-code avancées</li>
                    <li>Consulting en automatisation</li>
                  </ol>
                </div>
                <div className="business-tools">
                  <h4>Proposition de valeur</h4>
                  <p><strong>Bénéfice :</strong> Toolkit complet pour créer des automatisations premium</p>
                  <p><strong>Différenciation :</strong> Endpoints spécialisés, support technique expert</p>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h3>Tier STARTUP - Structure Tarifaire</h3>
              <div className="business-details">
                <ul>
                  <li><strong>Prix :</strong> $1,997 (166$/mois la première année)</li>
                  <li><strong>API Calls :</strong> 500K appels/mois</li>
                  <li><strong>Support :</strong> Support prioritaire + Slack dédié</li>
                  <li><strong>Endpoints Custom :</strong> 10 endpoints personnalisés</li>
                  <li><strong>SLA :</strong> 99.95% uptime garanti</li>
                  <li><strong>Team Access :</strong> Jusqu'à 5 développeurs</li>
                </ul>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil STARTUP : Équipes 2-15 Personnes</h3>
              
              <h4>📊 Pain Points Critiques</h4>
              <div className="pain-points">
                <ul>
                  <li><strong>Vélocité Développement :</strong> Besoin de livrer des fonctionnalités rapidement pour lever des fonds</li>
                  <li><strong>Budget Serré :</strong> Seed/Series A avec optimisation coûts critiques ($30K-$45K budget dev total)</li>
                  <li><strong>Intégrations Multiples :</strong> 26-50 APIs en moyenne par application startup</li>
                  <li><strong>Time-to-Market :</strong> Chaque semaine de retard = perte d'avance concurrentielle</li>
                  <li><strong>Complexité Technique :</strong> Manque d'expertise senior pour architecture APIs</li>
                </ul>
              </div>

              <h4>👥 Profil Démographique (Données 2024)</h4>
              <div className="demographic-profile">
                <ul>
                  <li><strong>Poste :</strong> CTO, Lead Developer, Technical Founder</li>
                  <li><strong>Âge :</strong> 28-40 ans</li>
                  <li><strong>Localisation :</strong> 60% USA, 25% Europe, 15% Canada</li>
                  <li><strong>Formation :</strong> 85% Computer Science, 15% autodidactes</li>
                  <li><strong>Expérience :</strong> 5-12 ans développement</li>
                </ul>
              </div>

              <h4>💰 Profil Économique</h4>
              <div className="economic-profile">
                <ul>
                  <li><strong>Budget API/mois :</strong> $500-$2,000</li>
                  <li><strong>Revenus Company :</strong> $100K-$1M ARR</li>
                  <li><strong>Funding Stage :</strong> Seed ($500K-$2M), Series A ($2M-$10M)</li>
                  <li><strong>Cycle Décision :</strong> 2-4 semaines (validation équipe)</li>
                  <li><strong>Seuil Prix :</strong> $2K/mois maximum pour outils</li>
                </ul>
              </div>

              <h4>🔧 Stack Technique Type</h4>
              <div className="tech-stack">
                <ul>
                  <li><strong>Langages :</strong> Node.js, Python, Go, TypeScript</li>
                  <li><strong>Cloud :</strong> AWS (60%), GCP (25%), Azure (15%)</li>
                  <li><strong>APIs Critiques :</strong> Auth0, Stripe, SendGrid, S3, Analytics</li>
                  <li><strong>CI/CD :</strong> GitHub Actions, Vercel, Railway</li>
                </ul>
              </div>

              <h4>🎯 Comportement Décisionnel</h4>
              <div className="decision-behavior">
                <ul>
                  <li><strong>Sources Info :</strong> GitHub, Hacker News, Twitter tech, Developer newsletters</li>
                  <li><strong>Processus Achat :</strong> POC gratuit → Test équipe → Validation budget → Achat</li>
                  <li><strong>Critères Prioritaires :</strong> 1) Temps d'intégration 2) Prix 3) Documentation 4) Support</li>
                </ul>
              </div>

              <h4>🚀 Objectifs et Motivations</h4>
              <div className="objectives-motivations">
                <ul>
                  <li><strong>Ambitions :</strong> Lever Series A/B, atteindre product-market fit</li>
                  <li><strong>Peurs :</strong> Retard concurrentiel, budget épuisé, complexité technique</li>
                  <li><strong>Définition Succès :</strong> Fonctionnalités livrées en &lt; 2 semaines, équipe autonome</li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <h3>Tier SCALE - Structure Tarifaire</h3>
              <div className="business-details">
                <ul>
                  <li><strong>Prix :</strong> $2,997 (249$/mois la première année)</li>
                  <li><strong>API Calls :</strong> 2M appels/mois</li>
                  <li><strong>Support :</strong> Support dédié + Success Manager</li>
                  <li><strong>Endpoints Custom :</strong> 25 endpoints personnalisés</li>
                  <li><strong>SLA :</strong> 99.99% uptime garanti</li>
                  <li><strong>Team Access :</strong> Jusqu'à 15 développeurs</li>
                  <li><strong>Infrastructure :</strong> Environnements dédiés staging/prod</li>
                </ul>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil SCALE : Scale-ups 15-100 Personnes</h3>
              
              <h4>📊 Pain Points Critiques</h4>
              <div className="pain-points">
                <ul>
                  <li><strong>Scaling Complexity :</strong> Architecture APIs devient ingérable avec la croissance</li>
                  <li><strong>Performance Issues :</strong> Latence et fiabilité critiques pour UX clients</li>
                  <li><strong>Team Coordination :</strong> 3-5 squads dev avec besoins API divergents</li>
                  <li><strong>Enterprise Sales :</strong> Clients exigent SLAs et certifications sécurité</li>
                  <li><strong>Cost Optimization :</strong> Budget AI/API €13.8B (500% croissance), optimisation critiques</li>
                </ul>
              </div>

              <h4>👥 Profil Démographique (Données 2024)</h4>
              <div className="demographic-profile">
                <ul>
                  <li><strong>Poste :</strong> VP Engineering, Senior CTO, Head of Platform</li>
                  <li><strong>Âge :</strong> 32-45 ans</li>
                  <li><strong>Localisation :</strong> 55% USA, 30% Europe, 15% Autres</li>
                  <li><strong>Formation :</strong> 90% Master CS/Engineering, 10% MBA technique</li>
                  <li><strong>Expérience :</strong> 8-20 ans engineering leadership</li>
                </ul>
              </div>

              <h4>💰 Profil Économique</h4>
              <div className="economic-profile">
                <ul>
                  <li><strong>Budget API/mois :</strong> $2,000-$10,000</li>
                  <li><strong>Revenus Company :</strong> $1M-$50M ARR</li>
                  <li><strong>Funding Stage :</strong> Series B ($10M-$50M), Series C ($50M+)</li>
                  <li><strong>Cycle Décision :</strong> 4-8 semaines (validation multiple stakeholders)</li>
                  <li><strong>Seuil Prix :</strong> $10K/mois acceptable pour platform-critical</li>
                </ul>
              </div>

              <h4>🔧 Stack Technique Type</h4>
              <div className="tech-stack">
                <ul>
                  <li><strong>Architecture :</strong> Microservices, API Gateway, Service Mesh</li>
                  <li><strong>Cloud :</strong> Multi-cloud (AWS+GCP), Kubernetes</li>
                  <li><strong>Monitoring :</strong> DataDog, New Relic, Prometheus</li>
                  <li><strong>APIs Volume :</strong> 50-200 APIs internes + externes</li>
                </ul>
              </div>

              <h4>🎯 Comportement Décisionnel</h4>
              <div className="decision-behavior">
                <ul>
                  <li><strong>Sources Info :</strong> Gartner, Industry reports, Peer networks, Conferences</li>
                  <li><strong>Processus Achat :</strong> RFP → POC enterprise → Legal review → Procurement</li>
                  <li><strong>Critères Prioritaires :</strong> 1) SLA/Uptime 2) Scalabilité 3) Support 4) Security compliance</li>
                </ul>
              </div>

              <h4>🚀 Objectifs et Motivations</h4>
              <div className="objectives-motivations">
                <ul>
                  <li><strong>Ambitions :</strong> IPO preparation, market leadership consolidation</li>
                  <li><strong>Peurs :</strong> Downtime = revenue loss, security breaches, vendor lock-in</li>
                  <li><strong>Définition Succès :</strong> 99.99% uptime, équipe autonome, coûts optimisés</li>
                </ul>
              </div>
            </div>

            <div className="info-card">
              <h3>Tier PATRON - Structure Tarifaire</h3>
              <div className="business-details">
                <ul>
                  <li><strong>Prix :</strong> $19,997 (1,666$/mois la première année)</li>
                  <li><strong>API Calls :</strong> 10M+ appels/mois</li>
                  <li><strong>Support :</strong> Support white-glove + CSM dédié + SLAs personnalisés</li>
                  <li><strong>Endpoints Custom :</strong> Illimités</li>
                  <li><strong>SLA :</strong> 99.999% uptime garanti + compensation financière</li>
                  <li><strong>Team Access :</strong> Organisation complète (100+ développeurs)</li>
                  <li><strong>Enterprise :</strong> On-premise, SOC2, ISO27001, BAA agreements</li>
                </ul>
              </div>
            </div>

            <div className="business-line-card">
              <h3>Profil PATRON : Enterprise 100+ Personnes</h3>
              
              <h4>📊 Pain Points Critiques</h4>
              <div className="pain-points">
                <ul>
                  <li><strong>Enterprise Governance :</strong> Compliance SOC2, ISO27001, GDPR obligatoires</li>
                  <li><strong>Multi-Region Deploy :</strong> Latence globale &lt; 100ms, data residency</li>
                  <li><strong>High Availability :</strong> Downtime = millions revenue loss, 99.999% requis</li>
                  <li><strong>Vendor Management :</strong> Due diligence security, legal reviews complexes</li>
                  <li><strong>Budget Efficiency :</strong> CTO budget $5.74T globalement (9.3% croissance), ROI démontrable</li>
                </ul>
              </div>

              <h4>👥 Profil Démographique (Données 2024)</h4>
              <div className="demographic-profile">
                <ul>
                  <li><strong>Poste :</strong> CTO, Chief Architect, VP Platform Engineering</li>
                  <li><strong>Âge :</strong> 35-55 ans</li>
                  <li><strong>Localisation :</strong> 50% USA, 35% Europe, 15% APAC</li>
                  <li><strong>Formation :</strong> 95% Advanced degrees, 60% Ivy League/Top tier</li>
                  <li><strong>Expérience :</strong> 12-25 ans, leadership enterprise scale</li>
                </ul>
              </div>

              <h4>💰 Profil Économique</h4>
              <div className="economic-profile">
                <ul>
                  <li><strong>Budget API/mois :</strong> $25,000-$200,000+</li>
                  <li><strong>Revenus Company :</strong> $50M+ ARR, souvent $1B+ public companies</li>
                  <li><strong>IT Budget Total :</strong> $50M-$500M annuel</li>
                  <li><strong>Cycle Décision :</strong> 6-18 mois (legal, procurement, security review)</li>
                  <li><strong>Seuil Prix :</strong> $100K+ acceptable si ROI enterprise démontrable</li>
                </ul>
              </div>

              <h4>🔧 Stack Technique Type</h4>
              <div className="tech-stack">
                <ul>
                  <li><strong>Architecture :</strong> Enterprise Service Bus, API Management platforms</li>
                  <li><strong>Cloud :</strong> Hybrid multi-cloud, private cloud, edge computing</li>
                  <li><strong>Governance :</strong> API catalog, lifecycle management, versioning</li>
                  <li><strong>Scale :</strong> 500+ APIs, millions requests/minute</li>
                </ul>
              </div>

              <h4>🎯 Comportement Décisionnel</h4>
              <div className="decision-behavior">
                <ul>
                  <li><strong>Sources Info :</strong> Analyst firms (Gartner, Forrester), Industry councils, Board networks</li>
                  <li><strong>Processus Achat :</strong> Strategic initiative → Committee approval → RFP formal → Pilot → Enterprise negotiation</li>
                  <li><strong>Critères Prioritaires :</strong> 1) Business continuity 2) Compliance/Security 3) Strategic alignment 4) Vendor stability</li>
                </ul>
              </div>

              <h4>🚀 Objectifs et Motivations</h4>
              <div className="objectives-motivations">
                <ul>
                  <li><strong>Ambitions :</strong> Digital transformation leadership, operational excellence</li>
                  <li><strong>Peurs :</strong> Security incidents, regulatory non-compliance, business disruption</li>
                  <li><strong>Définition Succès :</strong> 40-50% tech modernization acceleration, 40% cost reduction tech debt</li>
                </ul>
              </div>
            </div>

            <div className="warning-card">
              <h3>📊 Chiffres Clés Marché 2024-2025</h3>
              <div className="market-data">
                <h4>Données Économiques Validées</h4>
                <ul>
                  <li><strong>Startup MVP Budget :</strong> $30K-$45K développement total</li>
                  <li><strong>API Integration Cost :</strong> $18K-$20K par API custom</li>
                  <li><strong>Enterprise AI Spending :</strong> +500% croissance = $13.8B (2024)</li>
                  <li><strong>IT Budget Global :</strong> $5.74T (+9.3% vs 2024)</li>
                  <li><strong>Average APIs/App :</strong> 26-50 APIs par application</li>
                  <li><strong>Developer Rates :</strong> $120-$140/h (US Senior), $50-$70/h (EU)</li>
                </ul>
                
                <h4>Benchmarks Performance</h4>
                <ul>
                  <li><strong>Platform Solutions :</strong> 60% économies vs custom development</li>
                  <li><strong>API Issues Frequency :</strong> 88% companies = attention hebdomadaire</li>
                  <li><strong>Troubleshooting Time :</strong> 36% spend more time debugging than developing</li>
                  <li><strong>Enterprise Success Rate :</strong> High-performing IT orgs = 35% higher revenue growth</li>
                </ul>
              </div>
            </div>

            <div className="warning-card">
              <h3>Landing Pages Dédiées</h3>
              <p>Chaque profil nécessite une landing page adaptée basée sur le format développeur existant :</p>
              <ul>
                <li><strong>SOLO :</strong> Focus technique, intégrations rapides, exemples de code</li>
                <li><strong>STARTUP :</strong> Focus vélocité, time-to-market, case studies seed/A</li>
                <li><strong>SCALE :</strong> Focus performance, SLAs, architecture scalable</li>
                <li><strong>PATRON :</strong> Focus compliance, governance, enterprise security</li>
              </ul>
            </div>
          </div>
        );

      case 'apis':
        return (
          <div>
            <h2>Configuration des APIs</h2>
            <p>Le système utilise des APIs spécialisées pour chaque business activity, avec un chiffrement AES-256-CBC pour la sécurité.</p>

            <div className="info-card">
              <h4>Stripe Integration</h4>
              <p>Pour une configuration complète de Stripe Connect, consultez la section dédiée "Stripe Integration" qui contient :</p>
              <ul>
                <li>Guide complet Stripe Connect pour OnlyOneAPI</li>
                <li>Calculs détaillés des coûts par type de compte</li>
                <li>Options de payout avec délais et frais</li>
                <li>Plan d'implémentation étape par étape</li>
                <li>Architecture recommandée multi-projets</li>
              </ul>
            </div>

            <h3>APIs Essentielles</h3>
            <div className="api-section">
              <ul>
                <li><strong>openai_api_key</strong> - Génération de contenu (CRITIQUE)</li>
                <li><strong>linkedin_client_id/secret</strong> - Prospection LinkedIn</li>
                <li><strong>sendgrid_api_key</strong> - Envoi d'emails automatique</li>
                <li><strong>github_token</strong> - Monitoring des issues</li>
              </ul>
            </div>

            <h3>Sécurité des APIs</h3>
            <div className="security-info">
              <h4>Chiffrement</h4>
              <ul>
                <li><strong>AES-256-CBC</strong> pour le stockage en base</li>
                <li><strong>Masquage automatique</strong> dans l'interface (sk-12****5678)</li>
                <li><strong>Logs sécurisés</strong> avec valeurs masquées</li>
              </ul>

              <h4>Bonnes Pratiques</h4>
              <ul>
                <li>Utilisez des clés Stripe restreintes par activité</li>
                <li>Testez chaque API après configuration</li>
                <li>Vérifiez les permissions avant production</li>
              </ul>
            </div>
          </div>
        );

      case 'stripe':
        return (
          <div>
            <h2>Stripe Integration - Guide Complet OnlyOneAPI</h2>
            <p>Documentation complète pour l'implémentation Stripe Connect avec calculs de coûts et recommandations optimisées pour votre écosystème OnlyOneAPI.</p>
            
            <div className="info-card">
              <h4>Architecture Stripe Connect Recommandée</h4>
              <div className="code-block">
                <pre>{`Stripe Connect Platform Account
├── OnlyOneAPI Business (Standard Account)
│   ├── Plans: Free/Starter/Pro/Enterprise
│   ├── Coût: 2.9% + 0.30€ uniquement
│   ├── Webhook endpoints
│   ├── Bank: Compte OnlyOneAPI
│   └── Payout: Quotidien (gratuit)
│
├── Autres Projets (Standard Account 2+)
│   ├── Billing séparé
│   ├── Bank: Autres comptes
│   └── Gestion indépendante
│
└── Reporting unifié + API centralisée OnlyOneAPI`}</pre>
              </div>
            </div>

            <h3>Comparaison Détaillée Types de Comptes Connect</h3>
            
            <div className="business-line-card">
              <h4>✅ Standard Account (Fortement Recommandé)</h4>
              <div className="stripe-account-details">
                <div className="account-feature">
                  <strong>Coût Transaction:</strong> 2.9% + 0.30€
                </div>
                <div className="account-feature">
                  <strong>Frais Supplémentaires:</strong> 0€ (aucun)
                </div>
                <div className="account-feature">
                  <strong>Maintenance:</strong> 0€/mois
                </div>
                <div className="account-feature">
                  <strong>Total exemple 100€:</strong> 3.20€ (3.2% effectif)
                </div>
              </div>
              
              <div className="account-benefits">
                <h5>Avantages Standard Account:</h5>
                <ul>
                  <li>Pas de frais supplémentaires vs compte Stripe classique</li>
                  <li>Gestion simplifiée avec interface Stripe native</li>
                  <li>ROI optimal pour OnlyOneAPI</li>
                  <li>Configuration rapide et maintenance minimale</li>
                </ul>
              </div>
            </div>

            <div className="api-section">
              <h4>❌ Express/Custom Accounts (Non Recommandés)</h4>
              
              <div className="account-comparison">
                <div className="expensive-account">
                  <h5>Express Account</h5>
                  <ul>
                    <li><strong>Coût Transaction:</strong> 2.9% + 0.30€</li>
                    <li><strong>Frais Supplémentaires:</strong> 0.25% + 0.25€ par payout</li>
                    <li><strong>Maintenance:</strong> 2€/mois par compte actif</li>
                    <li><strong>Total exemple 100€:</strong> 3.70€ + 2€/mois</li>
                  </ul>
                </div>
                
                <div className="expensive-account">
                  <h5>Custom Account</h5>
                  <ul>
                    <li><strong>Coût Transaction:</strong> 2.9% + 0.30€</li>
                    <li><strong>Frais Supplémentaires:</strong> 0.25% + 0.25€ par payout</li>
                    <li><strong>Maintenance:</strong> 2€/mois par compte actif</li>
                    <li><strong>Développement:</strong> Interface custom complexe</li>
                  </ul>
                </div>
              </div>
              
              <div className="cost-warning">
                <strong>Surcoût Express/Custom:</strong> 15.6% plus cher + maintenance mensuelle
              </div>
            </div>

            <h3>Options de Payout - Guide Complet Coûts et Délais</h3>
            
            <div className="payout-options">
              <div className="payout-option recommended">
                <div className="payout-header">
                  <h4>✅ Payout Quotidien (Recommandé)</h4>
                  <span className="payout-badge recommended-badge">Gratuit</span>
                </div>
                <div className="payout-details">
                  <div className="payout-detail">
                    <strong>Coût:</strong> 0€ (entièrement gratuit)
                  </div>
                  <div className="payout-detail">
                    <strong>Délai:</strong> 3 jours ouvrables
                  </div>
                  <div className="payout-detail">
                    <strong>Fréquence:</strong> Automatique tous les jours
                  </div>
                  <div className="payout-description">
                    <strong>Avantage:</strong> Flux de trésorerie régulier et prévisible sans aucun frais supplémentaire
                  </div>
                </div>
              </div>

              <div className="payout-option">
                <div className="payout-header">
                  <h4>Payout Hebdomadaire</h4>
                  <span className="payout-badge free-badge">Gratuit</span>
                </div>
                <div className="payout-details">
                  <div className="payout-detail">
                    <strong>Coût:</strong> 0€
                  </div>
                  <div className="payout-detail">
                    <strong>Délai:</strong> 3 jours + attente programmée
                  </div>
                  <div className="payout-detail">
                    <strong>Fréquence:</strong> Jours spécifiques (ex: Lundi et Jeudi)
                  </div>
                  <div className="payout-description">
                    Pour comptabilité structurée avec jours fixes
                  </div>
                </div>
              </div>

              <div className="payout-option">
                <div className="payout-header">
                  <h4>Payout Mensuel</h4>
                  <span className="payout-badge free-badge">Gratuit</span>
                </div>
                <div className="payout-details">
                  <div className="payout-detail">
                    <strong>Coût:</strong> 0€
                  </div>
                  <div className="payout-detail">
                    <strong>Délai:</strong> 3 jours + attente mensuelle
                  </div>
                  <div className="payout-detail">
                    <strong>Fréquence:</strong> Dates fixes (ex: 1er et 15 du mois)
                  </div>
                  <div className="payout-description">
                    Gestion cash-flow planifiée pour grandes entreprises
                  </div>
                </div>
              </div>

              <div className="payout-option">
                <div className="payout-header">
                  <h4>Payout Manuel</h4>
                  <span className="payout-badge free-badge">Gratuit</span>
                </div>
                <div className="payout-details">
                  <div className="payout-detail">
                    <strong>Coût:</strong> 0€
                  </div>
                  <div className="payout-detail">
                    <strong>Délai:</strong> 3 jours une fois déclenché
                  </div>
                  <div className="payout-detail">
                    <strong>Fréquence:</strong> Contrôle total timing et montant
                  </div>
                  <div className="payout-description">
                    Contrôle maximum - Vous décidez quand et combien
                  </div>
                </div>
              </div>

              <div className="payout-option expensive">
                <div className="payout-header">
                  <h4>⚡ Payout Instantané</h4>
                  <span className="payout-badge expensive-badge">1-1.5%</span>
                </div>
                <div className="payout-details">
                  <div className="payout-detail">
                    <strong>Coût:</strong> 1% (EU) / 1.5% (US) du montant
                  </div>
                  <div className="payout-detail">
                    <strong>Délai:</strong> 30 minutes maximum
                  </div>
                  <div className="payout-detail">
                    <strong>Fréquence:</strong> 24h/24, 7j/7
                  </div>
                  <div className="payout-description">
                    <strong>Limite:</strong> Maximum 10 payouts instantanés par jour
                  </div>
                </div>
              </div>
            </div>

            <h3>Calcul ROI - Économies Annuelles OnlyOneAPI</h3>
            <div className="roi-calculator">
              <h4>Comparaison Impact Financier Payout Quotidien vs Instantané</h4>
              
              <div className="roi-examples">
                <div className="roi-example">
                  <h5>Exemple Startup: 10,000€/mois revenus</h5>
                  <div className="code-block">
                    <pre>{`├── Payout Quotidien (3 jours) : 0€ frais/mois
├── Payout Instantané (30 min) : 100-150€/mois
└── 💰 ÉCONOMIES ANNUELLES : 1,200-1,800€/an`}</pre>
                  </div>
                </div>

                <div className="roi-example">
                  <h5>Exemple Scale-up: 50,000€/mois revenus</h5>
                  <div className="code-block">
                    <pre>{`├── Payout Quotidien (3 jours) : 0€ frais/mois  
├── Payout Instantané (30 min) : 500-750€/mois
└── 💰 ÉCONOMIES ANNUELLES : 6,000-9,000€/an`}</pre>
                  </div>
                </div>

                <div className="roi-example">
                  <h5>Exemple Enterprise: 200,000€/mois revenus</h5>
                  <div className="code-block">
                    <pre>{`├── Payout Quotidien (3 jours) : 0€ frais/mois
├── Payout Instantané (30 min) : 2,000-3,000€/mois  
└── 💰 ÉCONOMIES ANNUELLES : 24,000-36,000€/an`}</pre>
                  </div>
                </div>
              </div>

              <div className="roi-recommendation">
                <h5>💡 Recommandation OnlyOneAPI</h5>
                <p>Le payout quotidien offre le meilleur équilibre flux-trésorerie/coût. Les 3 jours d'attente permettent d'économiser des milliers d'euros annuellement tout en maintenant un cash-flow régulier et prévisible.</p>
              </div>
            </div>

            <h3>Plan d'Implémentation Étape par Étape</h3>
            
            <div className="implementation-phases">
              <div className="phase-section">
                <h4>Phase 1 : Configuration Stripe (Vous - 1h total)</h4>
                <div className="phase-steps">
                  <div className="implementation-step">
                    <span className="step-number">1</span>
                    <div className="step-content">
                      <h5>Créer Compte Stripe Connect</h5>
                      <p>Configuration du compte platform principal</p>
                      <span className="step-duration">30 min</span>
                    </div>
                  </div>
                  
                  <div className="implementation-step">
                    <span className="step-number">2</span>
                    <div className="step-content">
                      <h5>Setup Standard Account OnlyOneAPI</h5>
                      <p>Configuration du compte Standard (recommandé)</p>
                      <span className="step-duration">15 min</span>
                    </div>
                  </div>
                  
                  <div className="implementation-step">
                    <span className="step-number">3</span>
                    <div className="step-content">
                      <h5>Générer Clés API Sécurisées</h5>
                      <p>Clés de test et production avec 2FA activé</p>
                      <span className="step-duration">15 min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="phase-section">
                <h4>Phase 2 : Intégration Technique (Claude Code - 4 jours)</h4>
                <div className="phase-steps">
                  <div className="implementation-step">
                    <span className="step-number">4</span>
                    <div className="step-content">
                      <h5>Développer Webhooks Portal</h5>
                      <p>Gestion événements Stripe automatique</p>
                      <span className="step-duration">1 jour</span>
                    </div>
                  </div>
                  
                  <div className="implementation-step">
                    <span className="step-number">5</span>
                    <div className="step-content">
                      <h5>Créer API Routes Billing</h5>
                      <p>Endpoints paiement et gestion abonnements</p>
                      <span className="step-duration">1 jour</span>
                    </div>
                  </div>
                  
                  <div className="implementation-step">
                    <span className="step-number">6</span>
                    <div className="step-content">
                      <h5>Interface Self-Service</h5>
                      <p>Dashboard utilisateur billing complet</p>
                      <span className="step-duration">1 jour</span>
                    </div>
                  </div>
                  
                  <div className="implementation-step">
                    <span className="step-number">7</span>
                    <div className="step-content">
                      <h5>Tests & Validation & Déploiement</h5>
                      <p>Suite de tests automatisés + mise en production</p>
                      <span className="step-duration">1 jour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h3>Configuration Technique Détaillée</h3>
            <div className="technical-config">
              <div className="api-section">
                <h4>Variables d'Environnement Requises</h4>
                <div className="code-block">
                  <pre>{`# Production Stripe Keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_ACCOUNT_ID=acct_...

# Development Stripe Keys (Test)
STRIPE_TEST_PUBLISHABLE_KEY=pk_test_...
STRIPE_TEST_SECRET_KEY=sk_test_...`}</pre>
                </div>
              </div>

              <div className="api-section">
                <h4>Plans de Pricing Stripe OnlyOneAPI</h4>
                <div className="pricing-plans">
                  <div className="plan-item">
                    <strong>Free Plan:</strong> 0€ - 1,000 requêtes/mois - <code>price_free_monthly</code>
                  </div>
                  <div className="plan-item">
                    <strong>Starter Plan:</strong> 29€ - 50,000 requêtes/mois - <code>price_starter_monthly</code>
                  </div>
                  <div className="plan-item">
                    <strong>Pro Plan:</strong> 79€ - 500,000 requêtes/mois - <code>price_pro_monthly</code>
                  </div>
                  <div className="plan-item">
                    <strong>Enterprise Plan:</strong> Sur mesure - Illimité - <code>price_enterprise_monthly</code>
                  </div>
                </div>
              </div>
            </div>

            <h3>Sécurité et Bonnes Pratiques</h3>
            <div className="security-section">
              <div className="security-info">
                <h4>Checklist Sécurité Obligatoire</h4>
                <div className="security-checklist">
                  <div className="security-item">
                    ✅ Clés API stockées dans variables d'environnement sécurisées
                  </div>
                  <div className="security-item">
                    ✅ Webhook signature validation obligatoire (éviter attaques)
                  </div>
                  <div className="security-item">
                    ✅ HTTPS uniquement pour tous endpoints billing
                  </div>
                  <div className="security-item">
                    ✅ Rate limiting sur APIs billing (protection DDoS)
                  </div>
                  <div className="security-item">
                    ✅ Audit logging complet de toutes transactions
                  </div>
                  <div className="security-item">
                    ✅ PCI compliance automatique via Stripe (pas de stockage cartes)
                  </div>
                </div>
              </div>

              <div className="security-warning">
                <h4>🔒 Alertes Sécurité Critiques</h4>
                <ul>
                  <li><strong>Jamais</strong> commiter les vraies clés APIs dans le code</li>
                  <li><strong>Jamais</strong> partager les clés par email, chat ou Slack</li>
                  <li><strong>Toujours</strong> tester en environnement sécurisé d'abord</li>
                  <li><strong>Immédiatement</strong> révoquer les clés si compromises</li>
                  <li><strong>Rotation</strong> des clés API tous les 6 mois minimum</li>
                </ul>
              </div>
            </div>

            <div className="final-objective">
              <h4>🎯 Objectif Final Transformation</h4>
              <p>Transformer OnlyOneAPI Portal en <strong>machine à revenus automatisée</strong>, capable de gérer des centaines de customers avec <strong>0% d'intervention manuelle</strong> sur le billing et les abonnements.</p>
              
              <div className="timeline-summary">
                <div className="timeline-item">
                  <strong>Setup Stripe:</strong> 1 heure (Vous)
                </div>
                <div className="timeline-item">
                  <strong>Développement:</strong> 4 jours (Claude Code)
                </div>
                <div className="timeline-item">
                  <strong>ROI:</strong> Économies 1,200-36,000€/an selon volume
                </div>
              </div>
            </div>

            <h3>Ressources et Documentation Externe</h3>
            <div className="resources-section">
              <div className="api-section">
                <h4>Documentation Officielle Stripe</h4>
                <div className="external-links">
                  <div className="link-item">
                    <strong>Stripe Connect Guide:</strong> https://stripe.com/docs/connect
                  </div>
                  <div className="link-item">
                    <strong>Webhook Best Practices:</strong> https://stripe.com/docs/webhooks/best-practices
                  </div>
                  <div className="link-item">
                    <strong>Testing Webhooks:</strong> https://stripe.com/docs/webhooks/test
                  </div>
                  <div className="link-item">
                    <strong>Connect Account Types:</strong> https://stripe.com/docs/connect/accounts
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h4>📚 Guide Technique Complet</h4>
                <p>Un guide détaillé de 182 lignes a été créé dans <code>/GUIDES/STRIPE-CONNECT-INTEGRATION-ONLYONEAPI.md</code> contenant :</p>
                <ul>
                  <li>Tous les détails techniques d'implémentation</li>
                  <li>Exemples de code prêts à l'emploi</li>
                  <li>Processus complet de configuration</li>
                  <li>Architecture recommandée pour multi-projets</li>
                  <li>Calculs détaillés de coûts et ROI</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'agents':
        return (
          <div>
            <h2>Squad d'Agents Claude - OnlyOneAPI SaaS</h2>
            <p>6 bots spécialisés pour automatiser la gestion complète de l'écosystème SaaS OnlyOneAPI avec coordination intelligente et workflows cross-projets.</p>

            <div className="info-card">
              <h4>Architecture Squad Claude</h4>
              <p>Système d'agents autonomes avec <strong>CoordinatorBot</strong> comme chef d'orchestration et 5 bots spécialisés par domaine d'expertise.</p>
              <ul>
                <li><strong>Coordination intelligente</strong> - Communication inter-bots avec résolution de conflits</li>
                <li><strong>Workflows automatisés</strong> - Déclenchement cross-plateformes (API changes → Doc updates → Community alerts)</li>
                <li><strong>KPIs mesurables</strong> - Métriques de performance par bot avec targets</li>
                <li><strong>Escalation automatique</strong> - Décisions >€500 remontées à supervision humaine</li>
              </ul>
            </div>

            <h3>Liste des Bots OnlyOneAPI Squad</h3>
            
            <div className="agent-card">
              <h4>🎯 CoordinatorBot - Chef d'Orchestration</h4>
              <p><strong>Domaine:</strong> Cross-project + Business intelligence + Strategic decisions</p>
              <p><strong>Mission:</strong> Synchronisation daily des 5 bots spécialisés, détection conflits ressources/priorités, escalation décisions critiques (budget >€500), reporting consolidé business metrics + KPIs techniques</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Daily standup 9h:</strong> Status sync 5 bots → dashboard global</li>
                    <li><strong>Conflict resolution:</strong> Dependencies analysis + priorités business</li>
                    <li><strong>Performance monitoring:</strong> SLA violations + escalation protocols</li>
                    <li><strong>Budget tracking:</strong> Coûts infrastructure + ROI analysis</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>Sync accuracy: <strong>95%+</strong> bots synchronized</li>
                    <li>Escalation precision: <strong>90%+</strong> justified escalations</li>
                    <li>Conflict resolution time: <strong>&lt;2h</strong> moyenne</li>
                    <li>Business impact accuracy: <strong>85%+</strong> predictions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-card">
              <h4>🔧 ApiBot - Gestionnaire API Infrastructure</h4>
              <p><strong>Domaine:</strong> /onlyoneapi/api + FastAPI + Kubernetes + DigitalOcean (423 endpoints)</p>
              <p><strong>Mission:</strong> Monitoring 423 endpoints (health checks + performance + errors), infrastructure management K8s (scaling + cost optimization), API documentation auto-generation, security audits (vulnerability scans + compliance)</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Health monitoring:</strong> API endpoints 24/7 + alerting</li>
                    <li><strong>Auto-scaling:</strong> K8s HPA based on traffic patterns</li>
                    <li><strong>Documentation sync:</strong> OpenAPI specs → developer portal</li>
                    <li><strong>Security scans:</strong> Daily vulnerability assessment + reports</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>API uptime: <strong>99.9%+</strong> SLA compliance</li>
                    <li>Response time P95: <strong>&lt;200ms</strong> target</li>
                    <li>Security score: <strong>95%+</strong> compliance rate</li>
                    <li>Documentation coverage: <strong>100%</strong> endpoints documented</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-card">
              <h4>📢 MarketingBot - Content & Campaign Manager</h4>
              <p><strong>Domaine:</strong> /onlyoneapi/marketing + Next.js site + content strategy</p>
              <p><strong>Mission:</strong> Content generation (blog posts + case studies + technical articles), campaign automation (email sequences + social media + LinkedIn), brand consistency cross-platforms, SEO optimization (content + technical SEO + performance)</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Content calendar:</strong> Weekly content planning + publication</li>
                    <li><strong>Social media:</strong> LinkedIn posts + Twitter threads automation</li>
                    <li><strong>Email marketing:</strong> Drip campaigns + segmentation + personalization</li>
                    <li><strong>SEO monitoring:</strong> Rankings + technical issues + optimization</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>Content engagement: Blog traffic + social shares + comments</li>
                    <li>Lead generation: MQL quantity + quality + conversion rates</li>
                    <li>Brand consistency: <strong>95%+</strong> messaging compliance</li>
                    <li>Campaign ROI: Revenue attribution + cost efficiency</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-card">
              <h4>👥 CommunityBot - Engagement & Support</h4>
              <p><strong>Domaine:</strong> /onlyoneapi/community + Discord + user support</p>
              <p><strong>Mission:</strong> Community moderation (Discord + forum + social channels), support automation (FAQ + ticket routing + knowledge base), user onboarding (welcome sequences + tutorial guidance), feedback collection (user insights + feature requests + satisfaction)</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Support triage:</strong> Ticket categorization + routing + escalation</li>
                    <li><strong>Community engagement:</strong> Welcome messages + activity prompts</li>
                    <li><strong>Feedback analysis:</strong> Sentiment analysis + feature prioritization</li>
                    <li><strong>Event management:</strong> Webinars + office hours scheduling</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>Community growth: Active members + engagement rates</li>
                    <li>Support efficiency: Response time + resolution rate + satisfaction</li>
                    <li>User retention: Churn rate + engagement continuity</li>
                    <li>Event participation: Attendance + engagement + follow-up actions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-card">
              <h4>📚 DeveloperBot - DevEx & Documentation</h4>
              <p><strong>Domaine:</strong> /onlyoneapi/developer + docs + SDKs + integration tools</p>
              <p><strong>Mission:</strong> Documentation maintenance (API docs + guides + examples), SDK development (client libraries + code samples + tools), developer onboarding (getting started + tutorials + best practices), integration support (troubleshooting + debugging + optimization)</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Doc generation:</strong> API changes → automated documentation updates</li>
                    <li><strong>SDK updates:</strong> API versioning → client library releases</li>
                    <li><strong>Example maintenance:</strong> Code samples testing + updates + validation</li>
                    <li><strong>Integration monitoring:</strong> Developer implementation success rates</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>Documentation quality: Accuracy + completeness + user ratings</li>
                    <li>SDK adoption: Download rates + implementation success + feedback</li>
                    <li>Developer onboarding: Time to first API call + success rate</li>
                    <li>Integration success: Error rates + support ticket volume</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="agent-card">
              <h4>💼 PortalBot - User Management & Experience</h4>
              <p><strong>Domaine:</strong> /onlyoneapi/portal + Next.js dashboard + user lifecycle</p>
              <p><strong>Mission:</strong> User account management (registration + profile + preferences), billing automation (invoicing + payment processing + renewals), usage monitoring (API consumption + limits + optimization alerts), customer success (health scoring + retention + upsell opportunities)</p>
              
              <div className="agent-details">
                <div className="agent-workflows">
                  <h5>Workflows Automatisés</h5>
                  <ul>
                    <li><strong>Account provisioning:</strong> Registration → API keys → onboarding flow</li>
                    <li><strong>Billing cycles:</strong> Usage calculation → invoice generation → payment processing</li>
                    <li><strong>Usage alerts:</strong> Limit monitoring → notifications → upgrade prompts</li>
                    <li><strong>Health scoring:</strong> User activity → churn prediction → intervention triggers</li>
                  </ul>
                </div>
                <div className="agent-kpis">
                  <h5>KPIs Cibles</h5>
                  <ul>
                    <li>User activation: Time to value + feature adoption rates</li>
                    <li>Billing accuracy: Payment success + dispute rates + revenue recognition</li>
                    <li>User satisfaction: Dashboard ratings + support tickets + retention</li>
                    <li>Revenue optimization: Upsell conversion + expansion revenue + LTV</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3>Coordination Inter-Bots</h3>
            <div className="management-info">
              <h4>Workflows Cross-Bots</h4>
              <div className="workflow-examples">
                <div className="workflow-example">
                  <h5>🔄 API Changes Impact Chain</h5>
                  <p><strong>ApiBot</strong> (change) → <strong>DeveloperBot</strong> (docs update) → <strong>PortalBot</strong> (UI impact) → <strong>CommunityBot</strong> (user communication) → <strong>MarketingBot</strong> (messaging update)</p>
                </div>
                
                <div className="workflow-example">
                  <h5>🚀 Feature Launch Coordination</h5>
                  <p><strong>CoordinatorBot</strong> (planning) → <strong>MarketingBot</strong> (campaign) → <strong>DeveloperBot</strong> (documentation) → <strong>CommunityBot</strong> (announcement) → <strong>PortalBot</strong> (UI/UX) → <strong>ApiBot</strong> (backend support)</p>
                </div>
                
                <div className="workflow-example">
                  <h5>🚨 Incident Response Chain</h5>
                  <p><strong>ApiBot</strong> (detection) → <strong>CoordinatorBot</strong> (impact analysis) → <strong>CommunityBot</strong> (user communication) → <strong>DeveloperBot</strong> (troubleshooting) → <strong>PortalBot</strong> (user experience) → <strong>MarketingBot</strong> (reputation management)</p>
                </div>
              </div>

              <h4>États des Bots</h4>
              <ul>
                <li><strong>Active</strong> - Bot opérationnel avec workflows actifs</li>
                <li><strong>Maintenance</strong> - Mise à jour en cours, workflows suspendus</li>
                <li><strong>Error</strong> - Problème détecté, escalation automatique</li>
                <li><strong>Paused</strong> - Bot suspendu manuellement</li>
              </ul>

              <h4>Actions de Coordination</h4>
              <ul>
                <li><strong>Execute Daily Standup</strong> - Synchronisation 9h00 de tous les bots</li>
                <li><strong>Sync All Bots Status</strong> - Mise à jour statuts temps réel</li>
                <li><strong>Generate Squad Report</strong> - Rapport performance consolidé</li>
                <li><strong>Emergency Escalation</strong> - Escalation supervision immédiate</li>
              </ul>
            </div>

            <div className="warning-card">
              <h4>⚠️ Modes de Fonctionnement</h4>
              <p><strong>Actuellement:</strong> Les bots sont configurés avec une interface fonctionnelle et des métriques de base, mais leurs workflows automatisés ne sont pas encore implémentés.</p>
              <p><strong>Prochaine étape:</strong> Validation agent par agent puis implémentation progressive des workflows réels selon les modalités définies avec supervision humaine.</p>
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div>
            <h2>Sessions Business</h2>
            <p>Le Challenge de 30 jours est organisé en 6 sessions parallèles, chacune avec des objectifs de revenus spécifiques.</p>

            <h3>Tableau de Bord Global</h3>
            <div className="sessions-overview">
              <div className="session-summary">
                <h4>Objectifs Globaux</h4>
                <ul>
                  <li><strong>Durée:</strong> 30 jours</li>
                  <li><strong>Objectif total:</strong> €50,000+</li>
                  <li><strong>Sessions simultanées:</strong> 6</li>
                  <li><strong>Agents actifs:</strong> 6</li>
                </ul>
              </div>
            </div>

            <h3>Revenus par Session</h3>
            
            <div className="revenue-card">
              <h4>Session 1: API Audits - €800/audit</h4>
              <p><strong>Modèle:</strong> Paiement unique</p>
              <p><strong>Objectif:</strong> 5-10 audits/mois = €4,000-8,000</p>
            </div>

            <div className="revenue-card">
              <h4>Session 2: Emergency Consulting - €300/h</h4>
              <p><strong>Modèle:</strong> Facturation horaire</p>
              <p><strong>Objectif:</strong> 20h/mois = €6,000</p>
            </div>

            <div className="revenue-card">
              <h4>Session 3: Founding Members - €497/mois</h4>
              <p><strong>Modèle:</strong> Abonnement récurrent</p>
              <p><strong>Objectif:</strong> 50 membres = €24,850/mois</p>
            </div>

            <div className="revenue-card">
              <h4>Session 4: Technical Writing - €300/deliverable</h4>
              <p><strong>Modèle:</strong> Paiement par livrable</p>
              <p><strong>Objectif:</strong> 10 livrables/mois = €3,000</p>
            </div>

            <div className="revenue-card">
              <h4>Session 5: Done-for-You - €1500+</h4>
              <p><strong>Modèle:</strong> Projets sur mesure</p>
              <p><strong>Objectif:</strong> 3-5 projets/mois = €4,500-7,500</p>
            </div>

            <div className="revenue-card">
              <h4>Session 6: Giveaway Campaign - Lead Gen</h4>
              <p><strong>Modèle:</strong> Acquisition</p>
              <p><strong>Objectif:</strong> Support des autres sessions</p>
            </div>

            <h3>Métriques de Performance</h3>
            <div className="metrics-info">
              <ul>
                <li><strong>Taux de completion journalier</strong> - % objectif atteint</li>
                <li><strong>Revenus actuels vs cible</strong> - Suivi en temps réel</li>
                <li><strong>Files créés</strong> - Production de contenu</li>
                <li><strong>Taux de conversion</strong> - Leads → Clients</li>
              </ul>
            </div>
          </div>
        );

      case 'validation':
        return (
          <div>
            <h2>File de Validation</h2>
            <p>Système de validation humaine pour tous les contenus générés par les agents avant publication.</p>

            <h3>Processus de Validation</h3>
            <ol>
              <li><strong>Génération</strong> - Agent produit du contenu</li>
              <li><strong>Queue</strong> - Contenu ajouté à la file d'attente</li>
              <li><strong>Review</strong> - Validation humaine requise</li>
              <li><strong>Action</strong> - Approuver/Rejeter/Modifier</li>
              <li><strong>Publication</strong> - Déploiement automatique si approuvé</li>
            </ol>

            <h3>Types de Contenu</h3>
            <div className="content-types">
              <div className="content-type-card">
                <h4>📄 Rapports d'Audit</h4>
                <p>Générés par AuditBot - Validation critique requise</p>
                <p><strong>Délai:</strong> 2h maximum</p>
              </div>

              <div className="content-type-card">
                <h4>Solutions d'Urgence</h4>
                <p>CrisisBot - Validation express</p>
                <p><strong>Délai:</strong> 30 minutes</p>
              </div>

              <div className="content-type-card">
                <h4>Contenu Premium</h4>
                <p>ContentBot - Tutorials et documentation</p>
                <p><strong>Délai:</strong> 24h</p>
              </div>

              <div className="content-type-card">
                <h4>Documentation Technique</h4>
                <p>TechWriterBot - Articles et guides</p>
                <p><strong>Délai:</strong> 48h</p>
              </div>
            </div>

            <h3>Actions de Validation</h3>
            <div className="validation-actions">
              <ul>
                <li><strong>Approuver</strong> - Publication automatique</li>
                <li><strong>Modifier</strong> - Édition avant approbation</li>
                <li><strong>Rejeter</strong> - Retour à l'agent avec feedback</li>
                <li><strong>⏰ Reporter</strong> - Validation différée</li>
              </ul>
            </div>

            <div className="priority-info">
              <h4>Priorités de Validation</h4>
              <ul>
                <li><strong>URGENT</strong> - CrisisBot (30 min)</li>
                <li><strong>HIGH</strong> - AuditBot (2h)</li>
                <li><strong>MEDIUM</strong> - ContentBot (24h)</li>
                <li><strong>LOW</strong> - TechWriterBot (48h)</li>
              </ul>
            </div>
          </div>
        );

      case 'system':
        return (
          <div>
            <h2>Monitoring Système</h2>
            <p>Supervision complète des services, scripts et processus du dashboard.</p>

            <h3>Santé du Système</h3>
            <div className="system-health">
              <h4>Métriques Système</h4>
              <ul>
                <li><strong>CPU Usage</strong> - Utilisation processeur</li>
                <li><strong>Memory Usage</strong> - Consommation mémoire</li>
                <li><strong>System Uptime</strong> - Temps de fonctionnement</li>
                <li><strong>Services Running</strong> - Services actifs/total</li>
              </ul>
            </div>

            <h3>Services Principaux</h3>
            <div className="services-info">
              <div className="service-card">
                <h4>Dashboard Backend</h4>
                <p><strong>Port:</strong> 5011</p>
                <p><strong>Rôle:</strong> API et Socket.IO</p>
                <p><strong>Status:</strong> Toujours actif (auto-hébergé)</p>
              </div>

              <div className="service-card">
                <h4>🌐 Dashboard Frontend</h4>
                <p><strong>Port:</strong> 5010</p>
                <p><strong>Rôle:</strong> Interface React</p>
                <p><strong>Contrôles:</strong> Start/Stop/Restart</p>
              </div>
            </div>

            <h3>Scripts de Session</h3>
            <div className="scripts-info">
              <h4>Scripts Principaux</h4>
              <ul>
                <li><strong>START-ALL-SESSIONS.sh</strong> - Démarrage global</li>
                <li><strong>SYNC-ALL-PROGRESS.sh</strong> - Synchronisation</li>
                <li><strong>POPULATE-VALIDATION-QUEUE.sh</strong> - File de validation</li>
              </ul>

              <h4>Scripts par Session</h4>
              <ul>
                <li><strong>REPORT-PROGRESS.sh</strong> - Rapport de progression</li>
                <li><strong>ADD-TO-VALIDATION.sh</strong> - Ajout validation</li>
                <li><strong>start-agents.sh</strong> - Démarrage des agents</li>
              </ul>

              <h4>Types de Scripts</h4>
              <ul>
                <li><strong>Task (One-shot)</strong> - Exécution unique</li>
                <li><strong>Service</strong> - Fonctionnement continu</li>
              </ul>
            </div>

            <h3>Processus Actifs</h3>
            <div className="process-info">
              <p>Monitoring en temps réel des processus Node.js, npm, et bash.</p>
              <ul>
                <li><strong>PID</strong> - Identifiant du processus</li>
                <li><strong>CPU/Memory</strong> - Consommation ressources</li>
                <li><strong>Command</strong> - Commande exécutée</li>
                <li><strong>Kill</strong> - Arrêt forcé si nécessaire</li>
              </ul>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h2>Sécurité</h2>
            <p>Mesures de sécurité implémentées pour protéger les APIs, données et processus.</p>

            <h3>Chiffrement des APIs</h3>
            <div className="encryption-info">
              <h4>Algorithme: AES-256-CBC</h4>
              <ul>
                <li><strong>Clé de chiffrement:</strong> Variable d'environnement ENCRYPTION_KEY</li>
                <li><strong>IV aléatoire</strong> pour chaque chiffrement</li>
                <li><strong>Stockage sécurisé</strong> en base de données</li>
              </ul>

              <h4>Masquage des Données</h4>
              <ul>
                <li><strong>Interface utilisateur:</strong> sk-12****5678</li>
                <li><strong>Logs système:</strong> Valeurs masquées automatiquement</li>
                <li><strong>APIs critiques:</strong> Jamais affichées en clair</li>
              </ul>
            </div>

            <h3>Sécurité Stripe</h3>
            <div className="stripe-security">
              <h4>Clés Restreintes par Activité</h4>
              <ul>
                <li><strong>stripe_audits_key</strong> - Accès limité aux audits uniquement</li>
                <li><strong>stripe_consulting_key</strong> - Consulting d'urgence seulement</li>
                <li><strong>stripe_founding_key</strong> - Abonnements membres fondateurs</li>
                <li><strong>stripe_content_key</strong> - Paiements contenu technique</li>
                <li><strong>stripe_done_for_you_key</strong> - Projets sur mesure</li>
              </ul>

              <h4>Avantages des Clés Restreintes</h4>
              <ul>
                <li><strong>Principe de moindre privilège</strong></li>
                <li><strong>Isolation des activités</strong></li>
                <li><strong>Traçabilité financière</strong></li>
                <li><strong>Limitation des risques</strong></li>
              </ul>
            </div>

            <h3>Bonnes Pratiques</h3>
            <div className="security-practices">
              <h4>Configuration</h4>
              <ul>
                <li>Utilisez des variables d'environnement pour les secrets</li>
                <li>Configurez ENCRYPTION_KEY unique en production</li>
                <li>Vérifiez le masquage dans les interfaces</li>
                <li>Surveillez les logs pour les fuites de données</li>
              </ul>

              <h4>Surveillance</h4>
              <ul>
                <li>👀 Monitoring des accès aux APIs</li>
                <li>Alertes sur les échecs d'authentification</li>
                <li>Rotation périodique des clés</li>
                <li>Détection d'activités suspectes</li>
              </ul>
            </div>

            <div className="security-warning">
              <h4>Alertes Sécurité</h4>
              <ul>
                <li><strong>Ne jamais</strong> commiter les vraies clés APIs</li>
                <li><strong>Ne jamais</strong> partager les clés par email/chat</li>
                <li><strong>Toujours</strong> tester en environnement sécurisé</li>
                <li><strong>Immédiatement</strong> révoquer les clés compromises</li>
              </ul>
            </div>
          </div>
        );

      case 'troubleshooting':
        return (
          <div>
            <h2>Guide de Dépannage</h2>
            <p>Solutions aux problèmes courants du dashboard et des sessions.</p>

            <h3>Problèmes Courants</h3>
            
            <div className="troubleshoot-section">
              <h4>"Can't find variable: criticalAPIs"</h4>
              <div className="solution">
                <p><strong>Cause:</strong> Cache de développement React corrompu</p>
                <p><strong>Solution:</strong></p>
                <ol>
                  <li>Arrêter le serveur frontend (Ctrl+C)</li>
                  <li><code>rm -rf node_modules/.cache</code></li>
                  <li><code>npm start</code></li>
                </ol>
              </div>
            </div>

            <div className="troubleshoot-section">
              <h4>🔌 "ECONNREFUSED" - Backend inaccessible</h4>
              <div className="solution">
                <p><strong>Cause:</strong> Backend sur port 5011 arrêté</p>
                <p><strong>Solution:</strong></p>
                <ol>
                  <li>Vérifier: <code>lsof -i :5011</code></li>
                  <li>Redémarrer: <code>cd backend && npm start</code></li>
                  <li>Vérifier les logs d'erreur</li>
                </ol>
              </div>
            </div>

            <div className="troubleshoot-section">
              <h4>Agent "Error" ou "Stopped"</h4>
              <div className="solution">
                <p><strong>Causes possibles:</strong></p>
                <ul>
                  <li>APIs manquantes ou incorrectes</li>
                  <li>Permissions insuffisantes</li>
                  <li>Erreur de configuration</li>
                </ul>
                <p><strong>Solutions:</strong></p>
                <ol>
                  <li>Vérifier configuration APIs</li>
                  <li>Tester chaque API key</li>
                  <li>Consulter les logs d'agent</li>
                  <li>Redémarrer l'agent</li>
                </ol>
              </div>
            </div>

            <div className="troubleshoot-section">
              <h4>Test Stripe échoué</h4>
              <div className="solution">
                <p><strong>Vérifications:</strong></p>
                <ul>
                  <li>Clé au bon format (sk_live_... ou rk_live_...)</li>
                  <li>Clé active dans le dashboard Stripe</li>
                  <li>Permissions correctes pour l'activité</li>
                </ul>
              </div>
            </div>

            <h3>Diagnostic Système</h3>
            <div className="diagnostic-info">
              <h4>Commandes Utiles</h4>
              <ul>
                <li><code>lsof -i :5010</code> - Vérifier port frontend</li>
                <li><code>lsof -i :5011</code> - Vérifier port backend</li>
                <li><code>ps aux | grep node</code> - Processus Node.js</li>
                <li><code>npm run dev</code> - Mode développement</li>
              </ul>

              <h4>Logs à Consulter</h4>
              <ul>
                <li><strong>Browser Console</strong> - Erreurs React</li>
                <li><strong>Backend Terminal</strong> - Erreurs serveur</li>
                <li><strong>Activity Log (DB)</strong> - Historique des actions</li>
                <li><strong>Script Logs</strong> - Via bouton "View Logs"</li>
              </ul>
            </div>

            <h3>Redémarrages Complets</h3>
            <div className="restart-guide">
              <h4>Séquence de Redémarrage</h4>
              <ol>
                <li><strong>Arrêter tout:</strong>
                  <ul>
                    <li>Ctrl+C sur frontend</li>
                    <li>Ctrl+C sur backend</li>
                    <li>Arrêter scripts via System Monitor</li>
                  </ul>
                </li>
                <li><strong>Nettoyer:</strong>
                  <ul>
                    <li><code>rm -rf frontend/node_modules/.cache</code></li>
                    <li>Vérifier ports libres</li>
                  </ul>
                </li>
                <li><strong>Redémarrer:</strong>
                  <ul>
                    <li><code>cd backend && npm start</code></li>
                    <li><code>cd frontend && npm start</code></li>
                    <li>Relancer scripts nécessaires</li>
                  </ul>
                </li>
              </ol>
            </div>

            <div className="emergency-contact">
              <h4>En Cas d'Urgence</h4>
              <p>Si les problèmes persistent:</p>
              <ul>
                <li>Copier tous les messages d'erreur</li>
                <li>📸 Screenshots des interfaces d'erreur</li>
                <li>Noter les étapes qui ont mené au problème</li>
                <li>Sauvegarder la base de données avant modifications</li>
              </ul>
            </div>
          </div>
        );

      case 'medias':
        return (
          <div>
            <h2>Guide Publication par Média</h2>
            <p>Standards et métriques réalistes pour chaque plateforme de publication OnlyOneAPI.</p>

            <div className="media-guide-card">
              <h3>📱 LinkedIn B2B</h3>
              <div className="media-details">
                <div className="media-benchmarks">
                  <h4>Métriques Benchmarks Réalistes</h4>
                  <ul>
                    <li><strong>Engagement Rate</strong>: 1-4% (posts performants max 4%)</li>
                    <li><strong>Reach Organique</strong>: 5-15K impressions (posts normaux)</li>
                    <li><strong>Comments</strong>: 20-80 par post (excellent contenu)</li>
                    <li><strong>Connections</strong>: 30-100 nouvelles par post viral</li>
                    <li><strong>Click-through Rate</strong>: 0.5-2% vers liens externes</li>
                  </ul>
                </div>
                <div className="media-process">
                  <h4>Workflow Obligatoire</h4>
                  <ol>
                    <li>Analyse STEEP+HORMOZI du contenu</li>
                    <li>Contrôle qualité avec benchmarks réalistes</li>
                    <li>Génération image Leonardo.ai (16:9, style B2B)</li>
                    <li>Validation finale avant publication</li>
                    <li>Monitoring engagement 15 min post-publication</li>
                  </ol>
                </div>
                <div className="media-templates">
                  <h4>Templates Images</h4>
                  <p>Prompts standardisés dans: <code>/TOOLS/nextstep/modules/marketing-intelligence/templates/linkedin-image-prompts.md</code></p>
                </div>
              </div>
            </div>

            <div className="media-guide-card">
              <h3>💬 Reddit</h3>
              <div className="media-details">
                <div className="media-benchmarks">
                  <h4>Métriques Benchmarks Réalistes</h4>
                  <ul>
                    <li><strong>Upvotes</strong>: 50-200 (posts normaux dans niches tech)</li>
                    <li><strong>Comments</strong>: 10-50 par post engageant</li>
                    <li><strong>Upvote Rate</strong>: 70-85% (contenu value-first)</li>
                    <li><strong>Cross-post Success</strong>: 20-30% des subreddits ciblés</li>
                  </ul>
                </div>
                <div className="media-rules">
                  <h4>Règles Critiques</h4>
                  <ul>
                    <li><strong>Value-first</strong>: Toujours apporter valeur avant promote</li>
                    <li><strong>Style authentique</strong>: Pas de corporate speak</li>
                    <li><strong>Community rules</strong>: Respecter règles de chaque subreddit</li>
                    <li><strong>Self-promotion limits</strong>: Max 10% du contenu total</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="media-guide-card">
              <h3>🐦 Twitter/X B2B</h3>
              <div className="media-details">
                <div className="media-benchmarks">
                  <h4>Métriques Benchmarks Réalistes</h4>
                  <ul>
                    <li><strong>Engagement Rate</strong>: 1-3% (tweets performants)</li>
                    <li><strong>Retweet Rate</strong>: 0.5-2% du reach total</li>
                    <li><strong>Thread Performance</strong>: 2-5x plus d'engagement</li>
                    <li><strong>Link Clicks</strong>: 1-3% des impressions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="media-guide-card">
              <h3>💬 Discord</h3>
              <div className="media-details">
                <div className="media-benchmarks">
                  <h4>Métriques Benchmarks Réalistes</h4>
                  <ul>
                    <li><strong>Réactions</strong>: 5-15 par message (communautés actives)</li>
                    <li><strong>Réponses</strong>: 2-8 dans discussions techniques</li>
                    <li><strong>Mentions</strong>: 1-3 par message helpful</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="warning-card">
              <h4>⚠️ Règle Critique</h4>
              <p><strong>Toujours rester dans les benchmarks réalistes de la plateforme, même avec optimisations.</strong></p>
              <p>Ne jamais promettre ou prévoir des performances fantaisistes (engagement 10%+, reach millions, etc.)</p>
            </div>
          </div>
        );

      default:
        return <div>Section non trouvée</div>;
    }
  };

  return (
    <div className="help-page">
      <div className="help-container">
        {/* Sidebar Navigation */}
        <div className="help-sidebar">
          <div className="help-header">
            <h1>Aide & Documentation</h1>
            <p>OnlyOneAPI Dashboard</p>
          </div>
          
          <nav className="help-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={`help-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                <span className={`nav-icon icon-${section.icon}`}></span>
                <span className="nav-title">{section.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="help-content">
          <div className="help-content-inner">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Modal d'analyse des prix */}
      {isPricingAnalysisOpen && (
        <div className="pricing-modal-overlay" onClick={() => setIsPricingAnalysisOpen(false)}>
          <div className="pricing-modal" onClick={e => e.stopPropagation()}>
            <div className="pricing-modal-header">
              <h2>💰 Analyse Tarifaire: Emergency Consulting</h2>
              <button 
                className="pricing-modal-close"
                onClick={() => setIsPricingAnalysisOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="pricing-modal-content">
              <div className="pricing-summary">
                <h3>Le tarif de €300/heure est premium mais justifié</h3>
                <p>Pour un service de consulting d'urgence avec réponse immédiate et intervention 24/7.</p>
              </div>
              
              <div className="pricing-comparison">
                <div className="pricing-section">
                  <h4>Benchmarking Tarifs Consulting</h4>
                  
                  <div className="pricing-category">
                    <h5>Consulting Standards (non-urgence)</h5>
                    <ul>
                      <li><strong>Junior:</strong> €150-300/heure (délais 3-5 jours)</li>
                      <li><strong>Senior:</strong> €500-1200/heure (délais 1-2 jours)</li>
                      <li><strong>Expert:</strong> €2000-5000/heure (délais négociables)</li>
                    </ul>
                  </div>
                  
                  <div className="pricing-category">
                    <h5>Consulting d'Urgence/Emergency</h5>
                    <ul>
                      <li><strong>Freelances seniors:</strong> €200-400/heure</li>
                      <li><strong>Cabinets spécialisés:</strong> €500-800/heure</li>
                      <li><strong>Big Tech consultants:</strong> €1000+/heure</li>
                    </ul>
                  </div>
                  
                  <div className="pricing-category">
                    <h5>Comparaison Marché US</h5>
                    <ul>
                      <li><strong>Emergency DevOps:</strong> $400-800/heure ($360-720/heure en €)</li>
                      <li><strong>Crisis Management:</strong> $500-1200/heure</li>
                      <li><strong>Security Incident:</strong> $600-1500/heure</li>
                    </ul>
                  </div>
                </div>
                
                <div className="pricing-advantage">
                  <h4>Notre Positionnement: €300/heure</h4>
                  
                  <div className="advantage-points">
                    <div className="advantage-point">
                      <span className="advantage-icon check"></span>
                      <div>
                        <strong>Premium justifié par l'urgence</strong>
                        <p>Intervention immédiate 24/7, pas d'attente</p>
                      </div>
                    </div>
                    
                    <div className="advantage-point">
                      <span className="advantage-icon lightning"></span>
                      <div>
                        <strong>Réactivité exceptionnelle</strong>
                        <p>Qualification 15min gratuite, intervention immédiate</p>
                      </div>
                    </div>
                    
                    <div className="advantage-point">
                      <span className="advantage-icon tool"></span>
                      <div>
                        <strong>Solutions complètes</strong>
                        <p>Hotfixes + rapport + recommandations préventives</p>
                      </div>
                    </div>
                    
                    <div className="advantage-point">
                      <span className="advantage-icon">🤖</span>
                      <div>
                        <strong>Support IA intégré</strong>
                        <p>CrisisBot + monitoring automatique des signaux</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="roi-justification">
                    <h5>ROI Justification</h5>
                    <ul>
                      <li><strong>Downtime costs:</strong> €10,000+/heure pour une API</li>
                      <li><strong>Incident de sécurité:</strong> €4.45M en moyenne</li>
                      <li><strong>Réputation:</strong> Dommages irréversibles si mal géré</li>
                      <li><strong>Time-to-resolution:</strong> Chaque minute compte en urgence</li>
                    </ul>
                    
                    <div className="roi-highlight">
                      €300/heure d'intervention prévient €100,000+ de pertes
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pricing-footer">
                <div className="pricing-conclusion">
                  <strong>Conclusion:</strong> €300/heure est compétitif pour l'urgence et attractif pour la valeur délivrée.
                  Notre avantage: service complet (technique + business) avec réactivité 24/7 vs délais de 3-5 jours ailleurs.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .help-page {
          min-height: 100vh;
          background: var(--background);
        }

        .help-container {
          display: flex;
          min-height: 100vh;
        }

        .help-sidebar {
          width: 300px;
          background: var(--surface);
          border-right: 1px solid var(--border);
          padding: 2rem 0;
          overflow-y: auto;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        .help-header {
          padding: 0 2rem;
          margin-bottom: 2rem;
        }

        .help-header h1 {
          margin: 0 0 0.5rem 0;
          color: var(--text);
          font-size: 1.5rem;
        }

        .help-header p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .help-nav {
          display: flex;
          flex-direction: column;
        }

        .help-nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 2rem;
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          border-left: 3px solid transparent;
        }

        .help-nav-item:hover {
          background: var(--surface-hover);
          color: var(--text);
        }

        .help-nav-item.active {
          background: var(--surface-hover);
          color: var(--primary);
          border-left-color: var(--primary);
        }

        .nav-icon {
          margin-right: 0.75rem;
          font-size: 1.1rem;
          width: 16px;
          height: 16px;
          display: inline-block;
        }

        /* CSS Icons */
        .icon-home::before { content: ''; }
        .icon-briefcase::before { content: '💼'; }
        .icon-settings::before { content: ''; }
        .icon-credit-card::before { content: '💳'; }
        .icon-bot::before { content: '🤖'; }
        .icon-activity::before { content: ''; }
        .icon-check-circle::before { content: ''; }
        .icon-monitor::before { content: ''; }
        .icon-shield::before { content: ''; }
        .icon-tool::before { content: ''; }

        .nav-title {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .help-content {
          flex: 1;
          overflow-y: auto;
        }

        .help-content-inner {
          max-width: 800px;
          padding: 3rem;
          line-height: 1.6;
        }

        .help-content h2 {
          color: var(--text);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border);
        }

        .help-content h3 {
          color: var(--text);
          margin: 2rem 0 1rem 0;
        }

        .help-content h4 {
          color: var(--text);
          margin: 1.5rem 0 0.5rem 0;
        }

        .help-content p {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .help-content ul, .help-content ol {
          color: var(--text-muted);
          padding-left: 1.5rem;
        }

        .help-content li {
          margin-bottom: 0.25rem;
        }

        .help-content strong {
          color: var(--text);
        }

        .help-content code {
          background: var(--surface-hover);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .code-block {
          background: #1a1a1a;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }

        .code-block pre {
          margin: 0;
          color: #e2e8f0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Info Cards */
        .info-card, .warning-card, .api-section, .security-info, 
        .agent-card, .revenue-card, .content-type-card, .service-card,
        .troubleshoot-section, .business-line-card {
          background: var(--surface);
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          margin: 1rem 0;
        }

        .business-line-card {
          border-left: 4px solid #2563eb;
        }

        .business-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .business-model, .business-process, .business-tools {
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 0.375rem;
        }

        .synergy-info {
          background: #f0f9ff;
          border: 1px solid #e0f2fe;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-top: 1rem;
        }

        @media (max-width: 1024px) {
          .business-details {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        .warning-card {
          border-left: 4px solid #f59e0b;
          background: #fffbeb;
        }

        .agent-card {
          border-left: 4px solid var(--primary);
        }

        .revenue-card {
          border-left: 4px solid #10b981;
        }

        .troubleshoot-section .solution {
          background: var(--surface-hover);
          padding: 1rem;
          border-radius: 0.25rem;
          margin-top: 0.5rem;
        }

        .security-warning {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-left: 4px solid #ef4444;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        .emergency-contact {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          border-left: 4px solid #f97316;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .help-container {
            flex-direction: column;
          }
          
          .help-sidebar {
            width: 100%;
            height: auto;
            position: static;
          }
          
          .help-content-inner {
            padding: 2rem 1rem;
          }
        }

        /* Pricing Analysis Styles */
        .pricing-analysis-tag {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
        }
        
        .pricing-analysis-tag:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.4);
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
        }
        
        .pricing-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }
        
        .pricing-modal {
          background: var(--surface);
          border-radius: 1rem;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }
        
        .pricing-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem 2rem;
          border-bottom: 1px solid var(--border);
        }
        
        .pricing-modal-header h2 {
          margin: 0;
          color: var(--text);
          font-size: 1.75rem;
        }
        
        .pricing-modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .pricing-modal-close:hover {
          color: var(--text);
        }
        
        .pricing-modal-content {
          padding: 2rem;
        }
        
        .pricing-summary {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 1.5rem;
          border-radius: 0.75rem;
          border-left: 4px solid #0ea5e9;
          margin-bottom: 2rem;
        }
        
        .pricing-summary h3 {
          margin: 0 0 0.5rem 0;
          color: #0c4a6e;
        }
        
        .pricing-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .pricing-section {
          background: var(--surface-hover);
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 1px solid var(--border);
        }
        
        .pricing-category {
          margin-bottom: 1.5rem;
        }
        
        .pricing-category h5 {
          color: var(--text);
          margin: 0 0 0.75rem 0;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .pricing-category ul {
          margin: 0;
          padding-left: 1.5rem;
        }
        
        .pricing-category li {
          margin-bottom: 0.5rem;
          color: var(--text-muted);
        }
        
        .pricing-advantage {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          padding: 1.5rem;
          border-radius: 0.75rem;
          border-left: 4px solid #22c55e;
        }
        
        .advantage-points {
          margin: 1rem 0;
        }
        
        .advantage-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
          gap: 1rem;
        }
        
        .advantage-icon {
          font-size: 1.25rem;
          margin-top: 0.125rem;
        }
        
        .advantage-point strong {
          color: #15803d;
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .advantage-point p {
          margin: 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        
        .roi-justification {
          background: #fffbeb;
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid #fed7aa;
          margin-top: 1rem;
        }
        
        .roi-justification h5 {
          color: #92400e;
          margin: 0 0 0.75rem 0;
        }
        
        .roi-highlight {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          font-weight: bold;
          margin-top: 1rem;
        }
        
        .pricing-footer {
          border-top: 1px solid var(--border);
          padding-top: 1.5rem;
        }
        
        .pricing-conclusion {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1.5rem;
          border-radius: 0.75rem;
          border-left: 4px solid #6366f1;
          color: var(--text);
        }
        
        @media (max-width: 768px) {
          .pricing-comparison {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .pricing-modal {
            margin: 1rem;
            max-height: 95vh;
          }
          
          .pricing-modal-content {
            padding: 1rem;
          }
          
          .pricing-analysis-tag {
            position: static;
            display: inline-block;
            margin-bottom: 1rem;
          }
        }

        /* Stripe Integration Enhanced Styles */
        .stripe-account-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .account-feature {
          padding: 0.75rem;
          background: var(--surface-hover);
          border-radius: 0.375rem;
          border-left: 3px solid #22c55e;
        }
        
        .account-benefits h5 {
          color: #15803d;
          margin: 1rem 0 0.5rem 0;
        }
        
        .account-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin: 1rem 0;
        }
        
        .expensive-account {
          padding: 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          border-left: 4px solid #ef4444;
        }
        
        .expensive-account h5 {
          color: #dc2626;
          margin: 0 0 0.75rem 0;
        }
        
        .cost-warning {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #f97316;
          margin-top: 1rem;
          text-align: center;
          color: #ea580c;
        }
        
        .payout-options {
          display: grid;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        
        .payout-option {
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 1.5rem;
          background: var(--surface);
        }
        
        .payout-option.recommended {
          border-color: #3b82f6;
          background: #f0f9ff;
          border-width: 2px;
        }
        
        .payout-option.expensive {
          border-color: #ef4444;
          background: #fef2f2;
          border-width: 2px;
        }
        
        .payout-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .payout-header h4 {
          margin: 0;
          color: var(--text);
        }
        
        .payout-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .recommended-badge {
          background: #3b82f6;
          color: white;
        }
        
        .free-badge {
          background: #22c55e;
          color: white;
        }
        
        .expensive-badge {
          background: #ef4444;
          color: white;
        }
        
        .payout-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .payout-detail {
          padding: 0.75rem;
          background: var(--surface-hover);
          border-radius: 0.375rem;
          font-size: 0.9rem;
        }
        
        .payout-description {
          grid-column: 1 / -1;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 0.5rem;
          font-style: italic;
          color: var(--text-muted);
        }
        
        .roi-calculator {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #bae6fd;
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
        }
        
        .roi-examples {
          display: grid;
          gap: 1.5rem;
          margin: 1.5rem 0;
        }
        
        .roi-example {
          background: white;
          border: 1px solid #e0f2fe;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
        
        .roi-example h5 {
          color: #0c4a6e;
          margin: 0 0 1rem 0;
        }
        
        .roi-recommendation {
          background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
          border-left: 4px solid #10b981;
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin-top: 1.5rem;
        }
        
        .roi-recommendation h5 {
          color: #065f46;
          margin: 0 0 0.75rem 0;
        }
        
        .implementation-phases {
          margin: 2rem 0;
        }
        
        .phase-section {
          margin-bottom: 3rem;
          background: var(--surface);
          border-radius: 1rem;
          padding: 2rem;
          border: 1px solid var(--border);
        }
        
        .phase-section h4 {
          color: var(--text);
          margin: 0 0 2rem 0;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border);
        }
        
        .phase-steps {
          display: grid;
          gap: 1.5rem;
        }
        
        .implementation-step {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem;
          background: var(--surface-hover);
          border-radius: 0.75rem;
          border-left: 4px solid #6366f1;
        }
        
        .step-number {
          background: #6366f1;
          color: white;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .step-content {
          flex: 1;
        }
        
        .step-content h5 {
          color: var(--text);
          margin: 0 0 0.5rem 0;
        }
        
        .step-content p {
          color: var(--text-muted);
          margin: 0 0 1rem 0;
        }
        
        .step-duration {
          background: #f1f5f9;
          color: #475569;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .technical-config {
          margin: 2rem 0;
        }
        
        .pricing-plans {
          display: grid;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        
        .plan-item {
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 0.5rem;
          border-left: 3px solid #6366f1;
        }
        
        .security-section {
          margin: 2rem 0;
        }
        
        .security-checklist {
          display: grid;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        
        .security-item {
          padding: 0.75rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.5rem;
          color: #15803d;
        }
        
        .final-objective {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 1px solid #f59e0b;
          border-radius: 1rem;
          padding: 2rem;
          margin: 2rem 0;
        }
        
        .final-objective h4 {
          color: #92400e;
          margin: 0 0 1rem 0;
        }
        
        .timeline-summary {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .timeline-item {
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          border-left: 4px solid #f59e0b;
        }
        
        .resources-section {
          margin: 2rem 0;
        }
        
        .external-links {
          display: grid;
          gap: 0.75rem;
          margin: 1rem 0;
        }
        
        .link-item {
          padding: 1rem;
          background: var(--surface-hover);
          border-radius: 0.5rem;
          border-left: 3px solid #06b6d4;
        }
        
        @media (max-width: 768px) {
          .stripe-account-details,
          .account-comparison,
          .payout-details {
            grid-template-columns: 1fr;
          }
          
          .timeline-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HelpPage;