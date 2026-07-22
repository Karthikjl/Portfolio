"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky, Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { Island } from "./Island";
import { Zones } from "./Zones";
import { Avatar } from "./Avatar";
import { CameraRig } from "./CameraRig";
import { InteractionPrompt } from "./InteractionPrompt";
import { SectionPanel } from "./SectionPanel";
import { findActiveZone } from "@/lib/proximity";
import { ZONES, type ZoneId } from "@/lib/zones";

/**
 * Runs inside the R3F render loop and reads the avatar's live position
 * straight off its ref every frame (no React state churn while stationary).
 * `onZoneChange` only fires when the computed zone id actually changes.
 */
function ProximityTracker({
  avatarRef,
  paused,
  onZoneChange,
}: {
  avatarRef: React.RefObject<THREE.Group>;
  paused: boolean;
  onZoneChange: (zone: ZoneId | null) => void;
}) {
  const lastZoneRef = useRef<ZoneId | null>(null);

  useFrame(() => {
    if (paused) return;
    const group = avatarRef.current;
    if (!group) return;

    const zone = findActiveZone({ x: group.position.x, z: group.position.z }, ZONES);
    if (zone !== lastZoneRef.current) {
      lastZoneRef.current = zone;
      onZoneChange(zone);
    }
  });

  return null;
}

/**
 * Surfaces a lost WebGL context as a thrown render error so the
 * surrounding GameErrorBoundary can catch it and show the static fallback.
 */
function WebglContextWatcher() {
  const { gl } = useThree();
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);
    return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
  }, [gl]);

  if (contextLost) {
    throw new Error("WebGL context was lost");
  }

  return null;
}

const SUN_POSITION: [number, number, number] = [100, 60, 50];

const CLOUD_PLACEMENTS: {
  position: [number, number, number];
  seed: number;
  scale: number;
  opacity: number;
}[] = [
  { position: [-20, 22, -15], seed: 1, scale: 3, opacity: 0.6 },
  { position: [15, 26, -25], seed: 2, scale: 4, opacity: 0.5 },
  { position: [0, 20, 30], seed: 3, scale: 3.5, opacity: 0.55 },
  { position: [-30, 24, 20], seed: 4, scale: 2.5, opacity: 0.5 },
  { position: [25, 28, 10], seed: 5, scale: 3, opacity: 0.6 },
  { position: [5, 30, -10], seed: 6, scale: 2, opacity: 0.45 },
];

function SkyClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      {CLOUD_PLACEMENTS.map((cloud) => (
        <Cloud
          key={cloud.seed}
          position={cloud.position}
          seed={cloud.seed}
          scale={cloud.scale}
          opacity={cloud.opacity}
          bounds={[8, 3, 8]}
          volume={6}
          fade={30}
        />
      ))}
    </Clouds>
  );
}

export function GameCanvas() {
  const avatarRef = useRef<THREE.Group>(null!);
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [openZone, setOpenZone] = useState<ZoneId | null>(null);
  const isPaused = !!openZone;

  const closePanel = useCallback(() => setOpenZone(null), []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyE" && activeZone && !openZone) {
        setOpenZone(activeZone);
        document.exitPointerLock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeZone, openZone]);

  return (
    <div className="relative h-screen w-screen">
      <Canvas shadows camera={{ position: [0, 4, 7], fov: 60 }}>
        <Sky sunPosition={SUN_POSITION} />
        <SkyClouds />
        <ambientLight intensity={0.6} />
        <directionalLight position={SUN_POSITION} intensity={1} castShadow />
        <Island />
        <Zones />
        <Avatar groupRef={avatarRef} paused={isPaused} />
        <CameraRig targetRef={avatarRef} />
        <ProximityTracker avatarRef={avatarRef} paused={isPaused} onZoneChange={setActiveZone} />
        <WebglContextWatcher />
      </Canvas>
      <InteractionPrompt activeZone={openZone ? null : activeZone} />
      {openZone && <SectionPanel zoneId={openZone} onClose={closePanel} />}
    </div>
  );
}
