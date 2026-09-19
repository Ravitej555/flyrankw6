import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ChatMessageRenderer } from '../components/ChatMessageRenderer';
import { ChatMessage } from '../services/mockAiService';

describe('ChatMessageRenderer (Part types and states)', () => {
  it('renders pending status with accessible role and label', () => {
    const pendingMsg: ChatMessage = {
      id: 'msg-1',
      role: 'assistant',
      status: 'pending',
      content: '',
    };

    render(<ChatMessageRenderer message={pendingMsg} />);

    // Querying strictly by accessible role and label (never test ID or CSS class)
    const statusElement = screen.getByRole('status', { name: /assistant is thinking/i });
    expect(statusElement).toBeInTheDocument();
    expect(screen.getByText(/reasoning over prompt/i)).toBeInTheDocument();
  });

  it('renders streaming state with incoming token content', () => {
    const streamingMsg: ChatMessage = {
      id: 'msg-2',
      role: 'assistant',
      status: 'streaming',
      content: 'Evaluating domain authority vector...',
    };

    render(<ChatMessageRenderer message={streamingMsg} />);

    const streamingElement = screen.getByRole('status', { name: /assistant is streaming response/i });
    expect(streamingElement).toBeInTheDocument();
    expect(screen.getByText(/evaluating domain authority vector/i)).toBeInTheDocument();
  });

  it('renders complete state with full text and structured tool result card', () => {
    const completeMsg: ChatMessage = {
      id: 'msg-3',
      role: 'assistant',
      status: 'complete',
      content: 'Lead qualified successfully for enterprise tier.',
      toolResult: {
        toolName: 'scoreLead',
        status: 'success',
        data: {
          leadScore: 95,
          urgencyTier: 'High',
          conversionProbability: '96.2%',
          keySignals: ['Verified Enterprise Domain', 'SOC2 Certified'],
        },
      },
    };

    render(<ChatMessageRenderer message={completeMsg} />);

    // Main text
    expect(screen.getByText(/lead qualified successfully for enterprise tier/i)).toBeInTheDocument();

    // Tool card region
    const toolRegion = screen.getByRole('region', { name: /structured result for scorelead/i });
    expect(toolRegion).toBeInTheDocument();
    expect(screen.getByText('95/100')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Verified Enterprise Domain')).toBeInTheDocument();
  });

  it('renders error state with alert role and triggers retry callback', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    const errorMsg: ChatMessage = {
      id: 'msg-error-1',
      role: 'assistant',
      status: 'error',
      content: '',
      error: 'Inference endpoint timed out (504 Gateway Timeout)',
    };

    render(<ChatMessageRenderer message={errorMsg} onRetry={handleRetry} />);

    // Querying alert by role
    const alertElement = screen.getByRole('alert', { name: /error generating message/i });
    expect(alertElement).toBeInTheDocument();
    expect(screen.getByText(/inference endpoint timed out/i)).toBeInTheDocument();

    // Querying retry button by accessible name
    const retryButton = screen.getByRole('button', { name: /retry generation/i });
    expect(retryButton).toBeInTheDocument();

    await user.click(retryButton);
    expect(handleRetry).toHaveBeenCalledWith('msg-error-1');
  });
});
