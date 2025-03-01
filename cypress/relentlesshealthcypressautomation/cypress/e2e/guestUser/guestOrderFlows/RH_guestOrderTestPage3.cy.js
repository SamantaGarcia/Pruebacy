describe('Order a Test - Where should we send the test kit?', () => {

    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    beforeEach(() => {
        cy.visit(`${EnvUrl}/order.html`);
        cy.fixture('orderTestSadPaths').as('orderTestPage3');
        cy.fixture('accountInformation').as('accountInformation');
    });

    it('Click on Back Button', function() {
        const { orderName, year, month, timestamp  } = this.accountInformation.OrderTestData;
        const { newPhone } = this.accountInformation.EditInformation;
        const { h5Page2 } = this.orderTestPage3.Page3;        
        cy.contains('button', 'Next').click();
        cy.get('input[name="subjects[0].name"]').clear().type(orderName); 
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
        cy.wait(5000);
        cy.contains('a', 'Back').click();
        cy.get('h5').contains(h5Page2)
        .should('be.visible');
    });

    it('Empty Fields', function() {
        const { orderName, year, month, timestamp  } = this.accountInformation.OrderTestData;
        const { emptyEmailAlert, emptyAddress1Alert, emptyCityAlert, emptyStateAlert, emptyZipcodeAlert } = this.orderTestPage3.Page3;
        const { newPhone, newState } = this.accountInformation.EditInformation;
        cy.contains('button', 'Next').click();
        cy.get('input[name="subjects[0].name"]').clear().type(orderName); 
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

        cy.get('input[name="email"]').clear();
        cy.get('input[name="address1"]').clear();
        cy.get('input[name="address2"]').clear();
        cy.get('input[name="city"]').clear();
        cy.get('input[name="zipcode"]').clear();

        cy.get('button[aria-label="Open"]').click();
        cy.get('li').contains(newState).click();
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').clear();

        cy.get('textarea[name="deliveryInstructions"]').clear();

        
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyEmailAlert);
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyAddress1Alert);
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyCityAlert);
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyStateAlert);
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyZipcodeAlert);
    });

    it('Invalid e-mail address', function() {
        const { orderName, year, month, timestamp  } = this.accountInformation.OrderTestData;
        const { invalidEmail, invalidEmailAlert } = this.orderTestPage3.Page3;
        const { newPhone } = this.accountInformation.EditInformation;
        cy.contains('button', 'Next').click();
        cy.get('input[name="subjects[0].name"]').clear().type(orderName); 
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

        cy.get('input[name="email"]').clear().type(invalidEmail);
        cy.contains('h5','Where should we send the test kit?').click();

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidEmailAlert);
    });

    it('Invalid mailing address', function() {
        const { orderName, year, month, timestamp  } = this.accountInformation.OrderTestData;
        const { invalidAddress1, invalidAddress2, invalidCity, invalidZipcode, invalidZipcodeAlert, invalidAddressAlert } = this.orderTestPage3.Page3;
        const { newPhone } = this.accountInformation.EditInformation;
        cy.contains('button', 'Next').click();
        cy.get('input[name="subjects[0].name"]').clear().type(orderName); 
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
        
        cy.get('input[name="address1"]').clear().type(invalidAddress1);
        cy.get('input[name="address2"]').clear().type(invalidAddress2);
        cy.get('input[name="city"]').clear().type(invalidCity);
        cy.get('input[name="zipcode"]').clear().type(invalidZipcode);
        
        cy.contains('h5','Where should we send the test kit?').click();

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidZipcodeAlert);

    });


});