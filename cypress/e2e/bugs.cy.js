describe('Bug CRUD operations', () => {
  beforeEach(() => {
    cy.visit('/bugs');
  });

  it('creates a bug', () => {
    cy.get('button').contains('New Bug').click();
    cy.get('input[name=title]').type('Bug A');
    cy.get('textarea[name=description]').type('Bug A description');
    cy.get('button[type=submit]').click();
    cy.contains('Bug A');
  });

  it('updates a bug', () => {
    cy.contains('Bug A').click();
    cy.get('button').contains('Edit').click();
    cy.get('textarea[name=description]').clear().type('Updated description');
    cy.get('button[type=submit]').click();
    cy.contains('Updated description');
  });

  it('deletes a bug', () => {
    cy.contains('Bug A').click();
    cy.get('button').contains('Delete').click();
    cy.contains('Bug A').should('not.exist');
  });
});
