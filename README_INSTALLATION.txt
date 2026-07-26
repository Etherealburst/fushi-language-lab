FUSHI LANGUAGE LAB — INSTALLATION

Cette PWA doit être publiée sur une adresse HTTPS pour être installable sur iPhone.

Option simple :
1. Décompresser ce dossier.
2. Déposer son contenu sur GitHub Pages, Netlify, Cloudflare Pages ou un autre hébergeur statique HTTPS.
3. Ouvrir l’adresse dans Safari sur iPhone.
4. Toucher Partager → Sur l’écran d’accueil.

Pour tester localement sur ordinateur :
- Ouvrir un terminal dans ce dossier.
- Lancer : python -m http.server 8000
- Visiter : http://localhost:8000

Fichiers principaux :
- index.html : application et contenu des 3 volumes
- manifest.webmanifest : paramètres d’installation
- service-worker.js : fonctionnement hors ligne
- icons/ : icônes de l’application
