describe('Timeline Results - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let results;

    beforeEach(() => {
        cy.RelHealthLogin();
        cy.visit(`${EnvUrl}/results.html`);
        cy.fixture('pfasResults.json').then((jsonData) => {
            results = jsonData;
        });
        cy.contains('button', 'Timeline').click();
    });

    it('Compound', function () {
        // Obtaining NASEM levels and save them as alias
        cy.obtainNasemLevelTimeline('level high').then((reportText) => {
            expect(reportText).to.not.be.empty;
            return cy.wrap(reportText).as('highNasemLevel');
        });
    
        cy.obtainNasemLevelTimeline('level medium').then((reportText) => {
            expect(reportText).to.not.be.empty;
            return cy.wrap(reportText).as('medNasemLevel');
        });
    
        cy.obtainNasemLevelTimeline('level low').then((reportText) => {
            expect(reportText).to.not.be.empty;
            return cy.wrap(reportText).as('lowNasemLevel');
        });
    
        cy.wait(5000); // Short wait to ensure stability
    
        // Test every circle in the graph
        cy.log('Validating Circle #0 (Skipping)');
        cy.get('circle').eq(0).trigger('mouseover'); 
        cy.get('.recharts-tooltip-wrapper').should('be.visible').invoke('text').then((text) => {
            cy.log('Skipping Tooltip 0');
        });
    
        cy.log('Validating Hover Tooltip - Low Level');
        cy.checkTooltip(1, 'Low Level');
        cy.log('Validating Low Level chart position');
        cy.validateCirclePosition(0, 'Low Level');
    
        cy.log('Validating Hover Tooltip - Medium Level');
        cy.checkTooltip(2, 'Medium Level');
        cy.log('Validating Medium Level chart position');
        cy.validateCirclePosition(1, 'Medium Level');
    
        cy.log('Validating Hover Tooltip - High Level');
        cy.checkTooltip(3, 'High Level');
        cy.log('Validating High Level chart position');
        cy.validateCirclePosition(2, 'High Level');

        //US MALE
        cy.log('US MALE');
        cy.contains('button', 'US Male').click();
        cy.wait(5000); // Short wait to ensure stability

        cy.log('US Male - Validating Low Level chart position');
        cy.validateCirclePosition(0, 'Low Level');
    
        cy.log('US Male - Validating Medium Level chart position');
        cy.validateCirclePosition(1, 'Medium Level');
    
        cy.log('US Male - Validating High Level chart position');
        cy.validateCirclePosition(2, 'High Level');

        //US Female
        cy.log('US FEMALE');
        cy.contains('button', 'US Female').click();
        cy.wait(5000); // Short wait to ensure stability

        cy.log('US Female - Validating Low Level chart position');
        cy.validateCirclePosition(0, 'Low Level');
    
        cy.log('US Female - Validating Medium Level chart position');
        cy.validateCirclePosition(1, 'Medium Level');
    
        cy.log('US Female - Validating High Level chart position');
        cy.validateCirclePosition(2, 'High Level');
    });

    it('PFBA', function () {
        const low = results.lowResults['PFBA'];
        const med = results.medResults['PFBA'];
        const high = results.highResults['PFBA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFBA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFBA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFBA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFBA', high, 2);
    });

    it('PFPeA', function () {
        const low = results.lowResults['PFPeA'];
        const med = results.medResults['PFPeA'];
        const high = results.highResults['PFPeA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFPeA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFPeA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFPeA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFPeA', high, 2);
    });
    
    it('PFHXA', function () {
        const low = results.lowResults['PFHXA'];
        const med = results.medResults['PFHXA'];
        const high = results.highResults['PFHXA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFHXA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFHXA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHXA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHXA', high, 2);
    });

    it('PFHpA', function () {
        const low = results.lowResults['PFHpA'];
        const med = results.medResults['PFHpA'];
        const high = results.highResults['PFHpA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFHpA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFHpA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpA', high, 2);
    });

    it('PFOA', function () {
        const low = results.lowResults['PFOA'];
        const med = results.medResults['PFOA'];
        const high = results.highResults['PFOA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFOA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFOA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFOA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFOA', high, 2);
    });

    it('PFNA', function () {
        const low = results.lowResults['PFNA'];
        const med = results.medResults['PFNA'];
        const high = results.highResults['PFNA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFNA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFNA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFNA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFNA', high, 2);
    });

    it('PFDA', function () {
        const low = results.lowResults['PFDA'];
        const med = results.medResults['PFDA'];
        const high = results.highResults['PFDA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFDA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFDA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFDA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFDA', high, 2);
    });

    it('PFUnDA', function () {
        const low = results.lowResults['PFUnDA'];
        const med = results.medResults['PFUnDA'];
        const high = results.highResults['PFUnDA'];
    
        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFUnDA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFUnDA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFUnDA', med, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFUnDA', high, 1);

    });

    it('PFDoDA', function () {
        const low = results.lowResults['PFDoDA'];
        const med = results.medResults['PFDoDA'];
        const high = results.highResults['PFDoDA'];
    
        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFDoDA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFDoDA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFDoDA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFDoDA', high, 2);
    });

    it('N-MeFOSAA', function () {
        const low = results.lowResults['N-MeFOSAA'];
        const med = results.medResults['N-MeFOSAA'];
        const high = results.highResults['N-MeFOSAA'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'N-MeFOSAA').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('N-MeFOSAA', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('N-MeFOSAA', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('N-MeFOSAA', high, 2);
    });

    it('PFBS', function () {
        const low = results.lowResults['PFBS'];
        const med = results.medResults['PFBS'];
        const high = results.highResults['PFBS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFBS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFBS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFBS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFBS', high, 2);
    });

    it('PFHxS', function () {
        const low = results.lowResults['PFHxS'];
        const med = results.medResults['PFHxS'];
        const high = results.highResults['PFHxS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFHxS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFHxS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHxS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHxS', high, 2);
    });

    it('PFHpS', function () {
        const low = results.lowResults['PFHpS'];
        const med = results.medResults['PFHpS'];
        const high = results.highResults['PFHpS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFHpS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFHpS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpS', high, 2);
    });

    it('PFHpS', function () {
        const low = results.lowResults['PFHpS'];
        const med = results.medResults['PFHpS'];
        const high = results.highResults['PFHpS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFHpS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFHpS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFHpS', high, 2);
    });

    it('PFOS', function () {
        const low = results.lowResults['PFOS'];
        const med = results.medResults['PFOS'];
        const high = results.highResults['PFOS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFOS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFOS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFOS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFOS', high, 2);
    });

    it('PFNS', function () {
        const low = results.lowResults['PFNS'];
        const med = results.medResults['PFNS'];
        const high = results.highResults['PFNS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', 'PFNS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('PFNS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFNS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('PFNS', high, 2);
    });

    it('4:2 FTS', function () {
        const low = results.lowResults['4:2 FTS'];
        const med = results.medResults['4:2 FTS'];
        const high = results.highResults['4:2 FTS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', '4:2 FTS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('4:2 FTS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('4:2 FTS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('4:2 FTS', high, 2);
    });

    it('6:2 FTS', function () {
        const low = results.lowResults['4:2 FTS'];
        const med = results.medResults['4:2 FTS'];
        const high = results.highResults['4:2 FTS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', '4:2 FTS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('4:2 FTS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('4:2 FTS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('4:2 FTS', high, 2);
    });

    it('8:2 FTS', function () {
        const low = results.lowResults['8:2 FTS'];
        const med = results.medResults['8:2 FTS'];
        const high = results.highResults['8:2 FTS'];

        cy.get('.MuiSelect-select').click();
        cy.contains('li', '8:2 FTS').click();
        cy.wait(3000);
        
        cy.validateCompoundTooltip('8:2 FTS', low, 0);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('8:2 FTS', med, 1);
        cy.get('.MuiBox-root.css-p63njl').click();
        cy.validateCompoundTooltip('8:2 FTS', high, 2);
    });

});
          


