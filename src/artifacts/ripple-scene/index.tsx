"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { useDeviceCapabilities } from "@/lib/use-device-capabilities";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface RippleSceneProps extends Partial<ArtifactConfigValues> {
  color?: string;
  rippleStrength?: number;
  waveSpeed?: number;
  mouseInfluence?: number;
  autoRipple?: boolean;
}

export default function RippleScene({
  color = "#4fb8c9",
  rippleStrength = 0.4,
  waveSpeed = 1.2,
  mouseInfluence = 1,
  autoRipple = true,
}: RippleSceneProps) {
  const { isMobile } = useDeviceCapabilities();

  return (
    <div className="h-full w-full">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 2.6], fov: 50 }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn("[ripple-scene] WebGL context lost — attempting restore.");
          });
        }}
      >
        <Scene
          color={color}
          rippleStrength={Number(rippleStrength)}
          waveSpeed={Number(waveSpeed)}
          mouseInfluence={Number(mouseInfluence)}
          autoRipple={Boolean(autoRipple)}
          reducedDetail={isMobile}
        />
      </Canvas>
    </div>
  );
}
