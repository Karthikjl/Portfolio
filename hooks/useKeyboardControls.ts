"use client";

import { useEffect, useReducer } from "react";
import {
  INITIAL_KEYBOARD_STATE,
  keyboardReducer,
  type KeyboardState,
} from "@/lib/keyboardReducer";

export function useKeyboardControls(): KeyboardState {
  const [state, dispatch] = useReducer(keyboardReducer, INITIAL_KEYBOARD_STATE);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      dispatch({ type: "keydown", code: event.code });
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      dispatch({ type: "keyup", code: event.code });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return state;
}
