import 'cypress-iframe';

/*************************************************
    Use below custom command to visit URL
        # Last updated by    :  Alex Alipoyo      
        # Last updated on    :  15 March 2023
**************************************************/

Cypress.Commands.add("visitUrl", () => {

    cy.visit(Cypress.env("url"));

});

/*************************************************
    Use below custom command to valide specific endpoint
        # Last updated by    :  Alex Alipoyo      
        # Last updated on    :  15 March 2023
**************************************************/

Cypress.Commands.add("stripeEndpoint", () => {

    cy.intercept('POST', 'https://m.stripe.com/*').as("stripe");
        cy.wait('@stripe').should(xhr => {		
            expect(xhr.response.statusCode).to.equal(200);
        });

});