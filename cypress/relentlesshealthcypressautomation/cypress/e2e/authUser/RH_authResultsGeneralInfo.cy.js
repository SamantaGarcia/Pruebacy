describe('Results General Info Logged User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let vitalData;
    const downloadFolder = 'cypress/downloads';

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/results.html`);
        cy.fixture('resultsGeneralInfo').as('resultsGeneralInfo');
        cy.fixture('accountInformation').as('accountInformation');
        cy.fixture('understandYourTest').as('understandYourTest');
        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json').then((data) => {
            vitalData = data;
        });
    });

    it('Nasem guidance for low level score', function() {
        const { title } = this.understandYourTest.firstSection;
        const { lowLevelTitle, lowLevelDescription, suggestion1 } = this.resultsGeneralInfo.nasemGuidanceLow;
        cy.contains('span', '<2 ng/mL').click();
        
        cy.get('.MuiBox-root.css-1efbyps')
            .should('contain.text', lowLevelTitle);
        
        cy.get('.MuiTypography-root.MuiTypography-body2.css-17dw292')
            .should('contain.text', lowLevelDescription); 
        
        //suggestion
        cy.get('.MuiBox-root.css-tn06no')
            .should('contain.text', suggestion1); 

        //button
        cy.contains('button', 'Understand your Test')
        .click();
        cy.get('p').should('contain.text', title); 
        
    });

    it('Nasem guidance for medium level score', function() {
        const { medLevelTitle, medLevelDescription, suggestion1, suggestion2, suggestion3 } = this.resultsGeneralInfo.nasemGuidanceMed;

        cy.contains('span', '2-20 ng/mL').click();

        cy.get('.MuiBox-root.css-1efbyps')
            .should('contain.text', medLevelTitle);

        cy.get('.MuiTypography-root.MuiTypography-body2.css-17dw292')
            .should('contain.text', medLevelDescription); 

        //suggestions and links
        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion1); 
        
            cy.get('a')
                .contains('American Heart Association (AHA)') 
                .should('have.attr', 'href') 
                .then((href) => {
                    cy.request(href).then((response) => {
                    expect(response.status).to.eq(200);
                    });
                });

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion2); 

            cy.get('a')
            .contains('American College of Obstetricians and Gynecologists (ACOG)') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion3); 
        
            cy.get('a')
            .contains('US Preventive Services Task Force (USPSTF)') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

    });

    it('Nasem guidance for high level score', function() {
        const { highLevelTitle, highLevelDescription, suggestion1, suggestion2, suggestion3, suggestion4, suggestion5, suggestion6 } = this.resultsGeneralInfo.nasemGuidanceHigh;

        cy.contains('span', '>20 ng/mL').click();

        cy.get('.MuiBox-root.css-1efbyps')
            .should('contain.text', highLevelTitle);

        cy.get('.MuiTypography-root.MuiTypography-body2.css-17dw292')
            .should('contain.text', highLevelDescription); 

        //suggestions and links
        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion1);

            cy.get('a')
            .contains('American Heart Association (AHA)') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion2); 
    
        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion3); 

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion4); 

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion5); 

            cy.get('a')
            .contains('American College of Obstetricians and Gynecologists (ACOG)') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

        cy.get('.MuiBox-root.css-ydg573')
            .should('contain.text', suggestion6); 

            cy.get('a')
            .contains('US Preventive Services Task Force (USPSTF)') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

    });

    it('Download PDF', function() {
        cy.contains('button', 'Download PDF').click();

        cy.task('waitForFile', { folder: downloadFolder, filenamePattern: /^PFAS_Core_Panel_Result_.*\.pdf$/ })
            .then((fileName) => {
                expect(fileName).to.exist;

                cy.task('deleteFile', `${downloadFolder}/${fileName}`).then((deleted) => {
                expect(deleted).to.be.true;
                });
            });
    });

    it('Download Guide', function() {
        cy.contains('button', 'Download guide').click();

          cy.task('waitForFile', { folder: downloadFolder, filenamePattern: /^PFAS Core Panel interpretation guide.pdf$/ })
            .then((fileName) => {
                expect(fileName).to.exist;

                cy.task('deleteFile', `${downloadFolder}/${fileName}`).then((deleted) => {
                expect(deleted).to.be.true;
                });
            });
    });

    it('Validate patient info', function() { 
        //using last report
        const { newName, newLastName, age, newGender, newAddress1, newAddress2, newCity, newZipCode } = this.accountInformation.EditInformation;
        const { orderState } = this.accountInformation.OrderTestData;
        const { disclaimerText, licenseNumber } = this.resultsGeneralInfo.ReportInfo;

        cy.get('.MuiTypography-root.MuiTypography-body2.css-usvskl')
        .should('contain', newName)
        .should('contain', newLastName)
        .should('contain', vitalData.authSampleID3)
        .should('contain', age)
        .should('contain', newGender)
        .should('contain', newAddress1)
        .should('contain', newAddress2)
        .should('contain', newCity)
        .should('contain', newZipCode)
        .should('contain', orderState)
        .should('contain', licenseNumber);
        
        cy.get('.MuiTypography-root.MuiTypography-body1.css-4xtfq5')
        .should('contain', disclaimerText);
        
    });

});