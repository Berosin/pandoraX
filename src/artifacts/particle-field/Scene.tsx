"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

interface SceneProps {
  particleCount: number;
  particleSize: number;
  speed: number;
  noiseScale: number;
  turbulence: number;
  color: string;
}

/** Uniform-distribution-in-a-sphere sample (rejection-free via a cube
 * root radius correction), not just a cube fill — keeps the field
 * looking like a cloud rather than a box. */
function randomInSphere(radius: number): [number, number, number] {
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ];
}

export function Scene({
  particleCount,
  particleSize,
  speed,
  noiseScale,
  turbulence,
  color,
}: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dpr = useThree((state) => state.viewport.dpr);

  // Rebuilt only when the particle count actually changes — every other
  // config knob updates a uniform instead, which is far cheaper than
  // regenerating tens of thousands of floats on every slider tick.
  const geometry = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const [x, y, z] = randomInSphere(2.2);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      // Deliberate: each regeneration (only on particleCount change,
      // see the dependency array below) should scatter particles
      // freshly. There's no correctness requirement that this be
      // idempotent — an extra re-run would just look like a
      // different, equally valid particle cloud, not a bug.
      // eslint-disable-next-line react-hooks/purity
      seeds[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [particleCount]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useRef({
    uTime: { value: 0 },
    uSize: { value: particleSize },
    uSpeed: { value: speed },
    uNoiseScale: { value: noiseScale },
    uTurbulence: { value: turbulence },
    uDpr: { value: dpr },
    uColor: { value: new THREE.Color(color) },
  });

  useEffect(() => {
    uniforms.current.uSize.value = particleSize;
  }, [particleSize]);
  useEffect(() => {
    uniforms.current.uSpeed.value = speed;
  }, [speed]);
  useEffect(() => {
    uniforms.current.uNoiseScale.value = noiseScale;
  }, [noiseScale]);
  useEffect(() => {
    uniforms.current.uTurbulence.value = turbulence;
  }, [turbulence]);
  useEffect(() => {
    uniforms.current.uDpr.value = dpr;
  }, [dpr]);
  useEffect(() => {
    uniforms.current.uColor.value.set(color);
  }, [color]);

  useFrame((_state, delta) => {
    uniforms.current.uTime.value += delta;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  // eslint-disable-next-line react-hooks/refs -- see shader-sphere/Scene.tsx
  const initialUniforms = uniforms.current;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
