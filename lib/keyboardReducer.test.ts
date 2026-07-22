import { describe, expect, it } from "vitest";
import { INITIAL_KEYBOARD_STATE, keyboardReducer } from "./keyboardReducer";

describe("keyboardReducer", () => {
  it("sets forward true on KeyW keydown", () => {
    const next = keyboardReducer(INITIAL_KEYBOARD_STATE, { type: "keydown", code: "KeyW" });
    expect(next.forward).toBe(true);
  });

  it("sets forward false on KeyW keyup after keydown", () => {
    const down = keyboardReducer(INITIAL_KEYBOARD_STATE, { type: "keydown", code: "KeyW" });
    const up = keyboardReducer(down, { type: "keyup", code: "KeyW" });
    expect(up.forward).toBe(false);
  });

  it("maps ArrowUp to the same forward flag as KeyW", () => {
    const next = keyboardReducer(INITIAL_KEYBOARD_STATE, { type: "keydown", code: "ArrowUp" });
    expect(next.forward).toBe(true);
  });

  it("ignores unrecognized key codes and returns the same state reference", () => {
    const next = keyboardReducer(INITIAL_KEYBOARD_STATE, { type: "keydown", code: "Space" });
    expect(next).toBe(INITIAL_KEYBOARD_STATE);
  });

  it("returns the same state reference for a redundant keydown", () => {
    const down = keyboardReducer(INITIAL_KEYBOARD_STATE, { type: "keydown", code: "KeyW" });
    const downAgain = keyboardReducer(down, { type: "keydown", code: "KeyW" });
    expect(downAgain).toBe(down);
  });
});
