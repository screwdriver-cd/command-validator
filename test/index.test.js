'use strict';

const assert = require('chai').assert;
const fs = require('fs');
const hoek = require('hoek');
const path = require('path');
const validator = require('../index.js');

const TEST_YAML_FOLDER = path.resolve(__dirname, 'data');
const BINARY_COMMAND_PATH = path.resolve(TEST_YAML_FOLDER, 'valid_binary_command_spec.yaml');
const DOCKER_COMMAND_PATH = path.resolve(TEST_YAML_FOLDER, 'valid_docker_command_spec.yaml');
const HABITAT_COMMAND_PATH = path.resolve(TEST_YAML_FOLDER, 'valid_habitat_command_spec.yaml');
const BAD_STRUCTURE_COMMAND_PATH = path.resolve(TEST_YAML_FOLDER, 'bad_structure_command.yaml');

describe('index test', () => {
    it('parses a valid binary command yaml', () => {
        const yamlString = fs.readFileSync(BINARY_COMMAND_PATH);

        return validator(yamlString)
            .then((config) => {
                assert.isObject(config);

                assert.deepEqual(config, {
                    errors: [],
                    command: {
                        description: 'this is sd-command of binary',
                        maintainer: 'foo@bar.com',
                        name: 'bar',
                        namespace: 'foo',
                        version: '1.0',
                        format: 'binary',
                        binary: {
                            file: './foobar.sh'
                        }
                    }
                });
            });
    });

    it('parses a valid docker command yaml', () => {
        const yamlString = fs.readFileSync(DOCKER_COMMAND_PATH);

        return validator(yamlString)
            .then((config) => {
                assert.isObject(config);

                assert.deepEqual(config, {
                    errors: [],
                    command: {
                        description: 'this is sd-command of docker',
                        maintainer: 'foo@bar.com',
                        name: 'bar',
                        namespace: 'foo',
                        version: '1.0',
                        format: 'docker',
                        docker: {
                            image: 'node:6',
                            command: 'node'
                        }
                    }
                });
            });
    });

    it('parses a valid habitat command yaml', () => {
        const yamlString = fs.readFileSync(HABITAT_COMMAND_PATH);

        return validator(yamlString)
            .then((config) => {
                assert.isObject(config);

                assert.deepEqual(config, {
                    errors: [],
                    command: {
                        description: 'this is sd-command of habitat',
                        maintainer: 'foo@bar.com',
                        name: 'bar',
                        namespace: 'foo',
                        version: '1.0',
                        format: 'habitat',
                        habitat: {
                            mode: 'remote',
                            package: 'core/git/2.14.1',
                            command: 'git'
                        }
                    }
                });
            });
    });

    it('validates a poorly structured command yaml', () => {
        const yamlString = fs.readFileSync(BAD_STRUCTURE_COMMAND_PATH);

        return validator(yamlString)
            .then((result) => {
                assert.deepEqual(result.command, {
                    maintainer: 'foo@bar.com',
                    name: 'bar',
                    namespace: 'foo',
                    version: '1.0',
                    format: 'docker',
                    habitat: {
                        mode: 'remote',
                        package: 'core/git',
                        command: 'git'
                    }
                });
                assert.strictEqual(result.errors.length, 2);

                // check required description
                const missingField = hoek.reach(result.command, result.errors[0].path);

                assert.strictEqual(result.errors[0].message, '"description" is required');
                assert.isUndefined(missingField);

                // check required docker specified in format
                const missingField2 = hoek.reach(result.command, result.errors[1].path);

                assert.strictEqual(result.errors[1].message, '"docker" is required');
                assert.isUndefined(missingField2);
            }, assert.fail);
    });

    it('throws when parsing incorrectly formatted yaml', () => {
        const yamlString = 'main: :';

        return validator(yamlString)
            .then(assert.fail, (err) => {
                assert.match(err, /YAMLException/);
            });
    });
});
