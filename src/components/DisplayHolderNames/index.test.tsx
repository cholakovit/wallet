import React from 'react';
import { render, screen } from '@testing-library/react';
import DisplayHolderNames from '.'; // Adjust the import path as necessary
import * as walletHooks from '../../hooks/walletHooks'; // Adjust the import path as necessary

// Mock the custom hook
jest.mock('../../hooks/walletHooks', () => ({
  useGetHolderNames: () => ({
    holderNames: ['Alice', 'Bob', 'Charlie'],
    error: null
  })
}));

describe('DisplayHolderNames', () => {
  it('renders the h1 tag and displays the list of holder names', () => {
    render(<DisplayHolderNames />);

    // Assert the h1 tag is in the document
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Display holder names:');

    // Assert the list items are displayed
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3); // Expecting 3 items in the list
    expect(listItems[0]).toHaveTextContent('Alice');
    expect(listItems[1]).toHaveTextContent('Bob');
    expect(listItems[2]).toHaveTextContent('Charlie');
  });
});
