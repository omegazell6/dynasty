import { EVENTS } from "./events";
import type {
  Child,
  Choice,
  ChoiceResult,
  GameEvent,
  GameState,
  Person,
  Sex,
  StatKey,
} from "./types";

const FEMALE = [
  "Adèle",
  "Jeanne",
  "Léonie",
  "Suzanne",
  "Louise",
  "Rose",
  "Clara",
  "Élise",
  "Ana",
  "Nina",
];
const MALE = [
  "Auguste",
  "Jules",
  "Émile",
  "Marcel",
  "Lucien",
  "Gabriel",
  "Louis",
  "Victor",
  "Noé",
  "Léon",
];
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const id = () => Math.random().toString(36).slice(2, 10);
const pick = <T>(a: readonly T[]) =>
  a[Math.floor(Math.random() * a.length)] as T;
const randomSex = (): Sex => (Math.random() < 0.5 ? "F" : "M");
const profession = (year: number, sex: Sex) => {
  const jobs =
    year < 1920
      ? sex === "F"
        ? ["couturière", "institutrice", "relieuse", "négociante"]
        : ["artisan", "instituteur", "relieur", "négociant"]
      : year < 1980
        ? sex === "F"
          ? ["infirmière", "comptable", "journaliste", "architecte"]
          : ["infirmier", "comptable", "journaliste", "architecte"]
        : sex === "F"
          ? ["ingénieure", "médecin", "designer", "entrepreneuse"]
          : ["ingénieur", "médecin", "designer", "entrepreneur"];
  return pick(jobs);
};
const randomName = (sex: Sex) => pick(sex === "F" ? FEMALE : MALE);
const makePerson = (
  firstName: string,
  lastName: string,
  sex: Sex,
  year: number,
  generation: number,
  age = 18,
): Person => ({
  id: id(),
  firstName,
  lastName,
  sex,
  age,
  birthYear: year - age,
  alive: true,
  profession: profession(year, sex),
  generation,
});

export function createGame(founder: {
  firstName: string;
  lastName: string;
  sex: Sex;
}): GameState {
  const current = makePerson(
    founder.firstName.trim(),
    founder.lastName.trim(),
    founder.sex,
    1850,
    1,
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
      relations: 15,
    },
    properties: [],
    companies: [],
    debt: 0,
    flags: [],
    seen: [],
    chronicle: [
      {
        year: 1850,
        text:
          current.firstName +
          " " +
          current.lastName +
          " commence sa vie adulte.",
      },
    ],
    timeline: [{ year: 1850, money: 20, family: 1 }],
    totalDescendants: 0,
    maxMoney: 20,
    notablePeople: [],
    pendingChild: null,
  };
}

function available(state: GameState, event: GameEvent) {
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
export function nextEvent(state: GameState): GameEvent {
  const guided =
    !state.spouse && state.current.age >= 20
      ? EVENTS.find((e) => e.id === "meeting" && available(state, e))
      : state.spouse && state.children.length === 0 && state.current.age <= 47
        ? EVENTS.find((e) => e.id === "baby" && available(state, e))
        : undefined;
  if (guided && !state.seen.slice(-2).includes(guided.id)) return guided;
  const fresh = EVENTS.filter(
    (e) => available(state, e) && !state.seen.slice(-7).includes(e.id),
  );
  return pick(fresh.length ? fresh : EVENTS.filter((e) => available(state, e)));
}

export function applyChoice(
  state: GameState,
  event: GameEvent,
  choice: Choice,
): ChoiceResult {
  const next: GameState = JSON.parse(JSON.stringify(state));
  const before = { ...state.stats };
  const years = 3 + Math.floor(Math.random() * 3);
  next.year += years;
  next.current.age += years;
  next.children.forEach((c) => (c.age += years));
  if (next.spouse) next.spouse.age += years;
  (Object.keys(next.stats) as StatKey[]).forEach(
    (k) => (next.stats[k] = clamp(next.stats[k] + (choice.effects[k] ?? 0))),
  );
  next.stats.health = clamp(
    next.stats.health - (next.current.age > 55 ? 3 : 1),
  );
  next.stats.money = Math.max(0, next.stats.money);
  next.flags = [
    ...new Set(
      next.flags
        .filter((f) => !choice.removeFlags?.includes(f))
        .concat(choice.flags ?? []),
    ),
  ];
  next.seen.push(event.id);
  if (choice.property && !next.properties.includes(choice.property))
    next.properties.push(choice.property);
  if (choice.company && !next.companies.includes(choice.company))
    next.companies.push(
      choice.company.replace("familiale", next.current.lastName),
    );
  if (choice.spouse === "gain") {
    const sex: Sex = next.current.sex === "F" ? "M" : "F";
    next.spouse = makePerson(
      randomName(sex),
      next.current.lastName,
      sex,
      next.year,
      next.generation,
      Math.max(18, next.current.age - 2),
    );
  }
  if (choice.spouse === "lose") next.spouse = null;
  if (choice.child)
    next.pendingChild = {
      sex: randomSex(),
      relation: choice.child === "adopt" ? "adopted" : "biological",
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
    family: 1 + next.children.length + (next.spouse ? 1 : 0),
  });
  next.chronicle.push({ year: next.year, text: choice.result });
  const risk =
    Math.max(0, (next.current.age - 63) * 0.024) +
    (next.stats.health < 20 ? 0.18 : 0);
  const died =
    next.stats.health <= 0 ||
    next.current.age >= 94 ||
    (next.current.age > 63 && Math.random() < risk);
  if (died) {
    next.current.alive = false;
    next.notablePeople.push(
      next.current.firstName +
        " " +
        next.current.lastName +
        " · " +
        next.current.age +
        " ans",
    );
    next.chronicle.push({
      year: next.year,
      text: next.current.firstName + " meurt à " + next.current.age + " ans.",
    });
  }
  const deltas = (Object.keys(next.stats) as StatKey[]).reduce(
    (a, k) => ({ ...a, [k]: next.stats[k] - before[k] }),
    {} as Record<StatKey, number>,
  );
  return { state: next, message: choice.result, deltas, died };
}

export function namePendingChild(
  state: GameState,
  firstName: string,
): GameState {
  if (!state.pendingChild) return state;
  const { sex, relation } = state.pendingChild;
  const next: GameState = JSON.parse(JSON.stringify(state));
  const child: Child = {
    ...makePerson(
      firstName.trim() || randomName(sex),
      next.current.lastName,
      sex,
      next.year,
      next.generation + 1,
      0,
    ),
    relation,
  };
  next.children.push(child);
  next.totalDescendants += 1;
  next.pendingChild = null;
  next.chronicle.push({
    year: next.year,
    text: child.firstName + " " + child.lastName + " rejoint la famille.",
  });
  return next;
}
export const heirs = (state: GameState) =>
  state.children.filter((c) => c.alive);
export function chooseHeir(state: GameState, heirId: string): GameState {
  const next: GameState = JSON.parse(JSON.stringify(state));
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
    text:
      heir.firstName +
      " devient le visage de la génération " +
      next.generation +
      ".",
  });
  return next;
}
export function score(state: GameState) {
  return Math.round(
    (state.year - state.founderYear) * 12 +
      state.generation * 400 +
      state.totalDescendants * 100 +
      state.maxMoney * 11 +
      state.stats.reputation * 8 +
      state.properties.length * 180 +
      state.companies.length * 340 +
      state.notablePeople.length * 120,
  );
}
export const formatMoney = (value: number) =>
  value >= 1000
    ? (value / 1000).toFixed(1) + " M"
    : "€ " + Math.round(value * 1000).toLocaleString("fr-FR");
