describe('Reset Your Password - Relentless Health Website ', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    const userNewPsw = Cypress.env('CYPRESS_RELHEALT_NEW_PASSWORD');
    let dynamicAccount, dynamicGuestAccount;
    
    beforeEach(() => {
        cy.visit(`${EnvUrl}/forgot-password`);
        cy.fixture('resetYourPassword').as('resetPasswordData');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
        });

        cy.readFile('cypress/fixtures/generatedData/dynamicGuestEmail.json').then((data) => {
            dynamicGuestAccount = data; 
        });
    });

    it('Reset Password Successfully', function() {
        const { expectedResult } = this.resetPasswordData.CorrectFields;
        cy.get('input#email').clear().type(dynamicAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(10000);

        cy.get('input#email').clear().type(dynamicAccount.dynEmail); 
        cy.getAccessToken().then(({ verificationCode, emailId }) => {
            cy.log("Verification code obtained: ", verificationCode);
            cy.get('input#code').type(verificationCode);
        });
        cy.get('input#newPassword').clear().type(userNewPsw); 
        cy.get('input#confirmPassword').clear().type(userNewPsw); 
        cy.contains('button', 'Reset Password').click();

        cy.get('p.MuiTypography-root.MuiTypography-body1.css-1trh6um').should('be.visible')
        .and('contain.text', expectedResult);

        cy.writeFile('cypress/fixtures/generatedData/dynamicEmail.json', { dynEmail: dynamicAccount.dynEmail, dynPsw: userNewPsw });

    });

    it('Cancel reset password (1st Page)', function() {
        const { expectedResultCancel } = this.resetPasswordData.CancelReset;
        cy.contains('button', 'Cancel').click();
        cy.get('p[class*="MuiTypography-body1"]').should('be.visible')
        .and('contain.text', expectedResultCancel);

    });

    it('Empty Email Address (1st Page)', function() {
        const { expectedErrorEmail } = this.resetPasswordData.EmptyFields;
        cy.get('input#email').clear();
        cy.get('p.MuiTypography-root.MuiTypography-body1.MuiTypography-gutterBottom.css-1havdwm').click();
        cy.get('#email-helper-text').should('be.visible')
        .and('contain.text', expectedErrorEmail);
    });

    it('Incorrect Email Address (1st Page)', function() {
        const { incorrectEmail, expectedErrorIncorrectEmail } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(incorrectEmail);
        cy.contains('button', 'Reset Password').click();
        cy.get('div.MuiAlert-message.css-f94cg5').should('be.visible')
        .and('contain.text', expectedErrorIncorrectEmail);
    });

    it('Invalid Email Address (1st Page)', function() {
        const { invalidEmail, expectedErrorInvalidEmail } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(invalidEmail);
        cy.get('p.MuiTypography-root.MuiTypography-body1.MuiTypography-gutterBottom.css-1havdwm').click();
        cy.get('#email-helper-text').should('be.visible')
        .and('contain.text', expectedErrorInvalidEmail);
    });

    it('Empty Fields (2nd Page)', function() {
        const { expectedErrorEmail, expectedVerCode, expectedPsw, expectedPswCon } = this.resetPasswordData.EmptyFields;
        cy.get('input#email').clear().type(dynamicAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(2000);

        cy.get('input#email').click(); 
        cy.get('input#code').click();
        cy.get('input#newPassword').click(); 
        cy.get('input#confirmPassword').click();
        cy.contains('h6', 'Reset Your Password').click();

        cy.get('p#email-helper-text').should('be.visible')
        .and('contain.text', expectedErrorEmail);
        cy.get('p#code-helper-text').should('be.visible')
        .and('contain.text', expectedVerCode);
        cy.get('p#newPassword-helper-text').should('be.visible')
        .and('contain.text', expectedPsw);
        cy.get('p#confirmPassword-helper-text').should('be.visible')
        .and('contain.text', expectedPswCon);

    });

    it('Invalid Email (2nd Page)', function() {
        const { invalidEmail, invalidCode, expectedErrorEmail } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(dynamicAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(2000);

        cy.get('input#email').clear().type(invalidEmail); 
        cy.get('input#code').click();

        cy.get('p#email-helper-text').should('be.visible')
        .and('contain.text', expectedErrorEmail);
    });

    it('Incorrect Email (2nd Page)', function() {
        const { incorrectEmail, invalidCode, expectedGeneralError } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(5000);

        cy.get('input#email').clear().type(incorrectEmail);
        cy.get('input#code').clear().type(invalidCode);
        cy.get('input#newPassword').clear().type(userNewPsw); 
        cy.get('input#confirmPassword').clear().type(userNewPsw); 
        cy.contains('button', 'Reset Password').click();

        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible')
        .and('contain.text', expectedGeneralError);
    });

    it('Incorrect Verification Code (2nd Page)', function() {
        const { invalidCode, expectedGeneralError } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(5000);

        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail);
        cy.get('input#code').clear().type(invalidCode);
        cy.get('input#newPassword').clear().type(userNewPsw); 
        cy.get('input#confirmPassword').clear().type(userNewPsw); 
        cy.contains('button', 'Reset Password').click();

        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible')
        .and('contain.text', expectedGeneralError);
    });

    it('Invalid Password (2nd Page)', function() {
        //Due to the limit of attempts to reset a password, we need to use now the guest account
            const { invalidCode,invalidPsw, expectedErrorPsw } = this.resetPasswordData.IncorrectFields;
            cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail); 
            cy.contains('button', 'Reset Password').click();
            cy.wait(2000);

            cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail);
            cy.get('input#code').clear().type(invalidCode);
            cy.get('input#newPassword').clear().type(invalidPsw); 
            cy.get('input#confirmPassword').clear().type(invalidPsw); 
            
            cy.get('p#newPassword-helper-text').should('be.visible')
            .and('contain.text', expectedErrorPsw);
    
    });

    it('Invalid Password Confirmation (2nd Page)', function() {
        const { invalidCode,invalidPswCon, expectedErrorPswCon } = this.resetPasswordData.IncorrectFields;
        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(5000);

        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail);
        cy.get('input#code').clear().type(invalidCode);
        cy.get('input#newPassword').clear().type(userNewPsw); 
        cy.get('input#confirmPassword').clear().type(invalidPswCon); 
        cy.contains('h6', 'Reset Your Password').click();
        
        cy.get('p#confirmPassword-helper-text').should('be.visible')
        .and('contain.text', expectedErrorPswCon);
    });

    it('Cancel reset password (2nd Page)', function() {
        const { expectedResultCancel } = this.resetPasswordData.CancelReset;
        cy.get('input#email').clear().type(dynamicGuestAccount.dynEmail); 
        cy.contains('button', 'Reset Password').click();
        cy.wait(2000);

        cy.contains('button', 'Cancel').click();
        cy.get('p[class*="MuiTypography-body1"]').should('be.visible')
        .and('contain.text', expectedResultCancel);

    });
});