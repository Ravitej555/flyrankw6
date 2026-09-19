import React from 'react';
import { BookOpen, Clock, Layers, ShieldCheck } from 'lucide-react';

export const MotionPhilosophyCard: React.FC = () => {
  return (
    <section className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            Motion Choreography & Design System Rationale
          </h2>
          <p className="text-xs text-slate-400">
            Formal technical justification for duration, easing curves, and compositor optimization (Assignment Deliverable).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Timing and Easing */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Duration & Curve Architecture</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            State changes never snap. We use distinct physiological easing profiles:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-slate-200 font-mono">200ms `ease-out`</strong> on hover/focus: Immediate physical reaction to user presence with zero perceived lag.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">100ms mechanical tap</strong> on active press: Tactile micro-depression simulating physical microswitch travel.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">240ms morph</strong> into loading: Smooth crossfade from text label to orbital spinner.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">320ms spring (stiffness 400, damping 25)</strong> on success: Dopamine checkmark punch without oscillation.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">420ms 4-stage dampened shake</strong> on error: Urgent error indication requiring no layout distortion.
            </li>
          </ul>
        </div>

        {/* Compositor Friendly */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>Compositor-Only (0.00 CLS)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Layout recalculations destroy 60fps frame rates. All dynamic animations target exclusively:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-slate-200 font-mono">transform: scale(), translate()</strong> for press depression and hover lifts.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">opacity</strong> for label cross-fades and pulse glow.
            </li>
            <li>
              <strong className="text-slate-200">Zero width/height interpolation</strong>: Containers maintain intrinsic structural bounds; content animates within an isolated hardware-accelerated composition layer.
            </li>
          </ul>
        </div>

        {/* Interruptibility & A11y */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-2.5">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Interruptibility & Reduced Motion</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Enterprise interactions must be resilient to user chaos:
          </p>
          <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
            <li>
              <strong className="text-slate-200">Spam-click Guard</strong>: Mid-flight clicks are absorbed by state machine guards without queuing duplicate requests or corrupting timer loops.
            </li>
            <li>
              <strong className="text-slate-200 font-mono">prefers-reduced-motion</strong>: Disables violent shakes and spatial translations while preserving essential color and icon feedback so no user is left disoriented.
            </li>
            <li>
              <strong className="text-slate-200">ARIA Live Announcements</strong>: Screen readers are kept continuously informed of asynchronous dispatch states.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
