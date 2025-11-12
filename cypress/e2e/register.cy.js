describe('Registration flow', () => {
  it('registers a new user', () => {
    cy.visit('/register');
    cy.get('input[name=email]').type('newuser@example.com');
    cy.get('input[name=password]').type('password123');
    cy.get('button[type=submit]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome, newuser@example.com');
  });
});
