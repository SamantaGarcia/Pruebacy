describe('Suppot Page Guest User - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');

    beforeEach(() => {
        cy.visit(`${EnvUrl}/support.html`);
        cy.fixture('supportPage').as('supportPage');
    });

    it('Send message successfully', function() {
        const { name, email, subject, message, messageSentAlert }=this.supportPage.SendMessageGuest;
        cy.get('input[name="name"]').type(name);
        cy.get('input[name="email"]').type(email);
        cy.get('input[name="subject"]').type(subject);
        cy.get('textarea[name="message"]').type(message);
        cy.contains('button', 'Submit').click();
        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible')
        .and('contain.text', messageSentAlert);

    });

    it('Empty fields', function() {
        const { emptyFieldsAlert }=this.supportPage.EmptyFields;
        cy.contains('button', 'Submit').click();
        cy.get('.MuiAlert-message.css-f94cg5').should('be.visible')
        .and('contain.text', emptyFieldsAlert);
    });

    it.only('About my test', function() {
        const { orderQuestion, orderExpectedResult }=this.supportPage.QuestionsSection;
        cy.get('button[type="button"]').contains('About my test').click();
        cy.get('.MuiAccordionSummary-content').contains(orderQuestion).click();
        cy.get('p').should('be.visible')
        .and('contain.text', orderExpectedResult);
    });

    it('PFAS Core Panel', function() {
        const { pfasTestQuestion, pfasTestExpectedResult }=this.supportPage.pfasTestSection;
        cy.get('button[type="button"]').contains('PFAS Core Panel').click();
        cy.get('.MuiAccordionSummary-content').contains(pfasTestQuestion).click();
        cy.get('p').should('be.visible')
        .and('contain.text', pfasTestExpectedResult);
    });

    it('PFAS basics', function() {
        const { pfasQuestion, pfasExpectedResult }=this.supportPage.pfasSection;
        cy.get('button.MuiButton-textPrimary:not(:contains("Test"))').contains('PFAS basics').click();
        cy.get('.MuiAccordionSummary-content').contains(pfasQuestion).click();
        cy.get('p').should('be.visible')
        .and('contain.text', pfasExpectedResult);
    });
});