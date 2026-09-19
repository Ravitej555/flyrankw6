import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ValidatedPromptForm } from '../components/ValidatedPromptForm';

describe('ValidatedPromptForm Component', () => {
  const mockConfig = {
    failureRate: 0,
    latencyMs: 50,
    reducedMotion: false,
    forcedState: null,
  };

  it('renders form input and submit button with accessible roles', () => {
    render(<ValidatedPromptForm onSubmit={vi.fn()} simulationConfig={mockConfig} />);

    const form = screen.getByRole('form', { name: /ai prompt submission form/i });
    expect(form).toBeInTheDocument();

    const input = screen.getByRole('textbox', { name: /enter your ai prompt/i });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-required', 'true');

    const submitBtn = screen.getByRole('button', { name: /send ai prompt/i });
    expect(submitBtn).toBeInTheDocument();
  });

  it('displays error when submitting empty input', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ValidatedPromptForm onSubmit={handleSubmit} simulationConfig={mockConfig} />);

    const submitBtn = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(submitBtn);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/prompt is required and cannot be empty/i);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('displays error when prompt length is below 5 characters', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ValidatedPromptForm onSubmit={handleSubmit} simulationConfig={mockConfig} />);

    const input = screen.getByRole('textbox', { name: /enter your ai prompt/i });
    await user.type(input, 'Hey');

    const submitBtn = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(submitBtn);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/prompt must be at least 5 characters long/i);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('successfully submits valid prompt and clears input upon success', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(true);

    render(<ValidatedPromptForm onSubmit={handleSubmit} simulationConfig={mockConfig} />);

    const input = screen.getByRole('textbox', { name: /enter your ai prompt/i });
    await user.type(input, 'Analyze target ICP enterprise requirements');

    const submitBtn = screen.getByRole('button', { name: /send ai prompt/i });
    await user.click(submitBtn);

    expect(handleSubmit).toHaveBeenCalledWith('Analyze target ICP enterprise requirements');
  });
});
