// Fichier genere automatiquement par scripts/build-snack.mjs.
// Ne pas editer a la main : editer App.tsx et src/*.ts, puis relancer
//   npm run snack
// Ce bundle est le point d'entree utilise par Expo Snack (Expo Go).
// App.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// src/events.ts
var EVENTS = [
  {
    id: "job",
    title: "Une place \xE0 l\u2019atelier",
    body: "Le ma\xEEtre imprimeur cherche une paire de mains fiable. Le salaire est maigre, mais le m\xE9tier ouvre des portes.",
    choices: [
      {
        label: "Accepter",
        hint: "Apprendre un m\xE9tier",
        effects: { money: 6, reputation: 4, health: -3 },
        result: "Tu apprends vite. L\u2019encre s\u2019incruste partout, sauf dans les comptes.",
        flags: ["printer"]
      },
      {
        label: "Chercher mieux",
        hint: "Rester libre",
        effects: { money: -3, happiness: 5, reputation: -2 },
        result: "Tu refuses. La libert\xE9 est grisante et assez peu rentable."
      }
    ]
  },
  {
    id: "workshop",
    title: "La boutique aux volets bleus",
    body: "Un artisan sans h\xE9ritier vend son petit atelier. Le toit fuit, mais la client\xE8le est fid\xE8le.",
    requires: "printer",
    excludes: "workshop",
    choices: [
      {
        label: "Acheter l\u2019atelier",
        hint: "Investir dans l\u2019avenir",
        effects: { money: -12, reputation: 8, happiness: 3 },
        result: "L\u2019atelier devient le premier actif de la famille.",
        flags: ["workshop"],
        property: "Atelier aux volets bleus"
      },
      {
        label: "Garder l\u2019argent",
        hint: "\xC9viter la dette",
        effects: { money: 5, happiness: -2 },
        result: "Un concurrent l\u2019ach\xE8te et repeint les volets en beige."
      }
    ]
  },
  {
    id: "meeting",
    title: "Sous le m\xEAme parapluie",
    body: "Une connaissance te raccompagne sous une pluie obstin\xE9e. La conversation dure bien apr\xE8s l\u2019averse.",
    minAge: 20,
    maxAge: 52,
    needsNoSpouse: true,
    choices: [
      {
        label: "Proposer une promenade",
        hint: "\xC9couter le c\u0153ur",
        effects: { happiness: 14, relations: 10, reputation: 2 },
        result: "La promenade devient une habitude, puis une vie commune.",
        spouse: "gain"
      },
      {
        label: "Rentrer seul",
        hint: "Ne rien pr\xE9cipiter",
        effects: { happiness: -4, money: 3 },
        result: "Tu rentres au sec, avec une excellente analyse de la m\xE9t\xE9o."
      }
    ]
  },
  {
    id: "baby",
    title: "Une chambre de plus",
    body: "Votre foyer pourrait accueillir un enfant. Le budget proteste d\xE9j\xE0.",
    minAge: 23,
    maxAge: 47,
    needsSpouse: true,
    choices: [
      {
        label: "Agrandir la famille",
        hint: "Une nouvelle branche",
        effects: { money: -7, happiness: 13, health: -3 },
        result: "Un enfant va rejoindre la famille.",
        child: "birth"
      },
      {
        label: "Attendre encore",
        hint: "Consolider le foyer",
        effects: { money: 6, happiness: -3 },
        result: "Vous repoussez la d\xE9cision pour quelques ann\xE9es."
      }
    ]
  },
  {
    id: "rail",
    title: "Des rails dans le verger",
    body: "La compagnie ferroviaire veut acheter une terre familiale. Elle promet fortune, fum\xE9e et ponctualit\xE9.",
    maxYear: 1910,
    choices: [
      {
        label: "Vendre la parcelle",
        hint: "De l\u2019argent maintenant",
        effects: { money: 16, reputation: -3 },
        result: "Le train passe. La bourse s\u2019alourdit et le verger dispara\xEEt."
      },
      {
        label: "Refuser le trac\xE9",
        hint: "Pr\xE9server la terre",
        effects: { money: -4, reputation: 9, relations: 5 },
        result: "Les ing\xE9nieurs contournent la propri\xE9t\xE9 avec une rancune m\xE9thodique.",
        property: "Verger familial"
      }
    ]
  },
  {
    id: "strike",
    title: "La gr\xE8ve devant l\u2019usine",
    body: "Les ouvriers r\xE9clament des journ\xE9es moins interminables. Ton employeur veut des noms.",
    minYear: 1860,
    maxYear: 1930,
    choices: [
      {
        label: "Soutenir la gr\xE8ve",
        hint: "La solidarit\xE9 a un prix",
        effects: { money: -7, reputation: 9, relations: 12, health: -4 },
        result: "Ton nom circule dans les ateliers avec reconnaissance.",
        flags: ["workers"]
      },
      {
        label: "Prot\xE9ger ton poste",
        hint: "Choisir la s\xE9curit\xE9",
        effects: { money: 10, reputation: -10, relations: -8 },
        result: "Ton poste est sauf. Ta r\xE9putation beaucoup moins.",
        flags: ["informer"]
      }
    ]
  },
  {
    id: "house",
    title: "La maison de la colline",
    body: "Une demeure solide est \xE0 vendre. Trop grande aujourd\u2019hui, parfaite pour une dynastie.",
    choices: [
      {
        label: "Acheter la maison",
        hint: "Ancrer la famille",
        effects: { money: -18, happiness: 10, reputation: 8 },
        result: "La cl\xE9 est lourde. La maison accueillera plusieurs g\xE9n\xE9rations.",
        property: "Maison de la colline",
        flags: ["family_home"]
      },
      {
        label: "Investir autrement",
        hint: "Faire travailler l\u2019argent",
        effects: { money: 10, happiness: -3 },
        result: "Le capital grandit. La cuisine reste minuscule."
      }
    ]
  },
  {
    id: "epidemic",
    title: "La fi\xE8vre gagne le quartier",
    body: "Les lits manquent. Les rumeurs courent plus vite que les m\xE9decins.",
    maxYear: 1920,
    choices: [
      {
        label: "Aider au dispensaire",
        hint: "Utile mais dangereux",
        effects: { health: -18, reputation: 13, relations: 8 },
        result: "Tu aides jusqu\u2019\xE0 l\u2019\xE9puisement. Le quartier n\u2019oubliera pas."
      },
      {
        label: "Partir \xE0 la campagne",
        hint: "Prot\xE9ger les proches",
        effects: { money: -9, health: 8, reputation: -3 },
        result: "La famille \xE9vite le pire au milieu des poules."
      }
    ]
  },
  {
    id: "company",
    title: "Mettre le nom sur la fa\xE7ade",
    body: "L\u2019atelier peut devenir une vraie entreprise. Il faut emprunter, recruter et dormir moins.",
    requires: "workshop",
    excludes: "company",
    choices: [
      {
        label: "Fonder l\u2019entreprise",
        hint: "Tout risquer",
        effects: { money: -15, reputation: 16, relations: 7, health: -6 },
        result: "La maison familiale ouvre ses portes.",
        company: "Maison familiale",
        flags: ["company"]
      },
      {
        label: "Rester artisan",
        hint: "Pr\xE9server l\u2019\xE9quilibre",
        effects: { money: 6, happiness: 8, reputation: 3 },
        result: "Tu choisis la qualit\xE9, les siestes et une comptabilit\xE9 lisible."
      }
    ]
  },
  {
    id: "inherit_company",
    title: "La vieille maison familiale",
    body: "L\u2019entreprise des a\xEFeux d\xE9cline. Un concurrent propose de la racheter.",
    requires: "company",
    minYear: 1880,
    choices: [
      {
        label: "La relancer",
        hint: "Honorer le nom",
        effects: { money: -12, reputation: 16, relations: 10, health: -4 },
        result: "La maison repart, plus moderne et presque solvable.",
        flags: ["company_saved"]
      },
      {
        label: "La vendre",
        hint: "Transformer le pass\xE9 en capital",
        effects: { money: 25, reputation: -8, happiness: 5 },
        result: "La fa\xE7ade change de nom. Le compte familial respire.",
        removeFlags: ["company"]
      }
    ]
  },
  {
    id: "school",
    title: "Les \xE9tudes d\u2019un enfant",
    body: "Un professeur remarque un talent rare chez l\u2019un de tes enfants. Les \xE9tudes co\xFBteront cher.",
    needsSpouse: true,
    choices: [
      {
        label: "Payer les \xE9tudes",
        hint: "Investir dans la prochaine g\xE9n\xE9ration",
        effects: { money: -12, happiness: 8, reputation: 6 },
        result: "L\u2019enfant part \xE9tudier. Ce choix p\xE8sera longtemps.",
        flags: ["educated_heir"]
      },
      {
        label: "Aider \xE0 l\u2019atelier",
        hint: "La famille d\u2019abord",
        effects: { money: 8, happiness: -6, relations: -4 },
        result: "Une paire de mains rejoint le travail familial."
      }
    ]
  },
  {
    id: "scandal",
    title: "Le carnet dans le secr\xE9taire",
    body: "Tu d\xE9couvres une dette honteuse contract\xE9e par un parent. La ville adore d\xE9j\xE0 l\u2019histoire.",
    choices: [
      {
        label: "Tout reconna\xEEtre",
        hint: "Payer et garder la face",
        effects: { money: -12, reputation: 9, happiness: -3 },
        result: "L\u2019honn\xEAtet\xE9 ruine le scandale avant qu\u2019il ne ruine le nom."
      },
      {
        label: "Br\xFBler le carnet",
        hint: "Esp\xE9rer l\u2019oubli",
        effects: { reputation: -6, health: -3, money: 4 },
        result: "Le carnet dispara\xEEt. Pas l\u2019odeur de papier br\xFBl\xE9.",
        flags: ["hidden_debt"]
      }
    ]
  },
  {
    id: "election",
    title: "On te veut sur la liste",
    body: "Le maire propose une place \xE9ligible et promet tr\xE8s peu de r\xE9unions. C\u2019est un mensonge \xE9l\xE9gant.",
    minAge: 30,
    choices: [
      {
        label: "Entrer en politique",
        hint: "Gagner de l\u2019influence",
        effects: { relations: 18, reputation: 8, happiness: -8, money: -4 },
        result: "Tu es \xE9lu. Ton sommeil perd d\xE8s le premier tour.",
        flags: ["politics"]
      },
      {
        label: "Refuser",
        hint: "Prot\xE9ger sa vie",
        effects: { happiness: 9, relations: -3 },
        result: "Tu rentres d\xEEner. Le conseil d\xE9bat encore des bordures."
      }
    ]
  },
  {
    id: "war",
    title: "L\u2019ordre de mobilisation",
    body: "Une enveloppe officielle arrive. Dans la rue, personne ne sait encore \xE0 quel point tout va changer.",
    minYear: 1910,
    maxYear: 1947,
    choices: [
      {
        label: "R\xE9pondre \xE0 l\u2019appel",
        hint: "Le devoir et le danger",
        effects: { health: -24, reputation: 17, happiness: -12 },
        result: "Tu reviens chang\xE9, avec une m\xE9daille difficile \xE0 regarder.",
        flags: ["veteran"]
      },
      {
        label: "Faire jouer un contact",
        hint: "\xC9chapper au front",
        effects: { money: -15, reputation: -15, health: 7 },
        result: "Tu restes loin du front, mais pas loin des murmures."
      }
    ]
  },
  {
    id: "crash",
    title: "Le banquier ne sourit plus",
    body: "Les cours s\u2019effondrent. Ton conseiller d\xE9couvre soudain la modestie.",
    minYear: 1927,
    maxYear: 1936,
    choices: [
      {
        label: "Acheter au plus bas",
        hint: "Courage ou inconscience",
        effects: { money: -15, relations: 6, health: -4 },
        result: "Tu investis quand tout le monde vend.",
        flags: ["crash_investor"]
      },
      {
        label: "Tout retirer",
        hint: "Sauver ce qui reste",
        effects: { money: -5, happiness: -4, health: 3 },
        result: "Les \xE9conomies finissent cach\xE9es dans un endroit presque oubli\xE9."
      }
    ]
  },
  {
    id: "television",
    title: "Le monde entre au salon",
    body: "Les voisins se pressent devant une bo\xEEte lumineuse. Votre famille pourrait \xEAtre la premi\xE8re \xE9quip\xE9e.",
    minYear: 1950,
    maxYear: 1975,
    choices: [
      {
        label: "Acheter le poste",
        hint: "Rassembler le quartier",
        effects: { money: -8, happiness: 12, relations: 7 },
        result: "Le salon devient un petit cin\xE9ma.",
        property: "T\xE9l\xE9vision familiale"
      },
      {
        label: "Garder les livres",
        hint: "D\xE9fendre l\u2019ancien monde",
        effects: { reputation: 5, money: 4, happiness: -2 },
        result: "Tu lis avec ostentation pr\xE8s de la fen\xEAtre."
      }
    ]
  },
  {
    id: "adoption",
    title: "Une famille autrement",
    body: "Une adoption est possible. Les d\xE9marches seront longues, mais un enfant attend un foyer.",
    minYear: 1960,
    maxAge: 55,
    choices: [
      {
        label: "Ouvrir le foyer",
        hint: "Cr\xE9er une autre filiation",
        effects: { money: -10, happiness: 14, reputation: 5 },
        result: "Un enfant va rejoindre votre histoire.",
        child: "adopt"
      },
      {
        label: "Renoncer",
        hint: "Ce n\u2019est pas le moment",
        effects: { happiness: -5, money: 3 },
        result: "Le dossier reste dans un tiroir."
      }
    ]
  },
  {
    id: "internet",
    title: "Un dr\xF4le de r\xE9seau",
    body: "Un proche veut brancher la famille \xE0 Internet. Le modem semble crier \xE0 l\u2019aide.",
    minYear: 1990,
    maxYear: 2008,
    choices: [
      {
        label: "Se connecter",
        hint: "Prendre de l\u2019avance",
        effects: { money: -5, relations: 12, reputation: 6, happiness: 4 },
        result: "La famille entre sur le r\xE9seau.",
        flags: ["online"]
      },
      {
        label: "Attendre",
        hint: "Une mode s\xFBrement",
        effects: { money: 5, relations: -7 },
        result: "Internet ne passe pas. Le temps, si."
      }
    ]
  },
  {
    id: "startup",
    title: "Une id\xE9e sur un coin de table",
    body: "Un enfant propose de transformer le vieux savoir-faire familial en service moderne.",
    minYear: 1980,
    requires: "educated_heir",
    choices: [
      {
        label: "Financer le projet",
        hint: "Miser sur la rel\xE8ve",
        effects: { money: -18, reputation: 9, relations: 10 },
        result: "Le projet d\xE9marre dans une pi\xE8ce trop petite.",
        company: "Entreprise num\xE9rique",
        flags: ["startup"]
      },
      {
        label: "Refuser",
        hint: "Pr\xE9server les \xE9conomies",
        effects: { money: 7, relations: -9, happiness: -5 },
        result: "L\u2019id\xE9e part ailleurs, avec l\u2019enfant vex\xE9."
      }
    ]
  },
  {
    id: "divorce",
    title: "Deux vies sous un toit",
    body: "Le couple n\u2019est plus qu\u2019une organisation logistique tr\xE8s bien tenue.",
    minAge: 34,
    needsSpouse: true,
    choices: [
      {
        label: "Se s\xE9parer",
        hint: "Co\xFBteux mais honn\xEAte",
        effects: { money: -12, happiness: 8, reputation: -4 },
        result: "Les biens sont partag\xE9s. Les non-dits aussi.",
        spouse: "lose"
      },
      {
        label: "Se reparler",
        hint: "Essayer encore",
        effects: { money: -4, happiness: 10, health: 3 },
        result: "Vous recommencez doucement."
      }
    ]
  },
  {
    id: "rival",
    title: "Le rival au banquet",
    body: "Une famille concurrente tourne tes r\xE9ussites en ridicule. Toute la table attend ta r\xE9ponse.",
    choices: [
      {
        label: "R\xE9pondre avec esprit",
        hint: "Briller ou se br\xFBler",
        effects: { reputation: 10, relations: 5, happiness: 3 },
        result: "La salle rit. Ton rival aussi, uniquement avec la bouche."
      },
      {
        label: "Ne pas s\u2019abaisser",
        hint: "Garder son calme",
        effects: { reputation: -3, health: 4, happiness: 2 },
        result: "Trois jours plus tard, tu trouves la r\xE9plique parfaite."
      }
    ]
  },
  {
    id: "doctor",
    title: "Le m\xE9decin insiste",
    body: "Il faudrait ralentir, dormir davantage et laisser quelqu\u2019un d\u2019autre compter les pi\xE8ces.",
    minAge: 50,
    choices: [
      {
        label: "Lever le pied",
        hint: "Prot\xE9ger sa sant\xE9",
        effects: { money: -8, health: 14, happiness: 8 },
        result: "Les journ\xE9es raccourcissent. La vie semble plus longue."
      },
      {
        label: "Continuer",
        hint: "La dynastie avant tout",
        effects: { money: 13, health: -15, reputation: 6 },
        result: "Les affaires prosp\xE8rent pendant que le corps proteste."
      }
    ]
  },
  {
    id: "future",
    title: "L\u2019agent familial",
    body: "Une intelligence artificielle propose de g\xE9rer le patrimoine et les disputes du dimanche.",
    minYear: 2025,
    choices: [
      {
        label: "Lui confier les comptes",
        hint: "Efficacit\xE9 avant contr\xF4le",
        effects: { money: 15, relations: 7, happiness: -5 },
        result: "Les finances prosp\xE8rent. L\u2019agent bloque l\u2019oncle Ren\xE9.",
        flags: ["ai"]
      },
      {
        label: "Garder la main",
        hint: "Rester humain",
        effects: { happiness: 8, reputation: 5, money: -3 },
        result: "Tu conserves tes habitudes et tes erreurs."
      }
    ]
  }
];

// src/engine.ts
var FEMALE = [
  "Ad\xE8le",
  "Jeanne",
  "L\xE9onie",
  "Suzanne",
  "Louise",
  "Rose",
  "Clara",
  "\xC9lise",
  "Ana",
  "Nina"
];
var MALE = [
  "Auguste",
  "Jules",
  "\xC9mile",
  "Marcel",
  "Lucien",
  "Gabriel",
  "Louis",
  "Victor",
  "No\xE9",
  "L\xE9on"
];
var clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
var id = () => Math.random().toString(36).slice(2, 10);
var pick = (a) => a[Math.floor(Math.random() * a.length)];
var randomSex = () => Math.random() < 0.5 ? "F" : "M";
var profession = (year, sex) => {
  const jobs = year < 1920 ? sex === "F" ? ["couturi\xE8re", "institutrice", "relieuse", "n\xE9gociante"] : ["artisan", "instituteur", "relieur", "n\xE9gociant"] : year < 1980 ? sex === "F" ? ["infirmi\xE8re", "comptable", "journaliste", "architecte"] : ["infirmier", "comptable", "journaliste", "architecte"] : sex === "F" ? ["ing\xE9nieure", "m\xE9decin", "designer", "entrepreneuse"] : ["ing\xE9nieur", "m\xE9decin", "designer", "entrepreneur"];
  return pick(jobs);
};
var randomName = (sex) => pick(sex === "F" ? FEMALE : MALE);
var makePerson = (firstName, lastName, sex, year, generation, age = 18) => ({
  id: id(),
  firstName,
  lastName,
  sex,
  age,
  birthYear: year - age,
  alive: true,
  profession: profession(year, sex),
  generation
});
function createGame(founder) {
  const current = makePerson(
    founder.firstName.trim(),
    founder.lastName.trim(),
    founder.sex,
    1850,
    1
  );
  return {
    version: 1,
    runId: id(),
    year: 1850,
    generation: 1,
    founderYear: 1850,
    current,
    spouse: null,
    children: [],
    stats: {
      money: 20,
      health: 82,
      happiness: 62,
      reputation: 12,
      relations: 15
    },
    properties: [],
    companies: [],
    debt: 0,
    flags: [],
    seen: [],
    chronicle: [
      {
        year: 1850,
        text: current.firstName + " " + current.lastName + " commence sa vie adulte."
      }
    ],
    timeline: [{ year: 1850, money: 20, family: 1 }],
    totalDescendants: 0,
    maxMoney: 20,
    notablePeople: [],
    pendingChild: null
  };
}
function available(state, event) {
  if (event.minYear && state.year < event.minYear) return false;
  if (event.maxYear && state.year > event.maxYear) return false;
  if (event.minAge && state.current.age < event.minAge) return false;
  if (event.maxAge && state.current.age > event.maxAge) return false;
  if (event.requires && !state.flags.includes(event.requires)) return false;
  if (event.excludes && state.flags.includes(event.excludes)) return false;
  if (event.needsSpouse && !state.spouse) return false;
  if (event.needsNoSpouse && state.spouse) return false;
  return true;
}
function nextEvent(state) {
  const guided = !state.spouse && state.current.age >= 20 ? EVENTS.find((e) => e.id === "meeting" && available(state, e)) : state.spouse && state.children.length === 0 && state.current.age <= 47 ? EVENTS.find((e) => e.id === "baby" && available(state, e)) : void 0;
  if (guided && !state.seen.slice(-2).includes(guided.id)) return guided;
  const fresh = EVENTS.filter(
    (e) => available(state, e) && !state.seen.slice(-7).includes(e.id)
  );
  return pick(fresh.length ? fresh : EVENTS.filter((e) => available(state, e)));
}
function applyChoice(state, event, choice) {
  const next = JSON.parse(JSON.stringify(state));
  const before = { ...state.stats };
  const years = 3 + Math.floor(Math.random() * 3);
  next.year += years;
  next.current.age += years;
  next.children.forEach((c) => c.age += years);
  if (next.spouse) next.spouse.age += years;
  Object.keys(next.stats).forEach(
    (k) => next.stats[k] = clamp(next.stats[k] + (choice.effects[k] ?? 0))
  );
  next.stats.health = clamp(
    next.stats.health - (next.current.age > 55 ? 3 : 1)
  );
  next.stats.money = Math.max(0, next.stats.money);
  next.flags = [
    ...new Set(
      next.flags.filter((f) => !choice.removeFlags?.includes(f)).concat(choice.flags ?? [])
    )
  ];
  next.seen.push(event.id);
  if (choice.property && !next.properties.includes(choice.property))
    next.properties.push(choice.property);
  if (choice.company && !next.companies.includes(choice.company))
    next.companies.push(
      choice.company.replace("familiale", next.current.lastName)
    );
  if (choice.spouse === "gain") {
    const sex = next.current.sex === "F" ? "M" : "F";
    next.spouse = makePerson(
      randomName(sex),
      next.current.lastName,
      sex,
      next.year,
      next.generation,
      Math.max(18, next.current.age - 2)
    );
  }
  if (choice.spouse === "lose") next.spouse = null;
  if (choice.child)
    next.pendingChild = {
      sex: randomSex(),
      relation: choice.child === "adopt" ? "adopted" : "biological"
    };
  if (next.flags.includes("crash_investor") && next.year > 1936) {
    next.stats.money += 22;
    next.flags = next.flags.filter((f) => f !== "crash_investor");
  }
  if (next.flags.includes("hidden_debt") && Math.random() < 0.2) {
    next.stats.reputation = clamp(next.stats.reputation - 16);
    next.flags = next.flags.filter((f) => f !== "hidden_debt");
  }
  next.maxMoney = Math.max(next.maxMoney, next.stats.money);
  next.timeline.push({
    year: next.year,
    money: next.stats.money,
    family: 1 + next.children.length + (next.spouse ? 1 : 0)
  });
  next.chronicle.push({ year: next.year, text: choice.result });
  const risk = Math.max(0, (next.current.age - 63) * 0.024) + (next.stats.health < 20 ? 0.18 : 0);
  const died = next.stats.health <= 0 || next.current.age >= 94 || next.current.age > 63 && Math.random() < risk;
  if (died) {
    next.current.alive = false;
    next.notablePeople.push(
      next.current.firstName + " " + next.current.lastName + " \xB7 " + next.current.age + " ans"
    );
    next.chronicle.push({
      year: next.year,
      text: next.current.firstName + " meurt \xE0 " + next.current.age + " ans."
    });
  }
  const deltas = Object.keys(next.stats).reduce(
    (a, k) => ({ ...a, [k]: next.stats[k] - before[k] }),
    {}
  );
  return { state: next, message: choice.result, deltas, died };
}
function namePendingChild(state, firstName) {
  if (!state.pendingChild) return state;
  const { sex, relation } = state.pendingChild;
  const next = JSON.parse(JSON.stringify(state));
  const child = {
    ...makePerson(
      firstName.trim() || randomName(sex),
      next.current.lastName,
      sex,
      next.year,
      next.generation + 1,
      0
    ),
    relation
  };
  next.children.push(child);
  next.totalDescendants += 1;
  next.pendingChild = null;
  next.chronicle.push({
    year: next.year,
    text: child.firstName + " " + child.lastName + " rejoint la famille."
  });
  return next;
}
var heirs = (state) => state.children.filter((c) => c.alive);
function chooseHeir(state, heirId) {
  const next = JSON.parse(JSON.stringify(state));
  const heir = next.children.find((c) => c.id === heirId);
  if (!heir) return next;
  const wait = Math.max(0, 18 - heir.age);
  next.year += wait;
  heir.age += wait;
  heir.birthYear = next.year - heir.age;
  heir.profession = profession(next.year, heir.sex);
  next.current = { ...heir, alive: true };
  next.generation += 1;
  next.spouse = null;
  next.children = [];
  next.stats.health = 78;
  next.stats.happiness = 60;
  next.stats.money = Math.round(next.stats.money * 0.78);
  next.stats.reputation = clamp(next.stats.reputation * 0.88);
  next.stats.relations = clamp(next.stats.relations * 0.8);
  if (next.flags.includes("educated_heir")) {
    next.stats.reputation = clamp(next.stats.reputation + 10);
    next.stats.money += 8;
  }
  next.chronicle.push({
    year: next.year,
    text: heir.firstName + " devient le visage de la g\xE9n\xE9ration " + next.generation + "."
  });
  return next;
}
function score(state) {
  return Math.round(
    (state.year - state.founderYear) * 12 + state.generation * 400 + state.totalDescendants * 100 + state.maxMoney * 11 + state.stats.reputation * 8 + state.properties.length * 180 + state.companies.length * 340 + state.notablePeople.length * 120
  );
}
var formatMoney = (value) => value >= 1e3 ? (value / 1e3).toFixed(1) + " M" : "\u20AC " + Math.round(value * 1e3).toLocaleString("fr-FR");

// src/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
var RUN = "dynasty.native.run.v1";
var BEST = "dynasty.native.best.v1";
async function saveRun(state) {
  await AsyncStorage.setItem(RUN, JSON.stringify(state));
}
async function loadRun() {
  const raw = await AsyncStorage.getItem(RUN);
  return raw ? JSON.parse(raw) : null;
}
async function clearRun() {
  await AsyncStorage.removeItem(RUN);
}
async function loadBest() {
  return Number(await AsyncStorage.getItem(BEST) ?? 0);
}
async function saveBest(value) {
  await AsyncStorage.setItem(BEST, String(value));
}

// App.tsx
var C = {
  paper: "#F8F5EF",
  card: "#FFFFFF",
  ink: "#172235",
  muted: "#747B87",
  line: "#E9E4DC",
  navy: "#182638",
  green: "#4C9A73",
  red: "#E76670",
  gold: "#D49A35",
  blue: "#638FC9",
  purple: "#7667C8"
};
var STAT = [
  { key: "money", label: "Argent", icon: "wallet-outline", color: C.green },
  { key: "health", label: "Sant\xE9", icon: "heart-outline", color: C.red },
  {
    key: "happiness",
    label: "Bonheur",
    icon: "emoticon-happy-outline",
    color: C.gold
  },
  {
    key: "reputation",
    label: "R\xE9putation",
    icon: "star-outline",
    color: C.blue
  }
];
function Avatar({
  name,
  sex,
  size = 52
}) {
  const color = sex === "F" ? "#E8C2AD" : "#A9C8D4";
  return /* @__PURE__ */ React.createElement(
    View,
    {
      style: [
        s.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color
        }
      ]
    },
    /* @__PURE__ */ React.createElement(
      Icon,
      {
        name: sex === "F" ? "face-woman-outline" : "face-man-outline",
        size: size * 0.58,
        color: C.ink
      }
    ),
    /* @__PURE__ */ React.createElement(Text, { style: [s.avatarInitial, { fontSize: size * 0.16 }] }, name.slice(0, 1).toUpperCase())
  );
}
function PrimaryButton({
  label,
  onPress,
  disabled = false
}) {
  return /* @__PURE__ */ React.createElement(
    Pressable,
    {
      disabled,
      onPress,
      style: ({ pressed }) => [
        s.primary,
        disabled && s.disabled,
        pressed && s.pressed
      ]
    },
    /* @__PURE__ */ React.createElement(Text, { style: s.primaryText }, label),
    /* @__PURE__ */ React.createElement(Icon, { name: "arrow-right", size: 20, color: "white" })
  );
}
function StartScreen({
  best,
  hasSave,
  onNew,
  onResume
}) {
  return /* @__PURE__ */ React.createElement(SafeAreaView, { style: s.start }, /* @__PURE__ */ React.createElement(View, { style: s.startBrand }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 28, color: C.gold }), /* @__PURE__ */ React.createElement(Text, { style: s.startTitle }, "Dynasty"), /* @__PURE__ */ React.createElement(Text, { style: s.startSub }, "UNE FAMILLE. PLUSIEURS VIES.")), /* @__PURE__ */ React.createElement(View, { style: s.startArt }, /* @__PURE__ */ React.createElement(View, { style: s.lineageLine }), /* @__PURE__ */ React.createElement(View, { style: s.startFaces }, /* @__PURE__ */ React.createElement(Avatar, { name: "A", sex: "F", size: 66 }), /* @__PURE__ */ React.createElement(Avatar, { name: "L", sex: "M", size: 82 }), /* @__PURE__ */ React.createElement(Avatar, { name: "E", sex: "F", size: 66 })), /* @__PURE__ */ React.createElement(Text, { style: s.startYears }, "1850 \xB7 \xB7 \xB7 DEMAIN")), /* @__PURE__ */ React.createElement(View, { style: s.startActions }, /* @__PURE__ */ React.createElement(PrimaryButton, { label: "Nouvelle dynastie", onPress: onNew }), hasSave ? /* @__PURE__ */ React.createElement(Pressable, { style: s.resume, onPress: onResume }, /* @__PURE__ */ React.createElement(Text, null, "Reprendre la partie")) : null, /* @__PURE__ */ React.createElement(Text, { style: s.record }, /* @__PURE__ */ React.createElement(Icon, { name: "trophy-outline", size: 15, color: C.gold }), " Meilleur score : ", best.toLocaleString("fr-FR"))));
}
function SetupScreen({
  onBack,
  onCreate
}) {
  const [firstName, setFirstName] = useState("\xC9lise"), [lastName, setLastName] = useState("Moreau"), [sex, setSex] = useState("F");
  const valid = firstName.trim().length > 1 && lastName.trim().length > 1;
  return /* @__PURE__ */ React.createElement(SafeAreaView, { style: s.screen }, /* @__PURE__ */ React.createElement(View, { style: s.nativeHeader }, /* @__PURE__ */ React.createElement(Pressable, { onPress: onBack, style: s.roundButton }, /* @__PURE__ */ React.createElement(Icon, { name: "chevron-left", size: 26, color: C.ink })), /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: s.headerEyebrow }, "FRANCE \xB7 1850"), /* @__PURE__ */ React.createElement(Text, { style: s.headerTitle }, "Ton fondateur")), /* @__PURE__ */ React.createElement(View, { style: { width: 42 } })), /* @__PURE__ */ React.createElement(
    KeyboardAvoidingView,
    {
      style: { flex: 1 },
      behavior: Platform.OS === "ios" ? "padding" : void 0
    },
    /* @__PURE__ */ React.createElement(
      ScrollView,
      {
        contentContainerStyle: s.setupBody,
        keyboardShouldPersistTaps: "handled"
      },
      /* @__PURE__ */ React.createElement(Avatar, { name: firstName || "?", sex, size: 118 }),
      /* @__PURE__ */ React.createElement(Text, { style: s.founderCaption }, "18 ans \xB7 ", sex === "F" ? "Fondatrice" : "Fondateur"),
      /* @__PURE__ */ React.createElement(View, { style: s.sexSwitch }, /* @__PURE__ */ React.createElement(
        Pressable,
        {
          onPress: () => {
            setSex("F");
            if (firstName === "Thomas") setFirstName("\xC9lise");
          },
          style: [s.sexChoice, sex === "F" && s.sexActive]
        },
        /* @__PURE__ */ React.createElement(Icon, { name: "gender-female", size: 21 }),
        /* @__PURE__ */ React.createElement(Text, null, "Femme")
      ), /* @__PURE__ */ React.createElement(
        Pressable,
        {
          onPress: () => {
            setSex("M");
            if (firstName === "\xC9lise") setFirstName("Thomas");
          },
          style: [s.sexChoice, sex === "M" && s.sexActive]
        },
        /* @__PURE__ */ React.createElement(Icon, { name: "gender-male", size: 21 }),
        /* @__PURE__ */ React.createElement(Text, null, "Homme")
      )),
      /* @__PURE__ */ React.createElement(View, { style: s.field }, /* @__PURE__ */ React.createElement(Text, { style: s.fieldLabel }, "PR\xC9NOM"), /* @__PURE__ */ React.createElement(
        TextInput,
        {
          style: s.fieldInput,
          value: firstName,
          onChangeText: setFirstName,
          maxLength: 18,
          autoCorrect: false,
          returnKeyType: "next"
        }
      )),
      /* @__PURE__ */ React.createElement(View, { style: s.field }, /* @__PURE__ */ React.createElement(Text, { style: s.fieldLabel }, "NOM DE FAMILLE"), /* @__PURE__ */ React.createElement(
        TextInput,
        {
          style: s.fieldInput,
          value: lastName,
          onChangeText: setLastName,
          maxLength: 22,
          autoCorrect: false,
          returnKeyType: "done"
        }
      )),
      /* @__PURE__ */ React.createElement(View, { style: s.origin }, /* @__PURE__ */ React.createElement(Icon, { name: "map-marker-outline", size: 23, color: C.gold }), /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, null, "Une vie commence"), /* @__PURE__ */ React.createElement(Text, null, "Peu d\u2019argent, aucun h\xE9ritage, tout \xE0 construire.")))
    ),
    /* @__PURE__ */ React.createElement(View, { style: s.fixedAction }, /* @__PURE__ */ React.createElement(
      PrimaryButton,
      {
        disabled: !valid,
        label: "Commencer en 1850",
        onPress: () => onCreate({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          sex
        })
      }
    ))
  ));
}
function TopBar({ state }) {
  return /* @__PURE__ */ React.createElement(View, { style: s.topbar }, /* @__PURE__ */ React.createElement(
    Avatar,
    {
      name: state.current.firstName,
      sex: state.current.sex,
      size: 44
    }
  ), /* @__PURE__ */ React.createElement(View, { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Text, { style: s.personName }, state.current.firstName, " ", state.current.lastName), /* @__PURE__ */ React.createElement(Text, { style: s.personSub }, state.current.age, " ans \xB7 ", state.year)), /* @__PURE__ */ React.createElement(View, { style: s.genPill }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 16, color: C.gold }), /* @__PURE__ */ React.createElement(Text, null, "G", state.generation)));
}
function StatStrip({ state }) {
  return /* @__PURE__ */ React.createElement(View, { style: s.statStrip }, STAT.map((item) => /* @__PURE__ */ React.createElement(View, { key: item.key, style: s.statMini }, /* @__PURE__ */ React.createElement(Icon, { name: item.icon, size: 17, color: item.color }), /* @__PURE__ */ React.createElement(Text, null, item.key === "money" ? formatMoney(state.stats.money) : Math.round(state.stats[item.key])))));
}
function ChoiceButton({
  index,
  label,
  hint,
  effects,
  onPress
}) {
  return /* @__PURE__ */ React.createElement(
    Pressable,
    {
      onPress,
      style: ({ pressed }) => [s.choice, pressed && s.pressed]
    },
    /* @__PURE__ */ React.createElement(
      View,
      {
        style: [
          s.choiceIcon,
          { backgroundColor: index === 0 ? "#E5F3E9" : "#F8E9E6" }
        ]
      },
      /* @__PURE__ */ React.createElement(
        Icon,
        {
          name: index === 0 ? "check" : "arrow-right",
          size: 19,
          color: index === 0 ? C.green : C.red
        }
      )
    ),
    /* @__PURE__ */ React.createElement(View, { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Text, { style: s.choiceLabel }, label), /* @__PURE__ */ React.createElement(Text, { style: s.choiceHint }, hint), /* @__PURE__ */ React.createElement(Text, { style: s.choiceEffect }, effects || "Cons\xE9quence incertaine"))
  );
}
function effectText(event, index) {
  const c = event.choices[index];
  if (!c) return "";
  const labels = {
    money: "argent",
    health: "sant\xE9",
    happiness: "bonheur",
    reputation: "r\xE9putation",
    relations: "relations"
  };
  return Object.entries(c.effects).map(([k, v]) => (Number(v) > 0 ? "+" : "") + v + " " + labels[k]).join("  \xB7  ");
}
function LifeTab({
  state,
  event,
  outcome,
  onChoice,
  onContinue
}) {
  return /* @__PURE__ */ React.createElement(View, { style: s.life }, /* @__PURE__ */ React.createElement(TopBar, { state }), /* @__PURE__ */ React.createElement(StatStrip, { state }), /* @__PURE__ */ React.createElement(
    ScrollView,
    {
      contentContainerStyle: s.lifeScroll,
      showsVerticalScrollIndicator: false
    },
    /* @__PURE__ */ React.createElement(Text, { style: s.eventLabel }, "\xC9V\xC9NEMENT"),
    /* @__PURE__ */ React.createElement(View, { style: s.eventCard }, outcome ? /* @__PURE__ */ React.createElement(View, { style: s.outcome }, /* @__PURE__ */ React.createElement(View, { style: s.outcomeIcon }, /* @__PURE__ */ React.createElement(
      Icon,
      {
        name: outcome.died ? "heart-broken-outline" : "check",
        size: 30,
        color: "white"
      }
    )), /* @__PURE__ */ React.createElement(Text, { style: s.outcomeOver }, outcome.died ? "FIN DE VIE" : "CONS\xC9QUENCE"), /* @__PURE__ */ React.createElement(Text, { style: s.outcomeText }, outcome.message), /* @__PURE__ */ React.createElement(View, { style: s.deltaWrap }, STAT.filter((x) => outcome.deltas[x.key]).map((x) => /* @__PURE__ */ React.createElement(Text, { key: x.key, style: { color: x.color } }, outcome.deltas[x.key] > 0 ? "+" : "", outcome.deltas[x.key], " ", x.label))), /* @__PURE__ */ React.createElement(
      PrimaryButton,
      {
        label: outcome.died ? "Choisir la suite" : "\xC9v\xE9nement suivant",
        onPress: onContinue
      }
    )) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(View, { style: s.eventIcon }, /* @__PURE__ */ React.createElement(Icon, { name: "feather", size: 28, color: C.purple })), /* @__PURE__ */ React.createElement(Text, { style: s.eventYear }, state.year), /* @__PURE__ */ React.createElement(Text, { style: s.eventTitle }, event.title), /* @__PURE__ */ React.createElement(Text, { style: s.eventBody }, event.body), /* @__PURE__ */ React.createElement(View, { style: s.choices }, event.choices.map((c, i) => /* @__PURE__ */ React.createElement(
      ChoiceButton,
      {
        key: c.label,
        index: i,
        label: c.label,
        hint: c.hint,
        effects: effectText(event, i),
        onPress: () => onChoice(i)
      }
    )))))
  ));
}
function FamilyTab({ state }) {
  const people = [
    ...state.spouse ? [{ ...state.spouse, role: "Conjoint" }] : [],
    ...state.children.map((c) => ({
      ...c,
      role: c.relation === "adopted" ? "Enfant adopt\xE9" : "Enfant"
    }))
  ];
  return /* @__PURE__ */ React.createElement(ScrollView, { style: s.tab, contentContainerStyle: s.tabBody }, /* @__PURE__ */ React.createElement(Text, { style: s.pageTitle }, "Famille"), /* @__PURE__ */ React.createElement(Text, { style: s.pageSub }, "La maison ", state.current.lastName), /* @__PURE__ */ React.createElement(View, { style: s.currentCard }, /* @__PURE__ */ React.createElement(
    Avatar,
    {
      name: state.current.firstName,
      sex: state.current.sex,
      size: 68
    }
  ), /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: s.currentOver }, "PERSONNAGE ACTUEL"), /* @__PURE__ */ React.createElement(Text, { style: s.currentName }, state.current.firstName, " ", state.current.lastName), /* @__PURE__ */ React.createElement(Text, { style: s.muted }, state.current.age, " ans \xB7 g\xE9n\xE9ration ", state.generation))), /* @__PURE__ */ React.createElement(Text, { style: s.sectionTitle }, "Proches"), people.length ? people.map((p) => /* @__PURE__ */ React.createElement(View, { key: p.id, style: s.personRow }, /* @__PURE__ */ React.createElement(Avatar, { name: p.firstName, sex: p.sex, size: 50 }), /* @__PURE__ */ React.createElement(View, null, /* @__PURE__ */ React.createElement(Text, { style: s.rowTitle }, p.firstName, " ", p.lastName), /* @__PURE__ */ React.createElement(Text, { style: s.muted }, p.role, " \xB7 ", p.age, " ans")))) : /* @__PURE__ */ React.createElement(View, { style: s.empty }, /* @__PURE__ */ React.createElement(Icon, { name: "account-group-outline", size: 34, color: C.blue }), /* @__PURE__ */ React.createElement(Text, null, "Ta lign\xE9e commence ici"), /* @__PURE__ */ React.createElement(Text, null, "Les rencontres et les enfants appara\xEEtront dans Vie.")));
}
function WealthTab({ state }) {
  const items = [
    ...state.properties.map((x) => ({
      name: x,
      type: "Propri\xE9t\xE9",
      icon: "home-outline"
    })),
    ...state.companies.map((x) => ({
      name: x,
      type: "Entreprise",
      icon: "store-outline"
    }))
  ];
  return /* @__PURE__ */ React.createElement(ScrollView, { style: s.tab, contentContainerStyle: s.tabBody }, /* @__PURE__ */ React.createElement(Text, { style: s.pageTitle }, "Patrimoine"), /* @__PURE__ */ React.createElement(Text, { style: s.pageSub }, "Ce que la famille poss\xE8de"), /* @__PURE__ */ React.createElement(View, { style: s.moneyCard }, /* @__PURE__ */ React.createElement(Text, { style: s.darkOver }, "FORTUNE DISPONIBLE"), /* @__PURE__ */ React.createElement(Text, { style: s.moneyValue }, formatMoney(state.stats.money)), /* @__PURE__ */ React.createElement(View, { style: s.moneyFooter }, /* @__PURE__ */ React.createElement(Text, { style: s.darkMuted }, "Maximum atteint"), /* @__PURE__ */ React.createElement(Text, { style: s.darkStrong }, formatMoney(state.maxMoney)))), /* @__PURE__ */ React.createElement(Text, { style: s.sectionTitle }, "Biens et entreprises"), items.length ? items.map((x) => /* @__PURE__ */ React.createElement(View, { key: x.name, style: s.assetRow }, /* @__PURE__ */ React.createElement(View, { style: s.assetIcon }, /* @__PURE__ */ React.createElement(Icon, { name: x.icon, size: 23, color: C.green })), /* @__PURE__ */ React.createElement(View, { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Text, { style: s.rowTitle }, x.name), /* @__PURE__ */ React.createElement(Text, { style: s.muted }, x.type)), /* @__PURE__ */ React.createElement(Icon, { name: "chevron-right", size: 21, color: C.muted }))) : /* @__PURE__ */ React.createElement(View, { style: s.empty }, /* @__PURE__ */ React.createElement(Icon, { name: "home-plus-outline", size: 34, color: C.green }), /* @__PURE__ */ React.createElement(Text, null, "Aucun patrimoine"), /* @__PURE__ */ React.createElement(Text, null, "Les premiers biens se gagnent par tes d\xE9cisions.")));
}
function LegacyTab({ state, best }) {
  return /* @__PURE__ */ React.createElement(ScrollView, { style: s.tab, contentContainerStyle: s.tabBody }, /* @__PURE__ */ React.createElement(Text, { style: s.pageTitle }, "H\xE9ritage"), /* @__PURE__ */ React.createElement(Text, { style: s.pageSub }, state.year - state.founderYear, " ans d\u2019histoire"), /* @__PURE__ */ React.createElement(View, { style: s.scoreCard }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 28, color: C.gold }), /* @__PURE__ */ React.createElement(Text, { style: s.darkOver }, "SCORE ACTUEL"), /* @__PURE__ */ React.createElement(Text, { style: s.scoreValue }, score(state).toLocaleString("fr-FR")), /* @__PURE__ */ React.createElement(Text, { style: s.darkMuted }, "Record : ", best.toLocaleString("fr-FR"))), /* @__PURE__ */ React.createElement(View, { style: s.legacyNumbers }, /* @__PURE__ */ React.createElement(View, { style: s.legacyItem }, /* @__PURE__ */ React.createElement(Text, { style: s.legacyValue }, state.generation), /* @__PURE__ */ React.createElement(Text, { style: s.legacyLabel }, "G\xE9n\xE9rations")), /* @__PURE__ */ React.createElement(View, { style: s.legacyItem }, /* @__PURE__ */ React.createElement(Text, { style: s.legacyValue }, state.totalDescendants), /* @__PURE__ */ React.createElement(Text, { style: s.legacyLabel }, "Descendants")), /* @__PURE__ */ React.createElement(View, { style: s.legacyItem }, /* @__PURE__ */ React.createElement(Text, { style: s.legacyValue }, state.properties.length + state.companies.length), /* @__PURE__ */ React.createElement(Text, { style: s.legacyLabel }, "Actifs"))), /* @__PURE__ */ React.createElement(Text, { style: s.sectionTitle }, "Chronique"), [...state.chronicle].reverse().slice(0, 8).map((e, i) => /* @__PURE__ */ React.createElement(View, { key: e.year + "-" + i, style: s.journalRow }, /* @__PURE__ */ React.createElement(Text, { style: s.journalYear }, e.year), /* @__PURE__ */ React.createElement(View, { style: s.journalDot }), /* @__PURE__ */ React.createElement(Text, { style: s.journalText }, e.text))));
}
function Tabs({ tab, onChange }) {
  const data = [
    ["life", "Vie", "cards-outline"],
    ["family", "Famille", "account-group-outline"],
    ["wealth", "Patrimoine", "home-city-outline"],
    ["legacy", "H\xE9ritage", "crown-outline"]
  ];
  return /* @__PURE__ */ React.createElement(View, { style: s.tabs }, data.map(([id2, label, icon]) => /* @__PURE__ */ React.createElement(Pressable, { key: id2, style: s.tabButton, onPress: () => onChange(id2) }, /* @__PURE__ */ React.createElement(
    Icon,
    {
      name: icon,
      size: 23,
      color: tab === id2 ? C.purple : C.muted
    }
  ), /* @__PURE__ */ React.createElement(Text, { style: [s.tabLabel, tab === id2 && s.tabLabelActive] }, label))));
}
function ChildNameModal({
  state,
  onSave
}) {
  const [name, setName] = useState(
    state.pendingChild?.sex === "F" ? "Louise" : "Louis"
  );
  return /* @__PURE__ */ React.createElement(Modal, { animationType: "slide", transparent: true }, /* @__PURE__ */ React.createElement(
    KeyboardAvoidingView,
    {
      style: s.modalShade,
      behavior: Platform.OS === "ios" ? "padding" : void 0
    },
    /* @__PURE__ */ React.createElement(View, { style: s.modalCard }, /* @__PURE__ */ React.createElement(View, { style: s.modalHandle }), /* @__PURE__ */ React.createElement(Avatar, { name, sex: state.pendingChild?.sex ?? "F", size: 84 }), /* @__PURE__ */ React.createElement(Text, { style: s.modalOver }, "UNE NAISSANCE"), /* @__PURE__ */ React.createElement(Text, { style: s.modalTitle }, state.pendingChild?.sex === "F" ? "Une fille" : "Un gar\xE7on", " ", "rejoint la famille"), /* @__PURE__ */ React.createElement(Text, { style: s.modalText }, "Choisis son pr\xE9nom. Son sexe a \xE9t\xE9 d\xE9termin\xE9 par le jeu."), /* @__PURE__ */ React.createElement(View, { style: s.field }, /* @__PURE__ */ React.createElement(Text, null, "PR\xC9NOM"), /* @__PURE__ */ React.createElement(
      TextInput,
      {
        style: s.fieldInput,
        autoFocus: true,
        value: name,
        onChangeText: setName,
        maxLength: 18
      }
    )), /* @__PURE__ */ React.createElement(
      PrimaryButton,
      {
        disabled: name.trim().length < 2,
        label: "Bienvenue " + name.trim(),
        onPress: () => onSave(name)
      }
    ))
  ));
}
function HeirScreen({
  state,
  onChoose,
  onEnd
}) {
  const list = heirs(state), [selected, setSelected] = useState(list[0]?.id ?? "");
  if (!list.length)
    return /* @__PURE__ */ React.createElement(SafeAreaView, { style: s.endSimple }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 55, color: C.gold }), /* @__PURE__ */ React.createElement(Text, null, "La lign\xE9e s\u2019\xE9teint"), /* @__PURE__ */ React.createElement(Text, null, "Aucun enfant ne peut reprendre le nom ", state.current.lastName, "."), /* @__PURE__ */ React.createElement(PrimaryButton, { label: "Voir le bilan", onPress: onEnd }));
  return /* @__PURE__ */ React.createElement(SafeAreaView, { style: s.screen }, /* @__PURE__ */ React.createElement(View, { style: s.heirHead }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 25, color: C.gold }), /* @__PURE__ */ React.createElement(Text, { style: s.heirTitle }, "Choisir un h\xE9ritier"), /* @__PURE__ */ React.createElement(Text, { style: s.heirSub }, "Qui poursuivra l\u2019histoire des ", state.current.lastName, " ?")), /* @__PURE__ */ React.createElement(ScrollView, { contentContainerStyle: s.heirList }, list.map((h) => /* @__PURE__ */ React.createElement(
    Pressable,
    {
      key: h.id,
      onPress: () => setSelected(h.id),
      style: [s.heirCard, selected === h.id && s.heirSelected]
    },
    /* @__PURE__ */ React.createElement(Avatar, { name: h.firstName, sex: h.sex, size: 76 }),
    /* @__PURE__ */ React.createElement(View, { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(Text, { style: s.currentName }, h.firstName, " ", h.lastName), /* @__PURE__ */ React.createElement(Text, { style: s.muted }, h.age, " ans \xB7 ", h.age >= 18 ? h.profession : "enfant"), /* @__PURE__ */ React.createElement(Text, { style: s.heirHint }, h.age < 18 ? "La partie avancera jusqu\u2019\xE0 ses 18 ans." : "Pr\xEAt \xE0 reprendre la dynastie.")),
    selected === h.id ? /* @__PURE__ */ React.createElement(View, { style: s.check }, /* @__PURE__ */ React.createElement(Icon, { name: "check", size: 18, color: "white" })) : null
  ))), /* @__PURE__ */ React.createElement(View, { style: s.fixedAction }, /* @__PURE__ */ React.createElement(
    PrimaryButton,
    {
      disabled: !selected,
      label: "Continuer avec " + (list.find((h) => h.id === selected)?.firstName ?? ""),
      onPress: () => onChoose(selected)
    }
  )));
}
function Summary({
  state,
  best,
  onRestart
}) {
  const finalScore = score(state);
  return /* @__PURE__ */ React.createElement(SafeAreaView, { style: s.summary }, /* @__PURE__ */ React.createElement(ScrollView, { contentContainerStyle: s.summaryBody }, /* @__PURE__ */ React.createElement(Icon, { name: "crown-outline", size: 34, color: C.gold }), /* @__PURE__ */ React.createElement(Text, { style: s.summaryOver }, "DYNASTIE ", state.current.lastName.toUpperCase()), /* @__PURE__ */ React.createElement(Text, { style: s.summaryScore }, finalScore.toLocaleString("fr-FR")), /* @__PURE__ */ React.createElement(Text, { style: s.summaryPoints }, "POINTS"), finalScore >= best ? /* @__PURE__ */ React.createElement(Text, { style: s.newRecord }, "NOUVEAU RECORD") : null, /* @__PURE__ */ React.createElement(View, { style: s.summaryGrid }, /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, state.generation), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "G\xE9n\xE9rations")), /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, state.year), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "Ann\xE9e finale")), /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, state.totalDescendants), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "Descendants")), /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, formatMoney(state.maxMoney)), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "Fortune max.")), /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, formatMoney(state.stats.money)), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "Fortune finale")), /* @__PURE__ */ React.createElement(View, { style: s.summaryItem }, /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemValue }, state.properties.length + state.companies.length), /* @__PURE__ */ React.createElement(Text, { style: s.summaryItemLabel }, "Patrimoine"))), state.notablePeople.length ? /* @__PURE__ */ React.createElement(View, { style: s.summarySection }, /* @__PURE__ */ React.createElement(Text, null, "Personnages remarquables"), state.notablePeople.map((x) => /* @__PURE__ */ React.createElement(Text, { key: x }, "\u2022 ", x))) : null, /* @__PURE__ */ React.createElement(View, { style: s.summarySection }, /* @__PURE__ */ React.createElement(Text, null, "Derniers \xE9v\xE9nements"), state.chronicle.slice(-4).map((e, i) => /* @__PURE__ */ React.createElement(Text, { key: i }, e.year, " \u2014 ", e.text)))), /* @__PURE__ */ React.createElement(View, { style: s.fixedAction }, /* @__PURE__ */ React.createElement(PrimaryButton, { label: "Nouvelle dynastie", onPress: onRestart })));
}
function App() {
  const [screen, setScreen] = useState("start"), [tab, setTab] = useState("life"), [state, setState] = useState(null), [event, setEvent] = useState(null), [outcome, setOutcome] = useState(null), [best, setBest] = useState(0), [hasSave, setHasSave] = useState(false);
  useEffect(() => {
    Promise.all([loadBest(), loadRun()]).then(([b, r]) => {
      setBest(b);
      setHasSave(Boolean(r));
    });
  }, []);
  const persist = (next) => {
    setState(next);
    setHasSave(true);
    void saveRun(next);
  };
  const start = (founder) => {
    const next = createGame(founder);
    persist(next);
    setEvent(nextEvent(next));
    setOutcome(null);
    setTab("life");
    setScreen("game");
  };
  const resume = async () => {
    const next = await loadRun();
    if (!next) return;
    setState(next);
    setEvent(nextEvent(next));
    setOutcome(null);
    setTab("life");
    setScreen(
      next.current.alive ? "game" : heirs(next).length ? "heir" : "summary"
    );
  };
  const choose = (index) => {
    if (!state || !event || outcome) return;
    const choice = event.choices[index];
    if (!choice) return;
    const result = applyChoice(state, event, choice);
    persist(result.state);
    setOutcome(result);
  };
  const continueLife = () => {
    if (!state || !outcome) return;
    if (outcome.died) {
      setOutcome(null);
      setScreen(heirs(state).length ? "heir" : "summary");
      return;
    }
    setEvent(nextEvent(state));
    setOutcome(null);
  };
  const saveChild = (name) => {
    if (!state) return;
    const next = namePendingChild(state, name);
    persist(next);
    setEvent(nextEvent(next));
    setOutcome(null);
  };
  const pickHeir = (id2) => {
    if (!state) return;
    const next = chooseHeir(state, id2);
    persist(next);
    setEvent(nextEvent(next));
    setOutcome(null);
    setTab("life");
    setScreen("game");
  };
  const finish = async () => {
    if (!state) return;
    const value = score(state), nextBest = Math.max(best, value);
    setBest(nextBest);
    await saveBest(nextBest);
    await clearRun();
    setHasSave(false);
    setScreen("summary");
  };
  useEffect(() => {
    if (screen === "summary" && state) {
      void finish();
    }
  }, [screen]);
  const active = useMemo(
    () => state && event ? tab === "life" ? /* @__PURE__ */ React.createElement(
      LifeTab,
      {
        state,
        event,
        outcome,
        onChoice: choose,
        onContinue: continueLife
      }
    ) : tab === "family" ? /* @__PURE__ */ React.createElement(FamilyTab, { state }) : tab === "wealth" ? /* @__PURE__ */ React.createElement(WealthTab, { state }) : /* @__PURE__ */ React.createElement(LegacyTab, { state, best }) : null,
    [state, event, tab, outcome, best]
  );
  return /* @__PURE__ */ React.createElement(SafeAreaProvider, null, /* @__PURE__ */ React.createElement(
    StatusBar,
    {
      style: screen === "game" && tab === "life" ? "light" : "dark"
    }
  ), screen === "start" ? /* @__PURE__ */ React.createElement(
    StartScreen,
    {
      best,
      hasSave,
      onNew: () => setScreen("setup"),
      onResume: resume
    }
  ) : screen === "setup" ? /* @__PURE__ */ React.createElement(SetupScreen, { onBack: () => setScreen("start"), onCreate: start }) : screen === "game" && state ? /* @__PURE__ */ React.createElement(View, { style: s.game }, /* @__PURE__ */ React.createElement(
    SafeAreaView,
    {
      edges: ["top"],
      style: [s.gameSafe, tab !== "life" && { backgroundColor: C.paper }]
    },
    active
  ), /* @__PURE__ */ React.createElement(Tabs, { tab, onChange: setTab }), state.pendingChild ? /* @__PURE__ */ React.createElement(ChildNameModal, { state, onSave: saveChild }) : null) : screen === "heir" && state ? /* @__PURE__ */ React.createElement(
    HeirScreen,
    {
      state,
      onChoose: pickHeir,
      onEnd: () => setScreen("summary")
    }
  ) : screen === "summary" && state ? /* @__PURE__ */ React.createElement(
    Summary,
    {
      state,
      best,
      onRestart: () => {
        setState(null);
        setScreen("setup");
      }
    }
  ) : null);
}
var s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper },
  start: { flex: 1, backgroundColor: C.paper, paddingHorizontal: 24 },
  startBrand: { alignItems: "center", marginTop: 70 },
  startTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 50,
    color: C.ink,
    marginTop: 8
  },
  startSub: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: C.gold,
    marginTop: 8
  },
  startArt: { flex: 1, alignItems: "center", justifyContent: "center" },
  lineageLine: {
    position: "absolute",
    height: 2,
    width: 210,
    backgroundColor: C.line
  },
  startFaces: { flexDirection: "row", alignItems: "center", gap: -8 },
  startYears: {
    marginTop: 28,
    fontSize: 11,
    letterSpacing: 2,
    color: C.muted,
    fontWeight: "700"
  },
  startActions: { paddingBottom: 24, gap: 12 },
  record: { textAlign: "center", fontSize: 12, color: C.muted, marginTop: 5 },
  resume: {
    height: 52,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.card
  },
  primary: {
    minHeight: 56,
    borderRadius: 17,
    backgroundColor: C.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18
  },
  primaryText: { color: "white", fontSize: 16, fontWeight: "800" },
  disabled: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    overflow: "hidden"
  },
  avatarInitial: {
    position: "absolute",
    bottom: 4,
    right: 8,
    fontWeight: "900",
    color: "rgba(23,34,53,.45)"
  },
  nativeHeader: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.card
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: C.gold,
    textAlign: "center"
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: C.ink
  },
  setupBody: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingBottom: 120
  },
  founderCaption: { marginTop: 10, color: C.muted, fontSize: 13 },
  sexSwitch: {
    flexDirection: "row",
    backgroundColor: "#ECE8E1",
    borderRadius: 16,
    padding: 4,
    marginTop: 26,
    width: "100%"
  },
  sexChoice: {
    height: 48,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13
  },
  sexActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8
  },
  field: { width: "100%", marginTop: 18 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: C.muted,
    marginBottom: 7
  },
  fieldInput: {
    height: 54,
    borderRadius: 15,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: "700",
    color: C.ink,
    width: "100%"
  },
  fieldText: {},
  origin: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFF9EC",
    borderRadius: 16,
    padding: 15,
    marginTop: 22
  },
  fixedAction: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Math.max(16, Platform.OS === "ios" ? 20 : 16),
    backgroundColor: C.paper
  },
  game: { flex: 1, backgroundColor: C.paper },
  gameSafe: { flex: 1, backgroundColor: C.navy },
  life: { flex: 1, backgroundColor: C.navy },
  topbar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10
  },
  personName: { color: "white", fontWeight: "800", fontSize: 14 },
  personSub: { color: "rgba(255,255,255,.62)", fontSize: 11, marginTop: 2 },
  genPill: {
    height: 36,
    paddingHorizontal: 11,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,.1)",
    flexDirection: "row",
    gap: 5,
    alignItems: "center"
  },
  statStrip: {
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 7
  },
  statMini: {
    flex: 1,
    height: 39,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,.09)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  lifeScroll: { padding: 16, paddingBottom: 28 },
  eventLabel: {
    color: "#DFC886",
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12
  },
  eventCard: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 20,
    minHeight: 470
  },
  eventIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F0EDFC",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  },
  eventYear: {
    textAlign: "center",
    fontSize: 11,
    color: C.muted,
    marginTop: 10
  },
  eventTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    textAlign: "center",
    color: C.ink,
    marginTop: 8
  },
  eventBody: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: C.muted,
    marginTop: 12
  },
  choices: { gap: 10, marginTop: 24 },
  choice: {
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: "#F8F8F7",
    borderWidth: 1,
    borderColor: C.line,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 11
  },
  choiceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  choiceLabel: { fontSize: 14, fontWeight: "800", color: C.ink },
  choiceHint: { fontSize: 11, color: C.muted, marginTop: 2 },
  choiceEffect: {
    fontSize: 10,
    color: C.green,
    fontWeight: "700",
    marginTop: 7
  },
  outcome: { flex: 1, alignItems: "center", justifyContent: "center" },
  outcomeIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center"
  },
  outcomeOver: {
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: "900",
    color: C.purple,
    marginTop: 18
  },
  outcomeText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    lineHeight: 30,
    textAlign: "center",
    color: C.ink,
    marginTop: 12
  },
  deltaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginVertical: 22
  },
  tabs: {
    height: 84,
    paddingBottom: Platform.OS === "ios" ? 18 : 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: C.line,
    flexDirection: "row"
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  tabLabel: { fontSize: 9, color: C.muted },
  tabLabelActive: { color: C.purple, fontWeight: "800" },
  tab: { flex: 1, backgroundColor: C.paper },
  tabBody: { padding: 20, paddingBottom: 38 },
  pageTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 34,
    color: C.ink
  },
  pageSub: { color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 24 },
  currentCard: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: C.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  currentOver: {
    fontSize: 9,
    color: C.gold,
    fontWeight: "900",
    letterSpacing: 1
  },
  currentName: { fontSize: 17, fontWeight: "800", color: C.ink, marginTop: 4 },
  muted: { fontSize: 12, color: C.muted, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.ink,
    marginTop: 28,
    marginBottom: 12
  },
  personRow: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 9
  },
  empty: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 8
  },
  emptyText: {},
  moneyCard: { backgroundColor: C.navy, borderRadius: 24, padding: 22 },
  darkOver: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: C.gold,
    marginTop: 8
  },
  moneyValue: { fontSize: 34, fontWeight: "900", color: "white", marginTop: 7 },
  moneyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,.12)",
    marginTop: 20,
    paddingTop: 14
  },
  darkMuted: { fontSize: 11, color: "rgba(255,255,255,.58)" },
  darkStrong: { fontSize: 12, fontWeight: "800", color: "white" },
  assetRow: {
    height: 74,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 9
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8F3EC",
    alignItems: "center",
    justifyContent: "center"
  },
  rowTitle: { fontSize: 14, fontWeight: "800", color: C.ink },
  scoreCard: {
    backgroundColor: C.navy,
    borderRadius: 24,
    padding: 22,
    alignItems: "center"
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    marginVertical: 6
  },
  legacyNumbers: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 20,
    marginTop: 12,
    paddingVertical: 18
  },
  legacyItem: { flex: 1, alignItems: "center" },
  legacyValue: {
    fontSize: 24,
    fontWeight: "900",
    color: C.ink,
    textAlign: "center"
  },
  legacyLabel: {
    fontSize: 9,
    color: C.muted,
    textAlign: "center",
    marginTop: 3
  },
  traitList: {},
  journalRow: { flexDirection: "row", gap: 11, marginBottom: 16 },
  journalYear: { width: 36, fontSize: 11, fontWeight: "800", color: C.gold },
  journalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.purple,
    marginTop: 4
  },
  journalText: { flex: 1, fontSize: 12, lineHeight: 18, color: C.muted },
  modalShade: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(10,18,28,.45)"
  },
  modalCard: {
    backgroundColor: C.paper,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 34,
    alignItems: "center"
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D8D3CB",
    marginBottom: 20
  },
  modalOver: {
    fontSize: 9,
    letterSpacing: 1.7,
    color: C.gold,
    fontWeight: "900",
    marginTop: 14
  },
  modalTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 25,
    textAlign: "center",
    color: C.ink,
    marginTop: 7
  },
  modalText: {
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    marginTop: 8
  },
  heirHead: { alignItems: "center", padding: 22 },
  heirTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 27,
    fontWeight: "700",
    color: C.ink,
    marginTop: 8
  },
  heirSub: { fontSize: 12, color: C.muted, marginTop: 5 },
  heirList: { padding: 16, paddingBottom: 110 },
  heirCard: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 12,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    marginBottom: 11
  },
  heirSelected: { borderColor: C.green },
  heirHint: { fontSize: 10, color: C.green, marginTop: 10 },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center"
  },
  endSimple: {
    flex: 1,
    backgroundColor: C.paper,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 16
  },
  summary: { flex: 1, backgroundColor: C.paper },
  summaryBody: { padding: 24, paddingBottom: 120, alignItems: "center" },
  summaryOver: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.gold,
    fontWeight: "900",
    marginTop: 12
  },
  summaryScore: { fontSize: 52, fontWeight: "900", color: C.ink, marginTop: 8 },
  summaryPoints: { fontSize: 10, letterSpacing: 2, color: C.muted },
  newRecord: { color: C.green, fontWeight: "900", fontSize: 11, marginTop: 10 },
  summaryGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: C.card,
    borderRadius: 22,
    marginTop: 24
  },
  summaryItem: {
    width: "50%",
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: C.line
  },
  summaryItemValue: { fontSize: 20, fontWeight: "900", color: C.ink },
  summaryItemLabel: {
    fontSize: 9,
    color: C.muted,
    marginTop: 4,
    textTransform: "uppercase"
  },
  summarySection: {
    width: "100%",
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    marginTop: 14
  }
});
export {
  App as default
};
