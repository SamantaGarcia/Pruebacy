describe('Activate Kit - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let orderData, dynamicAccount, vitalData;

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}`);
        cy.get('[data-tid="banner-accept"]').click();
        cy.fixture('activateKit').as('activateKit');
        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            dynamicAccount = data; 
        });
        cy.readFile('cypress/fixtures/generatedData/authOrderApiResponse.json').then((data) => {
            orderData = data;
        });
        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json').then((data) => {
            vitalData = data;
        });
        cy.fixture('navigation').as('navigation');
    });

    it.only('Cancel Activation', function() {
        const { cancelActivation } = this.activateKit.authActivateKit;
        cy.visit(`${EnvUrl}/activate.html`);
        cy.contains('button', 'Cancel activation').click();
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-k78egd")
        .should('contain.text', cancelActivation);
    });

    it.only('Activate Kit 1 Successfully from Orders', function() {
        const { kitActivatedTitle } = this.activateKit.authActivateKit;
        const { firefighters } = this.activateKit.Donation;
        const sOrderId = orderData[0].s_order_id.split('/').pop();
        cy.visit(`${EnvUrl}/orders/${sOrderId}`);
        cy.get("p.MuiTypography-root.MuiTypography-body1.css-lne3jp")
        .should('contain.text', orderData[0].s_order_name);
        cy.contains('button', 'Activate Kit').click();

        //Verify that Activation Code is pre-filled
        cy.get('input[name="activationCode"]').should('contain.value', vitalData.authSampleID1);
        cy.contains('button', 'Activate').click();
        cy.get("h4")
        .should('contain.text', kitActivatedTitle);
        cy.get("h5")
        .should('contain.text', vitalData.authSampleID1);
    });

    it('Activate Kit 2 Successfully from Dashboard', function() {
        const { kitActivatedTitle } = this.activateKit.authActivateKit;
        cy.visit(`${EnvUrl}/activate.html`);
        cy.get('input[name="activationCode"]').type(vitalData.authSampleID2);
        cy.contains('button', 'Activate').click();
        cy.get("h4")
        .should('contain.text', kitActivatedTitle);
        cy.get("h5")
        .should('contain.text', vitalData.authSampleID2);
    });

    it('Activate Kit 3 Successfully from Dashboard', function() {
        const { kitActivatedTitle } = this.activateKit.authActivateKit;
        cy.visit(`${EnvUrl}/activate.html`);
        cy.get('input[name="activationCode"]').type(vitalData.authSampleID3);
        cy.contains('button', 'Activate').click();
        cy.get("h4")
        .should('contain.text', kitActivatedTitle);
        cy.get("h5")
        .should('contain.text', vitalData.authSampleID3);
    });
   
});