# Structure du bot discord
```sh
bot-discord/
├── exports/
│   └── opinions_stream.ndjson
├── .env
├── bot.py
└── requirements.txt
```

## Architecture

- Script principal (bot.py) : Point d’entrée du bot, initialise le client Discord, charge les variables d’environnement et définit les événements/commandes utilisés pour interagir avec les  utilisateurs.  

- Configuration secrète (.env) : Contient les informations sensibles (token du bot, identifiants de serveur, etc.) chargées au démarrage afin de séparer le code des secrets.

- Données exportées (exports/) : Dossier dédié au stockage des données produites par le bot, par exemple un historique d’opinions en flux NDJSON (opinions_stream.ndjson) pour un traitement ou une analyse ultérieure.  

- Dépendances (requirements.txt) : Fichier listant les bibliothèques Python nécessaires au fonctionnement du bot, permettant une installation reproductible de l’environnement.

## Installation des dépendences

Ouvrez la commande de ligne ( Moi je suis sur linux, en fonction de votre système suivez les instructions de votre système)
Il faut être dans le dossier bot-discord.

# Créer environnement virtuel
python -m venv bot-env

## Activer

# Linux/Mac:
source venv/bin/activate   

# Windows:
venv\Scripts\activate

## Installation
pip install discord.py python-dotenv aiohttp ( Pour les 3 systèmes )

## Lancement

# Linux/Mac:
python3 bot.py

# Windows
python bot.py ou  python3 bot.py

# Message de confirmation 

Si tout a bien marcher vous verrez un truc comme ça   
2025-12-26 11:37:32 INFO     discord.client logging in using static token  
2025-12-26 11:37:33 INFO     discord.gateway Shard ID None has connected to Gateway (Session ID: ff9b87e9f5c479e799d76c6694cf2026).  
Logged in as Avis#4477 (ID: 1452965471992287353)
