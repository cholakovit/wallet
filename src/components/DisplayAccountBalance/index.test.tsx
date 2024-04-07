import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DisplayAccountBalance from '.';

// Mock the entire walletHooks module
jest.mock('../../hooks/walletHooks', () => ({
  useGetAccountBalance: jest.fn(),
  // Add other mocked hooks here if necessary
}));

// Mock the useQuery hook from @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'), // Use actual implementations for other exports
  useQuery: jest.fn(),
}));

describe('DisplayAccountBalance dynamic tests', () => {
  const queryClient = new QueryClient();

  it('renders Account ID and Balance when provided', async () => {
    // Provide dynamic mock implementations
    const mockAccountId = '123';
    const mockAccountBalance = 100;
    jest.requireMock('@tanstack/react-query').useQuery.mockImplementation(() => ({ data: mockAccountId }));
    jest.requireMock('../../hooks/walletHooks').useGetAccountBalance.mockImplementation(() => mockAccountBalance);

    render(
      <QueryClientProvider client={queryClient}>
        <DisplayAccountBalance />
      </QueryClientProvider>
    );

    expect(await screen.findByText(/Account ID:/i)).toBeInTheDocument();
    expect(await screen.findByText(/Balance:/i)).toBeInTheDocument();
  });

  it('does not render Account ID and Balance when not provided', async () => {
    // Provide dynamic mock implementations for absence scenario
    jest.requireMock('@tanstack/react-query').useQuery.mockImplementation(() => ({ data: undefined }));
    jest.requireMock('../../hooks/walletHooks').useGetAccountBalance.mockImplementation(() => undefined);

    render(
      <QueryClientProvider client={queryClient}>
        <DisplayAccountBalance />
      </QueryClientProvider>
    );

    expect(screen.queryByText(/Account ID:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Balance:/i)).not.toBeInTheDocument();
  });
});

  