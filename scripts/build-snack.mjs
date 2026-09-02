#!/usr/bin/env node
// Assemble tout le projet en un seul fichier snack/App.js, publiable tel quel
// dans Expo Snack via le parametre sourceUrl. Voir TESTER.md.
import { build } from "esbuild";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "snack/App.js");

// Modules fournis par le runtime Snack ou installes par Snack : jamais inlines.
const EXTERNAL = [
  "react",
  "react-native",
  "expo-status-bar",
  "@expo/vector-icons",
  "react-native-safe-area-context",
  "@react-native-async-storage/async-storage",
];

// Dependances declarees a Snack dans l'URL. Snack choisit la version
// compatible avec le SDK courant, comme le ferait `expo install`.
const SNACK_DEPENDENCIES = [
  "@react-native-async-storage/async-storage",
  "react-native-safe-area-context",
  "@expo/vector-icons",
  "expo-status-bar",
];

const repo = process.env.SNACK_REPO ?? "omegazell6/dynasty";
const branch = process.env.SNACK_BRANCH ?? "main";
const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/snack/App.js`;

function snackUrl(sourceUrl) {
  const params = new URLSearchParams({
    name: "Dynasty",
    description: "Dynasty — test sur iPhone avec Expo Go",
    platform: "mydevice",
    supportedPlatforms: "mydevice,ios,android",
    dependencies: SNACK_DEPENDENCIES.join(","),
    sourceUrl,
  });
  return `https://snack.expo.dev/?${params.toString()}`;
}

mkdirSync(resolve(root, "snack"), { recursive: true });

const result = await build({
  entryPoints: [resolve(root, "App.tsx")],
  bundle: true,
  format: "esm",
  target: "es2020",
  platform: "neutral",
  jsx: "transform",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  external: EXTERNAL,
  write: false,
  logLevel: "warning",
});

const banner = [
  "// Fichier genere automatiquement par scripts/build-snack.mjs.",
  "// Ne pas editer a la main : editer App.tsx et src/*.ts, puis relancer",
  "//   npm run snack",
  "// Ce bundle est le point d'entree utilise par Expo Snack (Expo Go).",
  "",
].join("\n");

const code = banner + result.outputFiles[0].text;
writeFileSync(outFile, code, "utf8");

const stable = snackUrl(rawUrl);
const sha = process.env.GITHUB_SHA;
const fresh = sha ? snackUrl(`${rawUrl}?v=${sha.slice(0, 12)}`) : null;

const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
console.log(`snack/App.js ecrit : ${(code.length / 1024).toFixed(1)} Ko (version ${pkg.version})`);
console.log(`\nLien stable Expo Go :\n${stable}`);
if (fresh) console.log(`\nLien de ce commit (sans cache) :\n${fresh}`);

if (process.env.GITHUB_OUTPUT) {
  const escape = (v) => v.replace(/\n/g, "");
  writeFileSync(
    process.env.GITHUB_OUTPUT,
    `stable_url=${escape(stable)}\nfresh_url=${escape(fresh ?? stable)}\n`,
    { flag: "a" },
  );
}
