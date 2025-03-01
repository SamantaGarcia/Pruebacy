describe('Order a Test - Checkout', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/order.html`);
        cy.fixture('accountInformation').as('accountInformation');
        cy.fixture('orderTestSadPaths').as('orderTestCheckout');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
        });
    });

    it('Click on Back button', function() {
        const { orderName, year, month, timestamp } = this.accountInformation.OrderTestData;
        const { h5Page3 } = this.orderTestCheckout.Checkout;
        cy.contains('button', 'Next').click();
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.css-m53ae2').clear().type(orderName); 

        cy.get('button[aria-label="Choose date"]').click();
        cy.get('button[role="radio"][aria-checked="false"]') 
        .contains(year) 
        .click(); 

        cy.get(`button[aria-label="${month}"]`) 
        .should('be.visible') 
        .click();

        cy.get(`button[data-timestamp="${timestamp}"]`) 
        .should('be.visible') 
        .click();
        
        cy.get('input[name="subjects[0].isAnAdult"]')
        .check().should('be.checked');
        cy.contains('button', 'Go to shipping').click(); 

        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });
        cy.contains('button', 'Go to Checkout').click(); 
        cy.wait(5000);
        cy.contains('a', 'Back').click();

        cy.get('h5').contains(h5Page3)
        .should('be.visible');
    });

    it('Validate Order Summary', function() {
        const { orderName, year, month, timestamp, orderInstructions } = this.accountInformation.OrderTestData;
        const { newAddress1, newAddress2, newCity, newState, newZipCode } = this.accountInformation.EditInformation;
        const { orderProduct, orderPrice, orderBirthdate } = this.orderTestCheckout.Checkout;
        cy.contains('button', 'Next').click();

        cy.get('input[name="subjects[0].name"]').clear().type(orderName);

        cy.get('button[aria-label="Choose date"]').click();
        cy.get('button[role="radio"][aria-checked="false"]') 
        .contains(year) 
        .click(); 

        cy.get(`button[aria-label="${month}"]`) 
        .should('be.visible') 
        .click();

        cy.get(`button[data-timestamp="${timestamp}"]`) 
        .should('be.visible') 
        .click();
        
        cy.get('input[name="subjects[0].isAnAdult"]')
        .check().should('be.checked');

        cy.contains('button', 'Go to shipping').click();

        cy.get('input[name="email"]').should('contain.value', dynamicAccount.dynEmail);

        cy.get('input[name="address1"]').clear().type(newAddress1);

        cy.get('input[name="address2"]').clear().type(newAddress2);

        cy.get('input[name="city"]').clear().type(newCity);

        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').type(newState)

        cy.get('input[name="zipcode"]').clear().type(newZipCode);

        cy.get('textarea[name="deliveryInstructions"]').type(orderInstructions);
 
        //prevents the shopify window to be opened
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen');
        });
          
        cy.contains('button', 'Go to Checkout').click();

        //Validations
        cy.get('p.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', orderProduct);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', orderPrice);

        cy.get('.MuiTypography-root.MuiTypography-h6.css-1v1mw66')
        .should('contain.text', orderName);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', dynamicAccount.dynEmail);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', orderBirthdate);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', orderName);
        
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', newAddress1);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', newCity);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um')
        .should('contain.text', newZipCode);

    });
});