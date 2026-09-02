# Dynasty — V1 Expo native

Cette base remplace entièrement l’ancien prototype web. C’est une application React Native construite avec Expo pour iOS et Android.

## Boucle jouable présente

- création du fondateur : prénom, nom de famille, femme ou homme ;
- départ en 1850 ;
- quatre onglets natifs : Vie, Famille, Patrimoine, Héritage ;
- événements contextuels et deux choix tactiles ;
- résultat persistant jusqu’au bouton suivant ;
- couple, naissance et choix du prénom de l’enfant ;
- sauvegarde automatique locale ;
- vieillissement par âge, mort, sélection d’un héritier ;
- générations suivantes ;
- extinction et bilan final ;
- score et meilleur score local ;
- 23 événements de départ.

## Vérifications effectuées

    npm install
    npm run typecheck
    npx expo export --platform ios

Le contrôle TypeScript et la création du bundle iOS passent sans erreur.

## Tester dans Expo Go

La marche a suivre complete, depuis l'iPhone et sans ordinateur, est dans
`TESTER.md` : un lien permanent ouvre le jeu dans Expo Go, et deposer un `.zip`
sur GitHub suffit a publier une nouvelle version.

## Organisation

- App.tsx : écrans et composants natifs ;
- src/engine.ts : moteur de partie ;
- src/events.ts : contenu des événements ;
- src/storage.ts : sauvegarde locale ;
- src/types.ts : modèle de données ;
- app.json : configuration Expo iOS/Android ;
- eas.json : profils de builds cloud.
