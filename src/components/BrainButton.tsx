import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { ButtonState, SimulationConfig } from '../types';

interface BrainButtonProps {
  onStateChange?: (from: ButtonState, to: ButtonState, trigger: string, duration: number, easing: string) => void;
  config?: SimulationConfig;
  onDispatchAction?: () => Promise<boolean>;
  className?: string;
}

export const BrainButton: React.FC<BrainButtonProps> = ({
  onStateChange,
  config,
  onDispatchAction,
  className = '',
}) => {
  const [internalState, setInternalState] = useState<ButtonState>('idle');
  const [spamCount, setSpamCount] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExecutingRef = useRef<boolean>(false);

  // Use forced state from tester harness if provided, otherwise internal state
  const effectiveState = config?.forcedState || internalState;
  const isReducedMotion = config?.reducedMotion || false;

  const transitionTo = useCallback((nextState: ButtonState, trigger: string, duration = 200, easing = 'cubic-bezier(0.16, 1, 0.3, 1)') => {
    setInternalState((prev) => {
      if (prev !== nextState) {
        onStateChange?.(prev, nextState, trigger, duration, easing);
      }
      return nextState;
    });
  }, [onStateChange]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Spam click protection and state guard
    if (effectiveState === 'loading') {
      setSpamCount((prev) => prev + 1);
      return;
    }

    if (effectiveState === 'disabled') {
      return;
    }

    if (isExecutingRef.current) return;
    isExecutingRef.current = true;

    // Clear any pending timeout from previous success/error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Move to active briefly, then loading
    transitionTo('loading', 'user_click_dispatch', 240, 'cubic-bezier(0.2, 0, 0, 1)');

    const latency = config?.latencyMs ?? 1200;
    const failureRate = config?.failureRate ?? 0.2;

    try {
      if (onDispatchAction) {
        const result = await onDispatchAction();
        handleResult(result);
      } else {
        // Simulated network call with intentional delay and failure probability
        await new Promise((resolve) => setTimeout(resolve, latency));
        const isSuccess = Math.random() >= failureRate;
        handleResult(isSuccess);
      }
    } catch {
      handleResult(false);
    } finally {
      isExecutingRef.current = false;
    }
  };

  const handleResult = (isSuccess: boolean) => {
    if (isSuccess) {
      transitionTo('success', 'async_resolve_success', 320, 'spring(stiffness: 400, damping: 25)');
      // Auto-revert back to idle after 2200ms
      timeoutRef.current = setTimeout(() => {
        transitionTo('idle', 'auto_revert_timeout', 250, 'cubic-bezier(0.25, 1, 0.5, 1)');
      }, 2200);
    } else {
      transitionTo('error', 'async_reject_error', 420, 'damped-shake (keyframes)');
      // Keep error state until user clicks Retry or resets
    }
  };

  const handleMouseEnter = () => {
    if (effectiveState === 'idle') {
      transitionTo('hover', 'mouse_enter', 200, 'cubic-bezier(0.16, 1, 0.3, 1)');
    }
  };

  const handleMouseLeave = () => {
    if (effectiveState === 'hover') {
      transitionTo('idle', 'mouse_leave', 180, 'cubic-bezier(0.4, 0, 1, 1)');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (effectiveState === 'idle') {
      transitionTo('hover', 'keyboard_focus', 200, 'cubic-bezier(0.16, 1, 0.3, 1)');
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (effectiveState === 'hover') {
      transitionTo('idle', 'keyboard_blur', 180, 'cubic-bezier(0.4, 0, 1, 1)');
    }
  };

  // State styling maps
  const stateStyles = {
    idle: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border-indigo-500/30',
    hover: 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/40 border-indigo-400/50',
    active: 'bg-indigo-700 text-white shadow-sm border-indigo-600',
    loading: 'bg-indigo-950 text-indigo-200 border-indigo-500/50 shadow-md shadow-indigo-950/50 cursor-wait',
    success: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 border-emerald-400/40',
    error: 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 border-rose-400/40 hover:bg-rose-500',
    disabled: 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed shadow-none opacity-60',
  };

  // Compositor-only motion variants
  const buttonVariants = {
    idle: { scale: 1, y: 0, x: 0 },
    hover: isReducedMotion ? {} : { scale: 1.025, y: -2, x: 0 },
    active: isReducedMotion ? {} : { scale: 0.96, y: 1, x: 0 },
    loading: isReducedMotion ? {} : { scale: 0.99, y: 0, x: 0 },
    success: isReducedMotion ? {} : { scale: [1, 1.05, 1], y: 0, x: 0 },
    error: isReducedMotion
      ? { x: 0 }
      : {
          x: [0, -8, 8, -6, 6, -2, 2, 0],
          transition: { duration: 0.42, ease: 'easeInOut' },
        },
    disabled: { scale: 1, y: 0, x: 0 },
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <motion.button
        type="button"
        id="brain-send-btn"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={effectiveState === 'disabled' || effectiveState === 'loading'}
        aria-label={`Send AI Prompt. Current state: ${effectiveState}`}
        aria-live="polite"
        aria-busy={effectiveState === 'loading'}
        variants={buttonVariants}
        animate={effectiveState}
        transition={{
          duration: isReducedMotion ? 0.01 : 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          relative group flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-sm
          border transition-colors duration-200 outline-none select-none overflow-hidden
          ${stateStyles[effectiveState]}
          ${isFocused ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''}
          ${className}
        `}
      >
        {/* Ambient subtle back glow pulse */}
        {effectiveState === 'loading' && (
          <span className="absolute inset-0 bg-indigo-500/20 animate-pulse pointer-events-none" />
        )}

        {/* Content transition container */}
        <AnimatePresence mode="wait" initial={false}>
          {effectiveState === 'loading' && (
            <motion.div
              key="loading-state"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.22, ease: [0.2, 0, 0, 1] }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
              <span className="font-mono text-xs tracking-wide">Synthesizing...</span>
            </motion.div>
          )}

          {effectiveState === 'success' && (
            <motion.div
              key="success-state"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: isReducedMotion ? 50 : 22,
              }}
              className="flex items-center gap-2 font-semibold"
            >
              <motion.div
                initial={isReducedMotion ? {} : { rotate: -45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check className="w-4 h-4 text-white stroke-[2.5]" />
              </motion.div>
              <span>Dispatched!</span>
            </motion.div>
          )}

          {effectiveState === 'error' && (
            <motion.div
              key="error-state"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.2 }}
              className="flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4 text-white stroke-[2]" />
              <span>Failed. Retry?</span>
              <RefreshCw className="w-3.5 h-3.5 opacity-80" />
            </motion.div>
          )}

          {(effectiveState === 'idle' || effectiveState === 'hover' || effectiveState === 'active' || effectiveState === 'disabled') && (
            <motion.div
              key="idle-state"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.18, ease: 'easeOut' }}
              className="flex items-center gap-2 font-semibold tracking-wide"
            >
              <span>Send Prompt</span>
              <motion.div
                animate={effectiveState === 'hover' && !isReducedMotion ? { x: 3 } : { x: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Send className="w-4 h-4 stroke-[2]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Spam click feedback toast */}
      <AnimatePresence>
        {spamCount > 0 && effectiveState === 'loading' && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="absolute -bottom-8 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-indigo-500/30 text-indigo-300 shadow-lg whitespace-nowrap pointer-events-none"
          >
            Blocked {spamCount} spam {spamCount === 1 ? 'click' : 'clicks'} (Interrupt Safe)
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
