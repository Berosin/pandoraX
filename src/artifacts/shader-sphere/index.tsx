"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface ShaderSphereProps extends Partial<ArtifactConfigValues> {
  colorA?: string;
  colorB?: string;
}

export default function ShaderSphere({
  colorA = "#3aa88c",
  colorB = "#7859c8",
}: ShaderSphereProps) {
  return (
    <div className="h-40 w-40 sm:h-48 sm:w-48">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "low-power" }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        onCreated={({ gl }) => {
          // If the GPU context is lost (driver crash, resource
          // exhaustion, OS-level reclaim), prevent the default
          // "lost forever" behavior so the browser can attempt to
          // restore it. This listener is discarded along with the
          // canvas element if this artifact unmounts — PreviewFrame
          // unmounts off-screen artifacts entirely (see
          // PREVIEW_ARCHITECTURE.md), so there's nothing to explicitly
          // remove here.
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            console.warn(
              "[shader-sphere] WebGL context lost — attempting restore."
            );
          });
        }}
      >
        <Scene colorA={colorA} colorB={colorB} />
      </Canvas>
    </div>
  );
}