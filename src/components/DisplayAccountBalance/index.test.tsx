import React from 'react';
import { render, screen } from '@testing-library/react';
import DisplayAccountBalance from '.'; // Adjust the import path as necessary
import * as walletHooks from '../../hooks/walletHooks'; // Adjust the import path as necessary

// Mock the custom hook
jest.mock('../../hooks/walletHooks', () => ({
  useGetAccountBalance: jest.fn()
}));

describe('DisplayAccountBalance', () => {
  it('renders the h2 tag, account ID, and balance correctly', () => {
    const mockedUseGetAccountBalance = walletHooks.useGetAccountBalance as jest.Mock;

    // Set up the mock to return a specific balance
    const mockedBalance = 100; // Example balance
    mockedUseGetAccountBalance.mockReturnValue(mockedBalance);

    render(<DisplayAccountBalance />);

    // Assert the h2 tag content
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Balance for account:');

    // Assert the account ID display
    expect(screen.getByText(/259566ae-9d0d-4def-a780-2bd3e7aca2ed/)).toBeInTheDocument();

    // Assert the balance display
    expect(screen.getByText(`Balance: ${mockedBalance}`)).toBeInTheDocument();
  });
});
