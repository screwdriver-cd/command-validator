'use strict';

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
async function validateCommand(commandObj) {
    const validCommand = await SCHEMA_CONFIG.validateAsync(commandObj, {
        abortEarly: false
    });

    return validCommand;
}

/**
 * Parses the configuration from a screwdriver-command-spec.yaml
 * @async  parseCommand
 * @param  {String}  yamlString Contents of screwdriver command yaml
 * @return {Promise}            Promise that rejects if the configuration cannot be parsed
 *                              The promise will eventually resolve into:
 *         {Object}   config
 *         {Object}   config.command   The parsed command that was validated
 *         {Object[]} config.errors    An array of objects related to validating
 *                                     the given command
 */
async function parseCommand(yamlString) {
    const command = await loadCommandSpecYaml(yamlString);

    try {
        return {
            errors: [],
            command: await validateCommand(command)
        };
    } catch (err) {
        return {
            errors: err.details,
            command
        };
    }
}

module.exports = parseCommand;
