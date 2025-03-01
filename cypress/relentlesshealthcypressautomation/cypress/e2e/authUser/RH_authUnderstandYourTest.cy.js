describe('Understand Your Test Logged User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/pfas-info.html`);
        cy.fixture('understandYourTest').as('understandYourTest');
        cy.fixture('resultsGeneralInfo').as('resultsGeneralInfo');
    });

    it('Validate First Section', function() {
        const { title, description, importantNote } = this.understandYourTest.firstSection;
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1xchleq')
        .should('contain', title);

        cy.get('.MuiTypography-root.MuiTypography-h4.css-15wqavp')
        .should('contain', description);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1boe22h')
        .should('contain', importantNote);

        //download guide
        let guidePDF = 'cypress/downloads/PFAS Core Panel interpretation guide.pdf';
        cy.contains('button', 'Download guide').click();
        cy.wait(2000)
        cy.task('fileExists', guidePDF).then((exists) => {
            expect(exists).to.be.true;
            cy.task('deleteFile', guidePDF).then((deleted) => {
                expect(deleted).to.be.true; //delete PDF
              });
        });

        //button
        cy.contains('button', 'View your latest results')
        .click();
        cy.get('h4').should('contain.text', 'Results'); 
    });

    //What your results mean tab

    it('What your results mean', function() {
        const { title, description, card1, card1Desc, card2, card2Desc, card3, card3Desc, card4, card4Desc, card5, card5Desc ,detailedListTitle, 
        detailedListDesc, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10, item11,
        tablePFAName, tablePFAName2, tableLevel, tableNhanes, tableLoq, tableDetectionFreq, tableDetected} = this.understandYourTest.whatYourResultsMean;
        cy.contains('button', 'What your results mean').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-9klg8g').should('contain', title);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1vs9jw6').should('contain', description);

        cy.get('.MuiBox-root.css-m0y282')
        .should('contain', card1)
        .should('contain', card1Desc)
        .should('contain', card2)
        .should('contain', card2Desc)
        .should('contain', card3)
        .should('contain', card3Desc);

        cy.get('.MuiBox-root.css-k1ogey')
        .should('contain', card4)
        .should('contain', card4Desc)
        .should('contain', card5)
        .should('contain', card5Desc);

        cy.get('a')
        .contains('International Agency for Research on Cancer (IARC)') 
        .should('have.attr', 'href') 
        .then((href) => {
            cy.request(href).then((response) => {
            expect(response.status).to.eq(200);
            });
        });

        cy.get('.MuiTypography-root.MuiTypography-body1.css-2fycnn')
        .should('contain', detailedListTitle);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1bq56uq')
        .should('contain', detailedListDesc);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71')
        .should('contain', item1).should('contain', item2).should('contain', item3)
        .should('contain', item4).should('contain', item5).should('contain', item6)
        .should('contain', item7).should('contain', item8).should('contain', item9)
        .should('contain', item10).should('contain', item11);


        cy.get('a')
        .contains('peer-reviewed scientific paper')
        .should('have.attr', 'href')
        .and('match', /https:\/\/pubs\.acs\.org\/doi\/10\.1021\/acs\.est\.2c09852/);

        cy.get('.MuiTable-root.css-mhc4l2').should('be.visible');
        
        cy.get('.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium')
        .should('contain', tablePFAName)
        .should('contain', tablePFAName2)
        .should('contain', tableLevel)
        .should('contain', tableNhanes)
        .should('contain', tableLoq)
        .should('contain', tableDetectionFreq)
        .should('contain', tableDetected);

    });

    it('Nasem guidance for low level score', function() {
        const { lowLevelTitle, lowLevelDescription } = this.resultsGeneralInfo.nasemGuidanceLow;
        cy.contains('button', 'What your results mean').click();
        cy.contains('span', '<2 ng/mL').click();
        cy.get('.MuiBox-root.css-1efbyps').should('contain.text', lowLevelTitle);
        cy.get('.MuiTypography-root.MuiTypography-body2.css-17dw292').should('contain.text', lowLevelDescription); 

    });

    it('Nasem guidance for medium level score', function() {
        const { medLevelTitle, medLevelDescription, suggestion1, suggestion2, suggestion3 } = this.resultsGeneralInfo.nasemGuidanceMed;
        cy.contains('button', 'What your results mean').click();
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
        cy.contains('button', 'What your results mean').click();
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

    //How to reduce PFAS tab

    it('How to reduce PFAS', function() {
        const { title, description, note, idea1title, idea1desc, idea2title, 
        idea2desc, idea3title, idea3desc, idea4title, idea4desc, idea5title, 
        idea5desc, idea6title, idea6desc, idea7title, idea7desc, detailedListTitle, detailedListDesc,
        item1, item2, item3, item4, item5, item6, item7, card1, title3, desc3, desc4} =this.understandYourTest.howToReducePfas;
        
        cy.contains('button', 'How to reduce PFAS').click();

        cy.get('.MuiTypography-root.MuiTypography-body1.css-9klg8g')
        .should('contain', title);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-1x4pn5h')
        .should('contain', description);

        cy.get('.MuiTypography-root.MuiTypography-body2.css-15cu3h2')
        .should('contain', note);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea1title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea1desc);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea2title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea2desc);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea3title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea3desc);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea4title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea4desc);
        cy.get('a')
            .contains('https://pfascentral.org/pfas-free-products/') 
            .should('have.attr', 'href') 
            .then((href) => {
                cy.request(href).then((response) => {
                expect(response.status).to.eq(200);
                });
            });

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea5title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea5desc);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea6title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea6desc);

        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea7title);
        cy.get('.MuiBox-root.css-9xlln2').should('contain', idea7desc);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-vbstee').should('contain', detailedListTitle);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1fjdjg1').should('contain', detailedListDesc);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item1);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item2);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item3);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item4);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item5);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item6);
        cy.get('.MuiListItem-root.MuiListItem-dense.MuiListItem-padding.css-ze8j71').should('contain', item7);
    
        cy.get('.MuiBox-root.css-18ltfuv').should('contain', card1);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-vbstee').should('contain', title3);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-gnpcxt').should('contain', desc3);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1ybhs0g').should('contain', desc4);
    });

    //About the test methodology

    it('About the test methodology', function() {
        const { title, desc, card1, card2, card3, card4, ref1, ref2, ref3, } = this.understandYourTest.aboutTheTestMethodology;
        cy.contains('button', 'About the test methodology').click();

        cy.get('.MuiTypography-root.MuiTypography-body1.css-9klg8g').should('contain', title);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1x4pn5h').should('contain', desc);

        cy.get('.MuiBox-root.css-1smfia7').should('contain', card1);
        cy.get('.MuiBox-root.css-1smfia7').should('contain', card2);
        cy.get('.MuiBox-root.css-1smfia7').should('contain', card3);
        cy.get('.MuiBox-root.css-1smfia7').should('contain', card4);

        cy.get('.MuiList-root.MuiList-padding.MuiList-dense.css-1h92pwd').should('contain', ref1);
        cy.get('.MuiList-root.MuiList-padding.MuiList-dense.css-1h92pwd').should('contain', ref2);
        cy.get('.MuiList-root.MuiList-padding.MuiList-dense.css-1h92pwd').should('contain', ref3);

        cy.get('a')
        .contains('https://nap.nationalacademies.org/resource/26156/interactive/') 
        .should('have.attr', 'href') 
        .then((href) => {
            cy.request(href).then((response) => {
            expect(response.status).to.eq(200);
            });
        });

        cy.get('a')
        .contains('https://pubmed.ncbi.nlm.nih.gov/29056041/')
        .should('have.attr', 'href', 'https://pubmed.ncbi.nlm.nih.gov/29056041/');

        cy.get('a')
        .contains('https://pubs.acs.org/doi/10.1021/acs.est.2c09852') 
        .should('have.attr', 'href') 
        .then((href) => {
            cy.request(href).then((response) => {
            expect(response.status).to.eq(200);
            });
        });

    });

});