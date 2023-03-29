/***************************************************************
    # Author             :  Alex Alipoyo      
    # Last updated on    :  15 March 2023
***************************************************************/
import * as faker from 'faker';

let email = faker.internet.email()
let clientName = faker.name.firstName();
let clientSurname = faker.name.firstName();
let recentDateTime =  faker.time.recent('unix');
let dayjs = require('dayjs');
let futureDate = dayjs().add('2','years').format('MM-/ YY');
let phoneNumber = '0905 123 4567';
let amounts = {
    5: "sku_GU4JYXyvvRb2sX",
    15: "sku_GU4KO8nfdg8G2Z",
    50: "sku_GU4LB0wBViiYsm",
};

export class commonElements {

    get dataPriceID() { return cy.get('[data-price-id="'+amounts['5']+'"]');}
    get productSummaryName() { return cy.get('[data-testid="product-summary-name"]');}
    get productSummaryTotalAmount() { return cy.get('[id="ProductSummary-totalAmount"]');}
    get productSummaryDescription() { return cy.get('.ProductSummaryDescription');}
    get email() { return cy.get('[name="email"]');}
    get cardNumber() { return cy.get('[name="cardNumber"]');}
    get cardExpiry() { return cy.get('[name="cardExpiry"]');}
    get cardCvc() { return cy.get('[name="cardCvc"]');}
    get billingName() { return cy.get('[name="billingName"]');}
    get billingCountry() { return cy.get('[name="billingCountry"]');}
    get enableStripePass() { return cy.get('[name="enableStripePass"]');}
    get phoneNumber() { return cy.get('[name="phoneNumber"]');}
    get submitPayment() { return cy.get('[data-testid="hosted-payment-submit-button"]');}    
    get submitProcessing() { return cy.get('.SubmitButton--processing');}  
    get paymentSucceedLabel() {return cy.get('.sr-payment-summary');}
    get confirmPaymentError() {return cy.get('.ConfirmPaymentButton-Error');}
    get submitIcon() {return cy.get('.SubmitButton-IconContainer');}
    get requiredErrorLabel() {return cy.get('[data-qa="EmptyFieldError"]')}
    get fieldErrorLabel() {return cy.get('.FieldError')}
    get modalHeaderTitle() {return cy.xpath('/html/body/div[1]/iframe').as('mainframe').iframe('@mainframe').find('[name="stripe-challenge-frame"]').as('frameheadertitle').iframe('@frameheadertitle').find('.Header-title');}
    get modalSubmitFail() { return cy.xpath('/html/body/div[1]/iframe').as('mainframe').iframe('@mainframe').find('[name="stripe-challenge-frame"]').as('framefail').iframe('@framefail').find('[id="test-source-fail-3ds"]');}
    get modalSubmitComplete() { return cy.xpath('/html/body/div[1]/iframe').as('mainframe').iframe('@mainframe').find('[name="stripe-challenge-frame"]').as('framesubmit').iframe('@framesubmit').find('[id="test-source-authorize-3ds"]');}
    
/*********************************************************************************
   *  MethodName    : scenarios
   *  Description   : validate all scenarios
   *  Parameter     : scenario
*********************************************************************************/

    scenarios(scenario: string) {
        
        const without3D = '4242 4242 4242 4242';
        const with3D = '4000 0000 0000 3220';

        cy.intercept('POST', '**/v1/consumers/accounts/sign_up').as("sign_up"); 
        cy.intercept('POST', '**/v1/payment_pages/*/confirm').as("confirm"); 
        cy.intercept('POST', '**/v1/*/authenticate').as("authenticate"); 
        cy.intercept('POST', '**/3d_secure_2_test/*/*/challenge').as("securemodal"); 
        
        this.dataPriceID.click({force:true});
        cy.stripeEndpoint();
        this.dataPriceID.should('be.visible');
        this.productSummaryName.should('contain.text','One-time Donation');
        this.productSummaryTotalAmount.should('contain.text','$5.00');
        this.productSummaryDescription.should('contain.text','One-time Donation - 5');
        this.email.type(recentDateTime+email);
        this.cardExpiry.type(futureDate);
        this.billingName.type(clientName + ' ' + clientSurname);
        this.billingCountry.should('be.visible');
        Cypress.on('uncaught:exception', () => {return false});	
        
            switch(scenario){
                case 'Without 3D secure Verfication':
                    this.cardNumber.type(without3D);
                    this.cardCvc.type('123');
                    this.submitPayment.click();
                    this.submitIcon.should('exist');
                    this.paymentSucceedLabel.should('contain.text','Your test payment succeeded');
                break;
                case 'With 3D secure Verification':
                    this.cardNumber.type(with3D);
                    this.cardCvc.type('123');
                    this.submitPayment.click();
                    this.submitIcon.should('exist');
                        cy.wait('@confirm').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                            expect(xhr.response.body.beta_versions).to.be.null;
                            expect(xhr.response.body.billing_address_collection).to.be.null;
                            expect(xhr.response.body.display_consent_collection_promotions).to.be.false;
                        });
                        cy.wait('@authenticate').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                    this.modalHeaderTitle.should('contain.text','3D Secure 2')
                        .should('contain.text','Test Page');
                    this.modalSubmitFail.should('be.visible');
                    this.modalSubmitComplete.should('be.visible');
                        cy.get("body").type("{enter}");
                break;
                case 'Mandatory fields':
                    this.email.clear({force:true});
                    this.cardExpiry.clear({force:true});
                    this.billingName.clear({force:true});
                    this.phoneNumber.clear({force:true});
                    this.submitPayment.click();
                    this.requiredErrorLabel.should('be.visible');
                        cy.get("body").type("{enter}");
                break;
                case 'Failed submission with 3D secure Verification':
                    this.cardNumber.type(with3D);
                    this.cardCvc.type('123');
                    this.submitPayment.click();
                    this.submitIcon.should('be.visible');
                        cy.wait('@securemodal').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                        cy.wait('@confirm').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                            expect(xhr.response.body.beta_versions).to.be.null;
                            expect(xhr.response.body.billing_address_collection).to.be.null;
                            expect(xhr.response.body.display_consent_collection_promotions).to.be.false;
                        });
                        cy.wait('@authenticate').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                    this.modalSubmitComplete.should('be.visible');
                    this.modalSubmitFail.click({force:true});
                        cy.stripeEndpoint();
                    this.submitIcon.should('be.visible');
                        cy.get("body").type("{enter}");
                break;
                case 'Complete submission with 3D secure Verification':
                    this.cardNumber.type(with3D);
                    this.cardCvc.type('123');
                    this.submitPayment.click();
                        cy.stripeEndpoint();
                    this.submitIcon.should('exist');
                        cy.wait('@securemodal').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                        cy.wait('@confirm').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                            expect(xhr.response.body.beta_versions).to.be.null;
                            expect(xhr.response.body.billing_address_collection).to.be.null;
                            expect(xhr.response.body.display_consent_collection_promotions).to.be.false;
                        });
                        cy.wait('@authenticate').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                    this.modalSubmitFail.should('be.visible');
                    this.modalSubmitComplete.click();
                        cy.get("body").type("{enter}");
                break;
                case 'Save information for 1-click Checkout':
                    this.enableStripePass.click();
                    this.phoneNumber.type(phoneNumber,{force:true});
                    this.cardNumber.type(with3D);
                    this.cardCvc.type('123');
                    this.submitPayment.click();
                        cy.stripeEndpoint();
                    this.submitIcon.should('exist');
                        cy.wait('@sign_up').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                            expect(xhr.response.body.account_id).to.exist;
                            expect(xhr.response.body.auth_session_client_secret).to.exist;
                            expect(xhr.response.body.consumer_session.client_secret).to.exist;
                            expect(xhr.response.body.consumer_session.email_address).to.exist;
                            expect(xhr.response.body.consumer_session.redacted_formatted_phone_number).to.exist;
                            expect(xhr.response.body.consumer_session.redacted_phone_number).to.exist;
                            expect(xhr.response.body.publishable_key).to.exist;
                        });
                        cy.wait('@securemodal').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                        cy.wait('@confirm').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                            expect(xhr.response.body.beta_versions).to.be.null;
                            expect(xhr.response.body.billing_address_collection).to.be.null;
                            expect(xhr.response.body.display_consent_collection_promotions).to.be.false;
                        });
                        cy.wait('@authenticate').should(xhr => {		
                            expect(xhr.response.statusCode).to.equal(200);
                        });
                    this.modalSubmitFail.should('be.visible');
                    this.modalSubmitComplete.click();
                break;
                case 'Validate incomplete email address':
                    this.email.clear({force:true}).type(recentDateTime);
                    this.submitPayment.click();
                    this.fieldErrorLabel.should('contain.text','Your email is incomplete.')
                break;
                
            }

    }

}
