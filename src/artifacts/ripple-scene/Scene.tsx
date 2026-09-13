"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders";

interface SceneProps {
  color: string;
  rippleStrength: number;
  waveSpeed: number;
  mouseInfluence: number;
  autoRipple: boolean;
  reducedDetail: boolean;
}

const RIPPLE_SLOTS = 4;
const AUTO_RIPPLE_INTERVAL = 2.4;

export function Scene({
  color,
  rippleStrength,
  waveSpeed,
  mouseInfluence,
  autoRipple,
  reducedDetail,
}: SceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useThree((state) => state.pointer);

  const rippleOrigins = useMemo(
    () => Array.from({ length: RIPPLE_SLOTS }, () => new THREE.Vector2(0, 0)),
    []
  );
  const nextSlot = useRef(0);
  const lastTriggerTime = useRef(-10);
  const nextAutoRipple = useRef(AUTO_RIPPLE_INTERVAL);

  // uRippleTimes' initial array is created inline here rather than as
  // its own separate ref/memo — reading another ref's `.current` while
  // building this object (during render) isn't allowed, so the array
  // literal is constructed directly as part of this one.
  const uniforms = useRef({
    uTime: { value: 0 },
    uRippleOrigins: { value: rippleOrigins },
    uRippleTimes: { value: Array<number>(RIPPLE_SLOTS).fill(-10) },
    uRippleStrength: { value: rippleStrength },
    uWaveSpeed: { value: waveSpeed },
    uColor: { value: new THREE.Color(color) },
  });

  useEffect(() => {
    uniforms.current.uRippleStrength.value = rippleStrength;
  }, [rippleStrength]);
  useEffect(() => {
    uniforms.current.uWaveSpeed.value = waveSpeed;
  }, [waveSpeed]);
  useEffect(() => {
    uniforms.current.uColor.value.set(color);
  }, [color]);

  // Only ever called from event handlers and the useFrame callback
  // below — never during render — so mutating uniforms.current's
  // arrays in place here is the same accepted pattern as the
  // `uniforms.current.uTime.value += delta` line further down.
  function triggerRipple(x: number, y: number, time: number) {
    const slot = nextSlot.current % RIPPLE_SLOTS;
    rippleOrigins[slot].set(x, y);
    uniforms.current.uRippleTimes.value[slot] = time;
    nextSlot.current += 1;
    lastTriggerTime.current = time;
  }

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    triggerRipple(event.point.x, event.point.y, uniforms.current.uTime.value);
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    // Buttons bitmask is non-zero while a pointer button is held —
    // only spawn ripples continuously while actively dragging.
    if (event.buttons === 0) return;
    const time = uniforms.current.uTime.value;
    if (time - lastTriggerTime.current < 0.15) return;
    triggerRipple(event.point.x, event.point.y, time);
  }

  useFrame((_state, delta) => {
    const time = (uniforms.current.uTime.value += delta);

    if (autoRipple && time >= nextAutoRipple.current) {
      const x = (Math.random() - 0.5) * 2.6;
      const y = (Math.random() - 0.5) * 1.6;
      triggerRipple(x, y, time);
      nextAutoRipple.current = time + AUTO_RIPPLE_INTERVAL;
    }

    if (meshRef.current) {
      const targetX = -pointer.y * 0.15 * mouseInfluence;
      const targetY = pointer.x * 0.15 * mouseInfluence;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetX,
        0.06
      );
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetY,
        0.06
      );
    }
  });

  // eslint-disable-next-line react-hooks/refs -- see shader-sphere/Scene.tsx
  const initialUniforms = uniforms.current;
  const segments = reducedDetail ? 48 : 100;

  return (
    <mesh ref={meshRef} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
      <planeGeometry args={[4, 2.6, segments, segments]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={initialUniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
