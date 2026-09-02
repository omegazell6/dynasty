#!/usr/bin/env node
// Deballe un .zip depose a la racine du depot (ou dans drop/) et remplace
// les sources du projet par son contenu. Voir TESTER.md.
import { execFileSync } from "node:child_process";
import {
  cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync,
  statSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Jamais ecrases par le contenu d'un zip : c'est la tuyauterie de test.
const PROTECTED = new Set([
  ".git", ".github", "scripts", "snack", "TESTER.md", "node_modules",
]);
// Dechets d'archives macOS / Windows.
const JUNK = new Set(["__MACOSX", ".DS_Store", "Thumbs.db", ".expo", "dist", "node_modules", ".git"]);

function findZips() {
  const dirs = [root, join(root, "drop")];
  const found = [];
  for (const dir of dirs) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.toLowerCase().endsWith(".zip")) continue;
      const full = join(dir, name);
      found.push({ full, mtime: statSync(full).mtimeMs });
    }
  }
  return found.sort((a, b) => a.mtime - b.mtime).map((f) => f.full);
}

const zips = findZips();
if (zips.length === 0) {
  console.log("Aucun zip a traiter.");
  process.exit(0);
}

// Si plusieurs zips ont ete deposes, le plus recent gagne ; les autres sont
// tout de meme appliques avant, dans l'ordre chronologique.
for (const zip of zips) {
  console.log(`\n=== Application de ${zip.replace(root + "/", "")} ===`);
  const tmp = mkdtempSync(join(tmpdir(), "dynasty-zip-"));
  execFileSync("unzip", ["-qq", "-o", zip, "-d", tmp]);

  // Le zip contient souvent un unique dossier racine : on l'aplatit.
  let src = tmp;
  for (;;) {
    const entries = readdirSync(src).filter((n) => !JUNK.has(n));
    if (entries.length !== 1) break;
    const only = join(src, entries[0]);
    if (!statSync(only).isDirectory()) break;
    src = only;
  }

  const entries = readdirSync(src).filter((n) => !JUNK.has(n) && !n.toLowerCase().endsWith(".zip"));
  if (entries.length === 0) {
    console.log("Zip vide, ignore.");
    rmSync(tmp, { recursive: true, force: true });
    rmSync(zip, { force: true });
    continue;
  }

  // Remplacement complet des sources quand le zip apporte un point d'entree.
  const isFullApp = entries.some((n) => n === "App.tsx" || n === "App.js");
  if (isFullApp && entries.includes("src") && existsSync(join(root, "src"))) {
    rmSync(join(root, "src"), { recursive: true, force: true });
    console.log("src/ precedent supprime (remplacement complet).");
  }

  for (const name of entries) {
    if (PROTECTED.has(name)) {
      console.log(`ignore (protege) : ${name}`);
      continue;
    }
    cpSync(join(src, name), join(root, name), { recursive: true, force: true });
    console.log(`copie : ${name}`);
  }

  rmSync(tmp, { recursive: true, force: true });
  rmSync(zip, { force: true });
  console.log(`zip consomme et supprime : ${zip.replace(root + "/", "")}`);
}

// Le zip peut apporter son propre package.json : on y remet ce dont la chaine
// de test a besoin, sinon le build Snack casserait au prochain envoi.
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
let patched = false;
pkg.scripts ??= {};
if (pkg.scripts.snack !== "node scripts/build-snack.mjs") {
  pkg.scripts.snack = "node scripts/build-snack.mjs";
  patched = true;
}
pkg.devDependencies ??= {};
if (!pkg.devDependencies.esbuild) {
  pkg.devDependencies.esbuild = "^0.28.0";
  patched = true;
}
if (patched) {
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf8");
  console.log("\npackage.json recomplete (script snack + esbuild).");
}
