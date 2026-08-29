export type Sex = "F" | "M";
export type Tab = "life" | "family" | "wealth" | "legacy";
export type StatKey =
  | "money"
  | "health"
  | "happiness"
  | "reputation"
  | "relations";
export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  sex: Sex;
  age: number;
  birthYear: number;
  alive: boolean;
  profession: string;
  generation: number;
};
export type Child = Person & { relation: "biological" | "adopted" };
export type Choice = {
  label: string;
  hint: string;
  effects: Partial<Record<StatKey, number>>;
  result: string;
  flags?: string[];
  removeFlags?: string[];
  property?: string;
  company?: string;
  child?: "birth" | "adopt";
  spouse?: "gain" | "lose";
};
export type GameEvent = {
  id: string;
  title: string;
  body: string;
  choices: Choice[];
  minYear?: number;
  maxYear?: number;
  minAge?: number;
  maxAge?: number;
  requires?: string;
  excludes?: string;
  needsSpouse?: boolean;
  needsNoSpouse?: boolean;
};
export type Chronicle = { year: number; text: string };
export type Timeline = { year: number; money: number; family: number };
export type GameState = {
  version: 1;
  runId: string;
  year: number;
  generation: number;
  founderYear: number;
  current: Person;
  spouse: Person | null;
  children: Child[];
  stats: Record<StatKey, number>;
  properties: string[];
  companies: string[];
  debt: number;
  flags: string[];
  seen: string[];
  chronicle: Chronicle[];
  timeline: Timeline[];
  totalDescendants: number;
  maxMoney: number;
  notablePeople: string[];
  pendingChild: { sex: Sex; relation: Child["relation"] } | null;
};
export type ChoiceResult = {
  state: GameState;
  message: string;
  deltas: Record<StatKey, number>;
  died: boolean;
};
