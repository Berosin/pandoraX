"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewportOptions {
  /** Grows the intersection root outward so mounting happens just before
   * the element is actually visible, avoiding a pop-in flash. */
  rootMargin?: string;
  threshold?: number;
}

/**
 * Tracks whether an element is both scrolled into view AND the browser
 * tab is active. PreviewFrame uses this to mount/unmount an artifact's
 * live component — off-screen or backgrounded previews stop consuming
 * GPU/CPU entirely rather than just visually hiding.
 */
export function useInViewport<T extends Element>({
  rootMargin = "200px 0px",
  threshold = 0,
}: UseInViewportOptions = {}) {
  const ref = useRef<T>(null);
  const [intersecting, setIntersecting] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin, threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  useEffect(() => {
    function handleVisibilityChange() {
      setTabVisible(document.visibilityState === "visible");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return { ref, inViewport: intersecting && tabVisible };
}