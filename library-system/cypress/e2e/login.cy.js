describe('Login Page', () => {
  it('logs in with valid username and password', () => {
    // Visit the login page (adjust if your dev server is on a different port)
    cy.visit('http://localhost:5174/login');

    // Fill in username & password
    cy.get('#username').type('testuser');
    cy.get('#password').type('testpass');

    // Click the "Login" button
    cy.contains('button', 'Login').click();

    // Check that the user is redirected to the dashboard
    cy.url().should('include', '/main/dashboard');
  });
});
