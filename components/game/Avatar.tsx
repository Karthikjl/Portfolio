"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { ZONES } from "@/lib/zones";

function CarModel() {
  const { scene } = useGLTF("/models/car.glb");
  return (
    <primitive
      object={scene}
      scale={1}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

useGLTF.preload("/models/car.glb");

// Car controller tuning: W/S accelerate/reverse, A/D steer (steering only
// takes effect while moving, and inverts in reverse, like a real car).
const ACCELERATION = 8;
const MAX_SPEED = 10;
const MAX_REVERSE_SPEED = 4;
const DRAG = 6;
const TURN_SPEED = Math.PI * 0.7;
const MOVING_THRESHOLD = 0.05;
// Keeps the avatar safely inside the island's edge (island radius ~17-20).
const MAX_DISTANCE_FROM_ORIGIN = 16;

// Simple circular collider (no physics engine) keeping the car from driving
// through the contact model — matches its zone position, radius sized to
// the model's rough footprint rather than the (larger) proximity trigger.
const CONTACT_ZONE = ZONES.find((zone) => zone.id === "contact")!;
const CONTACT_COLLIDER_RADIUS = 1.8;

interface AvatarProps {
  groupRef: React.RefObject<THREE.Group>;
  /** When true, movement integration is skipped (e.g. a content panel is open). */
  paused?: boolean;
}

export function Avatar({ groupRef, paused = false }: AvatarProps) {
  const keys = useKeyboardControls();
  const speedRef = useRef(0);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    if (paused) return;

    let speed = speedRef.current;

    if (keys.forward) {
      speed += ACCELERATION * delta;
    } else if (keys.backward) {
      speed -= ACCELERATION * delta;
    } else if (speed > 0) {
      speed = Math.max(0, speed - DRAG * delta);
    } else if (speed < 0) {
      speed = Math.min(0, speed + DRAG * delta);
    }

    speed = THREE.MathUtils.clamp(speed, -MAX_REVERSE_SPEED, MAX_SPEED);

    if (Math.abs(speed) > MOVING_THRESHOLD) {
      const steerDirection = keys.left ? 1 : keys.right ? -1 : 0;
      const speedSign = speed >= 0 ? 1 : -1;
      group.rotation.y += steerDirection * speedSign * TURN_SPEED * delta;
    }

    const forwardX = -Math.sin(group.rotation.y);
    const forwardZ = -Math.cos(group.rotation.y);

    let nextX = group.position.x + forwardX * speed * delta;
    let nextZ = group.position.z + forwardZ * speed * delta;

    const distanceFromOrigin = Math.sqrt(nextX * nextX + nextZ * nextZ);
    if (distanceFromOrigin > MAX_DISTANCE_FROM_ORIGIN) {
      const scale = MAX_DISTANCE_FROM_ORIGIN / distanceFromOrigin;
      nextX *= scale;
      nextZ *= scale;
    }

    const dxContact = nextX - CONTACT_ZONE.position.x;
    const dzContact = nextZ - CONTACT_ZONE.position.z;
    const distanceFromContact = Math.sqrt(dxContact * dxContact + dzContact * dzContact);
    if (distanceFromContact < CONTACT_COLLIDER_RADIUS) {
      const pushScale = CONTACT_COLLIDER_RADIUS / (distanceFromContact || 0.0001);
      nextX = CONTACT_ZONE.position.x + dxContact * pushScale;
      nextZ = CONTACT_ZONE.position.z + dzContact * pushScale;
    }

    group.position.x = nextX;
    group.position.z = nextZ;
    speedRef.current = speed;
  });

  return (
    <group ref={groupRef}>
      <CarModel />
    </group>
  );
}
