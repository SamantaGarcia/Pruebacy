describe('Login - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;

    beforeEach(() => {
        cy.visit(`${EnvUrl}/login`);
        cy.get('[data-tid="banner-accept"]').click();
        cy.fixture('login').as('loginData');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
          });
    });

    it('Successful Login', () => {
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); 
        cy.contains('button', 'Next').click();
        cy.get('button.MuiIconButton-root').should('be.visible');
    });

    it('Cancel Login', () => {
        cy.contains('button', 'Cancel').click();
        cy.contains('button', 'Sign In').should('be.visible');
    });

    it('Empty Fields', function() {
        const { expectedError1, expectedError2 } = this.loginData.EmptyFields;
        cy.get('input[name="password"]').click();
        cy.get('input[name="email"]').click();
        //validations
        cy.get('.MuiFormHelperText-root.Mui-error').contains(expectedError1)
        .should('be.visible');
        cy.get('.MuiFormHelperText-root.Mui-error').contains(expectedError2)
        .should('be.visible');
    });

    it('Incorrect Email', function() {
        const { wrongEmail, expectedError } = this.loginData.IncorrectEmail;
        cy.get('input[name="email"]').type(wrongEmail); 
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw); 
        cy.contains('button', 'Next').click();
        cy.get('div.MuiAlert-message').should('be.visible')
        .and('contain.text', expectedError);
    });

    it('Incorrect Password', function() {
        const { wrongPsw, expectedError } = this.loginData.IncorrectPassword;
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail); 
        cy.get('input[name="password"]').type(wrongPsw); 
        cy.contains('button', 'Next').click();
        cy.get('div.MuiAlert-message').should('be.visible')
        .and('contain.text', expectedError);
    });


});