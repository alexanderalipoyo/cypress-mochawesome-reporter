import { defineConfig } from "cypress"

export default defineConfig({
    videoCompression: false,
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    trashAssetsBeforeRuns: false,
    retries: {
        runMode: 0,
        openMode: 0,
    },

    defaultCommandTimeout: 1000000,
    downloadsFolder: "cypress/downloads",
    reporter: "cypress-multi-reporters",

    reporterOptions: {
        reporterEnabled: "mochawesome",
        mochawesomeReporterOptions: {
        reportDir: "cypress/reports/mocha",
        quite: true,
        overwrite: false,
        html: false,
        json: true,
        },
    },

    e2e: {
        // We've imported your old cypress plugins here.
        // You may want to clean this up later by importing these.
        setupNodeEvents(on, config) {
        return require("./cypress/plugins/index.ts")(on, config);
        },
        specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
        experimentalStudio: true,
        experimentalModifyObstructiveThirdPartyCode: true
    },

    component: {
        devServer: {
        framework: "react",
        bundler: "webpack",
        },
    },
});