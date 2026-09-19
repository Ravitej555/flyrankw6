export type ButtonState =
  | 'idle'
  | 'hover'
  | 'active'
  | 'loading'
  | 'success'
  | 'error'
  | 'disabled';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  fromState: ButtonState;
  toState: ButtonState;
  trigger: string;
  durationMs: number;
  easing: string;
  propertiesAnimated: string[];
}

export interface SimulationConfig {
  failureRate: number; // 0.0 to 1.0 (e.g. 0.2 = 20%)
  latencyMs: number;
  reducedMotion: boolean;
  forcedState: ButtonState | null;
}
