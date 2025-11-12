// This runs before every test file
// You can add global hooks or custom commands here
import '@percy/cypress';

import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
addMatchImageSnapshotCommand();

// Example: ignore uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  return false; // prevents Cypress from failing tests on app errors
});
