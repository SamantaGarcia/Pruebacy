describe('Crelio', () => {
    const crelioUrl = Cypress.env('CYPRESS_CRELIO_URL');
    const crelioUsername = Cypress.env('CYPRESS_CRELIO_USERNAME');
    const crelioPsw = Cypress.env('CYPRESS_CRELIO_PSW');
    const crelioAccession = Cypress.env('CYPRESS_CRELIO_URL_ACCESSION');
    const crelioOperation = Cypress.env('CYPRESS_CRELIO_URL_OPERATION');
    let vitalData, orderData;

    beforeEach(() => {
        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json').then((data) => {
            vitalData = data;
        });
        cy.readFile('cypress/fixtures/generatedData/authOrderApiResponse.json').then((data) => {
            orderData = data;
          });
          cy.fixture('pfasResults').as('pfasResults');

            cy.visit(crelioUrl);
            cy.get('#username').type(crelioUsername);
            cy.get('#password').type(crelioPsw);
            cy.contains('input', 'Sign in using our secure server').click();
            cy.contains('h4', 'Dev Relentless Health, Inc.')
            .should('be.visible');
    });

    it('Receive and print order 1', () => {
        cy.visit(crelioAccession);
        cy.window().then((win) => {
            cy.stub(win, 'open').callsFake(() => {}); 
          });

        cy.contains('.ag-cell-value', vitalData.authSampleID1)  
        .parents('.ag-row') 
        .find('#receive-print-btn')  
        .click();

        cy.get('#app-alert')
        .should('be.visible') 
        .and('contain', 'Sample received successfully'); 
    });

    it('Write results order 1', function() {
        cy.visit(crelioOperation);
        
        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .contains('.ag-cell', orderData[0].user_id.slice(0, 20)) 
        .then((cell) => {
            cy.wrap(cell).closest('.ag-row').click();
        });

        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .find('.ag-center-cols-container .ag-row')
        .first()
        .click();

        cy.writeResults(this.pfasResults.lowResults);

    });

    it('Receive and print order 2', () => {
        cy.visit(crelioAccession);
        cy.window().then((win) => {
            cy.stub(win, 'open').callsFake(() => {}); 
          });

        cy.contains('.ag-cell-value', vitalData.authSampleID2)  
        .parents('.ag-row') 
        .find('#receive-print-btn')  
        .click();

        cy.get('#app-alert')
        .should('be.visible') 
        .and('contain', 'Sample received successfully'); 
    });

    it('Write results order 2', function() {
        cy.visit(crelioOperation);
        
        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .contains('.ag-cell', orderData[1].user_id.slice(0, 20)) 
        .then((cell) => {
            cy.wrap(cell).closest('.ag-row').click();
        });

        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .find('.ag-center-cols-container .ag-row')
        .first()
        .click();

        cy.writeResults(this.pfasResults.medResults);

    });

    it('Receive and print order 3', () => {
        cy.visit(crelioAccession);
        cy.window().then((win) => {
            cy.stub(win, 'open').callsFake(() => {}); 
          });

        cy.contains('.ag-cell-value', vitalData.authSampleID3)  
        .parents('.ag-row') 
        .find('#receive-print-btn')  
        .click();

        cy.get('#app-alert')
        .should('be.visible') 
        .and('contain', 'Sample received successfully'); 
    });

    it('Write results order 3', function() {
        cy.visit(crelioOperation);
        
        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .contains('.ag-cell', orderData[2].user_id.slice(0, 20)) 
        .then((cell) => {
            cy.wrap(cell).closest('.ag-row').click();
        });

        cy.wait(5000);

        cy.get('.ag-root-wrapper') 
        .find('.ag-center-cols-container .ag-row')
        .first()
        .click();

        cy.writeResults(this.pfasResults.highResults);

    });

    afterEach(() => {
        //Always Logout to avoid issues
        cy.contains('button', 'Hello Diagnose Early Developer').click();
        cy.get('span.font-color-red').contains('Logout').click(); 
        cy.get('#logout-confirm').click();
        cy.contains('a', 'Centre Login').should('be.visible');
       
    });
});