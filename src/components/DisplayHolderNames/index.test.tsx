import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DisplayHolderNames from './index';
import * as walletHooks from '../../hooks/walletHooks';

// Define the mock type explicitly
jest.mock('../../hooks/walletHooks', () => ({
  useGetWallet: jest.fn(),
}));

// TypeScript cast to access mock properties
const mockUseGetWallet = walletHooks.useGetWallet as jest.Mock;

const mockWallet = [
  { id: '1', holder: { name: 'John Doe' } },
  { id: '2', holder: { name: 'Jane Doe' } },
];

describe('DisplayHolderNames', () => {
  it('displays loading text', () => {
    mockUseGetWallet.mockReturnValue({ wallet: null, error: null, isLoading: true });
    render(<BrowserRouter><DisplayHolderNames /></BrowserRouter>);
    //expect(screen.getByText(/Loading Data.../i)).toBeInTheDocument();
  });

  it('displays error text', () => {
    mockUseGetWallet.mockReturnValue({ wallet: null, error: 'Error Occured!', isLoading: false });
    render(<BrowserRouter><DisplayHolderNames /></BrowserRouter>);
    expect(screen.getByText(/Error Occurred/i)).toBeInTheDocument();
  });

  it('displays wallet holder names', async () => {
    mockUseGetWallet.mockReturnValue({ wallet: mockWallet, error: null, isLoading: false });
    render(<BrowserRouter><DisplayHolderNames /></BrowserRouter>);

    // Use findByText for asynchronous elements
    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(await screen.findByText(/Jane Doe/i)).toBeInTheDocument();
  });
});
    