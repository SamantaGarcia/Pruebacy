describe('How to collect a good sample Logged User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/how-to-collect-sample.html`);
        cy.fixture('howToCollectAGoodSample').as('howToCollectAGoodSample');
    });

    it('First Section', function() {
        const { title, importantNote, description } = this.howToCollectAGoodSample.firstSection;
        cy.get('.MuiTypography-root.MuiTypography-h4.css-thru0z').should('contain', title);
        cy.get('.MuiBox-root.css-1vgan8v').should('contain', importantNote);
        cy.get('.MuiTypography-root.MuiTypography-body1.css-1trh6um').should('contain', description);
    });

    it('How to take your test - Tab', function() {
        const { title, item1, item2, item3, item4, item5, item6 } = this.howToCollectAGoodSample.howToTakeYourTest;
        cy.contains('button', 'How to take your test').click();

        //testing images
        cy.get('img.MuiBox-root.css-xatbcl').each(($img) => {
            cy.wrap($img)
              .invoke('attr', 'src') 
              .then((src) => {
                cy.request({
                  url: src,
                }).then((response) => {
                  expect(response.status).to.eq(200);
                });
              });
          });

        //list
        cy.get('.MuiTypography-root.MuiTypography-h5.css-73opkm').should('contain', title);
        cy.get('.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary.css-1kbk4cn')
        .should('contain', item1)
        .should('contain', item2)
        .should('contain', item3)
        .should('contain', item4)
        .should('contain', item5)
        .should('contain', item6);
    });

    it('Taking your sample - Tab', function() {
        const { title, item1, item2, item3, item4, item5, item6, item7, item8, item9, importantNote } = this.howToCollectAGoodSample.takingYourSample;

        cy.contains('button', 'Taking your sample').click();

        //testing images
        cy.get('img.MuiBox-root.css-xatbcl').each(($img) => {
            cy.wrap($img)
              .invoke('attr', 'src') 
              .then((src) => {
                cy.request({
                  url: src,
                }).then((response) => {
                  expect(response.status).to.eq(200);
                });
              });
          });

        //list
        cy.get('.MuiTypography-root.MuiTypography-h5.css-73opkm').should('contain', title);
        cy.get('.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary.css-1kbk4cn')
        .should('contain', item1)
        .should('contain', item2)
        .should('contain', item3)
        .should('contain', item4)
        .should('contain', item5)
        .should('contain', item6)
        .should('contain', item7)
        .should('contain', item8)
        .should('contain', item9);

        cy.get('.MuiTypography-root.MuiTypography-body1.css-jzbvk5')
        .should('contain', importantNote);

    });

    it('Return your sample - Tab', function() {
      const { title, item1, item2, item3, item4, item5, item6, item2a, item2b, item2c,item2d, importantNote } = this.howToCollectAGoodSample.returnYourSample;

      cy.contains('button', 'Return your sample').click();

      //testing images
      cy.get('img.MuiBox-root.css-15xfvp0').each(($img) => {
          cy.wrap($img)
            .invoke('attr', 'src') 
            .then((src) => {
              cy.request({
                url: src,
              }).then((response) => {
                expect(response.status).to.eq(200);
              });
            });
        });

      //list
      cy.get('.MuiTypography-root.MuiTypography-h5.css-73opkm').should('contain', title);
      cy.get('.MuiTypography-root.MuiTypography-body1.MuiListItemText-primary.css-1kbk4cn')
      .should('contain', item1)
      .should('contain', item2)
      .should('contain', item2a)
      .should('contain', item2b)
      .should('contain', item2c)
      .should('contain', item2d)
      .should('contain', item3)
      .should('contain', item4)
      .should('contain', item5)
      .should('contain', item6);

      cy.get('.MuiTypography-root.MuiTypography-body1.css-jzbvk5')
      .should('contain', importantNote);

  });

    it('Download full instructions', function() {
        let guidePDF = 'cypress/downloads/How to collect your PFAS sample.pdf';
        cy.contains('button', 'Download full instructions').click();
        cy.wait(2000)
        cy.task('fileExists', guidePDF).then((exists) => {
            expect(exists).to.be.true;
            cy.task('deleteFile', guidePDF).then((deleted) => {
                expect(deleted).to.be.true; //delete PDF
              });
        });
    });
});