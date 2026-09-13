"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { createFacetTexture } from "./facet-texture";

interface SceneProps {
  color: string;
  metalness: number;
  roughness: number;
  autoRotate: boolean;
  rotationSpeed: number;
  dragToRotate: boolean;
  reducedDetail: boolean;
}

export function Scene({
  color,
  metalness,
  roughness,
  autoRotate,
  rotationSpeed,
  dragToRotate,
  reducedDetail,
}: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // A real CanvasTexture, not JSX-created, so R3F won't auto-dispose it
  // on unmount — that's handled explicitly below.
  const facetTexture = useMemo(() => createFacetTexture(), []);
  useEffect(() => () => facetTexture.dispose(), [facetTexture]);

  useFrame((_state, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed;
      meshRef.current.rotation.x += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} />
      <pointLight position={[-3, -2, -2]} intensity={0.6} color="#8b7cf6" />

      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.15, reducedDetail ? 0 : 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          roughnessMap={facetTexture}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          flatShading
        />
      </mesh>

      <OrbitControls
        enabled={dragToRotate}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.6}
      />
    </>
  );
}
