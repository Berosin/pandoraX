"use client";

import { useGLTF } from "@react-three/drei";
import { getArtifactAssetUrl } from "@/lib/artifact-assets";

const MODEL_URL = getArtifactAssetUrl({ slug: "threejs-environment" }, "crystals.glb");

/**
 * A real glTF binary (.glb) load — five separate mesh nodes, each with
 * its own PBR material, generated once by a one-off script from plain
 * Three.js geometry and hand-serialized to a spec-compliant .glb (see
 * the artifact's README for how). `useGLTF` suspends while it fetches
 * and parses, which is why this is split into its own component: the
 * <Suspense> wrapping it in Scene.tsx only needs to cover this, not
 * the lights/fog/stars/ground that can render immediately.
 */
export function CrystalModel() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} scale={1.15} />;
}

useGLTF.preload(MODEL_URL);
