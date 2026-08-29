import type { GameEvent } from "./types";

export const EVENTS: GameEvent[] = [
  {
    id: "job",
    title: "Une place à l’atelier",
    body: "Le maître imprimeur cherche une paire de mains fiable. Le salaire est maigre, mais le métier ouvre des portes.",
    choices: [
      {
        label: "Accepter",
        hint: "Apprendre un métier",
        effects: { money: 6, reputation: 4, health: -3 },
        result:
          "Tu apprends vite. L’encre s’incruste partout, sauf dans les comptes.",
        flags: ["printer"],
      },
      {
        label: "Chercher mieux",
        hint: "Rester libre",
        effects: { money: -3, happiness: 5, reputation: -2 },
        result: "Tu refuses. La liberté est grisante et assez peu rentable.",
      },
    ],
  },
  {
    id: "workshop",
    title: "La boutique aux volets bleus",
    body: "Un artisan sans héritier vend son petit atelier. Le toit fuit, mais la clientèle est fidèle.",
    requires: "printer",
    excludes: "workshop",
    choices: [
      {
        label: "Acheter l’atelier",
        hint: "Investir dans l’avenir",
        effects: { money: -12, reputation: 8, happiness: 3 },
        result: "L’atelier devient le premier actif de la famille.",
        flags: ["workshop"],
        property: "Atelier aux volets bleus",
      },
      {
        label: "Garder l’argent",
        hint: "Éviter la dette",
        effects: { money: 5, happiness: -2 },
        result: "Un concurrent l’achète et repeint les volets en beige.",
      },
    ],
  },
  {
    id: "meeting",
    title: "Sous le même parapluie",
    body: "Une connaissance te raccompagne sous une pluie obstinée. La conversation dure bien après l’averse.",
    minAge: 20,
    maxAge: 52,
    needsNoSpouse: true,
    choices: [
      {
        label: "Proposer une promenade",
        hint: "Écouter le cœur",
        effects: { happiness: 14, relations: 10, reputation: 2 },
        result: "La promenade devient une habitude, puis une vie commune.",
        spouse: "gain",
      },
      {
        label: "Rentrer seul",
        hint: "Ne rien précipiter",
        effects: { happiness: -4, money: 3 },
        result: "Tu rentres au sec, avec une excellente analyse de la météo.",
      },
    ],
  },
  {
    id: "baby",
    title: "Une chambre de plus",
    body: "Votre foyer pourrait accueillir un enfant. Le budget proteste déjà.",
    minAge: 23,
    maxAge: 47,
    needsSpouse: true,
    choices: [
      {
        label: "Agrandir la famille",
        hint: "Une nouvelle branche",
        effects: { money: -7, happiness: 13, health: -3 },
        result: "Un enfant va rejoindre la famille.",
        child: "birth",
      },
      {
        label: "Attendre encore",
        hint: "Consolider le foyer",
        effects: { money: 6, happiness: -3 },
        result: "Vous repoussez la décision pour quelques années.",
      },
    ],
  },
  {
    id: "rail",
    title: "Des rails dans le verger",
    body: "La compagnie ferroviaire veut acheter une terre familiale. Elle promet fortune, fumée et ponctualité.",
    maxYear: 1910,
    choices: [
      {
        label: "Vendre la parcelle",
        hint: "De l’argent maintenant",
        effects: { money: 16, reputation: -3 },
        result: "Le train passe. La bourse s’alourdit et le verger disparaît.",
      },
      {
        label: "Refuser le tracé",
        hint: "Préserver la terre",
        effects: { money: -4, reputation: 9, relations: 5 },
        result:
          "Les ingénieurs contournent la propriété avec une rancune méthodique.",
        property: "Verger familial",
      },
    ],
  },
  {
    id: "strike",
    title: "La grève devant l’usine",
    body: "Les ouvriers réclament des journées moins interminables. Ton employeur veut des noms.",
    minYear: 1860,
    maxYear: 1930,
    choices: [
      {
        label: "Soutenir la grève",
        hint: "La solidarité a un prix",
        effects: { money: -7, reputation: 9, relations: 12, health: -4 },
        result: "Ton nom circule dans les ateliers avec reconnaissance.",
        flags: ["workers"],
      },
      {
        label: "Protéger ton poste",
        hint: "Choisir la sécurité",
        effects: { money: 10, reputation: -10, relations: -8 },
        result: "Ton poste est sauf. Ta réputation beaucoup moins.",
        flags: ["informer"],
      },
    ],
  },
  {
    id: "house",
    title: "La maison de la colline",
    body: "Une demeure solide est à vendre. Trop grande aujourd’hui, parfaite pour une dynastie.",
    choices: [
      {
        label: "Acheter la maison",
        hint: "Ancrer la famille",
        effects: { money: -18, happiness: 10, reputation: 8 },
        result:
          "La clé est lourde. La maison accueillera plusieurs générations.",
        property: "Maison de la colline",
        flags: ["family_home"],
      },
      {
        label: "Investir autrement",
        hint: "Faire travailler l’argent",
        effects: { money: 10, happiness: -3 },
        result: "Le capital grandit. La cuisine reste minuscule.",
      },
    ],
  },
  {
    id: "epidemic",
    title: "La fièvre gagne le quartier",
    body: "Les lits manquent. Les rumeurs courent plus vite que les médecins.",
    maxYear: 1920,
    choices: [
      {
        label: "Aider au dispensaire",
        hint: "Utile mais dangereux",
        effects: { health: -18, reputation: 13, relations: 8 },
        result: "Tu aides jusqu’à l’épuisement. Le quartier n’oubliera pas.",
      },
      {
        label: "Partir à la campagne",
        hint: "Protéger les proches",
        effects: { money: -9, health: 8, reputation: -3 },
        result: "La famille évite le pire au milieu des poules.",
      },
    ],
  },
  {
    id: "company",
    title: "Mettre le nom sur la façade",
    body: "L’atelier peut devenir une vraie entreprise. Il faut emprunter, recruter et dormir moins.",
    requires: "workshop",
    excludes: "company",
    choices: [
      {
        label: "Fonder l’entreprise",
        hint: "Tout risquer",
        effects: { money: -15, reputation: 16, relations: 7, health: -6 },
        result: "La maison familiale ouvre ses portes.",
        company: "Maison familiale",
        flags: ["company"],
      },
      {
        label: "Rester artisan",
        hint: "Préserver l’équilibre",
        effects: { money: 6, happiness: 8, reputation: 3 },
        result:
          "Tu choisis la qualité, les siestes et une comptabilité lisible.",
      },
    ],
  },
  {
    id: "inherit_company",
    title: "La vieille maison familiale",
    body: "L’entreprise des aïeux décline. Un concurrent propose de la racheter.",
    requires: "company",
    minYear: 1880,
    choices: [
      {
        label: "La relancer",
        hint: "Honorer le nom",
        effects: { money: -12, reputation: 16, relations: 10, health: -4 },
        result: "La maison repart, plus moderne et presque solvable.",
        flags: ["company_saved"],
      },
      {
        label: "La vendre",
        hint: "Transformer le passé en capital",
        effects: { money: 25, reputation: -8, happiness: 5 },
        result: "La façade change de nom. Le compte familial respire.",
        removeFlags: ["company"],
      },
    ],
  },
  {
    id: "school",
    title: "Les études d’un enfant",
    body: "Un professeur remarque un talent rare chez l’un de tes enfants. Les études coûteront cher.",
    needsSpouse: true,
    choices: [
      {
        label: "Payer les études",
        hint: "Investir dans la prochaine génération",
        effects: { money: -12, happiness: 8, reputation: 6 },
        result: "L’enfant part étudier. Ce choix pèsera longtemps.",
        flags: ["educated_heir"],
      },
      {
        label: "Aider à l’atelier",
        hint: "La famille d’abord",
        effects: { money: 8, happiness: -6, relations: -4 },
        result: "Une paire de mains rejoint le travail familial.",
      },
    ],
  },
  {
    id: "scandal",
    title: "Le carnet dans le secrétaire",
    body: "Tu découvres une dette honteuse contractée par un parent. La ville adore déjà l’histoire.",
    choices: [
      {
        label: "Tout reconnaître",
        hint: "Payer et garder la face",
        effects: { money: -12, reputation: 9, happiness: -3 },
        result: "L’honnêteté ruine le scandale avant qu’il ne ruine le nom.",
      },
      {
        label: "Brûler le carnet",
        hint: "Espérer l’oubli",
        effects: { reputation: -6, health: -3, money: 4 },
        result: "Le carnet disparaît. Pas l’odeur de papier brûlé.",
        flags: ["hidden_debt"],
      },
    ],
  },
  {
    id: "election",
    title: "On te veut sur la liste",
    body: "Le maire propose une place éligible et promet très peu de réunions. C’est un mensonge élégant.",
    minAge: 30,
    choices: [
      {
        label: "Entrer en politique",
        hint: "Gagner de l’influence",
        effects: { relations: 18, reputation: 8, happiness: -8, money: -4 },
        result: "Tu es élu. Ton sommeil perd dès le premier tour.",
        flags: ["politics"],
      },
      {
        label: "Refuser",
        hint: "Protéger sa vie",
        effects: { happiness: 9, relations: -3 },
        result: "Tu rentres dîner. Le conseil débat encore des bordures.",
      },
    ],
  },
  {
    id: "war",
    title: "L’ordre de mobilisation",
    body: "Une enveloppe officielle arrive. Dans la rue, personne ne sait encore à quel point tout va changer.",
    minYear: 1910,
    maxYear: 1947,
    choices: [
      {
        label: "Répondre à l’appel",
        hint: "Le devoir et le danger",
        effects: { health: -24, reputation: 17, happiness: -12 },
        result: "Tu reviens changé, avec une médaille difficile à regarder.",
        flags: ["veteran"],
      },
      {
        label: "Faire jouer un contact",
        hint: "Échapper au front",
        effects: { money: -15, reputation: -15, health: 7 },
        result: "Tu restes loin du front, mais pas loin des murmures.",
      },
    ],
  },
  {
    id: "crash",
    title: "Le banquier ne sourit plus",
    body: "Les cours s’effondrent. Ton conseiller découvre soudain la modestie.",
    minYear: 1927,
    maxYear: 1936,
    choices: [
      {
        label: "Acheter au plus bas",
        hint: "Courage ou inconscience",
        effects: { money: -15, relations: 6, health: -4 },
        result: "Tu investis quand tout le monde vend.",
        flags: ["crash_investor"],
      },
      {
        label: "Tout retirer",
        hint: "Sauver ce qui reste",
        effects: { money: -5, happiness: -4, health: 3 },
        result:
          "Les économies finissent cachées dans un endroit presque oublié.",
      },
    ],
  },
  {
    id: "television",
    title: "Le monde entre au salon",
    body: "Les voisins se pressent devant une boîte lumineuse. Votre famille pourrait être la première équipée.",
    minYear: 1950,
    maxYear: 1975,
    choices: [
      {
        label: "Acheter le poste",
        hint: "Rassembler le quartier",
        effects: { money: -8, happiness: 12, relations: 7 },
        result: "Le salon devient un petit cinéma.",
        property: "Télévision familiale",
      },
      {
        label: "Garder les livres",
        hint: "Défendre l’ancien monde",
        effects: { reputation: 5, money: 4, happiness: -2 },
        result: "Tu lis avec ostentation près de la fenêtre.",
      },
    ],
  },
  {
    id: "adoption",
    title: "Une famille autrement",
    body: "Une adoption est possible. Les démarches seront longues, mais un enfant attend un foyer.",
    minYear: 1960,
    maxAge: 55,
    choices: [
      {
        label: "Ouvrir le foyer",
        hint: "Créer une autre filiation",
        effects: { money: -10, happiness: 14, reputation: 5 },
        result: "Un enfant va rejoindre votre histoire.",
        child: "adopt",
      },
      {
        label: "Renoncer",
        hint: "Ce n’est pas le moment",
        effects: { happiness: -5, money: 3 },
        result: "Le dossier reste dans un tiroir.",
      },
    ],
  },
  {
    id: "internet",
    title: "Un drôle de réseau",
    body: "Un proche veut brancher la famille à Internet. Le modem semble crier à l’aide.",
    minYear: 1990,
    maxYear: 2008,
    choices: [
      {
        label: "Se connecter",
        hint: "Prendre de l’avance",
        effects: { money: -5, relations: 12, reputation: 6, happiness: 4 },
        result: "La famille entre sur le réseau.",
        flags: ["online"],
      },
      {
        label: "Attendre",
        hint: "Une mode sûrement",
        effects: { money: 5, relations: -7 },
        result: "Internet ne passe pas. Le temps, si.",
      },
    ],
  },
  {
    id: "startup",
    title: "Une idée sur un coin de table",
    body: "Un enfant propose de transformer le vieux savoir-faire familial en service moderne.",
    minYear: 1980,
    requires: "educated_heir",
    choices: [
      {
        label: "Financer le projet",
        hint: "Miser sur la relève",
        effects: { money: -18, reputation: 9, relations: 10 },
        result: "Le projet démarre dans une pièce trop petite.",
        company: "Entreprise numérique",
        flags: ["startup"],
      },
      {
        label: "Refuser",
        hint: "Préserver les économies",
        effects: { money: 7, relations: -9, happiness: -5 },
        result: "L’idée part ailleurs, avec l’enfant vexé.",
      },
    ],
  },
  {
    id: "divorce",
    title: "Deux vies sous un toit",
    body: "Le couple n’est plus qu’une organisation logistique très bien tenue.",
    minAge: 34,
    needsSpouse: true,
    choices: [
      {
        label: "Se séparer",
        hint: "Coûteux mais honnête",
        effects: { money: -12, happiness: 8, reputation: -4 },
        result: "Les biens sont partagés. Les non-dits aussi.",
        spouse: "lose",
      },
      {
        label: "Se reparler",
        hint: "Essayer encore",
        effects: { money: -4, happiness: 10, health: 3 },
        result: "Vous recommencez doucement.",
      },
    ],
  },
  {
    id: "rival",
    title: "Le rival au banquet",
    body: "Une famille concurrente tourne tes réussites en ridicule. Toute la table attend ta réponse.",
    choices: [
      {
        label: "Répondre avec esprit",
        hint: "Briller ou se brûler",
        effects: { reputation: 10, relations: 5, happiness: 3 },
        result: "La salle rit. Ton rival aussi, uniquement avec la bouche.",
      },
      {
        label: "Ne pas s’abaisser",
        hint: "Garder son calme",
        effects: { reputation: -3, health: 4, happiness: 2 },
        result: "Trois jours plus tard, tu trouves la réplique parfaite.",
      },
    ],
  },
  {
    id: "doctor",
    title: "Le médecin insiste",
    body: "Il faudrait ralentir, dormir davantage et laisser quelqu’un d’autre compter les pièces.",
    minAge: 50,
    choices: [
      {
        label: "Lever le pied",
        hint: "Protéger sa santé",
        effects: { money: -8, health: 14, happiness: 8 },
        result: "Les journées raccourcissent. La vie semble plus longue.",
      },
      {
        label: "Continuer",
        hint: "La dynastie avant tout",
        effects: { money: 13, health: -15, reputation: 6 },
        result: "Les affaires prospèrent pendant que le corps proteste.",
      },
    ],
  },
  {
    id: "future",
    title: "L’agent familial",
    body: "Une intelligence artificielle propose de gérer le patrimoine et les disputes du dimanche.",
    minYear: 2025,
    choices: [
      {
        label: "Lui confier les comptes",
        hint: "Efficacité avant contrôle",
        effects: { money: 15, relations: 7, happiness: -5 },
        result: "Les finances prospèrent. L’agent bloque l’oncle René.",
        flags: ["ai"],
      },
      {
        label: "Garder la main",
        hint: "Rester humain",
        effects: { happiness: 8, reputation: 5, money: -3 },
        result: "Tu conserves tes habitudes et tes erreurs.",
      },
    ],
  },
];
