"use client";

import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { StaticFallback } from "./StaticFallback";
import { GameCanvas } from "./game/GameCanvas";
import { GameErrorBoundary } from "./game/GameErrorBoundary";

export function PortfolioExperience() {
  const capability = useDeviceCapability();

  if (capability === "checking") {
    return (
      <div className="flex h-screen w-screen items-center justify-center">Loading…</div>
    );
  }

  if (capability === "fallback") {
    return <StaticFallback />;
  }

  return (
    <GameErrorBoundary fallback={<StaticFallback />}>
      <GameCanvas />
    </GameErrorBoundary>
  );
}
