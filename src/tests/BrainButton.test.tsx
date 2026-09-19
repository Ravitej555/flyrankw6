import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrainButton } from '../components/BrainButton';

describe('BrainButton State Machine & Motion Micro-interactions', () => {
  it('renders in idle state with correct accessible attributes', () => {
    render(<BrainButton />);

    const button = screen.getByRole('button', { name: /send ai prompt/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-live', 'polite');
    expect(button).toHaveAttribute('aria-busy', 'false');
    expect(screen.getByText('Send Prompt')).toBeInTheDocument();
  });

  it('progresses through loading to success when action resolves', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 20));
      return true;
    });

    render(<BrainButton onDispatchAction={handleAction} />);

    const button = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(button);

    // Should enter loading state
    expect(button).toHaveAttribute('aria-busy', 'true');
    await waitFor(() => {
      expect(screen.getByText(/synthesizing/i)).toBeInTheDocument();
    });

    // Resolves to success
    await waitFor(() => {
      expect(screen.getByText('Dispatched!')).toBeInTheDocument();
    });
  });

  it('enters error state and provides retry action on failure', async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn().mockResolvedValue(false);

    render(<BrainButton onDispatchAction={handleAction} />);

    const button = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/failed\. retry\?/i)).toBeInTheDocument();
    });
  });

  it('blocks spam-clicking during active execution without corrupting state', async () => {
    const user = userEvent.setup();
    let resolveCall: (val: boolean) => void;
    const pendingPromise = new Promise<boolean>((resolve) => {
      resolveCall = resolve;
    });

    const handleAction = vi.fn().mockImplementation(() => pendingPromise);

    render(<BrainButton onDispatchAction={handleAction} />);

    const button = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);

    // Spam click multiple times while loading
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Guard ensures the underlying dispatch function is only called once
    expect(handleAction).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveCall!(true);
    });

    await waitFor(() => {
      expect(screen.getByText('Dispatched!')).toBeInTheDocument();
    });
  });
});
