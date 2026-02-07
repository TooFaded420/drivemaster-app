"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState, useEffect } from "react";
import { Plus, X, ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface ActionItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: "default" | "primary" | "secondary" | "destructive";
}

interface FloatingActionButtonProps {
  /**
   * Main icon when closed
   * @default Plus
   */
  icon?: ReactNode;
  /**
   * Icon when expanded
   * @default X
   */
  closeIcon?: ReactNode;
  /**
   * Additional actions to show when expanded
   */
  actions?: ActionItem[];
  /**
   * Click handler for the main button (when no actions)
   */
  onClick?: () => void;
  /**
   * Position on screen
   * @default "bottom-right"
   */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  /**
   * Visual variant
   * @default "primary"
   */
  variant?: "default" | "primary" | "secondary" | "outline";
  /**
   * Size of the button
   * @default "default"
   */
  size?: "small" | "default" | "large";
  /**
   * Custom className
   */
  className?: string;
  /**
   * Whether to show on desktop
   * @default false
   */
  showOnDesktop?: boolean;
  /**
   * Label for accessibility
   */
  label?: string;
}

const positionClasses = {
  "bottom-right": "bottom-20 right-4 md:bottom-6 md:right-6",
  "bottom-left": "bottom-20 left-4 md:bottom-6 md:left-6",
  "top-right": "top-20 right-4 md:top-6 md:right-6",
  "top-left": "top-20 left-4 md:top-6 md:left-6",
};

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md",
  outline: "bg-background border-2 border-border hover:bg-accent shadow-sm",
};

const sizeClasses = {
  small: "w-12 h-12",
  default: "w-14 h-14",
  large: "w-16 h-16",
};

const actionVariantClasses = {
  default: "bg-background text-foreground border shadow-md",
  primary: "bg-primary text-primary-foreground shadow-md",
  secondary: "bg-secondary text-secondary-foreground shadow-md",
  destructive: "bg-destructive text-destructive-foreground shadow-md",
};

/**
 * FloatingActionButton - A floating action button with optional expandable actions
 * 
 * Features:
 * - Fixed position that stays visible while scrolling
 * - Optional expandable action menu
 * - Multiple positions and variants
 * - Smooth animations
 * - Mobile-optimized with safe area insets
 * - Can be hidden on desktop
 * 
 * @example
 * // Simple FAB
 * <FloatingActionButton onClick={() => console.log("clicked")} />
 * 
 * // With expandable actions
 * <FloatingActionButton
 *   actions={[
 *     { icon: <Play />, label: "Start Quiz", onClick: () => {} },
 *     { icon: <Bookmark />, label: "Save", onClick: () => {} },
 *   ]}
 * />
 */
export function FloatingActionButton({
  icon = <Plus className="w-6 h-6" />,
  closeIcon = <X className="w-6 h-6" />,
  actions,
  onClick,
  position = "bottom-right",
  variant = "primary",
  size = "default",
  className,
  showOnDesktop = false,
  label = "Add",
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up or near top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsExpanded(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMainClick = () => {
    if (actions && actions.length > 0) {
      setIsExpanded(!isExpanded);
    } else if (onClick) {
      onClick();
    }
  };

  const handleActionClick = (action: ActionItem) => {
    action.onClick();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Backdrop when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div
        className={cn(
          "fixed z-50 flex flex-col items-center gap-3",
          positionClasses[position],
          !showOnDesktop && "md:hidden",
          !isVisible && "translate-y-20 opacity-0 pointer-events-none",
          "transition-all duration-300 ease-out"
        )}
      >
        {/* Expanded Actions */}
        <AnimatePresence>
          {isExpanded && actions && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col items-center gap-2 mb-2"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleActionClick(action)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium",
                    "transition-all duration-200 hover:scale-105 active:scale-95",
                    actionVariantClasses[action.variant || "default"]
                  )}
                >
                  <span className="w-5 h-5 flex items-center justify-center">
                    {action.icon}
                  </span>
                  <span>{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <motion.button
          onClick={handleMainClick}
          className={cn(
            "rounded-full flex items-center justify-center",
            "transition-all duration-200 hover:scale-105 active:scale-95",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "shadow-lg hover:shadow-xl",
            variantClasses[variant],
            sizeClasses[size],
            className
          )}
          whileTap={{ scale: 0.95 }}
          aria-label={isExpanded ? "Close menu" : label}
          aria-expanded={isExpanded}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? closeIcon : icon}
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}

/**
 * ScrollToTopFAB - A floating action button that scrolls to top
 */
interface ScrollToTopFABProps {
  className?: string;
  /**
   * Scroll threshold before showing (in pixels)
   * @default 300
   */
  threshold?: number;
}


export function ScrollToTopFAB({
  className,
  threshold = 300,
}: ScrollToTopFABProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40",
        "w-12 h-12 rounded-full bg-background border-2 border-border",
        "flex items-center justify-center shadow-lg",
        "hover:bg-accent transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      whileTap={{ scale: 0.95 }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </motion.button>
  );
}
