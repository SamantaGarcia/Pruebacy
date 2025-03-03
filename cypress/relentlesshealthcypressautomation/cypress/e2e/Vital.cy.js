describe('Vital', () => {
  const vitalUrl = Cypress.env('CYPRESS_VITAL_DEV_ENV');
  const qaEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
  let orderData, guestorderData;


  before(() => {
    cy.writeFile('cypress/fixtures/generatedData/vitalSampleIDs.json', []);
    cy.readFile('cypress/fixtures/generatedData/authOrderApiResponse.json').then((data) => {
      orderData = data;
    });
    cy.readFile('cypress/fixtures/generatedData/guestOrderApiResponse.json').then((data) => {
      guestorderData = data;
    });
  });

  beforeEach(() => {
    cy.session('googleLogin', () => {
      const socialLoginOptions = {
        username: Cypress.env('GOOGLE_USERNAME'),
        password: Cypress.env('GOOGLE_PASSWORD'),
        loginUrl: Cypress.env('CYPRESS_VITAL_DEV_ENV'),
        cookieName: Cypress.env('GOOGLE_COOKIE'),
        headless: false,
        logs: true,
        args: ['--no-sandbox', '--disable-dev-shm-usage'], //Ci/Cd
        loginSelector: 'button[data-provider="google"]',
        postLoginSelector: 'div.json-formatter-container',
      };
  
      cy.task('GoogleSocialLogin', socialLoginOptions).then(({ cookies }) => {
        cookies.forEach((cookie) => {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          });
        });
      });
  
      cy.visit(Cypress.env('CYPRESS_VITAL_DEV_ENV'));
    });
  
    cy.visit(Cypress.env('CYPRESS_VITAL_DEV_ENV'));
  });
 
  it('Obtain Auth SampleID 1', () => {
    cy.visit(vitalUrl);
    cy.contains('a', 'Orders').click(); 
    cy.get('input[placeholder="Search..."]').type(orderData[0].test_kit_details[0].vital_order_id);
    cy.wait(2000); //wait for the search to load 
    cy.get('button[aria-label="options"][aria-haspopup="menu"]').click();
    cy.contains('button', 'Test Order Lifecycle').click(); 
    cy.get('span.chakra-badge.css-18xo5qa', { timeout: 60000 }).should('contain.text', 'Completed');
    cy.contains('a', 'Webhooks').click(); 

    cy.frameLoaded('#iFrameResizer0'); 

    cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('a.css-q82gd8[href="/app_2jn7e7PSC5yKoKhyEqI56DlqWxi/messages"]')
      .click();

      cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('tbody.css-0 > tr.css-oi6c9t')
      .first() 
      .find('td.css-ap0b37 a.chakra-text.css-fza1a6') 
      .click();

      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap)
      .find('span.chakra-switch__track') 
      .click();
      cy.wait(2000);
      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('pre.prism-code.language-json.css-2xxn04') 
      .invoke('text') 
      .then((jsonText) => {
        const jsonObject = JSON.parse(jsonText);
        const sampleIdObject = { authSampleID1: jsonObject.data.sample_id };
        cy.log(sampleIdObject);

        cy.writeFile('cypress/fixtures/generatedData/vitalSampleIDs.json', sampleIdObject);
      });
    
  });
  
  it.skip('Obtain Auth SampleID 2', () => {
    cy.visit(vitalUrl);
    cy.contains('a', 'Orders').click(); 
    cy.get('input[placeholder="Search..."]').type(orderData[1].test_kit_details[0].vital_order_id);
    cy.wait(2000); //wait for the search to load 
    cy.get('button[aria-label="options"][aria-haspopup="menu"]').click();
    cy.contains('button', 'Test Order Lifecycle').click(); 
    cy.get('span.chakra-badge.css-18xo5qa', { timeout: 60000 }).should('contain.text', 'Completed');
    cy.contains('a', 'Webhooks').click(); 

    cy.frameLoaded('#iFrameResizer0'); 

    cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('a.css-q82gd8[href="/app_2jn7e7PSC5yKoKhyEqI56DlqWxi/messages"]')
      .click();

      cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('tbody.css-0 > tr.css-oi6c9t')
      .first() 
      .find('td.css-ap0b37 a.chakra-text.css-fza1a6') 
      .click();

      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap)
      .find('span.chakra-switch__track') 
      .click();
      cy.wait(2000);
      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('pre.prism-code.language-json.css-2xxn04') 
      .invoke('text') 
      .then((jsonText) => {
        const jsonObject = JSON.parse(jsonText);
        const sampleIdObject = { authSampleID2: jsonObject.data.sample_id };

        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json') 
        .then((currentData) => {
          const updatedData = { ...currentData, ...sampleIdObject };
          cy.writeFile('cypress/fixtures/generatedData/vitalSampleIDs.json', updatedData);
        });
      });
    
  });

  it.skip('Obtain Auth SampleID 3', () => {
    cy.visit(vitalUrl);
    cy.contains('a', 'Orders').click(); 
    cy.get('input[placeholder="Search..."]').type(orderData[2].test_kit_details[0].vital_order_id);
    cy.wait(2000); //wait for the search to load 
    cy.get('button[aria-label="options"][aria-haspopup="menu"]').click();
    cy.contains('button', 'Test Order Lifecycle').click(); 
    cy.get('span.chakra-badge.css-18xo5qa', { timeout: 60000 }).should('contain.text', 'Completed');
    cy.contains('a', 'Webhooks').click(); 

    cy.frameLoaded('#iFrameResizer0'); 

    cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('a.css-q82gd8[href="/app_2jn7e7PSC5yKoKhyEqI56DlqWxi/messages"]')
      .click();

      cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('tbody.css-0 > tr.css-oi6c9t')
      .first() 
      .find('td.css-ap0b37 a.chakra-text.css-fza1a6') 
      .click();

      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap)
      .find('span.chakra-switch__track') 
      .click();
      cy.wait(2000);
      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('pre.prism-code.language-json.css-2xxn04') 
      .invoke('text') 
      .then((jsonText) => {
        const jsonObject = JSON.parse(jsonText);
        const sampleIdObject = { authSampleID3: jsonObject.data.sample_id };

        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json') 
        .then((currentData) => {
          const updatedData = { ...currentData, ...sampleIdObject };
          cy.writeFile('cypress/fixtures/generatedData/vitalSampleIDs.json', updatedData);
        });
      });
    
  });

  it('Obtain Guest SampleID', () => {
    cy.visit(vitalUrl);
    cy.contains('a', 'Orders').click(); 
    cy.get('input[placeholder="Search..."]').type(guestorderData.test_kit_details[0].vital_order_id);
    cy.wait(2000); //wait for the search to load 
    cy.get('button[aria-label="options"][aria-haspopup="menu"]').click();
    cy.contains('button', 'Test Order Lifecycle').click(); 
    cy.get('span.chakra-badge.css-18xo5qa', { timeout: 60000 }).should('contain.text', 'Completed');
    cy.contains('a', 'Webhooks').click(); 

    cy.frameLoaded('#iFrameResizer0'); 

    cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('a.css-q82gd8[href="/app_2jn7e7PSC5yKoKhyEqI56DlqWxi/messages"]')
      .click();

      cy.get('iframe[id^="iFrameResizer0"]')
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('tbody.css-0 > tr.css-oi6c9t')
      .first() 
      .find('td.css-ap0b37 a.chakra-text.css-fza1a6') 
      .click();

      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap)
      .find('span.chakra-switch__track') 
      .click();
      cy.wait(2000);
      cy.get('iframe[id^="iFrameResizer0"]') 
      .its('0.contentDocument.body') 
      .then(cy.wrap) 
      .find('pre.prism-code.language-json.css-2xxn04') 
      .invoke('text') 
      .then((jsonText) => {
        const jsonObject = JSON.parse(jsonText);
        const sampleIdObject = { guestSampleID1: jsonObject.data.sample_id };

        cy.readFile('cypress/fixtures/generatedData/vitalSampleIDs.json') 
        .then((currentData) => {
          const updatedData = { ...currentData, ...sampleIdObject };
          cy.writeFile('cypress/fixtures/generatedData/vitalSampleIDs.json', updatedData);
        });
      });


  });
  
  
  
});
