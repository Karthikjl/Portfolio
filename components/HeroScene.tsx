"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { PCFShadowMap } from "three";
import type { Group } from "three";

const SCREEN_COLORS = ["#4F46E5", "#0EA5A0", "#DB2777", "#D97706"];

function Desk() {
  const groupRef = useRef<Group>(null);
  const { pointer, camera } = useThree();
  const [screenColorIndex, setScreenColorIndex] = useState(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = pointer.x * 0.6;
    const targetX = -pointer.y * 0.3;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * delta * 2;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * delta * 2;

    const baseX = 1.8;
    const baseY = 0.6;
    const dollyX = baseX + pointer.x * 0.15;
    const dollyY = baseY + pointer.y * 0.1;
    const nextX = camera.position.x + (dollyX - camera.position.x) * delta * 2;
    const nextY = camera.position.y + (dollyY - camera.position.y) * delta * 2;
    camera.position.set(nextX, nextY, camera.position.z);
    camera.lookAt(0, -0.3, 0);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.6}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* desk */}
        <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.12, 1.2]} />
          <meshStandardMaterial color="#e8e4dc" />
        </mesh>
        {/* monitor stand */}
        <mesh position={[0, -0.3, -0.3]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.1]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        {/* monitor body */}
        <mesh position={[0, 0.15, -0.3]} castShadow>
          <boxGeometry args={[1.3, 0.8, 0.06]} />
          <meshStandardMaterial color="#2b2b2b" />
        </mesh>
        {/* glowing screen — click to cycle the accent color */}
        <mesh
          position={[0, 0.15, -0.265]}
          onClick={(event) => {
            event.stopPropagation();
            setScreenColorIndex((index) => (index + 1) % SCREEN_COLORS.length);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <planeGeometry args={[1.16, 0.66]} />
          <meshStandardMaterial
            color={SCREEN_COLORS[screenColorIndex]}
            emissive={SCREEN_COLORS[screenColorIndex]}
            emissiveIntensity={1.4}
          />
        </mesh>
        {/* keyboard */}
        <mesh position={[0, -0.53, 0.25]} castShadow>
          <boxGeometry args={[0.9, 0.05, 0.32]} />
          <meshStandardMaterial color="#f5f5f0" />
        </mesh>
        {/* coffee cup */}
        <mesh position={[0.85, -0.45, 0.25]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* plant pot */}
        <mesh position={[-0.95, -0.48, 0.25]} castShadow>
          <cylinderGeometry args={[0.11, 0.09, 0.16, 16]} />
          <meshStandardMaterial color="#c96f4a" />
        </mesh>
        {/* plant leaves */}
        <mesh position={[-0.95, -0.3, 0.25]} castShadow>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#4d7c4d" />
        </mesh>
      </group>
      <ContactShadows position={[0, -0.95, 0]} opacity={0.45} scale={4} blur={2.5} far={1.2} />
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      shadows={{ type: PCFShadowMap }}
      camera={{ position: [1.8, 0.6, 2.4], fov: 40 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} castShadow />
      <directionalLight position={[-2, 1, -3]} intensity={0.3} />
      <Desk />
    </Canvas>
  );
}
