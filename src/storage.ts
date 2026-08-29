import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameState } from "./types";
const RUN = "dynasty.native.run.v1",
  BEST = "dynasty.native.best.v1";
export async function saveRun(state: GameState) {
  await AsyncStorage.setItem(RUN, JSON.stringify(state));
}
export async function loadRun() {
  const raw = await AsyncStorage.getItem(RUN);
  return raw ? (JSON.parse(raw) as GameState) : null;
}
export async function clearRun() {
  await AsyncStorage.removeItem(RUN);
}
export async function loadBest() {
  return Number((await AsyncStorage.getItem(BEST)) ?? 0);
}
export async function saveBest(value: number) {
  await AsyncStorage.setItem(BEST, String(value));
}
