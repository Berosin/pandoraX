"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { CrystalModel } from "./CrystalModel";
import { createGridTexture } from "./grid-texture";

interface SceneProps {
  ambientIntensity: number;
  pointLightColor: string;
  autoRotate: boolean;
  starCount: number;
  bloomIntensity: number;
  bloomThreshold: number;
  enablePostProcessing: boolean;
}

export function Scene({
  ambientIntensity,
  pointLightColor,
  autoRotate,
  starCount,
  bloomIntensity,
  bloomThreshold,
  enablePostProcessing,
}: SceneProps) {
  const lightsGroupRef = useRef<THREE.Group>(null);

  const gridTexture = useMemo(() => createGridTexture(), []);
  useEffect(() => () => gridTexture.dispose(), [gridTexture]);

  useFrame((_state, delta) => {
    if (lightsGroupRef.current) {
      lightsGroupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#0b0a12", 3, 9]} />
      <ambientLight intensity={ambientIntensity} />

      <group ref={lightsGroupRef}>
        <pointLight position={[2.2, 1.2, 1.5]} intensity={3} color={pointLightColor} />
        <pointLight position={[-2.2, -0.8, -1.5]} intensity={2} color="#4fb8c9" />
      </group>

      <Stars radius={9} depth={20} count={starCount} factor={2} fade speed={0.4} />

      <Suspense fallback={null}>
        <CrystalModel />
      </Suspense>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={gridTexture} transparent opacity={0.4} color="#888" />
      </mesh>

      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={0.6}
        enablePan={false}
        minDistance={2.5}
        maxDistance={6}
      />

      {enablePostProcessing && (
        <EffectComposer>
          <Bloom
            intensity={bloomIntensity}
            luminanceThreshold={bloomThreshold}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}
