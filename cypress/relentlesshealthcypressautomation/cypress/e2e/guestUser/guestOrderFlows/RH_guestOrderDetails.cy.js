describe('Guest order details - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    let orderData, extractedOrderId;
    beforeEach(() => {
        cy.readFile('cypress/fixtures/generatedData/dynamicGuestEmail.json').then((data) => {
            dynamicAccount = data; 
        });
        cy.fixture('orderTestSadPaths').as('orderTestCheckout');
        cy.fixture('accountInformation').as('accountInformation');
        cy.fixture('orderDetails').as('orderDetails');
        cy.readFile('cypress/fixtures/generatedData/guestOrderApiResponse.json').then((data) => {
            orderData = data;
            const sOrderId = orderData.s_order_id;
            extractedOrderId = sOrderId.match(/\d+$/)[0]; 
        }).then(() => {
            cy.visit(`${EnvUrl}/guest-orders/${extractedOrderId}`);
        });

    });
    
    it('Obtain order information', function() {
        const { guestName } = this.accountInformation.OrderTestData
        const { orderPrice } = this.orderTestCheckout.Checkout;

        cy.get('input[name="name"]').type(guestName);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.contains('button', 'Find order details').click(); 
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-lne3jp")
        .should('contain.text', orderData.s_order_name);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-lne3jp")
        .should('contain.text', orderPrice);
    });

    it('Empty fields', function() {
        const { emptyName, emptyEmail } = this.orderDetails.emptyFields
        cy.contains('button', 'Find order details').click(); 
        cy.get("p.MuiFormHelperText-root.Mui-error")
        .should('contain.text', emptyName);
        cy.get("p.MuiFormHelperText-root.Mui-error")
        .should('contain.text', emptyEmail);
    });

    it('Invalid email', function() {
        const { guestName } = this.accountInformation.OrderTestData
        const { invalidEmail, invalidEmailResult } = this.orderDetails.invalidEmail;

        cy.get('input[name="name"]').type(guestName);
        cy.get('input[name="email"]').type(invalidEmail);
        cy.contains('button', 'Find order details').click(); 
        cy.get("p.MuiFormHelperText-root.Mui-error")
        .should('contain.text', invalidEmailResult);
    });

    it('Incorrect account', function() {
        const { incorrectName, incorrectEmail, incorrectAccountResult } = this.orderDetails.incorrectAccount;

        cy.get('input[name="name"]').type(incorrectName);
        cy.get('input[name="email"]').type(incorrectEmail);
        cy.contains('button', 'Find order details').click(); 
        cy.get("h1")
        .should('contain.text', incorrectAccountResult);
    });
});