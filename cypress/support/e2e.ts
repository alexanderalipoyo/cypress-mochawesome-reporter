// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')
require('cypress-xpath');
Cypress.on('uncaught:exception', (err, runnable) => {
    
        if (err.message.includes('The client specified not to prompt')) {
        return false
        }
        
    })
module.exports = (on, config) => {    

  // accept a configFile value or use development by default

}

//enable support for XPath
// import ('cypress-xpath')