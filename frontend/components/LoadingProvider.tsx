"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

interface LoadingState {
  isLoading: boolean;
  loadingKey: string | null;
  progress: number;
  message: string | null;
}

interface LoadingContextValue {
  state: LoadingState;
  startLoading: (key?: string, message?: string) => void;
  stopLoading: (key?: string) => void;
  setProgress: (progress: number) => void;
  setMessage: (message: string | null) => void;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

/**
 * Loading Provider
 *
 * Global loading state management for the application.
 * Coordinates loading states across components without prop drilling.
 *
 * Usage:
 * - Wrap your app with <LoadingProvider>
 * - Use useLoading() hook in any component to access/control loading state
 * - Use LoadingOverlay component to display loading UI
 */
export function LoadingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    loadingKey: null,
    progress: 0,
    message: null,
  });

  const startLoading = useCallback((key?: string, message?: string) => {
    setState({
      isLoading: true,
      loadingKey: key ?? null,
      progress: 0,
      message: message ?? null,
    });
  }, []);

  const stopLoading = useCallback((key?: string) => {
    setState((prev) => {
      // Only stop if key matches or no key specified
      if (key && prev.loadingKey !== key) {
        return prev;
      }
      return {
        isLoading: false,
        loadingKey: null,
        progress: 100,
        message: null,
      };
    });
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((prev) => ({
      ...prev,
      progress: Math.min(100, Math.max(0, progress)),
    }));
  }, []);

  const setMessage = useCallback((message: string | null) => {
    setState((prev) => ({
      ...prev,
      message,
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      startLoading,
      stopLoading,
      setProgress,
      setMessage,
    }),
    [state, startLoading, stopLoading, setProgress, setMessage]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

/**
 * Hook to access loading context
 */
export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

/**
 * Hook for async operations with automatic loading state
 */
export function useAsyncLoading() {
  const { startLoading, stopLoading, setProgress, setMessage } = useLoading();

  const runAsync = useCallback(
    async <T,>(
      key: string,
      asyncFn: (setProgress: (p: number) => void) => Promise<T>,
      message?: string
    ): Promise<T> => {
      startLoading(key, message);
      try {
        const result = await asyncFn(setProgress);
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading, setProgress]
  );

  return { runAsync, setMessage };
}

/**
 * Loading Overlay Component
 *
 * Displays a fullscreen loading overlay when global loading is active.
 * Place this in your root layout after LoadingProvider.
 */
export function LoadingOverlay() {
  const { state } = useLoading();

  if (!state.isLoading) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="progressbar"
      aria-valuenow={state.progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy={true}
      aria-label={state.message ?? "Loading"}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12">
          <svg className="h-full w-full animate-spin" viewBox="0 0 50 50">
            <circle
              className="stroke-primary opacity-25"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className="stroke-primary"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
              strokeDasharray="80, 200"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Progress bar (optional) */}
        {state.progress > 0 && (
          <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        )}

        {/* Message */}
        {state.message && (
          <p className="text-sm text-muted-foreground">{state.message}</p>
        )}
      </div>
    </div>
  );
}

export default LoadingProvider;
