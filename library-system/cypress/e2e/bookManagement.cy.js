// cypress/e2e/bookManagement.cy.js
describe('Simplified Search Test', () => {
  const BOOKS_URL = 'http://localhost:5173/main/books'

  beforeEach(() => {

    cy.visit('http://localhost:5173/login')
    cy.get('#username').type('testuser')
    cy.get('#password').type('testpass')
    cy.contains('button', 'Login').click()


    cy.visit(BOOKS_URL)
    

    cy.get('input[type="search"]', { timeout: 10000 })
      .should('be.visible')
  })

  it('should accept search input', () => {

    const randomText = `aaa`
    

    cy.get('input[placeholder="Search by title/author/ISBN..."]')
      .clear()
      .type(randomText)
      .should('have.value', randomText)

    cy.contains('button', 'Search').click()
  })
})