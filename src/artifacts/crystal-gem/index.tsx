"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { useDeviceCapabilities } from "@/lib/use-device-capabilities";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface CrystalGemProps extends Partial<ArtifactConfigValues> {
  color?: string;
  metalness?: number;
  roughness?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  dragToRotate?: boolean;
}

export default function CrystalGem({
  color = "#8b7cf6",
  metalness = 0.4,
  roughness = 0.15,
  autoRotate = true,
  rotationSpeed = 0.4,
  dragToRotate = true,
}: CrystalGemProps) {
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        onCreated={({ gl }) => {
          // See shader-sphere/index.tsx for why this listener needs no
          // explicit cleanup: PreviewFrame unmounts the whole canvas
          // (and this listener with it) once the artifact scrolls
          // off-screen.
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("[crystal-gem] WebGL context lost — attempting restore.");
          });
        }}
      >
        <Scene
          color={color}
          metalness={Number(metalness)}
          roughness={Number(roughness)}
          autoRotate={Boolean(autoRotate) && !prefersReducedMotion}
          rotationSpeed={Number(rotationSpeed)}
          dragToRotate={Boolean(dragToRotate)}
          reducedDetail={isMobile}
        />
      </Canvas>
    </div>
  );
}
