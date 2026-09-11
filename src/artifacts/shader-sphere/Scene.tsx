"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

interface SceneProps {
  colorA: string;
  colorB: string;
}

export function Scene({ colorA, colorB }: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const pulse = useRef(0);

  // Held in a ref, not useMemo — this object is intentionally mutated
  // every frame inside useFrame below (the standard, performant R3F
  // pattern: mutate in place rather than trigger a React re-render per
  // frame). A ref's .current is the correct place for that; useMemo's
  // return value is not meant to be mutated after the fact.
  const uniforms = useRef({
    uTime: { value: 0 },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
  });

  useEffect(() => {
    uniforms.current.uColorA.value.set(colorA);
  }, [colorA]);

  useEffect(() => {
    uniforms.current.uColorB.value.set(colorB);
  }, [colorB]);

  useFrame((_state, delta) => {
    uniforms.current.uTime.value += delta;
    pulse.current = Math.max(0, pulse.current - delta * 2);

    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += delta * 0.15 + pointer.current.x * 0.01;
    mesh.rotation.x = THREE.MathUtils.lerp(
      mesh.rotation.x,
      pointer.current.y * 0.4,
      0.06
    );

    const scale = 1 + pulse.current * 0.12;
    mesh.scale.setScalar(scale);
  });

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (!event.uv) return;
    pointer.current = { x: event.uv.x - 0.5, y: event.uv.y - 0.5 };
  }

  function handleClick() {
    pulse.current = 1;
  }

  // Reading ref.current during render is normally discouraged — here
  // it's the one-time initial value handed to Three.js's ShaderMaterial
  // constructor via R3F. After this, the object is only ever mutated
  // imperatively inside useFrame above, which is the correct,
  // render-independent path for per-frame GPU uniform updates.
  // eslint-disable-next-line react-hooks/refs
  const initialUniforms = uniforms.current;

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      <icosahedronGeometry args={[1.3, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
      />
    </mesh>
  );
}