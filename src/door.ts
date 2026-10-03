export type Door = "open" | "shut" | "locked";

export type DoorState = {
  door: Door;
};

export const EMPTY_DOOR: DoorState = { door: "shut" };

export function doorLine(state: DoorState): string {
  if (state.door === "open") return "The door is open.";
  if (state.door === "locked") return "The door is locked.";
  return "The door is shut.";
}

export function latchLine(state: DoorState): string {
  if (state.door === "open") return "Wide.";
  if (state.door === "locked") return "Latched.";
  return "Closed.";
}

export function hasProgress(state: DoorState): boolean {
  return state.door !== "shut";
}

export function parseDoor(raw: string | null): DoorState {
  if (!raw) return EMPTY_DOOR;
  try {
    const value = JSON.parse(raw) as { door?: unknown };
    if (value.door !== "open" && value.door !== "shut" && value.door !== "locked") return EMPTY_DOOR;
    return { door: value.door };
  } catch {
    return EMPTY_DOOR;
  }
}

export function openDoor(state: DoorState): { state: DoorState; note: string } {
  if (state.door === "open") return { state, note: "Already open." };
  if (state.door === "locked") return { state, note: "Unlock first." };
  return { state: { door: "open" }, note: "Opened." };
}

export function shutDoor(state: DoorState): { state: DoorState; note: string } {
  if (state.door !== "open") return { state, note: "Already shut." };
  return { state: { door: "shut" }, note: "Shut." };
}

export function lockDoor(state: DoorState): { state: DoorState; note: string } {
  if (state.door === "open") return { state, note: "Shut it first." };
  if (state.door === "locked") return { state, note: "Already locked." };
  return { state: { door: "locked" }, note: "Locked." };
}

export function unlockDoor(state: DoorState): { state: DoorState; note: string } {
  if (state.door !== "locked") return { state, note: "Already unlocked." };
  return { state: { door: "shut" }, note: "Unlocked." };
}

export function resetDoor(): { state: DoorState; note: string } {
  return { state: EMPTY_DOOR, note: "Look at the door." };
}
