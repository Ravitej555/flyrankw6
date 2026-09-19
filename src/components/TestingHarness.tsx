import React from 'react';
import { Sliders, Activity, ShieldCheck, Zap, RotateCcw, Eye, Play } from 'lucide-react';
import { ButtonState, SimulationConfig, TelemetryLog } from '../types';

interface TestingHarnessProps {
  config: SimulationConfig;
  onChangeConfig: (newConfig: SimulationConfig) => void;
  telemetryLogs: TelemetryLog[];
  onClearLogs: () => void;
  onSimulateSpam: () => void;
}

export const TestingHarness: React.FC<TestingHarnessProps> = ({
  config,
  onChangeConfig,
  telemetryLogs,
  onClearLogs,
  onSimulateSpam,
}) => {
  const states: (ButtonState | null)[] = [null, 'idle', 'hover', 'active', 'loading', 'success', 'error', 'disabled'];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Reviewer Testing & Chaos Control Deck
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                FE-AA1 Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive levers for simulating real-world latency, failure spikes, reduced-motion, and spam clicks.
            </p>
          </div>
        </div>

        {/* Spam Click Verification Action */}
        <button
          type="button"
          onClick={onSimulateSpam}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-mono transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-rose-400" />
          <span>Simulate Rapid 10x Spam</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Force State Manual Inspection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Force State (Evaluation Freeze)</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {states.map((st) => {
              const isSelected = config.forcedState === st;
              return (
                <button
                  key={st ?? 'interactive'}
                  type="button"
                  onClick={() => onChangeConfig({ ...config, forcedState: st })}
                  className={`
                    px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all capitalize
                    ${isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:border-slate-600'
                    }
                  `}
                >
                  {st ? st : 'Auto'}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500">
            {config.forcedState
              ? `Currently freezing component in "${config.forcedState}" state for visual inspection.`
              : 'Auto mode: buttons transition naturally via clicks, hover, and simulated async events.'}
          </p>
        </div>

        {/* Network & Chaos Sliders */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Failure Rate: {Math.round(config.failureRate * 100)}%</span>
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              {config.failureRate === 0 ? 'Always 200 OK' : config.failureRate === 1 ? '100% Chaos Fail' : 'Default (20%)'}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.failureRate}
            onChange={(e) => onChangeConfig({ ...config, failureRate: parseFloat(e.target.value) })}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pt-2">
            <span>Latency: {config.latencyMs}ms</span>
            <span className="font-mono text-[11px] text-slate-400">
              {config.latencyMs < 500 ? 'Fiber' : config.latencyMs > 2000 ? 'Slow 3G' : 'Standard'}
            </span>
          </div>
          <input
            type="range"
            min="200"
            max="3000"
            step="200"
            value={config.latencyMs}
            onChange={(e) => onChangeConfig({ ...config, latencyMs: parseInt(e.target.value, 10) })}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Accessibility & Reduced Motion Switch */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Accessibility (A11y) Guards</span>
          </label>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-medium text-slate-200">Force Reduced Motion</div>
              <div className="text-[11px] text-slate-400">Replaces kinetic shakes & morphs with instant feedback</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={config.reducedMotion}
              onClick={() => onChangeConfig({ ...config, reducedMotion: !config.reducedMotion })}
              className={`
                relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent
                transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900
                ${config.reducedMotion ? 'bg-indigo-600' : 'bg-slate-700'}
              `}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0
                  transition duration-200 ease-in-out
                  ${config.reducedMotion ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed">
            Meets WCAG 2.2 §2.3.3. Keyboard accessible via <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Tab</kbd>, <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Enter</kbd>, and <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">Space</kbd>.
          </div>
        </div>
      </div>

      {/* Real-time State Transition Telemetry Feed */}
      <div className="border-t border-slate-800/80 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>State Machine Live Transition Telemetry</span>
            <span className="text-slate-500 font-mono text-[10px]">({telemetryLogs.length} events logged)</span>
          </div>
          <button
            type="button"
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors font-mono"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Feed</span>
          </button>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 divide-y divide-slate-900">
          {telemetryLogs.length === 0 ? (
            <div className="text-slate-500 italic py-2 text-center text-xs font-sans">
              No transitions recorded yet. Click or hover on any button above to stream telemetry.
            </div>
          ) : (
            telemetryLogs.slice(0, 15).map((log) => (
              <div key={log.id} className="pt-1.5 first:pt-0 flex flex-wrap items-center justify-between gap-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                    {log.fromState}
                  </span>
                  <span className="text-slate-500">➔</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] border ${
                    log.toState === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' :
                    log.toState === 'error' ? 'bg-rose-950/80 text-rose-300 border-rose-800/50' :
                    log.toState === 'loading' ? 'bg-amber-950/80 text-amber-300 border-amber-800/50' :
                    'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {log.toState}
                  </span>
                  <span className="text-slate-400 text-[10px]">({log.trigger})</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  <span>{log.durationMs}ms</span>
                  <span className="text-slate-500 truncate max-w-[200px]" title={log.easing}>{log.easing}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
