import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  applyChoice,
  chooseHeir,
  createGame,
  formatMoney,
  heirs,
  namePendingChild,
  nextEvent,
  score,
} from "./src/engine";
import { clearRun, loadBest, loadRun, saveBest, saveRun } from "./src/storage";
import type {
  ChoiceResult,
  GameEvent,
  GameState,
  Sex,
  StatKey,
  Tab,
} from "./src/types";

type Screen = "start" | "setup" | "game" | "heir" | "summary";
const C = {
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
  purple: "#7667C8",
};
const STAT: Array<{
  key: StatKey;
  label: string;
  icon: string;
  color: string;
}> = [
  { key: "money", label: "Argent", icon: "wallet-outline", color: C.green },
  { key: "health", label: "Santé", icon: "heart-outline", color: C.red },
  {
    key: "happiness",
    label: "Bonheur",
    icon: "emoticon-happy-outline",
    color: C.gold,
  },
  {
    key: "reputation",
    label: "Réputation",
    icon: "star-outline",
    color: C.blue,
  },
];

function Avatar({
  name,
  sex,
  size = 52,
}: {
  name: string;
  sex: Sex;
  size?: number;
}) {
  const color = sex === "F" ? "#E8C2AD" : "#A9C8D4";
  return (
    <View
      style={[
        s.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Icon
        name={sex === "F" ? "face-woman-outline" : "face-man-outline"}
        size={size * 0.58}
        color={C.ink}
      />
      <Text style={[s.avatarInitial, { fontSize: size * 0.16 }]}>
        {name.slice(0, 1).toUpperCase()}
      </Text>
    </View>
  );
}
function PrimaryButton({
  label,
  onPress,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.primary,
        disabled && s.disabled,
        pressed && s.pressed,
      ]}
    >
      <Text style={s.primaryText}>{label}</Text>
      <Icon name="arrow-right" size={20} color="white" />
    </Pressable>
  );
}
function StartScreen({
  best,
  hasSave,
  onNew,
  onResume,
}: {
  best: number;
  hasSave: boolean;
  onNew: () => void;
  onResume: () => void;
}) {
  return (
    <SafeAreaView style={s.start}>
      <View style={s.startBrand}>
        <Icon name="crown-outline" size={28} color={C.gold} />
        <Text style={s.startTitle}>Dynasty</Text>
        <Text style={s.startSub}>UNE FAMILLE. PLUSIEURS VIES.</Text>
      </View>
      <View style={s.startArt}>
        <View style={s.lineageLine} />
        <View style={s.startFaces}>
          <Avatar name="A" sex="F" size={66} />
          <Avatar name="L" sex="M" size={82} />
          <Avatar name="E" sex="F" size={66} />
        </View>
        <Text style={s.startYears}>1850 · · · DEMAIN</Text>
      </View>
      <View style={s.startActions}>
        <PrimaryButton label="Nouvelle dynastie" onPress={onNew} />
        {hasSave ? (
          <Pressable style={s.resume} onPress={onResume}>
            <Text>Reprendre la partie</Text>
          </Pressable>
        ) : null}
        <Text style={s.record}>
          <Icon name="trophy-outline" size={15} color={C.gold} /> Meilleur score
          : {best.toLocaleString("fr-FR")}
        </Text>
      </View>
    </SafeAreaView>
  );
}
function SetupScreen({
  onBack,
  onCreate,
}: {
  onBack: () => void;
  onCreate: (f: { firstName: string; lastName: string; sex: Sex }) => void;
}) {
  const [firstName, setFirstName] = useState("Élise"),
    [lastName, setLastName] = useState("Moreau"),
    [sex, setSex] = useState<Sex>("F");
  const valid = firstName.trim().length > 1 && lastName.trim().length > 1;
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.nativeHeader}>
        <Pressable onPress={onBack} style={s.roundButton}>
          <Icon name="chevron-left" size={26} color={C.ink} />
        </Pressable>
        <View>
          <Text style={s.headerEyebrow}>FRANCE · 1850</Text>
          <Text style={s.headerTitle}>Ton fondateur</Text>
        </View>
        <View style={{ width: 42 }} />
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.setupBody}
          keyboardShouldPersistTaps="handled"
        >
          <Avatar name={firstName || "?"} sex={sex} size={118} />
          <Text style={s.founderCaption}>
            18 ans · {sex === "F" ? "Fondatrice" : "Fondateur"}
          </Text>
          <View style={s.sexSwitch}>
            <Pressable
              onPress={() => {
                setSex("F");
                if (firstName === "Thomas") setFirstName("Élise");
              }}
              style={[s.sexChoice, sex === "F" && s.sexActive]}
            >
              <Icon name="gender-female" size={21} />
              <Text>Femme</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setSex("M");
                if (firstName === "Élise") setFirstName("Thomas");
              }}
              style={[s.sexChoice, sex === "M" && s.sexActive]}
            >
              <Icon name="gender-male" size={21} />
              <Text>Homme</Text>
            </Pressable>
          </View>
          <View style={s.field}>
            <Text style={s.fieldLabel}>PRÉNOM</Text>
            <TextInput
              style={s.fieldInput}
              value={firstName}
              onChangeText={setFirstName}
              maxLength={18}
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>
          <View style={s.field}>
            <Text style={s.fieldLabel}>NOM DE FAMILLE</Text>
            <TextInput
              style={s.fieldInput}
              value={lastName}
              onChangeText={setLastName}
              maxLength={22}
              autoCorrect={false}
              returnKeyType="done"
            />
          </View>
          <View style={s.origin}>
            <Icon name="map-marker-outline" size={23} color={C.gold} />
            <View>
              <Text>Une vie commence</Text>
              <Text>Peu d’argent, aucun héritage, tout à construire.</Text>
            </View>
          </View>
        </ScrollView>
        <View style={s.fixedAction}>
          <PrimaryButton
            disabled={!valid}
            label="Commencer en 1850"
            onPress={() =>
              onCreate({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                sex,
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
function TopBar({ state }: { state: GameState }) {
  return (
    <View style={s.topbar}>
      <Avatar
        name={state.current.firstName}
        sex={state.current.sex}
        size={44}
      />
      <View style={{ flex: 1 }}>
        <Text style={s.personName}>
          {state.current.firstName} {state.current.lastName}
        </Text>
        <Text style={s.personSub}>
          {state.current.age} ans · {state.year}
        </Text>
      </View>
      <View style={s.genPill}>
        <Icon name="crown-outline" size={16} color={C.gold} />
        <Text>G{state.generation}</Text>
      </View>
    </View>
  );
}
function StatStrip({ state }: { state: GameState }) {
  return (
    <View style={s.statStrip}>
      {STAT.map((item) => (
        <View key={item.key} style={s.statMini}>
          <Icon name={item.icon as never} size={17} color={item.color} />
          <Text>
            {item.key === "money"
              ? formatMoney(state.stats.money)
              : Math.round(state.stats[item.key])}
          </Text>
        </View>
      ))}
    </View>
  );
}
function ChoiceButton({
  index,
  label,
  hint,
  effects,
  onPress,
}: {
  index: number;
  label: string;
  hint: string;
  effects: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.choice, pressed && s.pressed]}
    >
      <View
        style={[
          s.choiceIcon,
          { backgroundColor: index === 0 ? "#E5F3E9" : "#F8E9E6" },
        ]}
      >
        <Icon
          name={index === 0 ? "check" : "arrow-right"}
          size={19}
          color={index === 0 ? C.green : C.red}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.choiceLabel}>{label}</Text>
        <Text style={s.choiceHint}>{hint}</Text>
        <Text style={s.choiceEffect}>
          {effects || "Conséquence incertaine"}
        </Text>
      </View>
    </Pressable>
  );
}
function effectText(event: GameEvent, index: number) {
  const c = event.choices[index];
  if (!c) return "";
  const labels: Record<string, string> = {
    money: "argent",
    health: "santé",
    happiness: "bonheur",
    reputation: "réputation",
    relations: "relations",
  };
  return Object.entries(c.effects)
    .map(([k, v]) => (Number(v) > 0 ? "+" : "") + v + " " + labels[k])
    .join("  ·  ");
}
function LifeTab({
  state,
  event,
  outcome,
  onChoice,
  onContinue,
}: {
  state: GameState;
  event: GameEvent;
  outcome: ChoiceResult | null;
  onChoice: (i: number) => void;
  onContinue: () => void;
}) {
  return (
    <View style={s.life}>
      <TopBar state={state} />
      <StatStrip state={state} />
      <ScrollView
        contentContainerStyle={s.lifeScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.eventLabel}>ÉVÉNEMENT</Text>
        <View style={s.eventCard}>
          {outcome ? (
            <View style={s.outcome}>
              <View style={s.outcomeIcon}>
                <Icon
                  name={outcome.died ? "heart-broken-outline" : "check"}
                  size={30}
                  color="white"
                />
              </View>
              <Text style={s.outcomeOver}>
                {outcome.died ? "FIN DE VIE" : "CONSÉQUENCE"}
              </Text>
              <Text style={s.outcomeText}>{outcome.message}</Text>
              <View style={s.deltaWrap}>
                {STAT.filter((x) => outcome.deltas[x.key]).map((x) => (
                  <Text key={x.key} style={{ color: x.color }}>
                    {outcome.deltas[x.key] > 0 ? "+" : ""}
                    {outcome.deltas[x.key]} {x.label}
                  </Text>
                ))}
              </View>
              <PrimaryButton
                label={outcome.died ? "Choisir la suite" : "Événement suivant"}
                onPress={onContinue}
              />
            </View>
          ) : (
            <>
              <View style={s.eventIcon}>
                <Icon name="feather" size={28} color={C.purple} />
              </View>
              <Text style={s.eventYear}>{state.year}</Text>
              <Text style={s.eventTitle}>{event.title}</Text>
              <Text style={s.eventBody}>{event.body}</Text>
              <View style={s.choices}>
                {event.choices.map((c, i) => (
                  <ChoiceButton
                    key={c.label}
                    index={i}
                    label={c.label}
                    hint={c.hint}
                    effects={effectText(event, i)}
                    onPress={() => onChoice(i)}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
function FamilyTab({ state }: { state: GameState }) {
  const people = [
    ...(state.spouse ? [{ ...state.spouse, role: "Conjoint" }] : []),
    ...state.children.map((c) => ({
      ...c,
      role: c.relation === "adopted" ? "Enfant adopté" : "Enfant",
    })),
  ];
  return (
    <ScrollView style={s.tab} contentContainerStyle={s.tabBody}>
      <Text style={s.pageTitle}>Famille</Text>
      <Text style={s.pageSub}>La maison {state.current.lastName}</Text>
      <View style={s.currentCard}>
        <Avatar
          name={state.current.firstName}
          sex={state.current.sex}
          size={68}
        />
        <View>
          <Text style={s.currentOver}>PERSONNAGE ACTUEL</Text>
          <Text style={s.currentName}>
            {state.current.firstName} {state.current.lastName}
          </Text>
          <Text style={s.muted}>
            {state.current.age} ans · génération {state.generation}
          </Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>Proches</Text>
      {people.length ? (
        people.map((p) => (
          <View key={p.id} style={s.personRow}>
            <Avatar name={p.firstName} sex={p.sex} size={50} />
            <View>
              <Text style={s.rowTitle}>
                {p.firstName} {p.lastName}
              </Text>
              <Text style={s.muted}>
                {p.role} · {p.age} ans
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={s.empty}>
          <Icon name="account-group-outline" size={34} color={C.blue} />
          <Text>Ta lignée commence ici</Text>
          <Text>Les rencontres et les enfants apparaîtront dans Vie.</Text>
        </View>
      )}
    </ScrollView>
  );
}
function WealthTab({ state }: { state: GameState }) {
  const items = [
    ...state.properties.map((x) => ({
      name: x,
      type: "Propriété",
      icon: "home-outline",
    })),
    ...state.companies.map((x) => ({
      name: x,
      type: "Entreprise",
      icon: "store-outline",
    })),
  ];
  return (
    <ScrollView style={s.tab} contentContainerStyle={s.tabBody}>
      <Text style={s.pageTitle}>Patrimoine</Text>
      <Text style={s.pageSub}>Ce que la famille possède</Text>
      <View style={s.moneyCard}>
        <Text style={s.darkOver}>FORTUNE DISPONIBLE</Text>
        <Text style={s.moneyValue}>{formatMoney(state.stats.money)}</Text>
        <View style={s.moneyFooter}>
          <Text style={s.darkMuted}>Maximum atteint</Text>
          <Text style={s.darkStrong}>{formatMoney(state.maxMoney)}</Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>Biens et entreprises</Text>
      {items.length ? (
        items.map((x) => (
          <View key={x.name} style={s.assetRow}>
            <View style={s.assetIcon}>
              <Icon name={x.icon as never} size={23} color={C.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowTitle}>{x.name}</Text>
              <Text style={s.muted}>{x.type}</Text>
            </View>
            <Icon name="chevron-right" size={21} color={C.muted} />
          </View>
        ))
      ) : (
        <View style={s.empty}>
          <Icon name="home-plus-outline" size={34} color={C.green} />
          <Text>Aucun patrimoine</Text>
          <Text>Les premiers biens se gagnent par tes décisions.</Text>
        </View>
      )}
    </ScrollView>
  );
}
function LegacyTab({ state, best }: { state: GameState; best: number }) {
  return (
    <ScrollView style={s.tab} contentContainerStyle={s.tabBody}>
      <Text style={s.pageTitle}>Héritage</Text>
      <Text style={s.pageSub}>
        {state.year - state.founderYear} ans d’histoire
      </Text>
      <View style={s.scoreCard}>
        <Icon name="crown-outline" size={28} color={C.gold} />
        <Text style={s.darkOver}>SCORE ACTUEL</Text>
        <Text style={s.scoreValue}>{score(state).toLocaleString("fr-FR")}</Text>
        <Text style={s.darkMuted}>Record : {best.toLocaleString("fr-FR")}</Text>
      </View>
      <View style={s.legacyNumbers}>
        <View style={s.legacyItem}>
          <Text style={s.legacyValue}>{state.generation}</Text>
          <Text style={s.legacyLabel}>Générations</Text>
        </View>
        <View style={s.legacyItem}>
          <Text style={s.legacyValue}>{state.totalDescendants}</Text>
          <Text style={s.legacyLabel}>Descendants</Text>
        </View>
        <View style={s.legacyItem}>
          <Text style={s.legacyValue}>
            {state.properties.length + state.companies.length}
          </Text>
          <Text style={s.legacyLabel}>Actifs</Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>Chronique</Text>
      {[...state.chronicle]
        .reverse()
        .slice(0, 8)
        .map((e, i) => (
          <View key={e.year + "-" + i} style={s.journalRow}>
            <Text style={s.journalYear}>{e.year}</Text>
            <View style={s.journalDot} />
            <Text style={s.journalText}>{e.text}</Text>
          </View>
        ))}
    </ScrollView>
  );
}
function Tabs({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const data: Array<[Tab, string, string]> = [
    ["life", "Vie", "cards-outline"],
    ["family", "Famille", "account-group-outline"],
    ["wealth", "Patrimoine", "home-city-outline"],
    ["legacy", "Héritage", "crown-outline"],
  ];
  return (
    <View style={s.tabs}>
      {data.map(([id, label, icon]) => (
        <Pressable key={id} style={s.tabButton} onPress={() => onChange(id)}>
          <Icon
            name={icon as never}
            size={23}
            color={tab === id ? C.purple : C.muted}
          />
          <Text style={[s.tabLabel, tab === id && s.tabLabelActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
function ChildNameModal({
  state,
  onSave,
}: {
  state: GameState;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(
    state.pendingChild?.sex === "F" ? "Louise" : "Louis",
  );
  return (
    <Modal animationType="slide" transparent>
      <KeyboardAvoidingView
        style={s.modalShade}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.modalCard}>
          <View style={s.modalHandle} />
          <Avatar name={name} sex={state.pendingChild?.sex ?? "F"} size={84} />
          <Text style={s.modalOver}>UNE NAISSANCE</Text>
          <Text style={s.modalTitle}>
            {state.pendingChild?.sex === "F" ? "Une fille" : "Un garçon"}{" "}
            rejoint la famille
          </Text>
          <Text style={s.modalText}>
            Choisis son prénom. Son sexe a été déterminé par le jeu.
          </Text>
          <View style={s.field}>
            <Text>PRÉNOM</Text>
            <TextInput
              style={s.fieldInput}
              autoFocus
              value={name}
              onChangeText={setName}
              maxLength={18}
            />
          </View>
          <PrimaryButton
            disabled={name.trim().length < 2}
            label={"Bienvenue " + name.trim()}
            onPress={() => onSave(name)}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
function HeirScreen({
  state,
  onChoose,
  onEnd,
}: {
  state: GameState;
  onChoose: (id: string) => void;
  onEnd: () => void;
}) {
  const list = heirs(state),
    [selected, setSelected] = useState(list[0]?.id ?? "");
  if (!list.length)
    return (
      <SafeAreaView style={s.endSimple}>
        <Icon name="crown-outline" size={55} color={C.gold} />
        <Text>La lignée s’éteint</Text>
        <Text>
          Aucun enfant ne peut reprendre le nom {state.current.lastName}.
        </Text>
        <PrimaryButton label="Voir le bilan" onPress={onEnd} />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={s.screen}>
      <View style={s.heirHead}>
        <Icon name="crown-outline" size={25} color={C.gold} />
        <Text style={s.heirTitle}>Choisir un héritier</Text>
        <Text style={s.heirSub}>
          Qui poursuivra l’histoire des {state.current.lastName} ?
        </Text>
      </View>
      <ScrollView contentContainerStyle={s.heirList}>
        {list.map((h) => (
          <Pressable
            key={h.id}
            onPress={() => setSelected(h.id)}
            style={[s.heirCard, selected === h.id && s.heirSelected]}
          >
            <Avatar name={h.firstName} sex={h.sex} size={76} />
            <View style={{ flex: 1 }}>
              <Text style={s.currentName}>
                {h.firstName} {h.lastName}
              </Text>
              <Text style={s.muted}>
                {h.age} ans · {h.age >= 18 ? h.profession : "enfant"}
              </Text>
              <Text style={s.heirHint}>
                {h.age < 18
                  ? "La partie avancera jusqu’à ses 18 ans."
                  : "Prêt à reprendre la dynastie."}
              </Text>
            </View>
            {selected === h.id ? (
              <View style={s.check}>
                <Icon name="check" size={18} color="white" />
              </View>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.fixedAction}>
        <PrimaryButton
          disabled={!selected}
          label={
            "Continuer avec " +
            (list.find((h) => h.id === selected)?.firstName ?? "")
          }
          onPress={() => onChoose(selected)}
        />
      </View>
    </SafeAreaView>
  );
}
function Summary({
  state,
  best,
  onRestart,
}: {
  state: GameState;
  best: number;
  onRestart: () => void;
}) {
  const finalScore = score(state);
  return (
    <SafeAreaView style={s.summary}>
      <ScrollView contentContainerStyle={s.summaryBody}>
        <Icon name="crown-outline" size={34} color={C.gold} />
        <Text style={s.summaryOver}>
          DYNASTIE {state.current.lastName.toUpperCase()}
        </Text>
        <Text style={s.summaryScore}>{finalScore.toLocaleString("fr-FR")}</Text>
        <Text style={s.summaryPoints}>POINTS</Text>
        {finalScore >= best ? (
          <Text style={s.newRecord}>NOUVEAU RECORD</Text>
        ) : null}
        <View style={s.summaryGrid}>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>{state.generation}</Text>
            <Text style={s.summaryItemLabel}>Générations</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>{state.year}</Text>
            <Text style={s.summaryItemLabel}>Année finale</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>{state.totalDescendants}</Text>
            <Text style={s.summaryItemLabel}>Descendants</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>
              {formatMoney(state.maxMoney)}
            </Text>
            <Text style={s.summaryItemLabel}>Fortune max.</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>
              {formatMoney(state.stats.money)}
            </Text>
            <Text style={s.summaryItemLabel}>Fortune finale</Text>
          </View>
          <View style={s.summaryItem}>
            <Text style={s.summaryItemValue}>
              {state.properties.length + state.companies.length}
            </Text>
            <Text style={s.summaryItemLabel}>Patrimoine</Text>
          </View>
        </View>
        {state.notablePeople.length ? (
          <View style={s.summarySection}>
            <Text>Personnages remarquables</Text>
            {state.notablePeople.map((x) => (
              <Text key={x}>• {x}</Text>
            ))}
          </View>
        ) : null}
        <View style={s.summarySection}>
          <Text>Derniers événements</Text>
          {state.chronicle.slice(-4).map((e, i) => (
            <Text key={i}>
              {e.year} — {e.text}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={s.fixedAction}>
        <PrimaryButton label="Nouvelle dynastie" onPress={onRestart} />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("start"),
    [tab, setTab] = useState<Tab>("life"),
    [state, setState] = useState<GameState | null>(null),
    [event, setEvent] = useState<GameEvent | null>(null),
    [outcome, setOutcome] = useState<ChoiceResult | null>(null),
    [best, setBest] = useState(0),
    [hasSave, setHasSave] = useState(false);
  useEffect(() => {
    Promise.all([loadBest(), loadRun()]).then(([b, r]) => {
      setBest(b);
      setHasSave(Boolean(r));
    });
  }, []);
  const persist = (next: GameState) => {
    setState(next);
    setHasSave(true);
    void saveRun(next);
  };
  const start = (founder: {
    firstName: string;
    lastName: string;
    sex: Sex;
  }) => {
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
      next.current.alive ? "game" : heirs(next).length ? "heir" : "summary",
    );
  };
  const choose = (index: number) => {
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
  const saveChild = (name: string) => {
    if (!state) return;
    const next = namePendingChild(state, name);
    persist(next);
    setEvent(nextEvent(next));
    setOutcome(null);
  };
  const pickHeir = (id: string) => {
    if (!state) return;
    const next = chooseHeir(state, id);
    persist(next);
    setEvent(nextEvent(next));
    setOutcome(null);
    setTab("life");
    setScreen("game");
  };
  const finish = async () => {
    if (!state) return;
    const value = score(state),
      nextBest = Math.max(best, value);
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
    () =>
      state && event ? (
        tab === "life" ? (
          <LifeTab
            state={state}
            event={event}
            outcome={outcome}
            onChoice={choose}
            onContinue={continueLife}
          />
        ) : tab === "family" ? (
          <FamilyTab state={state} />
        ) : tab === "wealth" ? (
          <WealthTab state={state} />
        ) : (
          <LegacyTab state={state} best={best} />
        )
      ) : null,
    [state, event, tab, outcome, best],
  );
  return (
    <SafeAreaProvider>
      <StatusBar
        style={screen === "game" && tab === "life" ? "light" : "dark"}
      />
      {screen === "start" ? (
        <StartScreen
          best={best}
          hasSave={hasSave}
          onNew={() => setScreen("setup")}
          onResume={resume}
        />
      ) : screen === "setup" ? (
        <SetupScreen onBack={() => setScreen("start")} onCreate={start} />
      ) : screen === "game" && state ? (
        <View style={s.game}>
          <SafeAreaView
            edges={["top"]}
            style={[s.gameSafe, tab !== "life" && { backgroundColor: C.paper }]}
          >
            {active}
          </SafeAreaView>
          <Tabs tab={tab} onChange={setTab} />
          {state.pendingChild ? (
            <ChildNameModal state={state} onSave={saveChild} />
          ) : null}
        </View>
      ) : screen === "heir" && state ? (
        <HeirScreen
          state={state}
          onChoose={pickHeir}
          onEnd={() => setScreen("summary")}
        />
      ) : screen === "summary" && state ? (
        <Summary
          state={state}
          best={best}
          onRestart={() => {
            setState(null);
            setScreen("setup");
          }}
        />
      ) : null}
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.paper },
  start: { flex: 1, backgroundColor: C.paper, paddingHorizontal: 24 },
  startBrand: { alignItems: "center", marginTop: 70 },
  startTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 50,
    color: C.ink,
    marginTop: 8,
  },
  startSub: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: C.gold,
    marginTop: 8,
  },
  startArt: { flex: 1, alignItems: "center", justifyContent: "center" },
  lineageLine: {
    position: "absolute",
    height: 2,
    width: 210,
    backgroundColor: C.line,
  },
  startFaces: { flexDirection: "row", alignItems: "center", gap: -8 },
  startYears: {
    marginTop: 28,
    fontSize: 11,
    letterSpacing: 2,
    color: C.muted,
    fontWeight: "700",
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
    backgroundColor: C.card,
  },
  primary: {
    minHeight: 56,
    borderRadius: 17,
    backgroundColor: C.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 18,
  },
  primaryText: { color: "white", fontSize: 16, fontWeight: "800" },
  disabled: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.985 }], opacity: 0.9 },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
    overflow: "hidden",
  },
  avatarInitial: {
    position: "absolute",
    bottom: 4,
    right: 8,
    fontWeight: "900",
    color: "rgba(23,34,53,.45)",
  },
  nativeHeader: {
    height: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.card,
  },
  headerEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: C.gold,
    textAlign: "center",
  },
  headerTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    fontWeight: "700",
    color: C.ink,
  },
  setupBody: {
    alignItems: "center",
    paddingHorizontal: 22,
    paddingBottom: 120,
  },
  founderCaption: { marginTop: 10, color: C.muted, fontSize: 13 },
  sexSwitch: {
    flexDirection: "row",
    backgroundColor: "#ECE8E1",
    borderRadius: 16,
    padding: 4,
    marginTop: 26,
    width: "100%",
  },
  sexChoice: {
    height: 48,
    flex: 1,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  sexActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  field: { width: "100%", marginTop: 18 },
  fieldLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: C.muted,
    marginBottom: 7,
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
    width: "100%",
  },
  fieldText: {},
  origin: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFF9EC",
    borderRadius: 16,
    padding: 15,
    marginTop: 22,
  },
  fixedAction: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Math.max(16, Platform.OS === "ios" ? 20 : 16),
    backgroundColor: C.paper,
  },
  game: { flex: 1, backgroundColor: C.paper },
  gameSafe: { flex: 1, backgroundColor: C.navy },
  life: { flex: 1, backgroundColor: C.navy },
  topbar: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
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
    alignItems: "center",
  },
  statStrip: {
    flexDirection: "row",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  statMini: {
    flex: 1,
    height: 39,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,.09)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  lifeScroll: { padding: 16, paddingBottom: 28 },
  eventLabel: {
    color: "#DFC886",
    fontSize: 11,
    letterSpacing: 1.8,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: C.card,
    borderRadius: 26,
    padding: 20,
    minHeight: 470,
  },
  eventIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F0EDFC",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  eventYear: {
    textAlign: "center",
    fontSize: 11,
    color: C.muted,
    marginTop: 10,
  },
  eventTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 26,
    textAlign: "center",
    color: C.ink,
    marginTop: 8,
  },
  eventBody: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: C.muted,
    marginTop: 12,
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
    gap: 11,
  },
  choiceIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceLabel: { fontSize: 14, fontWeight: "800", color: C.ink },
  choiceHint: { fontSize: 11, color: C.muted, marginTop: 2 },
  choiceEffect: {
    fontSize: 10,
    color: C.green,
    fontWeight: "700",
    marginTop: 7,
  },
  outcome: { flex: 1, alignItems: "center", justifyContent: "center" },
  outcomeIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
  outcomeOver: {
    fontSize: 10,
    letterSpacing: 1.7,
    fontWeight: "900",
    color: C.purple,
    marginTop: 18,
  },
  outcomeText: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 22,
    lineHeight: 30,
    textAlign: "center",
    color: C.ink,
    marginTop: 12,
  },
  deltaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginVertical: 22,
  },
  tabs: {
    height: 84,
    paddingBottom: Platform.OS === "ios" ? 18 : 8,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: C.line,
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  tabLabel: { fontSize: 9, color: C.muted },
  tabLabelActive: { color: C.purple, fontWeight: "800" },
  tab: { flex: 1, backgroundColor: C.paper },
  tabBody: { padding: 20, paddingBottom: 38 },
  pageTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 34,
    color: C.ink,
  },
  pageSub: { color: C.muted, fontSize: 13, marginTop: 4, marginBottom: 24 },
  currentCard: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: C.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  currentOver: {
    fontSize: 9,
    color: C.gold,
    fontWeight: "900",
    letterSpacing: 1,
  },
  currentName: { fontSize: 17, fontWeight: "800", color: C.ink, marginTop: 4 },
  muted: { fontSize: 12, color: C.muted, marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.ink,
    marginTop: 28,
    marginBottom: 12,
  },
  personRow: {
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 9,
  },
  empty: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {},
  moneyCard: { backgroundColor: C.navy, borderRadius: 24, padding: 22 },
  darkOver: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
    color: C.gold,
    marginTop: 8,
  },
  moneyValue: { fontSize: 34, fontWeight: "900", color: "white", marginTop: 7 },
  moneyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,.12)",
    marginTop: 20,
    paddingTop: 14,
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
    marginBottom: 9,
  },
  assetIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#E8F3EC",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTitle: { fontSize: 14, fontWeight: "800", color: C.ink },
  scoreCard: {
    backgroundColor: C.navy,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
  },
  scoreValue: {
    fontSize: 38,
    fontWeight: "900",
    color: "white",
    marginVertical: 6,
  },
  legacyNumbers: {
    flexDirection: "row",
    backgroundColor: C.card,
    borderRadius: 20,
    marginTop: 12,
    paddingVertical: 18,
  },
  legacyItem: { flex: 1, alignItems: "center" },
  legacyValue: {
    fontSize: 24,
    fontWeight: "900",
    color: C.ink,
    textAlign: "center",
  },
  legacyLabel: {
    fontSize: 9,
    color: C.muted,
    textAlign: "center",
    marginTop: 3,
  },
  traitList: {},
  journalRow: { flexDirection: "row", gap: 11, marginBottom: 16 },
  journalYear: { width: 36, fontSize: 11, fontWeight: "800", color: C.gold },
  journalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.purple,
    marginTop: 4,
  },
  journalText: { flex: 1, fontSize: 12, lineHeight: 18, color: C.muted },
  modalShade: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(10,18,28,.45)",
  },
  modalCard: {
    backgroundColor: C.paper,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 34,
    alignItems: "center",
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#D8D3CB",
    marginBottom: 20,
  },
  modalOver: {
    fontSize: 9,
    letterSpacing: 1.7,
    color: C.gold,
    fontWeight: "900",
    marginTop: 14,
  },
  modalTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 25,
    textAlign: "center",
    color: C.ink,
    marginTop: 7,
  },
  modalText: {
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    marginTop: 8,
  },
  heirHead: { alignItems: "center", padding: 22 },
  heirTitle: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 27,
    fontWeight: "700",
    color: C.ink,
    marginTop: 8,
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
    marginBottom: 11,
  },
  heirSelected: { borderColor: C.green },
  heirHint: { fontSize: 10, color: C.green, marginTop: 10 },
  check: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.green,
    alignItems: "center",
    justifyContent: "center",
  },
  endSimple: {
    flex: 1,
    backgroundColor: C.paper,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  summary: { flex: 1, backgroundColor: C.paper },
  summaryBody: { padding: 24, paddingBottom: 120, alignItems: "center" },
  summaryOver: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: C.gold,
    fontWeight: "900",
    marginTop: 12,
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
    marginTop: 24,
  },
  summaryItem: {
    width: "50%",
    paddingVertical: 18,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  summaryItemValue: { fontSize: 20, fontWeight: "900", color: C.ink },
  summaryItemLabel: {
    fontSize: 9,
    color: C.muted,
    marginTop: 4,
    textTransform: "uppercase",
  },
  summarySection: {
    width: "100%",
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
  },
});
