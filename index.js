'use strict';

const Joi = require('joi');
const SCHEMA_CONFIG = require('screwdriver-data-schema').config.command.schemaCommand;
const Yaml = require('js-yaml');

/**
 * Loads the configuration from a stringified sd-command.yaml
 * @method loadCommandSpecYaml
 * @param  {String} yamlString Contents of sd-command.yaml
 * @return {Promise}           Promise that resolves to the command as a config object
 */
function loadCommandSpecYaml(yamlString) {
    return new Promise(resolve => resolve(Yaml.safeLoad(yamlString)));
}

/**
 * Validate the command configuration
 * @method validateCommand
 * @param  {Object}         commandObj  Configuration object that represents the command
 * @return {Promise}                    Promise that resolves to the passed-in config object
 */
function validateCommand(commandObj) {
    return new Promise((resolve, reject) => {
        Joi.validate(commandObj, SCHEMA_CONFIG, {
            abortEarly: false
        }, (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}

/**
 * Parses the configuration from a screwdriver-command-spec.yaml
 * @method parseCommand
 * @param  {String} yamlString Contents of screwdriver command yaml
 * @return {Promise}           Promise that rejects if the configuration cannot be parsed
 *                             The promise will eventually resolve into:
 *         {Object}   config
 *         {Object}   config.command   The parsed command that was validated
 *         {Object[]} config.errors    An array of objects related to validating
 *                                     the given command
 */
function parseCommand(yamlString) {
    return loadCommandSpecYaml(yamlString)
        .then(configToValidate =>
            validateCommand(configToValidate)
                .then(commandConfiguration => ({
                    errors: [],
                    config: commandConfiguration
                }), err => ({
                    errors: err.details,
                    config: configToValidate
                }))
        );
}

module.exports = parseCommand;
