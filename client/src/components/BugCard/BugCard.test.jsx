import React from 'react';
import { render, screen } from '@testing-library/react';
import BugCard from '../components/BugCard/BugCard';

test('renders bug title', () => {
  render(<BugCard bug={{ title: 'Crash on login' }} />);
  expect(screen.getByText('Crash on login')).toBeInTheDocument();
});
