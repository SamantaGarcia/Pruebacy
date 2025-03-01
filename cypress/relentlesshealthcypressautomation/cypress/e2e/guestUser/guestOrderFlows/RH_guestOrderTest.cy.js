describe('Order test Guest User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    beforeEach(() => {
        cy.GenerateGuestDynamicEmail();
        cy.fixture('accountInformation').as('accountInformation');
        cy.readFile('cypress/fixtures/generatedData/dynamicGuestEmail.json').then((data) => {
            dynamicAccount = data; 
        });
    });

    it('Order Test Successfully', function() {
        const { newName, newPhone, newAddress1, newAddress2, newCity, newState, newZipCode } = this.accountInformation.EditInformation;
        const { year, month, timestamp, guestName, guestLastname, orderBirthdate, orderState } = this.accountInformation.OrderTestData;

        cy.ShopifyLogin();

        cy.visit(`${EnvUrl}/order.html`);
        cy.contains('button', 'Next').click();
        cy.get('input[name="subjects[0].name"]').clear().type(`${newName} ${guestLastname}`); 
        cy.get('input[name="subjects[0].phoneNumber"]').clear().type(newPhone); 

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

        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').check();
        cy.contains('button', 'Go to shipping').click();  

        cy.get('input[name="email"]').clear().type(dynamicAccount.dynEmail);
        cy.get('input[name="address1"]').clear().type(newAddress1);
        cy.get('input[name="address2"]').clear().type(newAddress2);
        cy.get('input[name="city"]').clear().type(newCity);
        cy.get('input[name="zipcode"]').clear().type(newZipCode);

        cy.get('button[aria-label="Open"]').click();
        cy.get('li').contains(newState).click();
 
        cy.window().then((win) => {
          cy.stub(win, 'open').as('windowOpen');
        });
          
        cy.contains('button', 'Go to Checkout').click();

        cy.SaveCartID().then(() => {
            cy.ShopifyPayment(dynamicAccount.dynEmail, newName, guestLastname, newAddress1, newAddress2, newCity, newState, newZipCode, newPhone);
            cy.wait(5000);
            const cartID = Cypress.env('cart');
            
            cy.log("Obtained Cart ID: " + cartID);
            expect(cartID).to.not.be.null;
            expect(cartID).to.not.be.undefined;
            
            cy.request({
              method: 'POST',
              url: 'http://dev.relentlesshealth.com/api/qa/order', 
              headers: {
                'x-api-key': '73c1c983-b64a-4a39-b833-8edca4629e0b',
                'Content-Type': 'application/json'
              },
              body: {
                "name": guestName,
                "dob": orderBirthdate,
                "email": dynamicAccount.dynEmail,
                "shipping_address": {
                    "address1": newAddress1,
                    "address2": newAddress2,
                    "city": newCity,
                    "state": orderState,
                    "zipcode": newZipCode,
                },
                "cart_id": cartID
              }
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.status).to.eq('SUCCESS');
              cy.log(JSON.stringify(response.body));
              cy.writeFile('cypress/fixtures/generatedData/guestOrderApiResponse.json', response.body);
              cy.visit(`${EnvUrl}/order.html`);
              cy.wait(8000);
              cy.get("p").should('contain.text', response.body.s_order_name);
            });
        });
        
    
    });
});

