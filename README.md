# Fushi Language Lab

Fushi Language Lab est une PWA statique pour pratiquer la traduction de phrases françaises vers le japonais. Elle contient trois volumes de questions, des filtres par catégorie et difficulté, une révélation de réponse, un suivi local de la progression et un mode hors ligne.

L’application reste volontairement simple : HTML, CSS, JavaScript et fichiers statiques locaux, sans framework ni dépendance externe.

## Lancer l’application localement

Depuis ce dossier, lancer un serveur HTTP :

```powershell
python -m http.server 8000
```

Puis ouvrir [http://localhost:8000/](http://localhost:8000/) dans un navigateur. Le serveur HTTP est nécessaire pour tester le service worker ; ouvrir `index.html` directement avec `file://` ne constitue pas un test PWA suffisant.

## Publier sur GitHub Pages

Le dépôt doit publier la branche `main` depuis sa racine (`/(root)`). Si aucun dépôt Git local n’existe encore :

```powershell
git init -b main
git add .
git commit -m "Prepare Fushi Language Lab PWA for GitHub Pages"
gh repo create fushi-language-lab --public --source=. --remote=origin --push
```

Dans GitHub, ouvrir ensuite `Settings` → `Pages`, choisir `Deploy from a branch`, sélectionner `main` et `/(root)`, puis cliquer sur `Save`. L’URL prendra normalement la forme :

`https://UTILISATEUR.github.io/fushi-language-lab/`

Une PWA doit être servie en HTTPS pour être installable normalement sur iPhone. `localhost` est une exception de développement.

## Installer sur iPhone

1. Ouvrir l’URL GitHub Pages en HTTPS dans Safari.
2. Toucher `Partager`.
3. Choisir `Sur l’écran d’accueil`.
4. Confirmer l’ajout. Si iOS le propose, activer l’ouverture comme app web.

## Mettre l’application à jour

Après une modification locale :

```powershell
git add .
git commit -m "Update Fushi Language Lab"
git push origin main
```

Pour forcer la récupération du nouvel app shell hors ligne, incrémenter `CACHE_NAME` dans `service-worker.js` (par exemple `v2` → `v3`) avant le commit. GitHub Pages peut prendre quelques instants à republier le dernier commit.

## Modifier les questions et les volumes

Les trois volumes et toutes leurs cartes se trouvent dans `index.html`, dans l’objet JavaScript `datasets` :

- `Volume 1` contient les bases et les premières particules ;
- `Volume 2` contient les adjectifs, l’existence, les positions, les compteurs et le passé ;
- `Volume 3` contient les formes négatives et passées, les démonstratifs, les lieux, les connecteurs et les raisons.

Chaque carte contient un `id`, la consigne française (`fr`), la réponse japonaise (`ja`), le `romaji`, un point grammatical (`point`), une `category` et un `level`. Conserver des `id` uniques pour préserver correctement la progression locale.

Les réglages d’installation se trouvent dans `manifest.webmanifest`, les fichiers précachés dans `service-worker.js` et les icônes dans `icons/`.
