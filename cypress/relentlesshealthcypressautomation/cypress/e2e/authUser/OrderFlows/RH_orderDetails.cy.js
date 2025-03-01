describe('Order Details - Validate Details', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    let orderData;
    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/orders.html`);
        cy.fixture('accountInformation').as('accountInformation');
        cy.fixture('orderTestSadPaths').as('orderTestCheckout');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
        });
        cy.readFile('cypress/fixtures/generatedData/authOrderApiResponse.json').then((data) => {
            orderData = data;
          });
    });
    
    it('Validate order information', function() {
        //Replace values with the outputs from the order API
        const { newAddress1, newAddress2, newCity, newZipCode } = this.accountInformation.EditInformation;
        const { orderPrice } = this.orderTestCheckout.Checkout;

        cy.contains('h6', orderData[0].s_order_name).click(); 
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-lne3jp")
        .should('contain.text', orderData[0].s_order_name);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-lne3jp")
        .should('contain.text', orderPrice);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-1trh6um")
        .should('contain.text', newAddress1);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-1trh6um")
        .should('contain.text', newAddress2);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-1trh6um")
        .should('contain.text', newCity);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-1trh6um")
        .should('contain.text', newZipCode);
    });
});