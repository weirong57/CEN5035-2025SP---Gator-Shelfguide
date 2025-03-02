describe('Signup Page', () => {
  it('signs up with valid data and redirects to login', () => {
    cy.visit('http://localhost:5174/signup');

    // Generate a unique username to avoid duplicates
    const uniqueUsername = `newuser_${Date.now()}`;

    // Use selectors based on placeholder text (update if you use IDs)
    cy.get('input[placeholder="Username"]').type(uniqueUsername);
    cy.get('input[placeholder="Create a Password"]').type('testpass');
    cy.get('input[placeholder="Confirm Password"]').type('testpass');

    // Click the "Sign Up" button
    cy.contains('button', 'Sign Up').click();

    // Wait up to 10 seconds for the URL to include '/login'
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
