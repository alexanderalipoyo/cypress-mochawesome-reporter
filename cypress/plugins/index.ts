/// <reference types="cypress" />

const FS = require("fs-extra");
const PATH = require("path");
const { renameSync } = require("fs");
const browserify = require("@cypress/browserify-preprocessor");

// This is used for calling the config file
function getConfigurationByFile(web, file, paymentType, amountType) {
	const pathToConfigFile = PATH.resolve(
		"cypress",
		"config/" + web,
		`${file}.json`
	);
	if (!FS.existsSync(pathToConfigFile)) {
		return {
		// return empty
		};
	}

	return new Promise(function (res) {
		if (web == "stripe-checkout") {
		try {
			FS.readJson(pathToConfigFile, (err, obj) => {
			if (err) throw err;
			res(obj[paymentType][amountType]);
			});
		} catch (err) {
			res(err);
		}
		} else {
		// return empty
		}
	});
}

/**
 * @type {Cypress.PluginConfig}
 */

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // const CLIPBOARDY = require("clipboardy");
	const WEB = config.env.website;
	const FILE = config.env.configFile;
	const PAYMENTTYPE = config.env.paymentType;
	const AMOUNTTYPE = config.env.amountType;
	const options = {
		...browserify.defaultOptions,
		typescript: require.resolve("typescript"),
	};

	// Use to rename the qr code after screenshot remove (1) and so forth
	on("after:screenshot", ({ path }) => {
		renameSync(path, path.replace(/ \(\d*\)/i, ""));
	});

	return getConfigurationByFile(WEB, FILE, PAYMENTTYPE, AMOUNTTYPE);
};
