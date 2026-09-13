"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { useDeviceCapabilities } from "@/lib/use-device-capabilities";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface ThreejsEnvironmentProps extends Partial<ArtifactConfigValues> {
  ambientIntensity?: number;
  pointLightColor?: string;
  autoRotate?: boolean;
  starCount?: number;
  bloomIntensity?: number;
  bloomThreshold?: number;
}

const MOBILE_STAR_CAP = 500;

export default function ThreejsEnvironment({
  ambientIntensity = 0.5,
  pointLightColor = "#8b7cf6",
  autoRotate = true,
  starCount = 1200,
  bloomIntensity = 1.2,
  bloomThreshold = 0.4,
}: ThreejsEnvironmentProps) {
  const { isMobile, isLowPower, prefersReducedMotion } = useDeviceCapabilities();

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0.4, 4], fov: 45 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("[threejs-environment] WebGL context lost — attempting restore.");
          });
        }}
      >
        <Scene
          ambientIntensity={Number(ambientIntensity)}
          pointLightColor={pointLightColor}
          autoRotate={Boolean(autoRotate) && !prefersReducedMotion}
          starCount={isMobile ? Math.min(Number(starCount), MOBILE_STAR_CAP) : Number(starCount)}
          bloomIntensity={Number(bloomIntensity)}
          bloomThreshold={Number(bloomThreshold)}
          // Bloom's multi-pass blur is one of the more expensive things
          // a preview here can do — skip it entirely on mobile/low-power
          // hardware rather than rendering a degraded version of it.
          enablePostProcessing={!isMobile && !isLowPower}
        />
      </Canvas>
    </div>
  );
}
