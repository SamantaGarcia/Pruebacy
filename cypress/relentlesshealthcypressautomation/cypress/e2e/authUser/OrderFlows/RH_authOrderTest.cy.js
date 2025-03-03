describe('Order test Logged User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;

    before(() => {
        cy.writeFile('cypress/fixtures/generatedData/authOrderApiResponse.json', []);
    });

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.fixture('accountInformation').as('accountInformation');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data;
        });
    });
     
    function saveOrderResponse(orderResponse) {
        cy.readFile('cypress/fixtures/generatedData/authOrderApiResponse.json').then((orders) => {
            orders.push(orderResponse);
            cy.writeFile('cypress/fixtures/generatedData/authOrderApiResponse.json', orders);
        });
    }

    it.only('Order First Test Successfully', function() {
        cy.placeAuthOrder(EnvUrl, this.accountInformation, dynamicAccount).then((orderResponse) => {
            saveOrderResponse(orderResponse);
            cy.visit(`${EnvUrl}/order.html`);
            cy.wait(8000);
            cy.get("p").should('contain.text', orderResponse.s_order_name);
        });
    });

    it('Order Second Test Successfully', function() {
        cy.placeAuthOrder(EnvUrl, this.accountInformation, dynamicAccount).then((orderResponse) => {
            saveOrderResponse(orderResponse);
            cy.visit(`${EnvUrl}/order.html`);
            cy.wait(8000);
            cy.get("p").should('contain.text', orderResponse.s_order_name);
        });
    });

    it('Order Third Test Successfully', function() {
        cy.placeAuthOrder(EnvUrl, this.accountInformation, dynamicAccount).then((orderResponse) => {
            saveOrderResponse(orderResponse);
            cy.visit(`${EnvUrl}/order.html`);
            cy.wait(8000);
            cy.get("p").should('contain.text', orderResponse.s_order_name);
        });
    });
});