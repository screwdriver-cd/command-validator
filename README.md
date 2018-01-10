# command-validator
[![Version][npm-image]][npm-url] ![Downloads][downloads-image] [![Build Status][status-image]][status-url] [![Open Issues][issues-image]][issues-url] [![Dependency Status][daviddm-image]][daviddm-url] ![License][license-image]

> A module for validating a Screwdriver Command file

## yaml

```yaml
# example.yaml
namespace: git
name: clone
version: '1.1'
description: SD Command for git clone with habitat.
maintainer: example@gmail.com
format: habitat
habitat:
    mode: remote
    package: core/git/2.14.1
    command:  git clone
```

## Usage

```bash
$ npm install screwdriver-command-validator
```

Validate in Node.js:

```javascript
const fs = require('fs');  // standard fs module
const validator = require('screwdriver-command-validator');

// The "example.yaml" is the YAML described above
validator(fs.readFileSync('example.yaml'))
    .then((commandData) => {
        console.log(commandData);
    });
```

Output of the console.log():

```javascript
config: {
    description: 'SD Command for git clone with habitat.',
    maintainer: 'example@gmail.com',
    name: 'git',
    namespace: 'clone',
    version: '1.0',
    format: 'habitat',
    habitat: {
        mode: 'remote',
        package: 'core/git/2.14.1',
        command: 'git clone'
    }
}
```

Validate in CLI:
```bash
$ ./node_modules/.bin/command-validate -h

  Usage: validate [options]


  Options:

    -j, --json         output with JSON
    -f, --file [name]  screwdriver command file (default: ./sd-command.yaml)
    -h, --help         output usage information

$ ./node_modules/.bin/command-validate -j
{"valid":true}
```

## Testing

```bash
npm test
```

## License

Code licensed under the BSD 3-Clause license. See LICENSE file for terms.

[npm-image]: https://img.shields.io/npm/v/screwdriver-command-validator.svg
[npm-url]: https://npmjs.org/package/screwdriver-command-validator
[downloads-image]: https://img.shields.io/npm/dt/screwdriver-command-validator.svg
[license-image]: https://img.shields.io/npm/l/screwdriver-command-validator.svg
[issues-image]: https://img.shields.io/github/issues/screwdriver-cd/command-validator.svg
[issues-url]: https://github.com/screwdriver-cd/command-validator/issues
[status-image]: https://cd.screwdriver.cd/pipelines/410/badge
[status-url]: https://cd.screwdriver.cd/pipelines/410
[daviddm-image]: https://david-dm.org/screwdriver-cd/command-validator.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/screwdriver-cd/command-validator
