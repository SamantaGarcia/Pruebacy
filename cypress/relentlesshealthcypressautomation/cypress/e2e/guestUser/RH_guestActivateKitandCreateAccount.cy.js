describe('Activate kit and create account - Relentless Health Website', () => {
    const envUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount, vitalData;

    beforeEach(() => {
        cy.visit(`${envUrl}/guest-activate.html`);
        cy.fixture('createAccount').as('createAccountData');
        cy.fixture('accountInformation').as('accountInformation');
        cy.fixture('activateKit').as('activateKit');
        cy.readFile('cypress/fixtures/generatedData/dynamicGuestEmail.json').then((data) => {
            dynamicAccount = data; 
        });
        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json').then((data) => {
            vitalData = data;
        });
        cy.fixture('navigation').as('navigation');
    });

    it('Cancel Activation', function() {
        const { expectedResult } = this.createAccountData.CancelCreation;
        cy.contains('button', 'Cancel').click();
        cy.get('p.MuiTypography-body1').should('be.visible')
        .and('contain.text', expectedResult);
    });

    it('Empty Fields - activation', function() {
        const { newBirthday } = this.accountInformation.EditInformation;
        const { expectedError1, expectedError2 } = this.activateKit.emptyfields;
        cy.get('input[name="activationCode"]').click();
        cy.get('input[name="email"]').click();
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.get('input[placeholder="DD/MM/YYYY"]').clear(); 
        cy.get('p.MuiTypography-root.MuiTypography-body2.css-obeg58').click(); 

        //alert validations
        cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2).each(($el) => {
            cy.wrap($el).should(($elem) => {
                const text = $elem.text().trim();
                expect(text).to.be.oneOf([expectedError1, expectedError2]);
            });
        });
    });

    it('Invalid Activation Code - activation', function() {
        const { incode, expectedResult } = this.activateKit.invalidCode;
        cy.get('input[name="activationCode"]').type(incode);
        cy.get('input[name="email"]').click();

        //alert validations
        cy.get('p.MuiFormHelperText-root.Mui-error').should('contain.text', expectedResult);
    });

    it('Invalid Email - activation', function() {
        const { inemail, expectedResult } = this.activateKit.invalidEmail;
        cy.get('input[name="email"]').type(inemail);
        cy.get('p.MuiTypography-root.MuiTypography-body2.css-obeg58').click(); 

        //alert validations
        cy.get('p.MuiFormHelperText-root.Mui-error').should('contain.text', expectedResult);
    });

    it('Incorrect Data - activation', function() {
        const { invalidBirthday } = this.createAccountData.InvalidFields;
        const { incCode } = this.activateKit.incorrectCode;
        cy.get('input[name="activationCode"]').type(incCode);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(invalidBirthday); 
        cy.contains('button', 'Next').click(); 

        //alert validations
        cy.get('.MuiDialogContent-root.css-1ukanrd').should('be.visible')
        .and('contain', 'Test kit was not found for the provided activation code, please contact support@relentlesshealth.com and ask for assistance.');
       

    });

    it('Cancel activation - create account', function() {
        const { newBirthday } = this.accountInformation.EditInformation;
        const { expectedResult } = this.createAccountData.CancelCreation;
        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        cy.contains('button', 'Cancel activation').click(); 

        //alert validations
        cy.get('p.MuiTypography-body1').should('be.visible')
        .and('contain.text', expectedResult);
    });

    it('Empty Fields - create account', function() {
        const { newBirthday } = this.accountInformation.EditInformation;
        const { expectedError1, expectedError2 } = this.createAccountData.EmptyFields;
        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        
        cy.get('input[name="password"]').click();
        cy.get('input[name="confirmPassword"]').click();
        cy.get('input[name="tos_flag"]').check();
        cy.get('input[name="tos_flag"]').uncheck();
        cy.get('input[name="marketing_flag"]').check();

        //alert validations
        cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 2).each(($el) => {
            cy.wrap($el).should('have.text', expectedError1);
        });
        cy.get('div.MuiBox-root.css-1q7ohal').should('be.visible').and('contain.text', expectedError2);

    });

    it('Empty Fields 2 - create account', function() {
        const { newBirthday } = this.accountInformation.EditInformation;
        const { expectedError1, expectedError4 } = this.createAccountData.EmptyFields;
        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').check();
        cy.get('input[name="marketing_flag"]').check();
        cy.contains('button', 'Next').click();

        cy.get('input[name="phoneNumber"]').click();
        cy.get('#mui-component-select-gender').click(); 
        cy.get('body').click(0, 0);   //Close dropdown     
        cy.get('input[name="address_1"]').clear(); 
        cy.get('input[name="city"]').clear(); 
        cy.get('input[name="state"]').clear(); 
        cy.get('#mui-component-select-occupation').click();
        cy.get('body').click(0, 0); //Close dropdown
        cy.get('input[name="zipcode"]').clear(); 
        cy.get('input[name="address_2"]').clear(); 

        cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 7).each(($el) => {
            cy.wrap($el).should(($elem) => {
                const text = $elem.text().trim(); 
                expect(text).to.be.oneOf([expectedError1, expectedError4]); 
            });
        });

    });

    it('Invalid Address - create account', function() {
        const { newBirthday, newPhone, newGender, newAddress2, newState } = this.accountInformation.EditInformation;
        const { education } = this.accountInformation.AccountCreation;
        const { invalidAddress1, invalidCity, invalidZipCode, expectedErrorAddress } = this.createAccountData.InvalidFields;
        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').check();
        cy.get('input[name="marketing_flag"]').check();
        cy.contains('button', 'Next').click();

        cy.get('input[name="phoneNumber"]').clear().type(newPhone); 
        cy.get('#mui-component-select-gender').click(); 
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); 
        cy.get('input[name="address_1"]').clear().type(invalidAddress1); //Address 1
        cy.get('input[name="address_2"]').clear().type(newAddress2); //Address 2
        cy.get('input[name="city"]').clear().type(invalidCity); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', newState).click(); //choose state
        cy.get('input[name="zipcode"]').clear().type(invalidZipCode); //Zip code
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); 
        cy.contains('button', 'Finalize & activate').click();

        cy.get('.MuiAlert-message').should('be.visible')
        .and('contain', expectedErrorAddress);

    });

    it('Invalid Phone - create account', function() {
        const { newBirthday, newGender } = this.accountInformation.EditInformation;
        const { expectedErrorPhone, invalidPhone } = this.createAccountData.InvalidFields;
        const { education } = this.accountInformation.AccountCreation;
        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').check();
        cy.get('input[name="marketing_flag"]').check();
        cy.contains('button', 'Next').click();

        cy.get('input[name="phoneNumber"]').clear().type(invalidPhone); 
        cy.get('#mui-component-select-gender').click(); 
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); 
        cy.get('#mui-component-select-occupation').click();
        cy.get('ul[role="listbox"] li').contains(education)
        .click();

        cy.contains('button', 'Finalize & activate').click();
        cy.get('.MuiFormHelperText-root.Mui-error').should('contain', expectedErrorPhone);
    });

    it('Activate kit and create account', function() {
        const { newPhone, newBirthday, newGender, newAddress1, newAddress2, newCity, newState, newZipCode } = this.accountInformation.EditInformation;
        const { education } = this.accountInformation.AccountCreation;
        const { kitActivatedTitle } = this.activateKit.guestActivateKit;

        cy.get('input[name="activationCode"]').type(vitalData.guestSampleID1);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(newBirthday); 
        cy.contains('button', 'Next').click();
        
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').check();
        cy.get('input[name="marketing_flag"]').check();
        cy.contains('button', 'Next').click();

        cy.get('input[name="phoneNumber"]').clear().type(newPhone); 
        cy.get('#mui-component-select-gender').click(); 
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); 
        cy.get('#mui-component-select-occupation').click();
        cy.get('ul[role="listbox"] li').contains(education).click();
        cy.get('input[name="address_1"]').should('contain.value', newAddress1);
        cy.get('input[name="address_2"]').should('contain.value', newAddress2);
        cy.get('input[name="city"]').should('contain.value', newCity);
        cy.get('input[name="state"]').should('contain.value', newState);
        cy.get('input[name="zipcode"]').should('contain.value', newZipCode);

        cy.contains('button', 'Finalize & activate').click();
        cy.get("h4")
        .should('contain.text', kitActivatedTitle);
        cy.get("h5")
        .should('contain.text', vitalData.guestSampleID1);
       
    });

    
});