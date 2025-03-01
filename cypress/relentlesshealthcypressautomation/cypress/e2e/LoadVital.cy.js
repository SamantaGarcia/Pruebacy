describe('Load Vital to avoid issues', () => {
    const vitalUrl = Cypress.env('CYPRESS_VITAL_DEV_ENV');
    const qaEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');

    it('Send Verification code to gmail', () => {
        cy.visit(vitalUrl);
        cy.get('#username').type(qaEmail);
        cy.contains('button', 'Continue').click(); 
        cy.get('p').should('contain.text', "We've sent an email with your code to");
        // this will prevent the sending of vital login codes from failing during e2e.
    });
});