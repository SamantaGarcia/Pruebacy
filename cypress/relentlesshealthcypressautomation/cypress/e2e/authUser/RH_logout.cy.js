describe('Logout - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
    });
    
    it('Logout successfully', () => {
        cy.visit(`${EnvUrl}/profile.html`);
        cy.get('button[class*="MuiButton-contained"]').contains('Logout').click();
        cy.get('p[class*="MuiTypography-body1"]').should('be.visible')
        .and('contain.text', "At-home PFAS and toxin testing");
    });
});