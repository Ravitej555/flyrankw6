export interface ToolResultData {
  toolName: string;
  status: 'success' | 'error';
  data?: {
    leadScore?: number;
    urgencyTier?: 'High' | 'Medium' | 'Low';
    conversionProbability?: string;
    keySignals?: string[];
  };
  errorMessage?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  status: 'pending' | 'streaming' | 'complete' | 'error';
  content: string;
  toolResult?: ToolResultData;
  error?: string;
}

export class MockAiService {
  static async streamResponse(
    prompt: string,
    onChunk: (chunk: string) => void,
    shouldFail = false
  ): Promise<ChatMessage> {
    if (!prompt.trim()) {
      throw new Error('Prompt cannot be empty');
    }

    if (shouldFail) {
      throw new Error('AI Route: Failed to connect to inference gateway (503)');
    }

    const chunks = [
      'Analyzing enterprise intent... ',
      'Evaluating domain authority and team size. ',
      'Synthesized behavioral scoring vector. ',
      'Dispatching CRM qualification hook.',
    ];

    let fullText = '';
    for (const chunk of chunks) {
      await new Promise((r) => setTimeout(r, 40));
      fullText += chunk;
      onChunk(fullText);
    }

    return {
      id: Math.random().toString(36).substring(7),
      role: 'assistant',
      status: 'complete',
      content: fullText,
      toolResult: {
        toolName: 'scoreLead',
        status: 'success',
        data: {
          leadScore: 94,
          urgencyTier: 'High',
          conversionProbability: '92.4%',
          keySignals: ['Enterprise Domain', 'SOC2 Compliant', 'Immediate Decision Window'],
        },
      },
    };
  }
}
