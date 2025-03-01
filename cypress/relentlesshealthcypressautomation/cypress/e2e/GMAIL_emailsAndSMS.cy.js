describe('EMAILS AND SMS RECEIVED', () => {

    it('Order Confirmed email', () => {
        cy.getEmailByCriteria('subject:Order confirmed').then((email) => {
                const regex = /Thank you for your purchase!.*we will notify you when it has been sent/i;

                expect(email.snippet).to.match(regex);
        });
    });

    it('PFAS in transit email', () => {
        cy.getEmailByCriteria('subject:Your PFAS core panel test kit is in transit').then((email) => {
            const regex = /Your PFAS core panel test kit is in transit. To keep track of your order, click/i;
            expect(email.snippet).to.match(regex);
        });
    });

    it('Order Placed SMS', () => {
        cy.getEmailByCriteria('subject:"New text message from (877) 438-0182" "Your order for the Relentless Health health kit has been placed!"').then((email) => {
            const regex = /Your order for the Relentless Health health kit has been placed!/i;
            expect(email.snippet).to.match(regex);
        });
    });

    it('Order in transit SMS', () => {
        cy.getEmailByCriteria('subject:"New text message from (877) 438-0182" "Your order for the Relentless Health test kit is in transit"').then((email) => {
            const regex = /Your order for the Relentless Health test kit is in transit, and should be arriving by/i;
            expect(email.snippet).to.match(regex);
        });
    });

    it('Order out for delivery SMS', () => {
        cy.getEmailByCriteria('subject:"New text message from (877) 438-0182" "Your order for the Relentless Health test kit is out for delivery"').then((email) => {
            const regex = /Your order for the Relentless Health test kit is out for delivery/i;
            expect(email.snippet).to.match(regex);
        });
    });

    it('Order arrived to labs SMS', () => {
        cy.getEmailByCriteria('subject:"New text message from (877) 438-0182" "Your test kit has arrived"').then((email) => {
            const regex = /Your test kit has arrived to our labs/i;
            expect(email.snippet).to.match(regex);            
        });
    });

    // it('Delete all emails', () => {
    //     cy.deleteAllEmails();
    // });
  
});

