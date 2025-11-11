import React from 'react';
import BugCard from './BugCard';
import { render, screen } from '@testing-library/react';

test('renders bug title', () => {
  render(<BugCard bug={{ title: 'Crash on login' }} />);
  expect(screen.getByText('Crash on login')).toBeInTheDocument();
});
