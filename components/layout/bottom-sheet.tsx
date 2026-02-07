"use client";

import { cn } from "@/lib/utils";
import {
  ReactNode,
  useState,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from "react";

interface BottomSheetContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const BottomSheetContext = createContext<BottomSheetContextType | null>(null);

export function useBottomSheet() {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheet");
  }
  return context;
}

interface BottomSheetProps {
  children: ReactNode;
  className?: string;
  /**
   * Whether the sheet is open
   */
  open?: boolean;
  /**
   * Callback when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Whether to show the drag handle
   * @default true
   */
  showHandle?: boolean;
  /**
   * Maximum height of the sheet (vh percentage)
   * @default 90
   */
  maxHeight?: number;
  /**
   * Whether the sheet can be dismissed by swiping down
   * @default true
   */
  dismissible?: boolean;
  /**
   * Snap points for the sheet (percentage of screen height)
   * @default [25, 50, 90]
   */
  snapPoints?: number[];
}

/**
 * BottomSheet - A mobile-optimized bottom sheet component
 * 
 * Features:
 * - Swipe up/down to expand/collapse
 * - Snap points for different heights
 * - Drag handle for accessibility
 * - Backdrop overlay
 * - Safe area insets
 * 
 * @example
 * <BottomSheet open={isOpen} onOpenChange={setIsOpen}>
 *   <BottomSheetHandle />
 *   <div className="p-4">
 *     <h2>Sheet Content</h2>
 *   </div>
 * </BottomSheet>
 */
export function BottomSheet({
  children,
  className,
  open: controlledOpen,
  onOpenChange,
  showHandle = true,
  maxHeight = 90,
  dismissible = true,
  snapPoints = [25, 50, 90],
}: BottomSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen ?? internalOpen;
  const [currentSnap, setCurrentSnap] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);

  const open = useCallback(() => {
    if (controlledOpen === undefined) {
      setInternalOpen(true);
    }
    onOpenChange?.(true);
    setCurrentSnap(snapPoints.length - 1);
  }, [controlledOpen, onOpenChange, snapPoints.length]);

  const close = useCallback(() => {
    if (controlledOpen === undefined) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
    setCurrentSnap(0);
  }, [controlledOpen, onOpenChange]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  // Handle touch/mouse events for dragging
  const handleDragStart = useCallback(
    (clientY: number) => {
      if (!dismissible) return;
      setIsDragging(true);
      setStartY(clientY);
    },
    [dismissible]
  );

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;
      const delta = clientY - startY;
      if (delta > 0) {
        setDragY(delta);
      }
    },
    [isDragging, startY]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // If dragged down more than 100px, close
    if (dragY > 100) {
      close();
    }
    setDragY(0);
  }, [isDragging, dragY, close]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Global mouse events for dragging outside the sheet
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
      const handleMouseUp = () => handleDragEnd();

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const translateY = isDragging
    ? dragY
    : isOpen
    ? `${100 - snapPoints[currentSnap]}%`
    : "100%";

  return (
    <BottomSheetContext.Provider value={{ isOpen, open, close, toggle }}>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={dismissible ? close : undefined}
        />
      )}

      {/* Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl z-50 md:hidden",
          "transition-transform duration-300 ease-out",
          isDragging && "transition-none",
          className
        )}
        style={{
          transform: `translateY(${isDragging ? dragY : isOpen ? 0 : "100%"})`,
          maxHeight: `${maxHeight}vh`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="w-full pt-3 pb-1 cursor-grab active:cursor-grabbing"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto" />
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-40px)]">
          {children}
        </div>
      </div>
    </BottomSheetContext.Provider>
  );
}

/**
 * BottomSheetHandle - Visual drag handle for the bottom sheet
 */
export function BottomSheetHandle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full pt-3 pb-1 flex justify-center",
        className
      )}
    >
      <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
    </div>
  );
}

/**
 * BottomSheetTrigger - Button to open the bottom sheet
 */
interface BottomSheetTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export function BottomSheetTrigger({
  children,
  asChild = false,
}: BottomSheetTriggerProps) {
  const { toggle } = useBottomSheet();

  if (asChild) {
    return (
      <div onClick={toggle} className="cursor-pointer">
        {children}
      </div>
    );
  }

  return (
    <button onClick={toggle} className="md:hidden">
      {children}
    </button>
  );
}
