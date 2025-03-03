describe('Edit Profile - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    beforeEach(() => {
        cy.RelHealthLogin();
        cy.fixture('editProfile').as('profileData');
        cy.fixture('accountInformation').as('accountInformation');
        cy.visit(`${EnvUrl}/profile.html`);
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
          });
    });

    it('View Profile Before Edit', function() {
        const { name, lastName, phone, birthday, gender, address1, address2, city, state, zipCode } = this.accountInformation.AccountCreation;
        cy.get('input[name="name"]').should('have.value', name);
        cy.get('input[name="family_name"]').should('have.value', lastName);
        cy.get('#gender-select').should('have.text', gender);
        cy.get('input[placeholder="DD/MM/YYYY"]').should('have.value', birthday);
        cy.get('input[name="custom:address_1"]').should('have.value', address1);
        cy.get('input[name="custom:address_2"]').should('have.value', address2);
        cy.get('input[name="custom:city"]').should('have.value', city);
        cy.get('input.MuiAutocomplete-input[aria-autocomplete="list"]').should('have.value', state); 
        cy.get('input[name="custom:zipcode"]').should('have.value', zipCode);
        cy.get('input[name="phone_number"]').should('have.value', phone);
        cy.get('input[name="email"]').should('have.value', dynamicAccount.dynEmail);
    });
    
    it('Edit Profile Successfully', function() {
        const { newName, newLastName, newPhone, year, month, day, newGender, newBirthday, newAddress1, newAddress2, newCity, newState, newZipCode, expectedResult } = this.accountInformation.EditInformation;
        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();

        cy.get('input[name="name"]').clear().type(newName); 
        cy.get('input[name="family_name"]').clear().type(newLastName); 
        cy.get('#gender-select').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); //Select Gender option

        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', day).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input[name="custom:address_1"]').clear().type(newAddress1);
        cy.get('input[name="custom:address_2"]').clear().type(newAddress2);
        cy.get('input[name="custom:city"]').clear().type(newCity);
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', newState).click(); //choose state
        cy.get('input[name="custom:zipcode"]').clear().type(newZipCode);
        cy.get('input[name="phone_number"]').clear().type(newPhone);
        cy.contains('button', 'Save').click();
        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible').and('contain.text', expectedResult);
        cy.wait(3000);

        //Validations
        cy.get('input[name="name"]').should('have.value', newName);
        cy.get('input[name="family_name"]').should('have.value', newLastName);
        cy.get('#gender-select').should('have.text', newGender);
        cy.get('input[placeholder="DD/MM/YYYY"]').should('have.value', newBirthday);
        cy.get('input[name="custom:address_1"]').should('have.value', newAddress1);
        cy.get('input[name="custom:address_2"]').should('have.value', newAddress2);
        cy.get('input[name="custom:city"]').should('have.value', newCity);
        cy.get('input.MuiAutocomplete-input[aria-autocomplete="list"]').should('have.value', newState); 
        cy.get('input[name="custom:zipcode"]').should('have.value', newZipCode);
        cy.get('input[name="phone_number"]').should('have.value', newPhone);
    });

    it('Cancel edit', () => {
        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();
        cy.contains('button', 'Cancel').click();
        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').should('be.visible');
    });

    it('Empty Fields', function() {
        const { gender, errorName, errorLastName, errorGender, errorAddress1, errorCity, errorState, errorZipCode, errorPhone, errordateofbirth } = this.profileData.EmptyFields;

        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();

        cy.get('input[name="name"]').clear();
        cy.get('input[name="family_name"]').clear();
        cy.get('#gender-select').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(gender).click(); //Select Gender option
        // cy.get('input[placeholder="DD/MM/YYYY"]').clear();
        cy.get('input[name="custom:address_1"]').clear();
        cy.get('input[name="custom:address_2"]').clear();
        cy.get('input[name="custom:city"]').clear();
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').clear(); //Open State dropdown
        cy.get('input[name="custom:zipcode"]').clear();
        cy.get('input[name="phone_number"]').clear();
        cy.contains('button', 'Save').click();

        //Validations
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorName)
        .should('be.visible');   
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorLastName)
        .should('be.visible');   
        cy.get('.MuiBox-root').contains(errorGender)
        .should('be.visible');
        // cy.get('.MuiFormHelperText-root.Mui-error').contains(errordateofbirth)
        // .should('be.visible');
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorAddress1)
        .should('be.visible');        
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorCity)
        .should('be.visible');        
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorState)
        .should('be.visible');
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorZipCode)
        .should('be.visible');
        cy.get('.MuiFormHelperText-root.Mui-error').contains(errorPhone)
        .should('be.visible');

    });

    it('Invalid US address', function() {
        const { newName, newLastName, newPhone, year, month, day, newGender, newState } = this.accountInformation.EditInformation;
        const { invalidAddress1, invalidAddress2, invalidCity, invalidZipCode, expectedErrorAddress} = this.profileData.InvalidFields;


        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();

        cy.get('input[name="name"]').clear().type(newName);
        cy.get('input[name="family_name"]').clear().type(newLastName);
        cy.get('#gender-select').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); //Select Gender option
        
        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', day).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input[name="custom:address_1"]').clear().type(invalidAddress1);
        cy.get('input[name="custom:address_2"]').clear().type(invalidAddress2);
        cy.get('input[name="custom:city"]').clear().type(invalidCity);
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', newState).click(); 
        cy.get('input[name="custom:zipcode"]').clear().type(invalidZipCode);
        cy.get('input[name="phone_number"]').clear().type(newPhone);
        cy.contains('button', 'Save').click();

        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible').and('contain.text', expectedErrorAddress);
    });

    it('Invalid US Phone', function() {
        const { invalidPhone, expectedErrorPhone } = this.profileData.InvalidFields;
        const { newName, newLastName, year, month, day, newGender, newAddress1, newAddress2, newCity, newState, newZipCode } = this.accountInformation.EditInformation;
        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();

        cy.get('input[name="name"]').clear().type(newName); 
        cy.get('input[name="family_name"]').clear().type(newLastName); 
        cy.get('#gender-select').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); //Select Gender option
        
        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', day).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input[name="custom:address_1"]').clear().type(newAddress1);
        cy.get('input[name="custom:address_2"]').clear().type(newAddress2);
        cy.get('input[name="custom:city"]').clear().type(newCity);
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', newState).click(); //choose state
        cy.get('input[name="custom:zipcode"]').clear().type(newZipCode);
        cy.get('input[name="phone_number"]').clear().type(invalidPhone);
        cy.contains('button', 'Save').click();

        cy.get('.MuiFormHelperText-root.Mui-error').should('be.visible').and('contain.text', expectedErrorPhone);

    });

    it('Invalid Birth date', function() {
        const { invalidBirthday, expectedErrorBirthday } = this.profileData.InvalidFields;
        const { newName, newLastName, newPhone, newGender, month, day, newAddress1, newAddress2, newCity, newState, newZipCode } = this.accountInformation.EditInformation;
        cy.get('p[class*="MuiTypography-body1"]').contains('Edit').click();

        cy.get('input[name="name"]').clear().type(newName); 
        cy.get('input[name="family_name"]').clear().type(newLastName); 
        cy.get('#gender-select').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(newGender).click(); //Select Gender option
        
        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(invalidBirthday).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', day).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input[name="custom:address_1"]').clear().type(newAddress1);
        cy.get('input[name="custom:address_2"]').clear().type(newAddress2);
        cy.get('input[name="custom:city"]').clear().type(newCity);
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', newState).click(); //choose state
        cy.get('input[name="custom:zipcode"]').clear().type(newZipCode);
        cy.get('input[name="phone_number"]').clear().type(newPhone);
        cy.contains('button', 'Save').click();

        cy.get('.MuiFormHelperText-root.Mui-error').should('be.visible').and('contain.text', expectedErrorBirthday);

    });

});