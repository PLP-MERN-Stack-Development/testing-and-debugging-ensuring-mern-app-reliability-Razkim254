describe('Error handling', () => {
  it('shows error on invalid login', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('wrong@example.com');
    cy.get('input[name=password]').type('badpass');
    cy.get('button[type=submit]').click();
    cy.contains('Invalid credentials');
  });

  it('shows validation errors on empty form', () => {
    cy.visit('/register');
    cy.get('button[type=submit]').click();
    cy.contains('Email is required');
    cy.contains('Password is required');
  });
});
