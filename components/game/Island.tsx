"use client";

export function Island() {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <cylinderGeometry args={[18, 20, 1, 8]} />
        <meshStandardMaterial color="#6fae5c" flatShading />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[17, 8]} />
        <meshStandardMaterial color="#8fce6c" flatShading />
      </mesh>
    </group>
  );
}
