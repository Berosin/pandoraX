"use client";

import { useEffect, useRef, useState } from "react";
import { createProgram, hexToRgb01, QUAD_VERTICES } from "./webgl-utils";
import { vertexShader, fragmentShader } from "./shaders";
import { useDeviceCapabilities } from "@/lib/use-device-capabilities";
import type { ArtifactConfigValues } from "@/types/artifact";

export interface ShaderBackdropProps extends Partial<ArtifactConfigValues> {
  colorA?: string;
  colorB?: string;
  speed?: number;
  scale?: number;
  warp?: number;
}

/**
 * Unlike every other Phase 11 artifact, this one manages its own raw
 * WebGL2 context directly — no react-three-fiber — to demonstrate the
 * platform supports both. That also means it's the one artifact that
 * needs its own explicit "WebGL unavailable" check: R3F/Three would
 * throw on init failure (caught by the shared ArtifactErrorBoundary
 * every preview already sits inside), but `canvas.getContext()`
 * returning null doesn't throw, so nothing would catch it otherwise.
 */
export default function ShaderBackdrop({
  colorA = "#1b1240",
  colorB = "#6c3fd1",
  speed = 0.25,
  scale = 1.4,
  warp = 0.6,
}: ShaderBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [unsupported, setUnsupported] = useState(false);
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();

  // Read inside the render loop instead of re-running the whole WebGL
  // setup effect on every config tweak or capability change — compiling
  // and linking a new program per slider tick would be wasteful.
  const configRef = useRef({ colorA, colorB, speed, scale, warp });
  useEffect(() => {
    configRef.current = { colorA, colorB, speed, scale, warp };
  }, [colorA, colorB, speed, scale, warp]);

  const qualityRef = useRef({ isMobile, prefersReducedMotion });
  useEffect(() => {
    qualityRef.current = { isMobile, prefersReducedMotion };
  }, [isMobile, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) {
      setUnsupported(true);
      return;
    }

    let program: WebGLProgram;
    let buffer: WebGLBuffer | null;
    try {
      program = createProgram(gl, vertexShader, fragmentShader);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

      const positionLoc = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    } catch (error) {
      console.error("[shader-backdrop] WebGL setup failed:", error);
      // Deliberate: this is the mount-time "does this environment
      // actually support what I need" check, discovered only inside
      // this effect (shader compile/link can fail even when a context
      // was obtained). There's no external-system subscription to
      // model this as instead — it's a one-time capability probe.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnsupported(true);
      return;
    }

    const uniforms = {
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uColorA: gl.getUniformLocation(program, "uColorA"),
      uColorB: gl.getUniformLocation(program, "uColorB"),
      uScale: gl.getUniformLocation(program, "uScale"),
      uWarp: gl.getUniformLocation(program, "uWarp"),
    };

    gl.useProgram(program);

    function resize() {
      if (!canvas) return;
      const dprCap = qualityRef.current.isMobile ? 1 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl!.viewport(0, 0, width, height);
      gl!.uniform2f(uniforms.uResolution, width, height);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    let raf = 0;
    let elapsed = 0;
    let lastTime = performance.now();

    function frame(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      // Reduced-motion: keep the shader rendered, just stop advancing time.
      if (!qualityRef.current.prefersReducedMotion) {
        elapsed += dt * configRef.current.speed;
      }

      const [ar, ag, ab] = hexToRgb01(configRef.current.colorA);
      const [br, bg, bb] = hexToRgb01(configRef.current.colorB);

      gl!.uniform1f(uniforms.uTime, elapsed);
      gl!.uniform3f(uniforms.uColorA, ar, ag, ab);
      gl!.uniform3f(uniforms.uColorB, br, bg, bb);
      gl!.uniform1f(uniforms.uScale, configRef.current.scale);
      gl!.uniform1f(uniforms.uWarp, configRef.current.warp);

      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      // Proactively frees the context rather than waiting on GC —
      // WebGL contexts are a scarce, browser-limited resource, and
      // PreviewFrame mounts/unmounts this artifact every time it
      // scrolls in and out of view.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (unsupported) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised p-6 text-center">
        <p className="text-sm font-medium text-foreground">WebGL unavailable</p>
        <p className="max-w-xs text-xs text-muted">
          This background needs WebGL, which isn&apos;t available in this browser.
        </p>
      </div>
    );
  }

  return <canvas ref={canvasRef} className="block h-full w-full" />;
}
