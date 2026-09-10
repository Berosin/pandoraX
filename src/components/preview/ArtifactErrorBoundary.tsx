"use client";

import { Component } from "react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ArtifactErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Scoped to this preview only — logged, never rethrown, never
    // allowed to propagate into the rest of the page tree.
    console.error("[PandoraX] artifact preview crashed:", error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-medium text-cream">
              Artifact unavailable
            </p>
            <p className="max-w-xs text-xs text-muted">
              Something went wrong while loading this experience.
            </p>
            <button
              onClick={this.reset}
              className="text-xs font-medium text-bronze hover:underline"
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
