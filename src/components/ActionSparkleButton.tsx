import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Wand2, XCircle, RotateCcw } from 'lucide-react';
import { ButtonState, SimulationConfig } from '../types';

interface ActionSparkleButtonProps {
  onStateChange?: (from: ButtonState, to: ButtonState, trigger: string, duration: number, easing: string) => void;
  config?: SimulationConfig;
  className?: string;
}

export const ActionSparkleButton: React.FC<ActionSparkleButtonProps> = ({
  onStateChange,
  config,
  className = '',
}) => {
  const [internalState, setInternalState] = useState<ButtonState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleClick = async () => {
    if (effectiveState === 'loading' || effectiveState === 'disabled') return;

    transitionTo('loading', 'generate_click', 240, 'cubic-bezier(0.2, 0, 0, 1)');
    const latency = config?.latencyMs ?? 1000;
    const failureRate = config?.failureRate ?? 0.2;

    await new Promise((res) => setTimeout(res, latency));
    const isSuccess = Math.random() >= failureRate;

    if (isSuccess) {
      transitionTo('success', 'generate_success', 320, 'spring(400, 25)');
      timeoutRef.current = setTimeout(() => {
        transitionTo('idle', 'auto_revert', 250, 'cubic-bezier(0.25, 1, 0.5, 1)');
      }, 2000);
    } else {
      transitionTo('error', 'generate_error', 420, 'damped-shake');
    }
  };

  const stateStyles = {
    idle: 'bg-violet-950/60 hover:bg-violet-900/60 text-violet-200 border-violet-500/40 hover:border-violet-400',
    hover: 'bg-violet-900/80 text-violet-100 border-violet-400 shadow-lg shadow-violet-950/60',
    active: 'bg-violet-950 text-violet-300 border-violet-600',
    loading: 'bg-slate-900 text-violet-300 border-violet-500/50 cursor-wait',
    success: 'bg-cyan-950/80 text-cyan-200 border-cyan-400/60 shadow-lg shadow-cyan-950/50',
    error: 'bg-rose-950/80 text-rose-200 border-rose-400/60',
    disabled: 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed opacity-50',
  };

  return (
    <motion.button
      type="button"
      id="sparkle-btn"
      onClick={handleClick}
      disabled={effectiveState === 'disabled' || effectiveState === 'loading'}
      animate={
        isReducedMotion
          ? {}
          : effectiveState === 'error'
          ? { x: [0, -6, 6, -4, 4, 0] }
          : effectiveState === 'hover'
          ? { scale: 1.03 }
          : effectiveState === 'active'
          ? { scale: 0.97 }
          : { scale: 1, x: 0 }
      }
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium backdrop-blur-md
        border transition-colors duration-200 outline-none
        ${stateStyles[effectiveState]}
        ${className}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {effectiveState === 'loading' && (
          <motion.div
            key="load"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
            <span>Reasoning...</span>
          </motion.div>
        )}
        {effectiveState === 'success' && (
          <motion.div
            key="succ"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-cyan-300"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Synthesized!</span>
          </motion.div>
        )}
        {effectiveState === 'error' && (
          <motion.div
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-rose-300"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Retry Token</span>
            <RotateCcw className="w-3 h-3 ml-1 opacity-75" />
          </motion.div>
        )}
        {(effectiveState === 'idle' || effectiveState === 'hover' || effectiveState === 'active' || effectiveState === 'disabled') && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Generate Reasoning</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
