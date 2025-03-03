describe('Order a Test - Who is this test for?', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/order.html`);
        cy.fixture('orderTestSadPaths').as('orderTestPage2');
        cy.fixture('accountInformation').as('accountInformation');
    });

    it('Click on Back Button', function() {
        const { back } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click();
        cy.contains('a', 'Back').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.MuiTypography-gutterBottom.css-4r6rfx')
        .should('contain.text', back);
    });

    it('Empty Fields', function() {
        const { birthdate, emptyNameAlert, emptyBirthdateAlert } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click(); 
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.css-m53ae2').clear();
        // cy.get('input[placeholder="DD/MM/YYYY"]').type(birthdate); 
        // cy.get('input[placeholder="DD/MM/YYYY"]').clear(); 
        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').uncheck();

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyNameAlert);

        // cy.get('.MuiFormHelperText-root.Mui-error')
        // .should('contain.text', emptyBirthdateAlert);
    });

    it('Invalid Full Name', function() {
        const { birthdate, invalidName, invalidNameAlert } = this.orderTestPage2.Page2;
        const { year, month, timestamp} = accountInformation.OrderTestData;

        cy.contains('button', 'Next').click(); 
        cy.get('.MuiInputBase-input.MuiOutlinedInput-input.css-m53ae2').clear().type(invalidName);
        
        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', timestamp).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').check();
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidNameAlert);
    });

    it('Invalid Birth date', function() {
        const { invalidBirthdate, invalidBirthdateAlert } = this.orderTestPage2.Page2;
        const { month, timestamp} = accountInformation.OrderTestData;
        cy.contains('button', 'Next').click(); 

        cy.get('input[placeholder="DD/MM/YYYY"]').click();
        cy.get('button[role="radio"][aria-checked="false"]').contains(invalidBirthdate).click();
        cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
        cy.contains('button', timestamp).should('be.visible').should('be.visible').click();
        cy.contains('button', 'OK').should('be.visible').should('be.visible').click();

        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').check();
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidBirthdateAlert);
    });

});