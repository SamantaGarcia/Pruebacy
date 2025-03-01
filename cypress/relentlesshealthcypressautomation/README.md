# REQUIRED DEPENDENCIES
Cypress: npm install cypress --save-dev
Cypress-iframe: npm install -D cypress-iframe
Dotenv: npm install dotenv --save
Mochawezome Reporter: npm i cypress-mochawesome-reporter

# IMPORTANT
- Ask for the .env file and paste it in the root of the project (in the same location than cypress.config.js)
- Do not change the gmail address and tokens from the .env file
- If you need access to the QA gmail account, ask for credentials
- If you want to run Vital.cy.js spec you should run first LoadVital.cy.js
and wait about 8 minutes before running Vital.cy.js (The vital login sends an OTP code but the first code always arrives late to gmail. Looks like it's a bug from Vital)

# COMMANDS
- Open the UI interface to run tests:
    npm run test
- Open the UI interface to run tests with an specific browser:
    npm run test -- --browser <nameOfTheBrowser>
    EXAMPLE:
    npm run test -- --browser chrome
- Run a complete end to end test in headless mode:
    npm run e2e
- Run a complete end to end test with an specific browser in headless mode:
    npm run e2e -- --browser <nameOfTheBrowser>
    EXAMPLE:
    npm run e2e -- --browser chrome
- Run a single test in headless mode:
    npx cypress run --headless --spec "cypress/e2e/folderName/fileName.cy.js" --browser chrome
    npx cypress run --headless --spec "cypress/e2e/authUser/RH_createAccount.cy.js" --browser chrome
- Run several tests in headless mode:
    npx cypress run --headless --spec "cypress/e2e/folderName/file1.cy.js,cypress/e2e/folderName/file2.cy.js,cypress/e2e/folderName/file3.cy.js" --browser chrome

# fixtures/generatedData folder
Here you will find all the information generated during the execution.
- dynamicEmail.json (auth user account)
- dynamicGuestEmail.json (guest user account)
- authOrderApiResponse.json (auth user order info)
- guestOrderApiResponse.json (guest user order info)
- cartID.json (last cart ID obtained)
- vitalSampleIDs.json (auth and guest sample IDs)
*This folder is overwritten with each run*

# Reports folder
After finishing a headless mode execution you will find an Index file. 
If you open it in the browser you will see all the results from the executions
(logs, failure screenshots and videos)
*This folder is overwritten with each run*

# Screenshots folder
After finishing a headless mode execution you will find all the failure screenshots here.
*This folder is overwritten with each run*

# Videos folder
After finishing a headless mode execution you will find a video for each test spec executed here.
*This folder is overwritten with each run*
