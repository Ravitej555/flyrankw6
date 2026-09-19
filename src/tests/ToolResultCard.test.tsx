import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ToolResultCard } from '../components/ToolResultCard';
import { ToolResultData } from '../services/mockAiService';

describe('ToolResultCard Component', () => {
  it('renders complete scorecard metrics and signals when tool succeeds', () => {
    const successData: ToolResultData = {
      toolName: 'scoreLead',
      status: 'success',
      data: {
        leadScore: 88,
        urgencyTier: 'High',
        conversionProbability: '89.5%',
        keySignals: ['Single Sign-On', '1,000+ Seats'],
      },
    };

    render(<ToolResultCard toolResult={successData} />);

    // Query region and headings
    const region = screen.getByRole('region', { name: /structured result for scorelead/i });
    expect(region).toBeInTheDocument();

    expect(screen.getByText('88/100')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('89.5%')).toBeInTheDocument();

    const signalList = screen.getByRole('list', { name: /detected signals list/i });
    expect(signalList).toBeInTheDocument();
    expect(screen.getByText('Single Sign-On')).toBeInTheDocument();
    expect(screen.getByText('1,000+ Seats')).toBeInTheDocument();
  });

  it('renders designed error state with alert and retry button when tool fails', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    const failedData: ToolResultData = {
      toolName: 'scoreLead',
      status: 'error',
      errorMessage: 'Database connection failed while resolving CRM records.',
    };

    render(<ToolResultCard toolResult={failedData} onRetry={handleRetry} />);

    const errorRegion = screen.getByRole('region', { name: /tool execution error/i });
    expect(errorRegion).toBeInTheDocument();

    expect(screen.getByText(/database connection failed while resolving crm records/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry failed tool execution/i });
    expect(retryBtn).toBeInTheDocument();

    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});
