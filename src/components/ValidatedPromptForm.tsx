import React, { useState } from 'react';
import { BrainButton } from './BrainButton';
import { SimulationConfig, ButtonState } from '../types';
import { AlertCircle } from 'lucide-react';

interface ValidatedPromptFormProps {
  onSubmit: (prompt: string) => Promise<boolean>;
  simulationConfig: SimulationConfig;
  onButtonStateChange?: (from: ButtonState, to: ButtonState, trigger: string, duration: number, easing: string) => void;
  className?: string;
}

export const ValidatedPromptForm: React.FC<ValidatedPromptFormProps> = ({
  onSubmit,
  simulationConfig,
  onButtonStateChange,
  className = '',
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (value: string): string | null => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Prompt is required and cannot be empty.';
    }
    if (trimmed.length < 5) {
      return 'Prompt must be at least 5 characters long.';
    }
    if (trimmed.length > 500) {
      return 'Prompt exceeds maximum limit of 500 characters.';
    }
    return null;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const validationError = validate(prompt);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const success = await onSubmit(prompt);
      if (success) {
        setPrompt('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      role="form"
      aria-label="AI Prompt Submission Form"
      onSubmit={handleSubmit}
      className={`space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
        <div className="flex-1">
          <label htmlFor="prompt-input" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            AI Prompt Input
          </label>
          <input
            id="prompt-input"
            name="prompt"
            type="text"
            role="textbox"
            aria-label="Enter your AI prompt"
            aria-required="true"
            aria-invalid={error !== null}
            aria-errormessage={error ? 'prompt-error-message' : undefined}
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Type a verified prompt (min 5 chars)..."
            className={`
              w-full bg-slate-950 border rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500
              focus:outline-none transition-colors
              ${error ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'}
            `}
            disabled={isSubmitting}
          />
        </div>

        <div className="sm:pt-6">
          <BrainButton
            config={simulationConfig}
            onStateChange={onButtonStateChange}
            onDispatchAction={async () => {
              const err = validate(prompt);
              if (err) {
                setError(err);
                return false;
              }
              return await onSubmit(prompt);
            }}
          />
        </div>
      </div>

      {error && (
        <div
          id="prompt-error-message"
          role="alert"
          className="flex items-center gap-1.5 text-xs text-rose-400 font-medium pt-1"
        >
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </form>
  );
};
