describe('Order a Test - You are buying a PFAS test kit', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    beforeEach(() => {
        cy.visit(`${EnvUrl}/order.html`);
        cy.fixture('orderTestSadPaths').as('orderTestPage1');
       
    });

    it('Cancel Order', function() {
        const { dashboard } = this.orderTestPage1.GuestPage1;
        cy.contains('button', 'Cancel').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-39x0eb')
        .should('contain.text', dashboard);
    });

    it('Click on Back Button', function() {
        const { dashboard } = this.orderTestPage1.GuestPage1;
        cy.contains('a', 'Back').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-39x0eb')
        .should('contain.text', dashboard);
    });

});