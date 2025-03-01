describe('Medium Results - Relentless Health Website', () => {
    const EnvUrl = Cypress.env('CYPRESS_RELHEALT_DEV_ENV');
    let nasemLevel;

    function clickUntilTextAppears() {
        cy.get('button')
          .find('img[src="/icons/back-white-arrow.svg"]')
          .parent()
          .click()
          .wait(500)
          .then(() => {
            cy.get('.MuiTypography-root.MuiTypography-body1.css-1xs8ajt')
              .then(($el) => {
                if ($el.text().includes('NASEM level medium')) {
                  cy.log('Report found');
                  return;
                } else {
                  cy.log('Report not found');
                  clickUntilTextAppears(); // Retry
                }
              });
          });
      }


    beforeEach(() => {
        cy.RelHealthLogin();
        cy.fixture('pfasResults').as('pfasResults');
        cy.visit(`${EnvUrl}/results.html`);
        clickUntilTextAppears();
        cy.get('.MuiBox-root.css-1oiaplf') 
            .invoke('text') 
            .then((text) => {
                nasemLevel = parseFloat(text.trim());  
                expect(nasemLevel).and.to.be.at.least(2);
                expect(nasemLevel).and.to.be.at.most(20);
            });
    });

    it('Comparison', function() {

        //validate that nasemLevel is at X value on the graph
        cy.get('text.recharts-text.recharts-label').should('contain', nasemLevel);

        //validate that 'all_18_and_over' percentile is correct and appears at Y value on the graph
        cy.getScorePercentile(nasemLevel, 'all_18_and_over').then((scorePercentile) => {
            cy.log('Score Percentile:', scorePercentile.key);
            cy.get('text.recharts-text.recharts-label').should('contain', scorePercentile.key);

            //validate 'your nasem score is lower/higher than...
            if (scorePercentile.key > 50){
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `higher than ${scorePercentile.key}%`);
            }else {
                let nasemScore = 100 - scorePercentile.key;
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `lower than ${nasemScore}%`);
            }

            //Validate that the average exposure is correct
            if (scorePercentile.key < 40) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'below average');
            } else if (scorePercentile.key >= 40 && scorePercentile.key <= 50) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'about average');
            } else {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'above average');
            }
        });
            
        //validate that 'all_males_18_and_over' percentile is correct and appears at Y value on the graph
        cy.contains('button', 'US Male').click();
        cy.getScorePercentile(nasemLevel, 'all_males_18_and_over').then((scorePercentile) => {
            cy.log('US MALE Score Percentile:', scorePercentile.key);
            cy.get('text.recharts-text.recharts-label').should('contain', scorePercentile.key);

            //validate 'your nasem score is lower/higher than...
            if (scorePercentile.key > 50){
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `higher than ${scorePercentile.key}%`);
            }else {
                let nasemScore = 100 - scorePercentile.key;
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `lower than ${nasemScore}%`);
            }

            //Validate that the average exposure is correct
            if (scorePercentile.key < 40) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'below average');
            } else if (scorePercentile.key >= 40 && scorePercentile.key <= 50) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'about average');
            } else {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'above average');
            }
        });

        //validate that 'all_females_18_and_over' percentile is correct and appears at Y value on the graph
        cy.contains('button', 'US Female').click();
        cy.getScorePercentile(nasemLevel, 'all_females_18_and_over').then((scorePercentile) => {
            cy.log('US MALE Score Percentile:', scorePercentile.key);
            cy.get('text.recharts-text.recharts-label').should('contain', scorePercentile.key);

            //validate 'your nasem score is lower/higher than...
            if (scorePercentile.key > 50){
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `higher than ${scorePercentile.key}%`);
            }else {
                let nasemScore = 100 - scorePercentile.key;
                cy.get('.MuiBox-root.css-n7zsof').should('contain', `lower than ${nasemScore}%`);
            }

            //Validate that the average exposure is correct
            if (scorePercentile.key < 40) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'below average');
            } else if (scorePercentile.key >= 40 && scorePercentile.key <= 50) {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'about average');
            } else {
                cy.get('.MuiBox-root.css-n7zsof').should('contain', 'above average');
            }
        });

    });

    it('Card View', function() {
        const medResults  = this.pfasResults.medResults;
        let compoundsDetected; 
        cy.contains('button', 'Card View').click();
        cy.get('.MuiChip-root.MuiChip-filled.MuiChip-sizeMedium.MuiChip-colorDefault.MuiChip-filledDefault.css-11w4lye')
        .then((elements) => {
            compoundsDetected = elements.length;
            cy.get('.MuiTypography-root.MuiTypography-body1.css-1rkkq5o').should('contain',compoundsDetected)
        });

        Object.entries(medResults).forEach(([key, value]) => {
            if (['PFPeA', 'PFHXA', 'PFHpA', 'PFBS' ].includes(key)) {
                if (value < 0.075) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value >= 0.075 && value < 0.25) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Below range').should('be.visible');
                    });                
                } else if (value >= 0.25 && value <= 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('p', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Above range').should('be.visible');
                    });                
                } else if (value == 'Not Detected') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Inconclusive').should('be.visible');
                    });                
                }
            } else if (['PFBA'].includes(key)) {
                if (value < 0.15) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value >= 0.15 && value < 0.5) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Below range').should('be.visible');
                    });                
                } else if (value >= 0.5 && value <= 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('p', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Above range').should('be.visible');
                    });                
                } else if (value == 'Not Detected') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Inconclusive').should('be.visible');
                    });                
                }
            } else {
                if (value < 0.03) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value >= 0.03 && value < 0.1) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Below range').should('be.visible');
                    });                
                } else if (value >= 0.1 && value <= 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('p', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Above range').should('be.visible');
                    });                
                } else if (value == 'Not Detected') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiBox-root.css-10a73ai')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Inconclusive').should('be.visible');
                    });                
                }
            }
        });



    });

    it('Card View - component info', function() {
        cy.contains('button', 'Card View').click();
        cy.get('.MuiChip-root.MuiChip-filled.MuiChip-sizeMedium.MuiChip-colorDefault.MuiChip-filledDefault.css-11w4lye').contains('Detected').click();

        cy.get('.MuiBox-root.css-vxc0q3').should('be.visible');
        cy.get('.MuiBox-root.css-170pj98').should('be.visible');
        cy.get('.recharts-surface').should('be.visible');
        cy.get('.MuiBox-root.css-1eazutg').should('be.visible');
    });

    it('Table View', function(){
        const medResults  = this.pfasResults.medResults;

        cy.contains('button', 'Table View').click();
        Object.entries(medResults).forEach(([key, value]) => {
            if (['PFPeA', 'PFHXA', 'PFHpA', 'PFBS' ].includes(key)) {
                if (value < 0.075) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });                
                } else if (value >= 0.075 && value < 0.25) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Below range').should('be.visible');
                    });                 
                } else if (value >= 0.25 && value <= 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('td', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Above range').should('be.visible');
                    });                
                } else if (value == 'Not Detected') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Inconclusive').should('be.visible');
                    });                
                }
            } else if (['PFBA'].includes(key)) {
                if (value < 0.15) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });                
                } else if (value >= 0.15 && value < 0.5) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Below range').should('be.visible');
                    });                 
                } else if (value >= 0.5 && value <= 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('td', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Above range').should('be.visible');
                    });                
                } else if (value == 'Not Detected') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Not Detected').should('be.visible');
                    });               
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                    .filter((index, el) => {
                        return Cypress.$(el).text().includes(key);
                    })
                    .within(() => {
                        cy.log(key)
                        cy.contains('div', 'Inconclusive').should('be.visible');
                    });                
                }
            } else {
                if (value < 0.03) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('div', 'Not Detected').should('be.visible');
                        });
                } else if (value >= 0.03 && value < 0.1) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('div', 'Below range').should('be.visible');
                        });
                } else if (value >= 0.1 && value <= 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('td', value).should('be.visible');
                        });
                } else if (value > 50) {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('div', 'Above range').should('be.visible');
                        });
                } else if (value == 'Not Detected') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('div', 'Not Detected').should('be.visible');
                        });
                } else if (value == 'Inconclusive') {
                    cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg')
                        .filter((index, el) => {
                            return Cypress.$(el).text().includes(key);
                        })
                        .within(() => {
                            cy.log(key)
                            cy.contains('div', 'Inconclusive').should('be.visible');
                        });
                }
            }
        });
    })

    it('Table view - component info', function() {
        cy.contains('button', 'Table View').click();
        cy.get('.MuiTableRow-root.MuiTableRow-hover.css-l8cqgg').contains('Detected').click();

        cy.get('.MuiBox-root.css-vxc0q3').should('be.visible');
        cy.get('.MuiBox-root.css-170pj98').should('be.visible');
        cy.get('.recharts-surface').should('be.visible');
        cy.get('.MuiBox-root.css-1eazutg').should('be.visible');
    });

    it('Bubble View', function () {
        const medResults = this.pfasResults.medResults;
        
        cy.contains('button', 'Bubble view').click();
    
        cy.get('.recharts-layer.recharts-scatter-symbol')
            .each(($elemento, index) => { 
                if (index === 0 || index === 19) {
                    cy.log(`Skipping invalid bubbles`);
                    return;
                }
                cy.wrap($elemento)
                    .trigger('mouseover', { force: true }) 
                    .wait(500)
                    .get('.recharts-tooltip-wrapper.recharts-tooltip-wrapper')
                    .should('be.visible')
                    .invoke('text')
                    .then((cardText) => {
                        // Verify if at leats 1 of the PFAS from medResults is in the card
                        cy.log(`Card text: ${cardText.trim()}`);
                        const matchFound = Object.entries(medResults).some(([key, value]) => {  

                            if (['PFPeA', 'PFHXA', 'PFHpA', 'PFBS' ].includes(key)) {
                                if (value < 0.075) {
                                    return cardText.includes(key) && cardText.includes('Not Detected');           
                                } else if (value >= 0.075 && value < 0.25) {
                                    return cardText.includes(key) && cardText.includes('Below range');           
                                } else if (value >= 0.25 && value <= 50) {
                                    return cardText.includes(key) && cardText.includes(value); 
                                } else if (value > 50) {
                                    return cardText.includes(key) && cardText.includes('Above range');        
                                } else if (value == 'Not Detected') {
                                    return cardText.includes(key) && cardText.includes('Not Detected');         
                                } else if (value == 'Inconclusive') {
                                    return cardText.includes(key) && cardText.includes('Inconclusive');    
                                }
                            } else if (['PFBA'].includes(key)) {
                                if (value < 0.15) {
                                    return cardText.includes(key) && cardText.includes('Not Detected');           
                                } else if (value >= 0.15 && value < 0.5) {
                                    return cardText.includes(key) && cardText.includes('Below range');           
                                } else if (value >= 0.5 && value <= 50) {
                                    return cardText.includes(key) && cardText.includes(value); 
                                } else if (value > 50) {
                                    return cardText.includes(key) && cardText.includes('Above range');        
                                } else if (value == 'Not Detected') {
                                    return cardText.includes(key) && cardText.includes('Not Detected');         
                                } else if (value == 'Inconclusive') {
                                    return cardText.includes(key) && cardText.includes('Inconclusive');    
                                }
                            } else {
                                if (value < 0.03) {
                                    return cardText.includes(key) && cardText.includes('Not Detected');
                                } else if (value >= 0.03 && value < 0.1) {
                                    return cardText.includes(key) && cardText.includes('Below range');
                                } else if (value >= 0.1 && value <= 50) {
                                    return cardText.includes(key) && cardText.includes(value);
                                } else if (value > 50) {
                                    return cardText.includes(key) && cardText.includes('Above range');
                                } else if (value == 'Not Detected') {
                                    return cardText.includes(key) && cardText.includes('Not Detected');
                                } else if (value == 'Inconclusive') {
                                    return cardText.includes(key) && cardText.includes('Inconclusive');
                                }
                            }
    
                                
                            });
    
                        expect(matchFound, 'The PFAS info from medResults is in the card').to.be.true;
                    });
            });
    });
});

