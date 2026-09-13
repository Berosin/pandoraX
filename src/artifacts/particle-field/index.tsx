"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { useDeviceCapabilities } from "@/lib/use-device-capabilities";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface ParticleFieldProps extends Partial<ArtifactConfigValues> {
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  noiseScale?: number;
  turbulence?: number;
  color?: string;
}

const MOBILE_PARTICLE_CAP = 700;

export default function ParticleField({
  particleCount = 1500,
  particleSize = 2.4,
  speed = 0.6,
  noiseScale = 1,
  turbulence = 0.6,
  color = "#6c9ceb",
}: ParticleFieldProps) {
  const { isMobile } = useDeviceCapabilities();
  const effectiveCount = isMobile
    ? Math.min(Number(particleCount), MOBILE_PARTICLE_CAP)
    : Number(particleCount);

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 4], fov: 50 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("[particle-field] WebGL context lost — attempting restore.");
          });
        }}
      >
        <Scene
          particleCount={effectiveCount}
          particleSize={Number(particleSize)}
          speed={Number(speed)}
          noiseScale={Number(noiseScale)}
          turbulence={Number(turbulence)}
          color={color}
        />
      </Canvas>
    </div>
  );
}
