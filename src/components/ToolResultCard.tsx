import React from 'react';
import { ToolResultData } from '../services/mockAiService';
import { CheckCircle2, AlertTriangle, ShieldCheck, TrendingUp, RefreshCw } from 'lucide-react';

interface ToolResultCardProps {
  toolResult: ToolResultData;
  onRetry?: () => void;
}

export const ToolResultCard: React.FC<ToolResultCardProps> = ({ toolResult, onRetry }) => {
  if (toolResult.status === 'error') {
    return (
      <section
        role="region"
        aria-label="Tool execution error"
        className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-rose-200 mt-3 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h4 className="font-semibold text-sm text-rose-100">Tool Execution Failed</h4>
          </div>
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-900/60 border border-rose-800 text-rose-300">
            {toolResult.toolName}
          </span>
        </div>
        <p className="text-xs text-rose-300">
          {toolResult.errorMessage || 'An unexpected error occurred while executing the AI tool.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            aria-label="Retry failed tool execution"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Tool</span>
          </button>
        )}
      </section>
    );
  }

  const data = toolResult.data || {};

  return (
    <section
      role="region"
      aria-label={`Structured result for ${toolResult.toolName}`}
      className="rounded-xl border border-emerald-500/30 bg-slate-900/90 p-4 mt-3 space-y-3 shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <h4 className="font-semibold text-sm text-slate-100">
            Lead Qualification Scorecard
          </h4>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          tool: {toolResult.toolName}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Propensity Score</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {data.leadScore ?? 'N/A'}/100
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-[11px] text-slate-400 block">Urgency Tier</span>
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            {data.urgencyTier ?? 'Standard'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 block">Conversion Prob.</span>
          <span className="text-sm font-semibold text-indigo-300 font-mono mt-1 block">
            {data.conversionProbability ?? '—'}
          </span>
        </div>
      </div>

      {data.keySignals && data.keySignals.length > 0 && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            Key Signals Detected
          </span>
          <ul aria-label="Detected signals list" className="flex flex-wrap gap-1.5">
            {data.keySignals.map((signal, idx) => (
              <li
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
