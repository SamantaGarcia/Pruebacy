describe('Messages - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.fixture('inboxMessages').as('inboxMessages');
        cy.visit(`${EnvUrl}/profile.html`);
        cy.get('button[class*="MuiButton-contained"]').contains('Messages').click();
    });

    it('PFAS test order', function() {
        //This message appears when an order is placed
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderPlaced;
         cy.get('.MuiListItemText-primary')
         .contains(messageDescription)
         .parents('.MuiListItem-root')
         .within(() => { 
             cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
             cy.root().click();
             });
         cy.get('div[role="presentation"]').should('be.visible');
         cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
         cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
         cy.get('button').contains('Close').should('be.visible').click();

    });

    it('PFAS test order dispatched', function() {
        //This message appears when an order is dispatched
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderDispatched;
         cy.get('.MuiListItemText-primary')
         .contains(messageDescription)
         .parents('.MuiListItem-root')
         .within(() => { 
             cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
             cy.root().click();
             });
         cy.get('div[role="presentation"]').should('be.visible');
         cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
         cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
         cy.get('button').contains('Close').should('be.visible').click();
    });

    it('PFAS test order at delivery company', function() {
        //This message appears when an order is at the delivery company
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderAtDelCompany;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();
    });

    it('PFAS test order in transit', function() {
        //This message appears when an order is in transit
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderInTransit;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();

    });

    it('PFAS test order delivered', function() {
        //This message appears when an order is delivered to the user
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderDelivered;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();

    });

    it('PFAS test order in transit to LAB', function() {
        //This message appears when an order is in transit to lab
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderInTransitToLab;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();
    });

    it('Order update', function() {
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.OrderUpdate;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();
    });

    it('PFAS test result', function() {
        //This message appears when the test results are visible
        const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.TestResults;
        cy.get('.MuiListItemText-primary')
        .contains(messageDescription)
        .parents('.MuiListItem-root')
        .within(() => { 
            cy.contains(/(hour ago|minute ago|hours ago|minutes ago|seconds ago)/) 
            cy.root().click();
            });
        cy.get('div[role="presentation"]').should('be.visible');
        cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
        cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
        cy.get('button').contains('Close').should('be.visible').click();
    });
    //THIS WILL BE COMMENTED UNTIL THE CHANGES IN RESULTS SECTION ARE COMPLETED

    // it('PFAS test result', function() {
    //     //This message appears when the test results are visible
    //     const { messageDescription, modalTitle, modalDescription } = this.inboxMessages.TestResults;
    //     cy.get('.MuiListItemText-primary')
    //     .contains(messageDescription)
    //     .parents('.MuiListItem-root')
    //     .within(() => { 
    //         cy.contains(/(hour ago|minute ago|hours ago|minutes ago)/) 
    //         cy.root().click();
    //         });
    //     cy.get('div[role="presentation"]').should('be.visible');
    //     cy.get('#modal-title').should('be.visible').and('contain', modalTitle);
    //     cy.get('#modal-description').should('be.visible').and('contain', modalDescription);
    //     cy.get('button').contains('Close').should('be.visible').click();
    // });
});
