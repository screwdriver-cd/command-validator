#!/usr/bin/env node

'use strict';

const index = require('./index');
const commander = require('commander');
const fs = require('fs');

commander
    .usage('[options]')
    .option('-j, --json', 'output with JSON')
    .option('-f, --file [path]', 'screwdriver command file', './sd-command.yaml')
    .parse(process.argv);

/**
 * Loads the yaml configuration from a file
 * @method loadFile
 * @param  {String}     path        File path
 * @return {Promise}    Promise that resolves to the command as a yaml string
 */
function loadFile(path) {
    return new Promise(resolve =>
        resolve(fs.readFileSync(path, 'utf8')));
}

return loadFile(commander.file)
    .then(yamlString => index(yamlString))
    .then((result) => {
        if (result.errors.length > 0) {
            console.error(result.errors);
            process.exit(1);
        } else if (commander.json) {
            console.log(JSON.stringify({ valid: true }));
        } else {
            console.log('true');
        }
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
