describe('Navigation and routing', () => {
  it('navigates to bugs page', () => {
    cy.visit('/');
    cy.get('nav').contains('Bugs').click();
    cy.url().should('include', '/bugs');
    cy.contains('Bug List');
  });

  it('shows 404 page for invalid route', () => {
    cy.visit('/non-existent', { failOnStatusCode: false });
    cy.contains('404');
    cy.contains('Page Not Found');
  });
});
