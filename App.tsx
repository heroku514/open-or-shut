import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import {
  doorLine,
  EMPTY_DOOR,
  hasProgress,
  latchLine,
  lockDoor,
  openDoor,
  resetDoor,
  shutDoor,
  unlockDoor,
  type DoorState,
} from "./src/door";
import { loadDoor, saveDoor } from "./src/store";

export default function App() {
  const [state, setState] = useState<DoorState>(EMPTY_DOOR);
  const [note, setNote] = useState("Look at the door.");
  const [ready, setReady] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);

  useEffect(() => {
    let alive = true;
    loadDoor()
      .then((loaded) => {
        if (!alive) return;
        setState(loaded);
        setNote(hasProgress(loaded) ? "Saved door loaded." : "Look at the door.");
        setReady(true);
      })
      .catch(() => {
        if (alive) setNote("Could not read the door.");
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDoor(state).catch(() => setNote("Could not save the door."));
  }, [ready, state]);

  if (!ready && note === "Look at the door.") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loading}>Loading the door</Text>
        </View>
      </SafeAreaView>
    );
  }

  function apply(result: { state: DoorState; note: string }) {
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <Text style={styles.title}>Open or Shut</Text>
        <Text style={styles.note}>{note}</Text>
        <Text style={styles.count}>{latchLine(state)}</Text>
        <Text style={styles.line}>{doorLine(state)}</Text>
        <View style={styles.row}>
          <BigButton label="Open the door" inRow onPress={() => apply(openDoor(state))} />
          <BigButton label="Shut the door" inRow onPress={() => apply(shutDoor(state))} />
        </View>
        <View style={styles.row}>
          <BigButton label="Lock it" inRow onPress={() => apply(lockDoor(state))} />
          <BigButton label="Unlock it" inRow onPress={() => apply(unlockDoor(state))} />
        </View>
        {confirmNew ? (
          <View style={styles.row}>
            <BigButton label="Confirm new" filled inRow onPress={onConfirmNew} />
            <BigButton label="Cancel new" inRow onPress={onCancelNew} />
          </View>
        ) : (
          <BigButton label="New door" onPress={() => setConfirmNew(true)} />
        )}
      </View>
    </SafeAreaView>
  );

  function onConfirmNew() {
    const result = resetDoor();
    setState(result.state);
    setConfirmNew(false);
    setNote(result.note);
  }

  function onCancelNew() {
    setConfirmNew(false);
    setNote("New door canceled.");
  }
}

function BigButton({
  label,
  onPress,
  filled,
  inRow,
}: {
  label: string;
  onPress: () => void;
  filled?: boolean;
  inRow?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.button, inRow && styles.buttonRow, filled && styles.buttonFilled]}
    >
      <Text style={[styles.buttonText, filled && styles.buttonTextFilled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6EDE4" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loading: { fontSize: 28, fontWeight: "800", color: "#3F2E22" },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 8, gap: 8 },
  title: { fontSize: 32, fontWeight: "800", color: "#3F2E22" },
  note: { fontSize: 18, color: "#6B5344", minHeight: 24 },
  count: { fontSize: 22, fontWeight: "700", color: "#3F2E22" },
  line: { fontSize: 34, fontWeight: "800", color: "#9A3412", lineHeight: 40 },
  row: { flexDirection: "row", gap: 8 },
  button: {
    minHeight: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#3F2E22",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
  },
  buttonRow: { flex: 1 },
  buttonFilled: { backgroundColor: "#3F2E22" },
  buttonText: { fontSize: 20, fontWeight: "800", color: "#3F2E22", textAlign: "center" },
  buttonTextFilled: { color: "#FFFFFF" },
});
