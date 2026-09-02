# Tester Dynasty sur iPhone, sans ordinateur

Tout se fait depuis l'iPhone : GitHub dans Safari pour envoyer le code,
Expo Go pour y jouer.

## Une seule fois

1. Installer **Expo Go** depuis l'App Store.
2. Ouvrir le lien ci-dessous et l'ajouter aux favoris Safari.

## Le lien de test

https://snack.expo.dev/?name=Dynasty&description=Dynasty+%E2%80%94+test+sur+iPhone+avec+Expo+Go&platform=mydevice&supportedPlatforms=mydevice%2Cios%2Candroid&dependencies=%40react-native-async-storage%2Fasync-storage%2Creact-native-safe-area-context%2C%40expo%2Fvector-icons%2Cexpo-status-bar&sourceUrl=https%3A%2F%2Fraw.githubusercontent.com%2Fomegazell6%2Fdynasty%2Fmain%2Fsnack%2FApp.js

Il ouvre Expo Snack, qui charge la derniere version du jeu publiee sur la
branche `main`. Dans Snack, choisir **My Device** puis scanner le QR Code avec
Expo Go, ou toucher le bouton d'ouverture dans Expo Go.

Ce lien ne change jamais : un favori suffit pour toutes les versions futures.

## Envoyer une nouvelle version en zip

1. Ouvrir `https://github.com/omegazell6/dynasty` dans Safari.
2. **Add file** puis **Upload files**, choisir le `.zip` dans l'application
   Fichiers, et valider (Commit changes) sur la branche `main`.
3. Attendre une a deux minutes : GitHub deballe le zip, remplace les sources,
   reconstruit le bundle et supprime le zip.
4. Rouvrir le lien de test. C'est tout.

Le zip peut contenir un dossier racine (`dynasty/App.tsx`) ou les fichiers
directement (`App.tsx`, `src/`) : les deux formes sont acceptees. Les dechets
macOS (`__MACOSX`, `.DS_Store`) et `node_modules` sont ignores.

### Si la nouvelle version ne s'affiche pas

GitHub met les fichiers bruts en cache environ cinq minutes. Pour tester
immediatement : onglet **Actions** du depot, ouvrir le dernier run **Expo Go**,
le resume affiche un lien « Ouvrir la derniere version » qui contourne le cache.

## Ce que ce montage fait et ne fait pas

- Snack execute le jeu avec la **derniere version du SDK Expo**, pas forcement
  le SDK 54 declare dans `package.json`. Le code actuel n'utilise que des
  composants standards, donc cela passe ; un module natif exotique, non.
- Les dependances utilisables sont celles supportees par Snack. Les quatre du
  projet (`async-storage`, `safe-area-context`, `vector-icons`, `expo-status-bar`)
  le sont.
- La sauvegarde locale fonctionne, mais reste liee a Expo Go.
- EAS Update n'est pas utilisable ici : une mise a jour publiee avec un
  `runtimeVersion` ne peut pas etre chargee par Expo Go, il faudrait un
  development build. D'ou le passage par Snack.
- Pour un vrai test hors Expo Go (TestFlight), il faut un compte Apple
  Developer payant, puis `npx eas-cli build --platform ios --profile preview`.

## Comment ca marche, cote depot

- `App.tsx` et `src/*.ts` restent la source de verite.
- `scripts/build-snack.mjs` assemble tout en un fichier unique `snack/App.js`.
- `scripts/apply-zip.mjs` deballe un zip depose a la racine ou dans `drop/`.
- `.github/workflows/expo-go.yml` enchaine les deux a chaque envoi, verifie
  TypeScript, publie le bundle et affiche le lien.

Pour reconstruire a la main, sur une machine :

    npm install
    npm run snack
