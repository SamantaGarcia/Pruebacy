describe('Order a Test - Who is this test for?', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    beforeEach(() => {
        cy.visit(`${EnvUrl}/order.html`);
        cy.fixture('orderTestSadPaths').as('orderTestPage2');
    });

    it('Click on Back Button', function() {
        const { back } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click();
        cy.contains('a', 'Back').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.MuiTypography-gutterBottom.css-4r6rfx')
        .should('contain.text', back);
    });

    it('Empty Fields', function() {
        const { birthdate, emptyNameAlert, emptyBirthdateAlert, emptyPhoneAlert } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click(); 
        cy.get('input[name="subjects[0].name"]').clear();
        cy.get('input[name="subjects[0].phoneNumber"]').clear(); 
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthdate); 
        cy.get('input[placeholder="DD/MM/YYYY"]').clear(); 
        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').uncheck();

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyNameAlert);

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyPhoneAlert);

        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', emptyBirthdateAlert);
    });

    it('Invalid Full Name', function() {
        const { birthdate, invalidName, invalidNameAlert } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click(); 
        cy.get('input[name="subjects[0].name"]').clear().type(invalidName);
        cy.get('input[placeholder="DD/MM/YYYY"]').type(birthdate);
        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').check();
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidNameAlert);
    });

    it('Invalid Birth date', function() {
        const { invalidBirthdate, invalidBirthdateAlert } = this.orderTestPage2.Page2;
        cy.contains('button', 'Next').click(); 
        cy.get('input[placeholder="DD/MM/YYYY"]').type(invalidBirthdate);
        cy.get('input.PrivateSwitchBase-input[name="subjects[0].isAnAdult"]').check();
        cy.get('.MuiFormHelperText-root.Mui-error')
        .should('contain.text', invalidBirthdateAlert);
    });

});