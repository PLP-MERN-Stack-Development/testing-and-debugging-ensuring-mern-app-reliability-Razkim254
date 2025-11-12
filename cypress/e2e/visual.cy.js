describe('Visual regression tests', () => {
  it('Homepage snapshot', () => {
    cy.visit('/');
    cy.percySnapshot('Homepage');
  });

  it('BugCard snapshot', () => {
    cy.visit('/bugs/123'); // adjust to a real bug route
    cy.get('.bug-card').percySnapshot('BugCard');
  });
});
