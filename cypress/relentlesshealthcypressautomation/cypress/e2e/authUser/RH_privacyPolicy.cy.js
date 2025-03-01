describe('Privacy Policy - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
    });

    it('Validate content exist', () => {
        cy.visit(`${EnvUrl}/profile.html`);
        cy.get('button[class*="MuiButton-contained"]').contains('Privacy Policy').click();
        
        cy.frameLoaded('#618d21cc-d582-42bd-9592-d5d330ff78a1'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'PRIVACY POLICY');
        cy.wait(3000);
    });

});