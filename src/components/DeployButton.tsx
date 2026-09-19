import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Loader2, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react';
import { ButtonState, SimulationConfig } from '../types';

interface DeployButtonProps {
  onStateChange?: (from: ButtonState, to: ButtonState, trigger: string, duration: number, easing: string) => void;
  config?: SimulationConfig;
  className?: string;
}

export const DeployButton: React.FC<DeployButtonProps> = ({
  onStateChange,
  config,
  className = '',
}) => {
  const [internalState, setInternalState] = useState<ButtonState>('idle');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExecutingRef = useRef<boolean>(false);

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (effectiveState === 'loading' || effectiveState === 'disabled' || isExecutingRef.current) {
      return;
    }

    isExecutingRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    transitionTo('loading', 'deploy_dispatch', 240, 'cubic-bezier(0.2, 0, 0, 1)');

    const latency = config?.latencyMs ?? 1500;
    const failureRate = config?.failureRate ?? 0.2;

    try {
      await new Promise((res) => setTimeout(res, latency));
      const isSuccess = Math.random() >= failureRate;

      if (isSuccess) {
        transitionTo('success', 'deploy_success', 320, 'spring(stiffness: 400, damping: 25)');
        timeoutRef.current = setTimeout(() => {
          transitionTo('idle', 'auto_revert_timeout', 250, 'cubic-bezier(0.25, 1, 0.5, 1)');
        }, 2500);
      } else {
        transitionTo('error', 'deploy_failed', 420, 'damped-shake');
      }
    } catch {
      transitionTo('error', 'deploy_exception', 420, 'damped-shake');
    } finally {
      isExecutingRef.current = false;
    }
  };

  const stateStyles = {
    idle: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 border-emerald-500/30',
    hover: 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/40 border-emerald-400/50',
    active: 'bg-emerald-700 text-white shadow-sm border-emerald-600',
    loading: 'bg-emerald-950 text-emerald-200 border-emerald-500/50 shadow-md shadow-emerald-950/50 cursor-wait',
    success: 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 border-teal-400/40',
    error: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border-amber-400/40 hover:bg-amber-500',
    disabled: 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed shadow-none opacity-60',
  };

  const buttonVariants = {
    idle: { scale: 1, y: 0, x: 0 },
    hover: isReducedMotion ? {} : { scale: 1.025, y: -2, x: 0 },
    active: isReducedMotion ? {} : { scale: 0.96, y: 1, x: 0 },
    loading: isReducedMotion ? {} : { scale: 0.99, y: 0, x: 0 },
    success: isReducedMotion ? {} : { scale: [1, 1.04, 1], y: 0, x: 0 },
    error: isReducedMotion
      ? { x: 0 }
      : {
          x: [0, -7, 7, -5, 5, -2, 2, 0],
          transition: { duration: 0.4, ease: 'easeInOut' },
        },
    disabled: { scale: 1, y: 0, x: 0 },
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <motion.button
        type="button"
        id="deploy-btn"
        onClick={handleClick}
        onMouseEnter={() => effectiveState === 'idle' && transitionTo('hover', 'mouse_enter', 200)}
        onMouseLeave={() => effectiveState === 'hover' && transitionTo('idle', 'mouse_leave', 180)}
        onFocus={() => {
          setIsFocused(true);
          if (effectiveState === 'idle') transitionTo('hover', 'keyboard_focus', 200);
        }}
        onBlur={() => {
          setIsFocused(false);
          if (effectiveState === 'hover') transitionTo('idle', 'keyboard_blur', 180);
        }}
        disabled={effectiveState === 'disabled' || effectiveState === 'loading'}
        aria-label={`Deploy Application. State: ${effectiveState}`}
        aria-live="polite"
        aria-busy={effectiveState === 'loading'}
        variants={buttonVariants}
        animate={effectiveState}
        transition={{
          duration: isReducedMotion ? 0.01 : 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={`
          relative group flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm
          border transition-colors duration-200 outline-none select-none overflow-hidden
          ${stateStyles[effectiveState]}
          ${isFocused ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : ''}
          ${className}
        `}
      >
        <AnimatePresence mode="wait" initial={false}>
          {effectiveState === 'loading' && (
            <motion.div
              key="deploy-loading"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.2 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin text-emerald-300" />
              <span className="font-mono text-xs tracking-wide">Publishing to Edge...</span>
            </motion.div>
          )}

          {effectiveState === 'success' && (
            <motion.div
              key="deploy-success"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              className="flex items-center gap-2 font-semibold"
            >
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Live on Vercel Edge</span>
            </motion.div>
          )}

          {effectiveState === 'error' && (
            <motion.div
              key="deploy-error"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.2 }}
              className="flex items-center gap-2 font-medium"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span>Rollback Triggered</span>
              <RotateCcw className="w-3.5 h-3.5 opacity-80" />
            </motion.div>
          )}

          {(effectiveState === 'idle' || effectiveState === 'hover' || effectiveState === 'active' || effectiveState === 'disabled') && (
            <motion.div
              key="deploy-idle"
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: isReducedMotion ? 0.01 : 0.18 }}
              className="flex items-center gap-2 font-semibold tracking-wide"
            >
              <Rocket className="w-4 h-4" />
              <span>Deploy Production</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
