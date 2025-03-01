describe('Inactivity Modal - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}`);
        cy.fixture('inactivityModal').as('inactivityModal');
    });

    it('Extend session', function() {
        const { expectedResultExtend } = this.inactivityModal.ExtendSession;

        cy.get('.MuiTypography-root.MuiTypography-body1.css-k78egd').should('be.visible')
        .and('contain.text', expectedResultExtend);

        cy.get('.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.css-zcidyw', { timeout: 60000 }).click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-k78egd').should('be.visible')
        .and('contain.text', expectedResultExtend);
    });

    it('Logout', function() {
        const { expectedResultExtend } = this.inactivityModal.ExtendSession;

        cy.get('.MuiTypography-root.MuiTypography-body1.css-k78egd').should('be.visible')
        .and('contain.text', expectedResultExtend);
        
        cy.get('.MuiButton-root.MuiButton-outlined.MuiButton-outlinedPrimary.css-1j10gnh', { timeout: 60000 }).click();

        cy.contains('button', 'Create account').should('be.visible');
    });

    it('No response', function() {
        const { expectedResultExtend } = this.inactivityModal.ExtendSession;

        cy.get('.MuiTypography-root.MuiTypography-body1.css-k78egd').should('be.visible')
        .and('contain.text', expectedResultExtend);
        
        cy.contains('button', 'Create account', { timeout: 120000 }).should('be.visible');
    });
});