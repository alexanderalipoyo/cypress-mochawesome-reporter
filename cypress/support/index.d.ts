declare namespace Cypress {
    interface Chainable {
        visitUrl;
        xpath;
        mount;
        stripeEndpoint;
        logTime: () => Chainable<number>
    }
}