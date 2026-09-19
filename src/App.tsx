import React, { useState, useCallback } from 'react';
import { BrainButton } from './components/BrainButton';
import { DeployButton } from './components/DeployButton';
import { ActionSparkleButton } from './components/ActionSparkleButton';
import { TestingHarness } from './components/TestingHarness';
import { MotionPhilosophyCard } from './components/MotionPhilosophyCard';
import { ButtonState, SimulationConfig, TelemetryLog } from './types';
import { Sparkles, Terminal, Github, Bot, CornerDownLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    failureRate: 0.2,
    latencyMs: 1200,
    reducedMotion: false,
    forcedState: null,
  });

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [chatPrompt, setChatPrompt] = useState<string>('Synthesize state machine transitions with sub-frame motion tokens.');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'Welcome to Buttons with a Brain (FE-AA1). Test the choreographed button states below: hover, active press, loading morph, success pop, and kinetic error shake.',
    },
  ]);

  const handleStateChange = useCallback((
    from: ButtonState,
    to: ButtonState,
    trigger: string,
    durationMs: number,
    easing: string
  ) => {
    const newLog: TelemetryLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      fromState: from,
      toState: to,
      trigger,
      durationMs,
      easing,
      propertiesAnimated: ['transform', 'opacity'],
    };

    setTelemetryLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const handleChatDispatch = async (): Promise<boolean> => {
    if (!chatPrompt.trim()) return false;

    const userText = chatPrompt;
    setChatMessages((prev) => [...prev, { role: 'user', text: userText }]);

    // Simulated dispatch latency
    await new Promise((res) => setTimeout(res, simulationConfig.latencyMs));

    const isSuccess = Math.random() >= simulationConfig.failureRate;
    if (isSuccess) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Synthesized response for: "${userText}". All transition curves rendered at 60fps with zero layout shift.`,
        },
      ]);
      return true;
    } else {
      return false;
    }
  };

  const handleSimulateSpam = () => {
    const btn = document.getElementById('brain-send-btn');
    if (btn) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }, i * 25);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-slate-100 text-sm sm:text-base tracking-tight">
                Buttons with a Brain
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                FE-AA1 | Week 6
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Ravitej555/flyrankw6"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ravitej555/flyrankw6</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Motion & State Micro-interactions
          </h1>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            A production button that handles its full lifecycle (<span className="text-indigo-400 font-mono">idle</span> ➔ <span className="text-indigo-400 font-mono">hover</span> ➔ <span className="text-indigo-400 font-mono">active</span> ➔ <span className="text-indigo-400 font-mono">loading</span> ➔ <span className="text-emerald-400 font-mono">success</span> / <span className="text-rose-400 font-mono">error</span> ➔ <span className="text-indigo-400 font-mono">idle</span>) with intentional motion, compositor-friendly properties, and accessibility protections.
          </p>
        </section>

        {/* Live Contextual Chat Dispatch Showcase */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Interactive Capstone Demo: AI Chat Prompt Dispatch</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Random Failure Rate: {Math.round(simulationConfig.failureRate * 100)}%
            </div>
          </div>

          {/* Chat Transcript preview */}
          <div className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 min-h-[140px] max-h-[220px] overflow-y-auto space-y-3 font-sans text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Chat Input Bar with the BrainButton */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Enter prompt to dispatch..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const btn = document.getElementById('brain-send-btn');
                    btn?.click();
                  }
                }}
              />
              <span className="hidden sm:inline-flex absolute right-3 top-3.5 items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                <CornerDownLeft className="w-2.5 h-2.5" /> Enter
              </span>
            </div>

            <BrainButton
              onStateChange={handleStateChange}
              config={simulationConfig}
              onDispatchAction={handleChatDispatch}
            />
          </div>
        </section>

        {/* System Button Family Showcase (Proving the Motion Language is a System) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>The Motion System Family (Optional Flex)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Shared timing curves, spring damping, & interruptibility
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Primary AI Send */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center justify-between gap-6 text-center">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-200">1. AI Dispatch ("Send")</div>
                <p className="text-xs text-slate-400">
                  Slide-in orbital spinner, 320ms spring checkmark, and 4-stage kinetic shake on error.
                </p>
              </div>
              <BrainButton
                onStateChange={handleStateChange}
                config={simulationConfig}
              />
              <div className="text-[11px] font-mono text-slate-500">
                Primary Action (Indigo)
              </div>
            </div>

            {/* Card 2: Production Deploy */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center justify-between gap-6 text-center">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-200">2. Cloud Deploy ("Deploy")</div>
                <p className="text-xs text-slate-400">
                  Shared motion system powering deployment pipelines with rollback alert treatment.
                </p>
              </div>
              <DeployButton
                onStateChange={handleStateChange}
                config={simulationConfig}
              />
              <div className="text-[11px] font-mono text-slate-500">
                System Action (Emerald)
              </div>
            </div>

            {/* Card 3: Sparkle Generate */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col items-center justify-between gap-6 text-center">
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-200">3. Quick Reasoning ("Generate")</div>
                <p className="text-xs text-slate-400">
                  Compact glassmorphic variant demonstrating scale invariance of the easing curves.
                </p>
              </div>
              <ActionSparkleButton
                onStateChange={handleStateChange}
                config={simulationConfig}
              />
              <div className="text-[11px] font-mono text-slate-500">
                Tertiary Glass (Violet)
              </div>
            </div>
          </div>
        </section>

        {/* Reviewer Testing Harness & Chaos Deck */}
        <TestingHarness
          config={simulationConfig}
          onChangeConfig={setSimulationConfig}
          telemetryLogs={telemetryLogs}
          onClearLogs={() => setTelemetryLogs([])}
          onSimulateSpam={handleSimulateSpam}
        />

        {/* Formal Design System & Motion Rationale Document */}
        <MotionPhilosophyCard />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        Buttons with a Brain (FE-AA1) • Built with React, TypeScript, Framer Motion & Tailwind CSS • Compositor-only 60fps
      </footer>
    </div>
  );
};

export default App;
