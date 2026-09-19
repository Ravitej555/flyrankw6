import React, { useState, useCallback } from 'react';
import { BrainButton } from './components/BrainButton';
import { DeployButton } from './components/DeployButton';
import { ActionSparkleButton } from './components/ActionSparkleButton';
import { TestingHarness } from './components/TestingHarness';
import { MotionPhilosophyCard } from './components/MotionPhilosophyCard';
import { ChatMessageRenderer } from './components/ChatMessageRenderer';
import { ValidatedPromptForm } from './components/ValidatedPromptForm';
import { ButtonState, SimulationConfig, TelemetryLog } from './types';
import { ChatMessage, MockAiService } from './services/mockAiService';
import { Sparkles, Terminal, Github, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    failureRate: 0.2,
    latencyMs: 1200,
    reducedMotion: false,
    forcedState: null,
  });

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      status: 'complete',
      content: 'Welcome to Buttons with a Brain & AI Test Harness (FE-AA1 / FE-09). Dispatch prompts below to test our state machine and component verification suite.',
      toolResult: {
        toolName: 'scoreLead',
        status: 'success',
        data: {
          leadScore: 96,
          urgencyTier: 'High',
          conversionProbability: '94.8%',
          keySignals: ['Production Ready', 'Full CI Pipeline', 'Accessible UI'],
        },
      },
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

  const handlePromptSubmit = async (prompt: string): Promise<boolean> => {
    const userMsgId = Math.random().toString(36).substring(7);
    const assistantMsgId = Math.random().toString(36).substring(7);

    // Append user message
    setChatMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: 'user',
        status: 'complete',
        content: prompt,
      },
      {
        id: assistantMsgId,
        role: 'assistant',
        status: 'pending',
        content: '',
      },
    ]);

    const shouldFail = Math.random() < simulationConfig.failureRate;

    try {
      // Stream response using mock AI engine
      const assistantMessage = await MockAiService.streamResponse(
        prompt,
        (streamedText) => {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? { ...msg, status: 'streaming', content: streamedText }
                : msg
            )
          );
        },
        shouldFail
      );

      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMsgId ? assistantMessage : msg))
      );
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown generation error';
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                status: 'error',
                content: '',
                error: errorMsg,
              }
            : msg
        )
      );
      return false;
    }
  };

  const handleRetryMessage = async (messageId: string) => {
    // Retry failed message
    setChatMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, status: 'pending', error: undefined } : m))
    );

    try {
      const assistantMessage = await MockAiService.streamResponse(
        'Retrying synthesis with heightened priority...',
        (streamedText) => {
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, status: 'streaming', content: streamedText }
                : msg
            )
          );
        },
        false
      );

      setChatMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? assistantMessage : msg))
      );
    } catch {
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'error', error: 'Retry attempt failed.' } : msg
        )
      );
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
                Buttons with a Brain & AI Test Harness
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                FE-AA1 / FE-09
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
            Motion Choreography & Test Verification Suite
          </h1>
          <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
            Full component lifecycle testing (FE-09) and state machine micro-interactions (FE-AA1). Tested across pending, streaming, tool-result, and error states with Vitest, React Testing Library, and Playwright.
          </p>
        </section>

        {/* Live Contextual Chat Dispatch Showcase with Message Renderer */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400">
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Tested AI Route & Message Renderer (All Part Types)</span>
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              Failure Rate: {Math.round(simulationConfig.failureRate * 100)}%
            </div>
          </div>

          {/* Render messages with ChatMessageRenderer */}
          <div
            role="region"
            aria-label="Chat conversation log"
            className="bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 min-h-[160px] max-h-[320px] overflow-y-auto space-y-3 font-sans text-xs"
          >
            {chatMessages.map((msg) => (
              <ChatMessageRenderer
                key={msg.id}
                message={msg}
                onRetry={handleRetryMessage}
              />
            ))}
          </div>

          {/* Validated Form Component */}
          <ValidatedPromptForm
            onSubmit={handlePromptSubmit}
            simulationConfig={simulationConfig}
            onButtonStateChange={handleStateChange}
          />
        </section>

        {/* System Button Family Showcase */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>The Motion System Family (FE-AA1 Deliverable)</span>
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
        FE-AA1 & FE-09 Test Pass • Built with React, TypeScript, Vitest, React Testing Library & Tailwind CSS
      </footer>
    </div>
  );
};

export default App;
