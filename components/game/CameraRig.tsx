"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

const CAMERA_OFFSET = new THREE.Vector3(0, 4, 7);
const LERP_FACTOR = 4;
const MOUSE_SENSITIVITY = 0.0025;
const MIN_LOOK_PITCH = -0.3;
const MAX_LOOK_PITCH = 1.2;
// While actively driving, the look-around offset decays back to directly
// behind the car so free-look doesn't leave the camera facing a direction
// the car isn't actually driving toward.
const RECENTER_RATE = 3;

// One-time intro: camera starts high above the island and eases down into
// the normal chase position over this duration before handing off control.
const INTRO_DURATION = 2.5;
const INTRO_START_POSITION = new THREE.Vector3(0, 40, 60);

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CameraRig({ targetRef }: { targetRef: React.RefObject<THREE.Group> }) {
  const { camera, gl } = useThree();
  const keys = useKeyboardControls();
  const desiredPosition = useRef(new THREE.Vector3());
  const lookYaw = useRef(0);
  const lookPitch = useRef(0);
  const introElapsed = useRef(0);

  // Click-to-look: engages pointer lock so mouse movement orbits the camera
  // around the car (independent of steering). The browser exits pointer
  // lock on its own when Escape is pressed — no extra handling needed.
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== canvas) return;
      lookYaw.current -= event.movementX * MOUSE_SENSITIVITY;
      lookPitch.current = THREE.MathUtils.clamp(
        lookPitch.current - event.movementY * MOUSE_SENSITIVITY,
        MIN_LOOK_PITCH,
        MAX_LOOK_PITCH
      );
    };

    const handleClick = () => {
      // Browsers enforce a brief cooldown after Escape exits pointer lock,
      // during which a new request rejects with a SecurityError — catch it
      // so a quick re-click right after Escape doesn't surface as an
      // unhandled promise rejection.
      canvas.requestPointerLock()?.catch(() => {});
    };
    const handlePointerLockError = () => {};

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockerror", handlePointerLockError);
    window.addEventListener("mousemove", handlePointerMove);
    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("pointerlockerror", handlePointerLockError);
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const target = targetRef.current;
    if (!target) return;

    if (keys.forward || keys.backward) {
      const recenterAmount = 1 - Math.exp(-RECENTER_RATE * delta);
      lookYaw.current = THREE.MathUtils.lerp(lookYaw.current, 0, recenterAmount);
      lookPitch.current = THREE.MathUtils.lerp(lookPitch.current, 0, recenterAmount);
    }

    const combinedYaw = target.rotation.y + lookYaw.current;
    const orbit = new THREE.Euler(lookPitch.current, combinedYaw, 0, "YXZ");

    desiredPosition.current
      .copy(CAMERA_OFFSET)
      .applyEuler(orbit)
      .add(target.position);

    if (introElapsed.current < INTRO_DURATION) {
      introElapsed.current += delta;
      const t = easeOutCubic(Math.min(introElapsed.current / INTRO_DURATION, 1));
      camera.position.lerpVectors(INTRO_START_POSITION, desiredPosition.current, t);
    } else {
      camera.position.lerp(desiredPosition.current, 1 - Math.exp(-LERP_FACTOR * delta));
    }
    camera.lookAt(target.position.x, target.position.y + 1, target.position.z);
  });

  return null;
}
