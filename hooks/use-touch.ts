"use client";

import { useState, useEffect, useCallback, useRef, RefObject } from "react";

// ============================================
// Constants (extracted from inline magic numbers)
// ============================================
const SWIPE_THRESHOLD_PX = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;
const LONG_PRESS_DEFAULT_MS = 500;
const DOUBLE_TAP_DELAY_MS = 300;
const PULL_TO_REFRESH_THRESHOLD_PX = 80;
const PINCH_MIN_DISTANCE = 10;
const HAPTIC_DURATIONS = { light: 10, medium: 25, heavy: 50, success: [10, 30, 10], error: [30, 10, 30] } as const;

// ============================================
// Touch Detection
// ============================================

/**
 * useTouchDevice - Detect if the device supports touch
 * 
 * @returns boolean indicating if the device is a touch device
 */
export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          // @ts-ignore - IE fallback
          (window.DocumentTouch && document instanceof window.DocumentTouch)
      );
    };

    checkTouch();
  }, []);

  return isTouchDevice;
}

// ============================================
// Swipe Gestures
// ============================================

interface SwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  preventDefault?: boolean;
}

interface SwipeState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/**
 * useSwipe - Hook for detecting swipe gestures
 * 
 * @param options - Configuration for swipe detection
 * @returns Ref to attach to the element and swipe state
 * 
 * @example
 * const { ref, swipeDirection } = useSwipe({
 *   threshold: 50,
 *   onSwipeLeft: () => console.log("Swiped left"),
 * });
 * 
 * return <div ref={ref}>Swipe me</div>;
 */
export function useSwipe<T extends HTMLElement = HTMLDivElement>(
  options: SwipeOptions = {}
) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    preventDefault = false,
  } = options;

  const ref = useRef<T>(null);
  const [swipeDirection, setSwipeDirection] = useState<
    "left" | "right" | "up" | "down" | null
  >(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (preventDefault) e.preventDefault();
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const startX = touchStart.current.x;
      const startY = touchStart.current.y;

      const diffX = startX - endX;
      const diffY = startY - endY;

      // Determine primary direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            setSwipeDirection("left");
            onSwipeLeft?.();
          } else {
            setSwipeDirection("right");
            onSwipeRight?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > threshold) {
          if (diffY > 0) {
            setSwipeDirection("up");
            onSwipeUp?.();
          } else {
            setSwipeDirection("down");
            onSwipeDown?.();
          }
        }
      }

      touchStart.current = null;
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: !preventDefault });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, preventDefault]);

  return { ref, swipeDirection };
}

// ============================================
// Long Press
// ============================================

interface LongPressOptions {
  threshold?: number;
  onLongPress: () => void;
  onClick?: () => void;
}

/**
 * useLongPress - Hook for detecting long press gestures
 * 
 * @param options - Configuration for long press detection
 * @returns Event handlers to attach to the element
 * 
 * @example
 * const longPressProps = useLongPress({
 *   threshold: 500,
 *   onLongPress: () => console.log("Long pressed!"),
 * });
 * 
 * return <button {...longPressProps}>Press and hold</button>;
 */
export function useLongPress(options: LongPressOptions) {
  const { threshold = 500, onLongPress, onClick } = options;
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (event.type === "mousedown") {
        const mouseEvent = event as React.MouseEvent;
        if (mouseEvent.button !== 0) return;
      }

      // Clear any existing timer to prevent leaks on rapid re-trigger
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      isLongPress.current = false;
      setIsPressing(true);

      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        onLongPress();
        setIsPressing(false);
      }, threshold);
    },
    [threshold, onLongPress]
  );

  const stop = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setIsPressing(false);

      if (!isLongPress.current && onClick) {
        onClick();
      }
    },
    [onClick]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: stop,
    isPressing,
  };
}

// ============================================
// Haptic Feedback
// ============================================

/**
 * useHapticFeedback - Hook for triggering haptic feedback
 * 
 * Uses the Vibration API on supported devices
 * 
 * @example
 * const { trigger } = useHapticFeedback();
 * 
 * <button onClick={() => trigger("light")}>Click</button>
 */
export function useHapticFeedback() {
  const isSupported = typeof navigator !== "undefined" && "vibrate" in navigator;

  const trigger = useCallback(
    (pattern: "light" | "medium" | "heavy" | "success" | "error" | number[] = "medium") => {
      if (!isSupported) return;

      const patterns = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        error: [30, 50, 30],
      };

      const vibrationPattern = Array.isArray(pattern) ? pattern : patterns[pattern];
      navigator.vibrate(vibrationPattern);
    },
    [isSupported]
  );

  return { trigger, isSupported };
}

// ============================================
// Touch vs Mouse Event Handling
// ============================================

/**
 * useTouchOrMouse - Hook that handles both touch and mouse events
 * 
 * Prevents duplicate firing when both events are triggered
 * 
 * @param handlers - Event handlers
 * @returns Unified event handlers
 */
export function useTouchOrMouse(handlers: {
  onStart?: () => void;
  onMove?: (x: number, y: number) => void;
  onEnd?: () => void;
}) {
  const { onStart, onMove, onEnd } = handlers;
  const isTouch = useRef(false);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.type === "touchstart") {
        isTouch.current = true;
      } else if (isTouch.current) {
        return; // Ignore mouse events after touch
      }
      onStart?.();
    },
    [onStart]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.type === "mousemove" && isTouch.current) return;

      let clientX: number;
      let clientY: number;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      onMove?.(clientX, clientY);
    },
    [onMove]
  );

  const handleEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.type === "mouseup" && isTouch.current) {
        isTouch.current = false;
        return;
      }
      if (e.type === "touchend") {
        isTouch.current = false;
      }
      onEnd?.();
    },
    [onEnd]
  );

  return {
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onMouseLeave: handleEnd,
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
  };
}

// ============================================
// Pull to Refresh
// ============================================

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

/**
 * usePullToRefresh - Hook for implementing pull-to-refresh
 * 
 * @param options - Configuration for pull-to-refresh
 * @returns Ref, state, and handlers
 */
export function usePullToRefresh<T extends HTMLElement = HTMLDivElement>(
  options: PullToRefreshOptions
) {
  const { onRefresh, threshold = 80, maxPullDistance = 120 } = options;
  const ref = useRef<T>(null);
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });
  const startY = useRef(0);
  const isAtTop = useRef(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      isAtTop.current = element.scrollTop <= 0;
      if (isAtTop.current) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTop.current || state.isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0) {
        e.preventDefault();
        const distance = Math.min(diff * 0.5, maxPullDistance);
        setState((prev) => ({ ...prev, isPulling: true, pullDistance: distance }));
      }
    };

    const handleTouchEnd = async () => {
      if (!state.isPulling) return;

      if (state.pullDistance >= threshold) {
        setState((prev) => ({ ...prev, isRefreshing: true }));
        await onRefresh();
      }

      setState({
        isPulling: false,
        pullDistance: 0,
        isRefreshing: false,
      });
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onRefresh, threshold, maxPullDistance, state.isPulling, state.isRefreshing, state.pullDistance]);

  return { ref, ...state };
}

// ============================================
// Double Tap
// ============================================

interface DoubleTapOptions {
  onDoubleTap: () => void;
  delay?: number;
}

/**
 * useDoubleTap - Hook for detecting double tap gestures
 * 
 * @param options - Configuration for double tap detection
 * @returns Event handlers
 */
export function useDoubleTap(options: DoubleTapOptions) {
  const { onDoubleTap, delay = 300 } = options;
  const lastTap = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap.current;

      if (tapLength < delay && tapLength > 0) {
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = null;
        }
        onDoubleTap();
        lastTap.current = 0;
      } else {
        lastTap.current = currentTime;
        timer.current = setTimeout(() => {
          lastTap.current = 0;
        }, delay);
      }
    },
    [onDoubleTap, delay]
  );

  return {
    onClick: handleTap,
    onTouchEnd: handleTap,
  };
}

// ============================================
// Pinch to Zoom
// ============================================

interface PinchOptions {
  onPinchStart?: () => void;
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: () => void;
}

/**
 * usePinch - Hook for detecting pinch gestures
 * 
 * @param options - Configuration for pinch detection
 * @returns Ref to attach to the element
 */
export function usePinch<T extends HTMLElement = HTMLDivElement>(
  options: PinchOptions = {}
) {
  const { onPinchStart, onPinchMove, onPinchEnd } = options;
  const ref = useRef<T>(null);
  const initialDistance = useRef(0);
  const currentScale = useRef(1);
  const isPinching = useRef(false);

  const getDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isPinching.current = true;
        initialDistance.current = getDistance(e.touches);
        onPinchStart?.();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPinching.current || e.touches.length !== 2) return;

      const distance = getDistance(e.touches);
      const scale = distance / initialDistance.current;
      currentScale.current = scale;
      onPinchMove?.(scale);
    };

    const handleTouchEnd = () => {
      if (isPinching.current) {
        isPinching.current = false;
        onPinchEnd?.();
      }
    };

    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchmove", handleTouchMove, { passive: true });
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onPinchStart, onPinchMove, onPinchEnd]);

  return ref;
}
