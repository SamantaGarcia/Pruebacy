describe('Guest User Navigation - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    const ProdUrl = Cypress.env('CYPRESS_RELHEALT_PROD_ENV');

    beforeEach(() => {
        cy.visit(`${EnvUrl}`);
        cy.fixture('navigation').as('navigation');
    });
    
    it('Desktop Navigation', function() {
        const { home, signIn, createAccount } = this.navigation.Guest;
        const { orderTest, activateTest, support, infoEmail } = this.navigation.Auth;
        //Home navigation
        cy.get('img[src="/logo.svg"]').click();
        cy.url().should('include', ProdUrl);
        cy.visit(`${EnvUrl}`);

        //Sign In navigation
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Sign In').click();
        cy.get('h4').should('contain', signIn);

        //Create account navigation
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Create account').click();
        cy.get('h4').should('contain', createAccount);

        //Order Test Button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Order test').click();
        cy.get("p.MuiTypography-root.MuiTypography-body1")
        .should('contain.text', orderTest);

        //Activate test button
        cy.visit(`${EnvUrl}`);
        cy.contains('button', 'Activate test').click();
        cy.get("h4").should('contain.text', activateTest);

        //Support footer
        cy.visit(`${EnvUrl}`);
        cy.contains('a', 'Support').click();
        cy.get('h2').should('contain', support);

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
        const { home, signIn, createAccount } = this.navigation.Guest;
        const { orderTest, activateTest, support, infoEmail } = this.navigation.Auth;

        cy.viewport(375, 871);
        cy.get('[data-tid="banner-accept"]').click();

        // Home
        cy.visit(`${EnvUrl}`);
        cy.get('p').should('contain.text', home);

        //Profile
        cy.visit(`${EnvUrl}`);
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Sign In').click();
        cy.get('h4').should('contain', signIn);

        //Create Account
        cy.visit(`${EnvUrl}`);
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Create account').click();
        cy.get('h4').should('contain', createAccount);

        //Support
        cy.visit(`${EnvUrl}`);
        cy.get('button.MuiIconButton-root').click();
        cy.get('span').contains('Support').click();
        cy.get('h2').should('contain', support);

        //Privacy Policy navigation
        cy.visit(`${EnvUrl}`);
        cy.get('button.MuiIconButton-root').click();
        cy.contains('span', 'Privacy policy').click();
        cy.frameLoaded('#618d21cc-d582-42bd-9592-d5d330ff78a1'); 
        cy.iframe().find('bdt.question').should('be.visible').and('contain.text', 'PRIVACY POLICY');

        //Terms of service navigation
        cy.visit(`${EnvUrl}`);
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

        //info email
        cy.visit(`${EnvUrl}`);
        cy.get('button.MuiIconButton-root').click();
        cy.get('a[href^="mailto:"]')
        .should('have.attr', 'href')
        .and('eq', infoEmail);
    });
});