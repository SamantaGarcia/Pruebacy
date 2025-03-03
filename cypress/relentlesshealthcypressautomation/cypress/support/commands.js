import 'cypress-iframe';

// Relentless Health website
Cypress.Commands.add('RelHealthDevEnv', () => {
    cy.session('RelHealthDevEnvSession', () => {
        const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
        const EnvPsw = Cypress.env('CYPRESS_RELHEALT_DEV_ENV_PSW');

        cy.visit(`${EnvUrl}`);
        cy.get('input#\\:r0\\:').type(EnvPsw); 
        cy.get('button[type="button"]').click();
    });
});

Cypress.Commands.add('RelHealthLogin', () => {
    cy.session('RelHealthSession', () => {
        const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
       // const EnvPsw = Cypress.env('CYPRESS_RELHEALT_DEV_ENV_PSW');

        cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
            cy.visit(`${EnvUrl}/login`);
            // cy.get('input#\\:r0\\:').type(EnvPsw); 
            // cy.get('button[type="button"]').click();

            cy.get('input[name="email"]').type(data.dynEmail); 
            cy.get('input[name="password"]').type(data.dynPsw); 
            cy.contains('button', 'Next').click();
            cy.get('button.MuiIconButton-root').should('be.visible');
        });
    
    });
});

Cypress.Commands.add('GenerateDynamicEmail', () => {
    const baseEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const timestamp = Date.now();
    const dynamicEmail = `${baseEmail.split('@')[0]}+${timestamp}@${baseEmail.split('@')[1]}`;

    const psw = `Cy${timestamp}!`;

    cy.writeFile('cypress/fixtures/generatedData/dynamicEmail.json', { dynEmail: dynamicEmail, dynPsw: psw });
});

Cypress.Commands.add('GenerateGuestDynamicEmail', () => {
    const baseEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const timestamp = Date.now();
    const dynamicEmail = `${baseEmail.split('@')[0]}+${timestamp}@${baseEmail.split('@')[1]}`;

    const psw = `Cy${timestamp}!`;

    cy.writeFile('cypress/fixtures/generatedData/dynamicGuestEmail.json', { dynEmail: dynamicEmail, dynPsw: psw });
});

Cypress.Commands.add('GenerateNewAccount', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let dynamicAccount;
    cy.readFile('cypress/fixtures/generatedData/dynamicEmail.json').then((data) => {
        dynamicAccount = data; 
        cy.visit(`${EnvUrl}/signup`);
        cy.get('input[name="email"]').type(dynamicAccount.dynEmail);
        cy.get('input[name="password"]').type(dynamicAccount.dynPsw);
        cy.get('input[name="confirmPassword"]').type(dynamicAccount.dynPsw);
        cy.fixture('accountInformation').then((accountInformation) => {
            const { name, lastName, phone, birthday, gender, address1, address2, city, state, zipCode, education } = accountInformation.AccountCreation;
                
            cy.get('input[name="firstName"]').type(name); //Name
            cy.get('input[name="lastName"]').type(lastName);//Lastname
            
            cy.get('input[name="tos_flag"]').click().should('be.checked'); //Terms and Conditions checkbox
            cy.get('input[name="marketing_flag"]').click().should('be.checked'); //Marketing checkbox
            cy.contains('button', 'Next').click();
    
            cy.get('input[name="phoneNumber"]').type(phone); //Phone number. Must be a real US phone
            cy.get('input[placeholder="DD/MM/YYYY"]').type(birthday); //birthday
            cy.get('#mui-component-select-gender').click(); //Open Gender dropdown
            cy.get('li.MuiMenuItem-root').contains(gender).click(); //Select Gender option
            cy.get('input[name="address_1"]').type(address1); //Address 1
            cy.get('input[name="address_2"]').type(address2); //Address 2
            cy.get('input[name="city"]').type(city); //City
            cy.get('input[name="state"]').click(); //Open State dropdown
            cy.contains('li.MuiAutocomplete-option', state).click(); //choose state
            cy.get('input[name="zipcode"]').type(zipCode); //Zip code
            cy.get('#mui-component-select-occupation').click(); //Open Occupation dropdown
            cy.get('li.MuiButtonBase-root').contains(education).click(); //Select Occupation option
        
            cy.contains('button', 'Next').click();
            cy.wait(5000); 
    
            //Get verification code sent to Gmail
            cy.getAccessToken().then((verificationCode) => {
                cy.log("Código de verificación recibido: ", verificationCode);
                cy.get('input[name="confirmationCode"]').type(verificationCode);
                cy.contains('button', 'Confirm').click();
                cy.wait(5000);
            });
            //Validate that the account was created
            cy.get('h4.MuiTypography-h4').contains('Registration was successfully completed');
          });
      });
      
      
      
});

// Gmail
Cypress.Commands.add('getVitalCode', { prevSubject: false }, () => {
    const userEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const clientId = Cypress.env('CYPRESS_GMAIL_CLIENTID');
    const clientSecret = Cypress.env('CYPRESS_GMAIL_CLIENTSECRET');
    const refreshToken = Cypress.env('CYPRESS_GMAIL_REFRESH_TOKEN');
  
    // Function to obtain the access token
    const getAccessToken = () => {
        return cy.request({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response.body.access_token;
        });
    };
  
    // Obtaining token and then search messages
    return getAccessToken().then((accessToken) => {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.status === 200 && response.body.messages && response.body.messages.length > 0) {
                const emailId = response.body.messages[0].id;
  
                return cy.request({
                    method: 'GET',
                    url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages/${emailId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((emailResponse) => {
                    const snippet = emailResponse.body.snippet;
                    const verificationCodeMatch = snippet.match(/Your verification code is: \s*(\d+)/);
  
                    if (verificationCodeMatch && verificationCodeMatch[1]) {
                        const verificationCode = verificationCodeMatch[1];
                        cy.log("Vital Code: ", verificationCode);
  
                        // Devolver tanto el código de verificación como el ID del correo
                        return cy.wrap({ verificationCode, emailId }); 
                    } else {
                        cy.log("No se encontró el código de verificación en el snippet.");
                        return cy.wrap({ verificationCode: null, emailId }); 
                    }
                });
            } else {
                cy.log('No se encontraron mensajes o hubo un error.');
                return cy.wrap({ verificationCode: null, emailId: null }); 
            }
        });
    });
  });

Cypress.Commands.add('getAccessToken', { prevSubject: false }, () => {
    const userEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const clientId = Cypress.env('CYPRESS_GMAIL_CLIENTID');
    const clientSecret = Cypress.env('CYPRESS_GMAIL_CLIENTSECRET');
    const refreshToken = Cypress.env('CYPRESS_GMAIL_REFRESH_TOKEN');
  
    // Function to obtain the access token
    const getAccessToken = () => {
        return cy.request({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response.body.access_token;
        });
    };
  
    // Obtaining token and then search messages
    return getAccessToken().then((accessToken) => {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.status === 200 && response.body.messages && response.body.messages.length > 0) {
                const emailId = response.body.messages[0].id;
  
                return cy.request({
                    method: 'GET',
                    url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages/${emailId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((emailResponse) => {
                    const snippet = emailResponse.body.snippet;
                    const verificationCodeMatch = snippet.match(/Verification code:\s*(\d+)/);
  
                    if (verificationCodeMatch && verificationCodeMatch[1]) {
                        const verificationCode = verificationCodeMatch[1];
                        cy.log("Verification Code: ", verificationCode);
  
                        // Devolver tanto el código de verificación como el ID del correo
                        return cy.wrap({ verificationCode, emailId }); 
                    } else {
                        cy.log("No se encontró el código de verificación en el snippet.");
                        return cy.wrap({ verificationCode: null, emailId }); 
                    }
                });
            } else {
                cy.log('No se encontraron mensajes o hubo un error.');
                return cy.wrap({ verificationCode: null, emailId: null }); 
            }
        });
    });
});

Cypress.Commands.add('getEmailByCriteria', { prevSubject: false }, (searchCriteria) => {
    const userEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const clientId = Cypress.env('CYPRESS_GMAIL_CLIENTID');
    const clientSecret = Cypress.env('CYPRESS_GMAIL_CLIENTSECRET');
    const refreshToken = Cypress.env('CYPRESS_GMAIL_REFRESH_TOKEN');

    const getAccessToken = () => {
        return cy.request({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response.body.access_token;
        });
    };

    return getAccessToken().then((accessToken) => {
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages`,
            qs: {
                q: searchCriteria
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.status === 200 && response.body.messages && response.body.messages.length > 0) {
                const emailId = response.body.messages[0].id;

                return cy.request({
                    method: 'GET',
                    url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages/${emailId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((emailResponse) => {
                    return {
                        id: emailId,
                        snippet: emailResponse.body.snippet
                    };
                });
            } else {
                cy.log('No se encontraron mensajes o hubo un error.');
                return null;
            }
        });
    });
});

Cypress.Commands.add('deleteAllEmails', { prevSubject: false }, () => {
    const userEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const clientId = Cypress.env('CYPRESS_GMAIL_CLIENTID');
    const clientSecret = Cypress.env('CYPRESS_GMAIL_CLIENTSECRET');
    const refreshToken = Cypress.env('CYPRESS_GMAIL_REFRESH_TOKEN');

    // Function to obtain the access token
    const getAccessToken = () => {
        return cy.request({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response.body.access_token;
        });
    };

    // Function to delete an email by messageId
    const deleteEmailById = (accessToken, messageId) => {
        return cy.request({
            method: 'DELETE',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages/${messageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    };

    // Main function to delete all emails
    return getAccessToken().then((accessToken) => {
        // Get the list of messages
        return cy.request({
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            const messages = response.body.messages || [];
            const deletePromises = messages.map((message) =>
                deleteEmailById(accessToken, message.id)
            );

            // Wait for all deletion requests to complete
            return Cypress.Promise.all(deletePromises).then(() => {
                cy.log(`${messages.length} emails were deleted`);
            });
        });
    });
});

//Orders
Cypress.Commands.add('placeAuthOrder', (EnvUrl, accountInformation, dynamicAccount) => {
    const { newName, newLastName, newAddress1, newAddress2, newCity, newState, newZipCode, newPhone } = accountInformation.EditInformation;
    const { year, month, timestamp, orderName, orderBirthdate, orderState } = accountInformation.OrderTestData;

    cy.ShopifyLogin();
    cy.visit(`${EnvUrl}/order.html`);
    cy.get('[data-tid="banner-accept"]').click();
    cy.contains('button', 'Next').click();

    cy.get('input[name="subjects[0].name"]').should('contain.value', newName);

    // cy.get('button[aria-label="Choose date"]').click();
    // cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
    // cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
    // cy.get(`button[data-timestamp="${timestamp}"]`).should('be.visible').click();

    cy.get('input[placeholder="DD/MM/YYYY"]').click();
    cy.get('button[role="radio"][aria-checked="false"]').contains(year).click();
    cy.get(`button[aria-label="${month}"]`).should('be.visible').click();
    cy.contains('button', timestamp).should('be.visible').should('be.visible').click();
    cy.contains('button', 'OK').should('be.visible').should('be.visible').click();
    
    cy.get('input[name="subjects[0].isAnAdult"]').check().should('be.checked');

    cy.contains('button', 'Go to shipping').click();

    cy.get('input[name="email"]').should('contain.value', dynamicAccount.dynEmail);
    cy.get('input[name="address1"]').should('contain.value', newAddress1);
    cy.get('input[name="address2"]').should('contain.value', newAddress2);
    cy.get('input[name="city"]').should('contain.value', newCity);
    cy.get('.MuiInputBase-input.MuiOutlinedInput-input.MuiAutocomplete-input').should('contain.value', newState);
    cy.get('input[name="zipcode"]').should('contain.value', newZipCode);

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen');
    });
      
    cy.contains('button', 'Go to Checkout').click();

    return cy.SaveCartID().then(() => {
        cy.ShopifyPayment(dynamicAccount.dynEmail, newName, newLastName, newAddress1, newAddress2, newCity, newState, newZipCode, newPhone);
        cy.wait(5000);
        const cartID = Cypress.env('cart');

        cy.log("Obtained Cart ID: " + cartID);
        expect(cartID).to.not.be.null;
        expect(cartID).to.not.be.undefined;

        return cy.request({
          method: 'POST',
          url: 'http://dev.relentlesshealth.com/api/qa/order', 
          headers: {
            'x-api-key': '73c1c983-b64a-4a39-b833-8edca4629e0b',
            'Content-Type': 'application/json'
          },
          body: {
            "name": orderName,
            "dob": orderBirthdate,
            "email": dynamicAccount.dynEmail,
            "shipping_address": {
                "address1": newAddress1,
                "address2": newAddress2,
                "city": newCity,
                "state": orderState,
                "zipcode": newZipCode,
            },
            "cart_id": cartID
          }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.status).to.eq('SUCCESS');
          cy.log(JSON.stringify(response.body));

          return cy.wrap(response.body); 
        });
    });
});

//Shopify
Cypress.Commands.add('ShopifyLogin', () => {

    const ShopUrl = Cypress.env('CYPRESS_SHOPIFY_DEV_ENV');
    cy.origin(ShopUrl, () => {
        const ShopPsw = Cypress.env('CYPRESS_SHOPIFY_DEV_ENV_PSW');
        cy.visit("/password");
        cy.get('input#password').type(ShopPsw);
        cy.contains('button', 'Enter').click();

        cy.get('img.header__heading-logo')
        .should('be.visible');
    });
});

Cypress.Commands.add('SaveCartID', () => {
    let cart;
    cy.window().then((win) => {
        cart = win.localStorage.getItem('cart');
        Cypress.env('cart', cart); 
    }).then(() => {
        const fullcartID = cart;
        const cartID_key = cart.replace('gid://shopify/Cart/', '');
        const cartID = cart.split('/').pop().split('?')[0];
        
        cy.writeFile('cypress/fixtures/generatedData/cartID.json', { fullcartID: fullcartID, cartID_key: cartID_key, cartID: cartID });
        cy.log("CART ID: "+ cartID);
    });
    
});

Cypress.Commands.add('ShopifyPayment', (email, name, lastname, address1, address2, city, state, zipcode, phone) => {
    cy.contains('a', 'Go to Payment')
      .should('be.visible')
      .invoke('removeAttr', 'target')
      .click();
    cy.url().should('include', 'relentlesshealth-dev.myshopify.com');

    // Workaround Shopify - avoid empty fields
    cy.get('input[name="email"]').invoke('val', '');
    cy.get('input[name="email"]').type(email);
    cy.get('select[name="countryCode"]').select('United States');
    cy.get('input[name="firstName"][placeholder="First name"]').clear().type(name);
    cy.get('input[name="lastName"][placeholder="Last name"]').clear().type(lastname);
    cy.get('input[name="address1"][placeholder="Address"]').clear().type(address1);
    cy.get('input[name="address2"][placeholder="Apartment, suite, etc. (optional)"]').clear().type(address2);
    cy.get('input[name="city"][placeholder="City"]').clear().type(city);
    cy.get('select[name="zone"]').select(state);
    cy.get('input[name="postalCode"][placeholder="ZIP code"]').clear().type(zipcode);
    cy.get('input[name="phone"][placeholder="Phone"]').clear().type(phone);
    // End of Workaround Shopify

    cy.get('input[type="radio"][id="basic-creditCards"]')
        .should('be.visible')
        .check();

    cy.get('iframe[id^="card-fields-number"]').should('be.visible'); 
    cy.get('iframe[id^="card-fields-number"]')
        .its('0.contentDocument.body') 
        .then(cy.wrap) 
        .find('input[name="number"]') 
        .clear()
        .type('4242424242424242');

    cy.get('iframe[id^="card-fields-expiry"]').should('be.visible'); 
    cy.get('iframe[id^="card-fields-expiry"]')
        .its('0.contentDocument.body') 
        .then(cy.wrap) 
        .find('input[name="expiry"]') 
        .clear()
        .type('1129');

    cy.get('iframe[id^="card-fields-verification_value"]').should('be.visible'); 
    cy.get('iframe[id^="card-fields-verification_value"]')
        .its('0.contentDocument.body') 
        .then(cy.wrap) 
        .find('input[name="verification_value"]') 
        .clear()
        .type('123');


    cy.get('#RememberMe-RememberMeCheckbox').uncheck({ force: true });
    cy.contains('button', 'Pay now').click();
    cy.get('h2.n8k95w1').should('be.visible').and('contain.text', 'Thank you');
});

Cypress.Commands.add('deleteEmail', { prevSubject: false }, (messageId) => {
    const userEmail = Cypress.env('CYPRESS_RELHEALT_EMAIL');
    const clientId = Cypress.env('CYPRESS_GMAIL_CLIENTID');
    const clientSecret = Cypress.env('CYPRESS_GMAIL_CLIENTSECRET');
    const refreshToken = Cypress.env('CYPRESS_GMAIL_REFRESH_TOKEN');

    // Function to obtain the access token
    const getAccessToken = () => {
        return cy.request({
            method: 'POST',
            url: 'https://oauth2.googleapis.com/token',
            body: {
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            return response.body.access_token;
        });
    };

    // Delete the email using its messageId
    return getAccessToken().then((accessToken) => {
        return cy.request({
            method: 'DELETE',
            url: `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages/${messageId}`,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((response) => {
            if (response.status === 204) {
                cy.log('El correo fue eliminado exitosamente.');
            } else {
                cy.log('No se pudo eliminar el correo.');
            }
        });
    });
});

// Crelio
Cypress.Commands.add('writeResults', (pfasResults) => {
    const { PFPeA, PFUnDA, PFNA, PFHXA, PFHpS, PFDA, "N-MeFOSAA":NMeFOSAA, PFBS, PFBA, PFOA, PFDoDA, PFHxS, PFOS, "6:2 FTS":FTS62, PFNS, "4:2 FTS":FTS42, "8:2 FTS":FTS82, PFHpA } = pfasResults;
    cy.get('#report_entry_1').type(PFBA); 
    cy.get('#report_entry_2').type(PFPeA); 
    cy.get('#report_entry_3').type(PFHXA);
    cy.get('#report_entry_4').type(PFHpA);  
    cy.get('#report_entry_5').type(PFOA);
    cy.get('#report_entry_6').type(PFNA);
    cy.get('#report_entry_7').type(PFDA);
    cy.get('#report_entry_8').type(PFUnDA);
    cy.get('#report_entry_9').type(PFDoDA);
    cy.get('#report_entry_12').type(NMeFOSAA);
    cy.get('#report_entry_14').type(PFBS);
    cy.get('#report_entry_16').type(PFHxS);
    cy.get('#report_entry_17').type(PFHpS);
    cy.get('#report_entry_18').type(PFOS);
    cy.get('#report_entry_19').type(PFNS);
    cy.get('#report_entry_21').type(FTS42);
    cy.get('#report_entry_22').type(FTS62);
    cy.get('#report_entry_23').type(FTS82);

    cy.get('input[placeholder="Enter Passkey"]').type('1234'); 
    cy.wait(2000);

    cy.contains('button', 'Save And Validate').click(); 
    cy.wait(5000);
    cy.get('.ag-root-wrapper')
    .find('.ag-center-cols-container .ag-row')
    .first()
    .should('be.visible')
    .within(() => {
        cy.contains('button', 'Submit').should('be.visible').click(); 
    });
    cy.contains('button', 'Back').should('be.visible').click(); 
});

// More commands

Cypress.Commands.add('getScorePercentile', (nasemLevel, gender) => {
    cy.fixture('demographicData.json').then((data) => {
      const allValues = data[gender];
  
      // Filtrar los valores que sean menores o iguales a nasemLevel
      const validValues = Object.keys(allValues)
        .map(key => ({
          key: key,
          value: allValues[key]
        }))
        .filter(item => item.value <= nasemLevel);
  
      // Obtener el último valor de la lista filtrada
      const scorePercentile = validValues.pop();
  
      // Retornar el resultado como un objeto con la clave y el valor
      return scorePercentile;
    });
  });

// Command to obtain NASEM levels for timeline
Cypress.Commands.add('obtainNasemLevelTimeline', (searchText, retries = 3) => {
    if (retries === 0) {
        cy.log(`Attempts to find the text were exhausted: ${searchText}`);
        return cy.wrap(null);
    }

    return cy.get('.MuiBox-root.css-10dygnh').then(($el) => {
        if ($el.text().includes(searchText)) {
            cy.log(`Report found for: ${searchText}`);
            return cy.wrap($el.text());
        } else {
            return cy.get('button')
                .find('img[src="/icons/back-white-arrow.svg"]')
                .parent()
                .click()
                .wait(500)
                .then(() => {
                    return cy.obtainNasemLevelTimeline(searchText, retries - 1);
                });
        }
    });
});

// Command to normalize text (remove extra spaces and trim)
Cypress.Commands.add('normalizeText', (text) => {
    return cy.wrap(text.replace(/\s+/g, ' ').trim());
});
// Command to check tooltip content
Cypress.Commands.add('checkTooltip', (index, expectedLevel) => {
    cy.get('circle').eq(index).trigger('mouseover');
    cy.get('.recharts-tooltip-wrapper').should('be.visible').within(() => {
        cy.get('div.MuiBox-root.css-1w9gr6n').invoke('text').then((tooltipText) => {
            cy.get('@highNasemLevel').then((highNasemLevel) => {
                cy.get('@medNasemLevel').then((medNasemLevel) => {
                    cy.get('@lowNasemLevel').then((lowNasemLevel) => {
                        
                        // Normalize texts
                        cy.normalizeText(tooltipText).then((normalizedTooltip) => {
                            cy.normalizeText(highNasemLevel).then((normalizedHigh) => {
                                cy.normalizeText(medNasemLevel).then((normalizedMed) => {
                                    cy.normalizeText(lowNasemLevel).then((normalizedLow) => {

                                        // Check if the tooltip matches one of the levels
                                        if (
                                            normalizedTooltip.includes(normalizedHigh) ||
                                            normalizedTooltip.includes(normalizedMed) ||
                                            normalizedTooltip.includes(normalizedLow)
                                        ) {
                                            cy.log(`${expectedLevel} was found in Tooltip ${index}`);
                                        } else {
                                            cy.log(`${expectedLevel} not found in Tooltip ${index}`);
                                            throw new Error(`${expectedLevel} not found in Tooltip ${index}`);
                                        }
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
// Command to validate Circles Position
Cypress.Commands.add('validateCirclePosition', (index, expectedLevel) => {
    cy.get('circle').eq(index).invoke('attr', 'cy').then((circleY) => {
        cy.get('.recharts-reference-line-line').then(($lines) => {
            const lowLevelY = parseFloat($lines.eq(0).attr('y1'));   // Line de 2 ng/mL
            const highLevelY = parseFloat($lines.eq(2).attr('y1')); // Line de 20 ng/mL

            // cy.log(`Circle ${index} y-position: ${circleY}`);
            // cy.log(`Low Level line y-position: ${lowLevelY}`);
            // cy.log(`High Level line y-position: ${highLevelY}`);

            const circleYPos = parseFloat(circleY);

            // Validate position depending on the level
            if (expectedLevel === 'Low Level') {
                expect(circleYPos).to.be.greaterThan(lowLevelY);
                cy.log(`Circle ${index} is correctly below 2 ng/mL`);
            } else if (expectedLevel === 'Medium Level') {
                expect(circleYPos).to.be.lte(lowLevelY);
                expect(circleYPos).to.be.gte(highLevelY);
                cy.log(`Circle ${index} is correctly between 2 and 20 ng/mL`);
            } else if (expectedLevel === 'High Level') {
                expect(circleYPos).to.be.lessThan(highLevelY);
                cy.log(`Circle ${index} is correctly above 20 ng/mL`);
            } else {
                cy.log(`Unknown level: ${expectedLevel}`);
            }
        });
    });
});

Cypress.Commands.add('validateCompoundTooltip', (compound, value, valueIndex) => {

    if (compound == 'PFPeA' || compound == 'PFHXA' || compound == 'PFHpA' || compound == 'PFBS') {
        if (value < 0.075) { // Not Detected
            cy.log('SECONDS');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });             
        } else if (value >= 0.075 && value < 0.25) { // Below Range
            cy.log('SECONDS');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Below Reportable Range')
            });             
        } else if (value >= 0.25 && value <= 1) { // Detected
            cy.log('SECONDS');
            cy.get('.recharts-line-dots circle').eq(valueIndex).then(($circle) => {
                cy.wrap($circle).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 1 && value <= 50) { // Detected
            cy.log('SECONDS');
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 50) { // Above Range
            cy.log('SECONDS');
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Above Reportable Range')
            });               
        } else if (value == 'Not Detected') { // Not Detected
            cy.log('SECONDS');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });            
        } else if (value == 'Inconclusive') { // Inconclusive
            cy.log('SECONDS');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Inconclusive')
            });              
        }
    } else if (compound == 'PFBA') {
        if (value < 0.15) {
            cy.log('PFBA')
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });
        } else if (value >= 0.15 && value < 0.5) {
            cy.log('PFBA')
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Below Reportable Range')
            });
        } else if (value >= 0.5 && value <= 1) {
            cy.log('PFBA')
            cy.get('.recharts-line-dots circle').eq(valueIndex).then(($circle) => {
                cy.wrap($circle).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 1 && value <= 50) {
            cy.log('PFBA')
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 50) {
            cy.log('PFBA')
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Above Reportable Range')
            });
        } else if (value === 'Not Detected') {
            cy.log('PFBA')
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });
        } else if (value === 'Inconclusive') {
            cy.log('PFBA')
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Inconclusive')
            });
        }
    } else {
        if (value < 0.03) {
            cy.log('REST');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });
        } else if (value >= 0.03 && value < 0.1) {
            cy.log('REST');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Below Reportable Range')
            });
        } else if (value >= 0.1 && value <= 1) {
            cy.log('REST');
            cy.get('.recharts-line-dots circle').eq(valueIndex).then(($circle) => {
                cy.wrap($circle).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 1 && value <= 50) {
            cy.log('REST');
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', value)
            });
        } else if (value > 50) {
            cy.log('REST');
            cy.get('.recharts-line-dots line').eq(valueIndex).then(($line) => {
                cy.wrap($line).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Above Reportable Range')
            });
        } else if (value == 'Not Detected') {
            cy.log('REST');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Not Detected')
            });
        } else if (value == 'Inconclusive') {
            cy.log('REST');
            cy.get('.recharts-line-dots image').eq(valueIndex).then(($image) => {
                cy.wrap($image).trigger('mouseover', { force: true });
                cy.get('.recharts-tooltip-wrapper').should('include.text', 'Inconclusive')
            });
        }
    }

});
