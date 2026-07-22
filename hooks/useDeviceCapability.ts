"use client";

import { useEffect, useState } from "react";
import { shouldUseGameExperience } from "@/lib/deviceCapability";

export type DeviceCapability = "checking" | "game" | "fallback";

function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>("checking");

  useEffect(() => {
    const canUseGame = shouldUseGameExperience({
      matchesFinePointer: () => window.matchMedia("(pointer: fine)").matches,
      canCreateWebGLContext: detectWebGLSupport,
    });
    setCapability(canUseGame ? "game" : "fallback");
  }, []);

  return capability;
}
