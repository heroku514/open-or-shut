import AsyncStorage from "@react-native-async-storage/async-storage";
import { parseDoor, type DoorState } from "./door";

const KEY = "open-or-shut-v1";

export async function loadDoor(): Promise<DoorState> {
  const raw = await AsyncStorage.getItem(KEY);
  return parseDoor(raw);
}

export async function saveDoor(state: DoorState): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(state));
}
