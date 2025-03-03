const { defineConfig } = require("cypress");
require('dotenv').config();
const {GoogleSocialLogin} = require('cypress-social-logins').plugins
const fs = require('fs');


module.exports = defineConfig({
  // experimentalMemoryManagement: true,
  // numTestsKeptInMemory: 1,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: { //added for ci/cd
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true,
    charts: true,
    reportFilename: 'report',
    saveJson: true,
  },
  env: {...process.env},
  e2e: {
    watchForFileChanges: false,
    defaultCommandTimeout: 20000, //defines the maximum waiting time to find an element
    setupNodeEvents(on, config) {
      on('task', {
        GoogleSocialLogin: GoogleSocialLogin
      }),
      on("task", {
        fileExists(filePath) {
          return fs.existsSync(filePath);
        },
        deleteFile(filePath) {
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              return true;
            }
            return false;
          } catch (err) {
            console.error("Error deleting file:", err);
            return false;
          }
        },
        waitForFile({ folder, filenamePattern }) {
          return new Promise((resolve) => {
            // Convertir el string a una RegExp
            const regex = new RegExp(filenamePattern);

            const interval = setInterval(() => {
              const files = fs.readdirSync(folder);
              const matchingFile = files.find(file => regex.test(file));

              if (matchingFile) {
                clearInterval(interval);
                resolve(matchingFile);
              }
            }, 500);

            // Tiempo máximo de espera (10 segundos)
            setTimeout(() => {
              clearInterval(interval);
              resolve(null);
            }, 10000);
          });
        },
      });

      require('cypress-mochawesome-reporter/plugin')(on);
      config.specPattern = [
        "cypress/e2e/authUser/RH_createAccount.cy.js",
        "cypress/e2e/authUser/RH_login.cy.js",
        "cypress/e2e/authUser/RH_logout.cy.js",
        "cypress/e2e/authUser/RH_authNavigation.cy.js",
        "cypress/e2e/authUser/RH_editProfile.cy.js",
        "cypress/e2e/authUser/RH_privacyPolicy.cy.js",
        "cypress/e2e/authUser/RH_termsOfService.cy.js",
        "cypress/e2e/authUser/RH_authSupportPage.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_authOrderTest.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_orderTestPage1.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_orderTestPage2.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_orderTestPage3.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_orderTestCheckout.cy.js",
        "cypress/e2e/authUser/OrderFlows/RH_orderDetails.cy.js",
        "cypress/e2e/guestUser/RH_guestNavigation.cy.js",
        "cypress/e2e/guestUser/RH_guestSupportPage.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderTest.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderDetails.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderTestPage1.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderTestPage2.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderTestPage3.cy.js",
        "cypress/e2e/guestUser/guestOrderFlows/RH_guestOrderCheckout.cy.js",
        "cypress/e2e/Vital.cy.js",
        "cypress/e2e/authUser/RH_authActivateKit.cy.js",
        "cypress/e2e/guestUser/RH_guestActivateKitandCreateAccount.cy.js",
        "cypress/e2e/Crelio.cy.js",
        "cypress/e2e/authUser/RH_authResultsGeneralInfo.cy.js",
        "cypress/e2e/authUser/RH_authLowResults.cy.js",
        "cypress/e2e/authUser/RH_authMediumResults.cy.js",
        "cypress/e2e/authUser/RH_authHighResults.cy.js",
        "cypress/e2e/authUser/RH_authTimelineResults.cy.js",
        "cypress/e2e/authUser/RH_authUnderstandYourTest.cy.js",
        "cypress/e2e/authUser/RH_howToCollectGoodSample.cy.js",
        "cypress/e2e/authUser/RH_messages.cy.js",
        "cypress/e2e/GMAIL_emailsAndSMS.cy.js",
        "cypress/e2e/authUser/RH_resetPassword.cy.js"
      ]
      return config
    },
    browser: {
      name: 'chrome',
      family: 'chromium',
      channel: 'stable',
      version: 'latest',
      launchOptions: {
        args: ['--disable-site-isolation-trials'] //Prevents cross-origin issues
      },
    },
    "viewportWidth": 1024, //defines the resolution of the execution
    "viewportHeight": 768, //defines the resolution of the execution
    // "viewportWidth": 1726, //resolution for github actions
    // "viewportHeight": 1024, //resolution for github actions
    "chromeWebSecurity": false, //Prevents cross-origin issues
    "video": true, 
    "screenshotOnRunFailure": true 
  },
});
