"use client";

import { useGLTF, Html } from "@react-three/drei";
import type { Zone } from "@/lib/zones";

const ZONE_COLORS: Record<Zone["id"], string> = {
  about: "#e0a458",
  projects: "#4f6f9f",
  skills: "#9f5f6f",
  contact: "#5f9f7f",
};

function ContactModel() {
  const { scene } = useGLTF("/models/contact.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={1}/>;
}

export function ZoneLandmark({ zone }: { zone: Zone }) {
  return (
    <group position={[zone.position.x, 0, zone.position.z]}>
      {zone.id === "contact" ? (
        <ContactModel />
      ) : (
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2, 3, 2]} />
          <meshStandardMaterial color={ZONE_COLORS[zone.id]} flatShading />
        </mesh>
      )}
      <Html position={[0, 3.5, 0]} center distanceFactor={15}>
        <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
          {zone.label}
        </div>
      </Html>
    </group>
  );
}
