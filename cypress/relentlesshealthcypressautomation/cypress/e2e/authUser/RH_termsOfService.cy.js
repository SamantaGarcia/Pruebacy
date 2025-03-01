describe('Terms of Service - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
    });

    it('Validate content exist', () => {
        cy.visit(`${EnvUrl}/profile.html`);
        cy.get('button[class*="MuiButton-contained"]').contains('Terms of Service').click();
        
        cy.frameLoaded('#3beeac26-7ce8-4f9b-a698-01ec576294f4'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'TERMS OF SERVICE');
        cy.wait(3000);
    });

});