describe('Smoke test', () => {
  it('loads the homepage', () => {
    cy.visit('/');
    cy.contains('Bug Tracker'); // adjust to something visible on your homepage
  });
});
