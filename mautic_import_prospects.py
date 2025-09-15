#!/usr/bin/env python3
import csv
import requests
import json

# Mautic OAuth2 Config
MAUTIC_URL = "http://localhost:8085"
CLIENT_ID = "1_3m0i55by836s00488ko08gg40040cwww40k8kwgkcg48gcco4c"
CLIENT_SECRET = "3z3dzoe14bgg0ookoc840gc4480w0400gkw040kg0880wk8kgk"

def get_auth_url():
    """Get OAuth2 authorization URL"""
    auth_url = f"{MAUTIC_URL}/oauth/v2/auth"
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": "https://authorityrent.com/callback"
    }
    
    url = f"{auth_url}?" + "&".join([f"{k}={v}" for k, v in params.items()])
    print(f"Visit this URL to authorize: {url}")
    return url

def import_prospects_csv(csv_file_path):
    """Import prospects from CSV file"""
    prospects = []
    
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            prospect = {
                "email": row["email"],
                "firstname": row["firstname"], 
                "lastname": row["lastname"],
                "company": row["company"],
                "title": row["title"],
                "tags": [row["deadline_urgency"], row["tier"]],
                "custom_fields": {
                    "probability": row["probability"],
                    "revenue_eur": row["revenue_eur"],
                    "pain_point": row["pain_point"],
                    "linkedin_url": row["linkedin_url"],
                    "language": row["language"]
                }
            }
            prospects.append(prospect)
    
    return prospects

def main():
    csv_file = "/Users/ludovicpilet/PROJECTS/NEXIA/FASTCASH-MAUTIC-IMPORT.csv"
    
    print("FASTCASH Prospects Import Tool")
    print("=" * 40)
    
    # Load prospects
    prospects = import_prospects_csv(csv_file)
    print(f"Loaded {len(prospects)} prospects from CSV")
    
    # Show sample
    if prospects:
        print(f"\nSample prospect: {prospects[0]['company']} - {prospects[0]['email']}")
        print(f"Deadline: {prospects[0]['tags'][0]}")
        print(f"Revenue: {prospects[0]['custom_fields']['revenue_eur']}€")
    
    print("\nFor OAuth2 authorization, visit Mautic and get authorization code")
    print("Then use Mautic's built-in CSV import: Contacts > Import")
    
    return prospects

if __name__ == "__main__":
    prospects = main()