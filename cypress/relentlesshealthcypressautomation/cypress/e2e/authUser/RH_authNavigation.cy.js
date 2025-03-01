describe('Logged User Navigation - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    const ProdUrl = Cypress.env('CYPRESS_RELHEALT_PROD_ENV');

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}`);
        cy.fixture('navigation').as('navigation');
    });

    it('Desktop Navigation', function() {
        const { dashboard, emptyResults, emptyOrders, support, profile, emptyInbox, privacyPolicy, termsService, orderTest, activateTest, infoEmail } = this.navigation.Auth;
        //Dashboard header
        cy.get('img[src="/logo.svg"]').click();
        cy.url().should('include', ProdUrl);
        cy.visit(`${EnvUrl}`);

        //Results header
        cy.get('p.header-text').contains('Results').click();
        cy.get('div').should('contain', emptyResults);

        //Orders header
        cy.get('p.header-text').contains('Orders').click();
        cy.get('h6').should('contain', emptyOrders);

        //Support header
        cy.get('p.header-text').contains('Support').click();
        cy.get('h2').should('contain', support);

        //Profile header
        cy.get('button.MuiIconButton-root').click();
        cy.get('.MuiTypography-root.MuiTypography-h2.css-6v53wu')
        .should('contain.text', profile);

        //Messages
        cy.contains('button', 'Messages').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-8lgz8s')
        .should('contain', emptyInbox);

        //Privacy Policy
        cy.contains('button', 'Privacy Policy').click();
        cy.get('.MuiTypography-root.MuiTypography-h2.css-6v53wu')
        .should('have.text', privacyPolicy);

        //Terms of service
        cy.contains('button', 'Terms of Service').click();
        cy.get('.MuiTypography-root.MuiTypography-h2.css-6v53wu')
        .should('have.text', termsService);

        //Order Test Button
        cy.visit(`${EnvUrl}`);        
        cy.contains('button', 'Order test').click();
        cy.get("p.MuiTypography-root.MuiTypography-body1")
        .should('contain.text', orderTest);

        //Activate test button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Activate test').click();
        cy.get("h4").should('contain.text', activateTest);

        //View results button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'View results').click();
        cy.get('div').should('contain', emptyResults);

        //Terms of Service footer
        cy.visit(`${EnvUrl}`);
        cy.contains('a', 'Terms of Service').click();
        cy.frameLoaded('#3beeac26-7ce8-4f9b-a698-01ec576294f4'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'TERMS OF SERVICE');

        //Privacy Policy footer
        cy.visit(`${EnvUrl}`);
        cy.contains('a', 'Privacy Policy').click();
        cy.frameLoaded('#618d21cc-d582-42bd-9592-d5d330ff78a1'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'PRIVACY POLICY');

        //info email
        cy.visit(`${EnvUrl}`);
        cy.get('a[href^="mailto:"]')
        .should('have.attr', 'href')
        .and('eq', infoEmail);
    });

    it('Mobile Navigation', function() {
        const { dashboard, emptyResults, emptyOrders, support, emptyInbox, orderTest, activateTest } = this.navigation.Auth;

        cy.viewport(375, 871);
        cy.get('[data-tid="banner-accept"]').click();

        // Dashboard
        cy.visit(`${EnvUrl}`);
        cy.get('p')
        .should('contain.text', dashboard);

        //Profile
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Edit profile').click();
        cy.get('p.MuiTypography-root').contains('Edit')
        .should('be.visible');

        // //Messages
        cy.get('button[aria-label="open drawer"]').click();
        cy.contains('span', 'Messages').click();
        cy.get('.MuiTypography-root.MuiTypography-body1.css-8lgz8s')
        .should('contain', emptyInbox);

        //Buy a test
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Buy a test').click();
        cy.get("p.MuiTypography-root.MuiTypography-body1")
        .should('contain.text', orderTest);

        //Activate test navigation
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Activate a test').click();
        cy.get("h4").should('contain.text', activateTest);

        //View your results navigation
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('View your results').click();
        cy.get('div').should('contain', emptyResults);

        // //View your orders navigation
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('View your orders').click();
        cy.get('h6').should('contain', emptyOrders);

        //Support navigation
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Support').click();
        cy.get('h2').should('contain', support);

        //Privacy Policy navigation
        cy.get('button.MuiIconButton-root').click();
        cy.contains('span', 'Privacy policy').click();
        cy.frameLoaded('#618d21cc-d582-42bd-9592-d5d330ff78a1'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'PRIVACY POLICY');

        //Terms of service navigation
        cy.get('button.MuiIconButton-root').click();
        cy.contains('span', 'Terms of service').click();
        cy.frameLoaded('#3beeac26-7ce8-4f9b-a698-01ec576294f4'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'TERMS OF SERVICE');
        
        //Order Test Button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Order test').click();
        cy.get("p.MuiTypography-root.MuiTypography-body1")
        .should('contain.text', orderTest);

        //Activate test button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Activate test').click();
        cy.get("h4").should('contain.text', activateTest);

        //View results button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'View results').click();
        cy.get('div').should('contain', emptyResults);

    });
});