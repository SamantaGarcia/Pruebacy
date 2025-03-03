describe('Create Account - Relentless Health Website', () => {
    const envUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;

    beforeEach(() => {
        cy.GenerateDynamicEmail();
        cy.visit(`${envUrl}/signup`);
        cy.fixture('createAccount').as('createAccountData');
        cy.fixture('accountInformation').as('accountInformation');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
          });
    });

    it('Cancel Account Creation', function() {
        const { expectedResult } = this.createAccountData.CancelCreation;
        cy.contains('button', 'Cancel').click();
        cy.get('p.MuiTypography-body1').should('be.visible')
        .and('contain.text', expectedResult);
    });

    it('Empty Fields - Page 1', function() {
        const { expectedError1, expectedError2 } = this.createAccountData.EmptyFields;
        cy.get('input[name="email"]').click(); //Email
        cy.get('input[name="firstName"]').click(); //Name
        cy.get('input[name="lastName"]').click(); //Lastname
        cy.get('input[name="password"]').click(); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').click(); //Confirm password
        cy.get('input[name="tos_flag"]').check(); //Terms and Conditions checkbox
        cy.get('input[name="tos_flag"]').uncheck();
        cy.get('input[name="marketing_flag"]').check(); //Marketing checkbox
        //alert validations
        cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 5).each(($el) => {
            cy.wrap($el).should('have.text', expectedError1);
        });
        cy.get('div.MuiBox-root.css-1q7ohal').should('be.visible').and('contain.text', expectedError2);
    });

    it('Empty Fields - Page 2', function(){
        const { name, lastName, year, month, timestamp } = this.accountInformation.AccountCreation;
        const { expectedError1, expectedError3, expectedError4 } = this.createAccountData.EmptyFields;


        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName);
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); 
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);   
        cy.get('input[name="tos_flag"]').click().should('be.checked'); 
        cy.get('input[name="marketing_flag"]').click().should('be.checked');
        cy.contains('button', 'Next').click();

        cy.get('input[name="phoneNumber"]').clear();

        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', '3').should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        
        // cy.get('input[placeholder="DD/MM/YYYY"]').clear(); 
        cy.get('#mui-component-select-gender').click(); 
        cy.get('body').click(0, 0);   //Close dropdown     
        cy.get('input[name="address_1"]').clear(); 
        cy.get('input[name="city"]').clear(); 
        cy.get('input[name="state"]').dblclick(); 
        cy.get('#mui-component-select-occupation').click();
        cy.get('body').click(0, 0); //Close dropdown
        cy.get('input[name="zipcode"]').clear(); 
        cy.get('input[name="address_2"]').clear(); 

        //alert validations
        cy.get('.MuiFormHelperText-root.Mui-error').should('have.length', 7).each(($el) => {
            cy.wrap($el).should(($elem) => {
                const text = $elem.text().trim();
                expect(text).to.be.oneOf([expectedError1, expectedError3, expectedError4]);
            });
        });
        
    });

    it('Cancel Account Activation', function() {
        const { name, lastName } = this.accountInformation.AccountCreation;
        const { expectedResult } = this.createAccountData.CancelCreation;
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); //Email
        cy.get('input[name="firstName"]').type(name); //Name
        cy.get('input[name="lastName"]').type(lastName); //Lastname
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw); //Confirm password
        cy.get('input[name="tos_flag"]').click().should('be.checked'); //Terms and Conditions checkbox
        cy.contains('button', 'Next').click();
        cy.contains('button', 'Cancel activation').click();
        cy.get('p.MuiTypography-body1').should('be.visible')
        .and('contain.text', expectedResult);
    });

    it('Invalid US Phone Number', function() {
        const { name, lastName, year, month, day, gender, address1, address2, city, state, zipCode, education } = this.accountInformation.AccountCreation;
        const { invalidPhone, expectedErrorPhone } = this.createAccountData.InvalidFields;
        
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').click().should('be.checked'); 
        cy.contains('button', 'Next').click();
  
        cy.get('input[name="phoneNumber"]').type(invalidPhone); 
        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', day).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();
        cy.get('#mui-component-select-gender').click(); 
        cy.get('li.MuiMenuItem-root').contains(gender).click(); 
        cy.get('input[name="address_1"]').type(address1); //Address 1
        cy.get('input[name="address_2"]').type(address2); //Address 2
        cy.get('input[name="city"]').type(city); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
        cy.get('input[name="zipcode"]').type(zipCode); //Zip code 
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); 
        cy.contains('button', 'Next').click();

        cy.get('.MuiFormHelperText-root.Mui-error').contains(expectedErrorPhone)
        .should('be.visible');
    });

    it.skip('Invalid Birth date', function() {
        const { name, lastName, phone, gender, address1, address2, city, state, zipCode, education } = this.accountInformation.AccountCreation;
        const { invalidBirthday, expectedErrorBirthday } = this.createAccountData.InvalidFields;
        
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').click().should('be.checked'); 
        cy.contains('button', 'Next').click();
  
         
        cy.get('input[placeholder="DD/MM/YYYY"]').type(invalidBirthday);

        cy.get('.MuiFormHelperText-root.Mui-error').contains(expectedErrorBirthday)
        .should('be.visible');
    });

    it.skip('Invalid US Address', function() {
        const { name, lastName, birthday, gender, phone, address2, state, education } = this.accountInformation.AccountCreation;
        const { invalidAddress1, invalidCity, invalidZipCode, expectedErrorAddress } = this.createAccountData.InvalidFields;
        
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').click().should('be.checked'); 
        cy.contains('button', 'Next').click();
  
        cy.get('input[name="phoneNumber"]').type(phone); 
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthday); 
        cy.get('#mui-component-select-gender').click(); 
        cy.get('li.MuiMenuItem-root').contains(gender).click(); 
        cy.get('input[name="address_1"]').type(invalidAddress1); //Address 1
        cy.get('input[name="address_2"]').type(address2); //Address 2
        cy.get('input[name="city"]').type(invalidCity); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
        cy.get('input[name="zipcode"]').type(invalidZipCode); //Zip code
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); 
        cy.contains('button', 'Next').click();

        cy.get('div.MuiAlert-message.css-f94cg5').should('be.visible').and('contain.text', expectedErrorAddress);
    });

    it.skip('Invalid Verification Code', function() {
        const { name, lastName, phone, birthday, gender, address1, address2, city, state, zipCode, education } = this.accountInformation.AccountCreation;
        const { invalidVerificationCode, expectedErrorCode } = this.createAccountData.InvalidFields;

        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').click().should('be.checked'); //Terms and Conditions checkbox
        cy.contains('button', 'Next').click();
  
        cy.get('input[name="phoneNumber"]').type(phone); 
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthday); 
        cy.get('#mui-component-select-gender').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(gender).click(); //Select Gender option
        cy.get('input[name="address_1"]').type(address1); //Address 1
        cy.get('input[name="address_2"]').type(address2); //Address 2
        cy.get('input[name="city"]').type(city); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
        cy.get('input[name="zipcode"]').type(zipCode); //Zip code
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); //Select Occupation option
        cy.contains('button', 'Next').click();

        cy.get('input[name="confirmationCode"]').type(invalidVerificationCode);
        cy.contains('button', 'Confirm').click();
        
        cy.get('div.MuiAlert-message').should('be.visible').and('contain.text', expectedErrorCode);
    });

    it.skip('Resend Verification Code', function() {
        const { name, lastName, phone, birthday, gender, address1, address2, city, state, zipCode, education } = this.accountInformation.AccountCreation;
        const { expectedResult }= this.createAccountData.ResendCode;
        
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="firstName"]').type(name); 
        cy.get('input[name="lastName"]').type(lastName); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="tos_flag"]').click().should('be.checked'); //Terms and Conditions checkbox
        cy.contains('button', 'Next').click();
  
        cy.get('input[name="phoneNumber"]').type(phone); 
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthday); 
        cy.get('#mui-component-select-gender').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(gender).click(); //Select Gender option
        cy.get('input[name="address_1"]').type(address1); //Address 1
        cy.get('input[name="address_2"]').type(address2); //Address 2
        cy.get('input[name="city"]').type(city); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
        cy.get('input[name="zipcode"]').type(zipCode); //Zip code
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); //Select Occupation option
    
        cy.contains('button', 'Next').click();
        cy.contains('button', 'Resend Code').click();
        cy.get('div.MuiAlert-root.MuiAlert-colorSuccess').should('be.visible').and('contain.text', expectedResult);
        
    });

    it.skip('Create Account Successfully', function() {
        const { name, lastName, phone, birthday, gender, address1, address2, city, state, zipCode, education } = this.accountInformation.AccountCreation;
    
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); //Email
        cy.get('input[name="firstName"]').type(name); //Name
        cy.get('input[name="lastName"]').type(lastName); //Lastname
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); //Password. At least 8 chars, 1 uppercase, 1 special char, 1 number
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw); //Confirm password    
        cy.get('input[name="tos_flag"]').click().should('be.checked'); //Terms and Conditions checkbox
        cy.get('input[name="marketing_flag"]').click().should('be.checked'); //Marketing checkbox
        cy.contains('button', 'Next').click();
  
        cy.get('input[name="phoneNumber"]').type(phone); //Phone number. Must be a real US phone
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthday); 
        cy.get('#mui-component-select-gender').click(); //Open Gender dropdown
        cy.get('li.MuiMenuItem-root').contains(gender).click(); //Select Gender option
        cy.get('input[name="address_1"]').type(address1); //Address 1
        cy.get('input[name="address_2"]').type(address2); //Address 2
        cy.get('input[name="city"]').type(city); //City
        cy.get('input[name="state"]').click(); //Open State dropdown
        cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
        cy.get('input[name="zipcode"]').type(zipCode); //Zip code
        cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
        cy.get('li.MuiButtonBase-root').contains(education).click(); //Select Occupation option
    
        cy.contains('button', 'Next').click();
        cy.wait(5000);
        //Get verification code sent to Gmail
        cy.getAccessToken().then(({ verificationCode }) => {
            cy.get('input[name="confirmationCode"]').type(verificationCode);
            cy.contains('button', 'Confirm').click();
        });
        //Validate that the account was created
        cy.get('h4.MuiTypography-h4').contains('Registration was successfully completed');
    });   
});