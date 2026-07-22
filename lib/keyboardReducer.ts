export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

export type KeyboardAction =
  | { type: "keydown"; code: string }
  | { type: "keyup"; code: string };

const CODE_MAP: Record<string, keyof KeyboardState> = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

export const INITIAL_KEYBOARD_STATE: KeyboardState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

export function keyboardReducer(state: KeyboardState, action: KeyboardAction): KeyboardState {
  const key = CODE_MAP[action.code];
  if (!key) {
    return state;
  }
  const pressed = action.type === "keydown";
  if (state[key] === pressed) {
    return state;
  }
  return { ...state, [key]: pressed };
}
