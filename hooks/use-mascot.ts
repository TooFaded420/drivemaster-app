"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  MascotEmotion,
  MascotState,
  MASCOT_MESSAGES,
} from "@/lib/constants/mascot";

interface UseMascotOptions {
  initialEmotion?: MascotEmotion;
  autoHideDelay?: number;
  respectReducedMotion?: boolean;
}

export function useMascot(options: UseMascotOptions = {}) {
  const {
    initialEmotion = "happy",
    autoHideDelay = 5000,
    respectReducedMotion = true,
  } = options;

  const [state, setState] = useState<MascotState>({
    emotion: initialEmotion,
    message: "",
    title: undefined,
    isVisible: false,
    isAnimating: true,
  });

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (respectReducedMotion && typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [respectReducedMotion]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const show = useCallback(
    (emotion: MascotEmotion, message: string, title?: string) => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      setState({
        emotion,
        message,
        title,
        isVisible: true,
        isAnimating: !prefersReducedMotion,
      });

      // Auto-hide after delay
      hideTimeoutRef.current = setTimeout(() => {
        setState((prev) => ({ ...prev, isVisible: false }));
      }, autoHideDelay);
    },
    [autoHideDelay, prefersReducedMotion]
  );

  const hide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const celebrate = useCallback(
    (customMessage?: string) => {
      const messages = MASCOT_MESSAGES.correctAnswer.messages;
      const randomMessage = customMessage || messages[Math.floor(Math.random() * messages.length)];
      show("excited", randomMessage, MASCOT_MESSAGES.correctAnswer.title);
    },
    [show]
  );

  const encourage = useCallback(
    (customMessage?: string) => {
      const messages = MASCOT_MESSAGES.wrongAnswer.messages;
      const randomMessage = customMessage || messages[Math.floor(Math.random() * messages.length)];
      show("encouraging", randomMessage, MASCOT_MESSAGES.wrongAnswer.title);
    },
    [show]
  );

  const think = useCallback(
    (customMessage?: string, customTitle?: string) => {
      show(
        "thinking",
        customMessage || "Let me think about this...",
        customTitle || "Hmm..."
      );
    },
    [show]
  );

  const welcome = useCallback(() => {
    show(
      "happy",
      MASCOT_MESSAGES.welcome.message,
      MASCOT_MESSAGES.welcome.title
    );
  }, [show]);

  const reset = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setState({
      emotion: initialEmotion,
      message: "",
      title: undefined,
      isVisible: false,
      isAnimating: !prefersReducedMotion,
    });
  }, [initialEmotion, prefersReducedMotion]);

  const setEmotion = useCallback((emotion: MascotEmotion) => {
    setState((prev) => ({ ...prev, emotion }));
  }, []);

  const setMessage = useCallback((message: string, title?: string) => {
    setState((prev) => ({ ...prev, message, title }));
  }, []);

  return {
    // State
    emotion: state.emotion,
    message: state.message,
    title: state.title,
    isVisible: state.isVisible,
    isAnimating: state.isAnimating,
    prefersReducedMotion,

    // Actions
    show,
    hide,
    celebrate,
    encourage,
    think,
    welcome,
    reset,
    setEmotion,
    setMessage,
  };
}

export type UseMascotReturn = ReturnType<typeof useMascot>;
