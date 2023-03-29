/***************************************************************
    # Author            :  Alex Alipoyo  
    # Last updated on   :  15 March 2023

    # TestCase          :  Submit One-Time Donation with $5.00
    # Scenarios         :  
        Without 3D secure Verification
        With 3D secure Verification
        Validate Mandatory Fields
        Failed submission with 3D secure Verification
        Complete submission with 3D secure Verification
        Save information for 1-click Checkout
        Validate incomplete email address
***************************************************************/

import { commonElements } from "../page-objects/common-elements";

const COMM_ELEMENTS = new commonElements();

beforeEach(() => {
    cy.visitUrl();
});

context("Submit One-Time Donation with $5.00", () => {
    
    it("Without 3D secure Verification", () => {

        COMM_ELEMENTS.scenarios('Without 3D secure Verfication');
        
    });

    it("With 3D secure Verification", () => {

        COMM_ELEMENTS.scenarios('With 3D secure Verification');
        
    });

    it("Validate Mandatory Fields", () => {

        COMM_ELEMENTS.scenarios('Mandatory fields');
        
    });

    it("Failed submission with 3D secure Verification", () => {

        COMM_ELEMENTS.scenarios('Failed submission with 3D secure Verification');
        
    });

    it("Complete submission with 3D secure Verification", () => {

        COMM_ELEMENTS.scenarios('Complete submission with 3D secure Verification');
        
    });

    it("Save information for 1-click Checkout", () => {

        COMM_ELEMENTS.scenarios('Save information for 1-click Checkout');
        
    });

    it("Validate incomplete email address", () => {

        COMM_ELEMENTS.scenarios('Validate incomplete email address');
        
    });

});
