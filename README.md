# fastify-check-runtime-env

  [![NPM Version](https://img.shields.io/npm/v/fastify-check-runtime-env.svg?style=flat)](https://npmjs.org/package/fastify-check-runtime-env/)
  [![NPM Downloads](https://img.shields.io/npm/dm/fastify-check-runtime-env.svg?style=flat)](https://npmjs.org/package/fastify-check-runtime-env/)
  [![Code Style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
  [![Coverage Status](https://coveralls.io/repos/github/smartiniOnGitHub/fastify-check-runtime-env/badge.svg?branch=master)](https://coveralls.io/github/smartiniOnGitHub/fastify-check-runtime-env/?branch=master)
  [![dependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-check-runtime-env/status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-check-runtime-env)
  [![devDependencies Status](https://david-dm.org/smartiniOnGitHub/fastify-check-runtime-env/dev-status.svg)](https://david-dm.org/smartiniOnGitHub/fastify-check-runtime-env?type=dev)

Fastify Plugin to check runtime environment properties


The purpose of this plugin is to let Fastify web applications do some checks 
on some properties available at runtime (for example at application startup).
By default any checker method that doesn't satisfy its condition 
will throw `Error`, but in some cases this is configurable via plugin options.

Note that all Chechers features exposed here are in the the library [check-runtime-env](https://npmjs.org/package/check-runtime-env/).
For Semantic Versioning checks, see [semver](https://npmjs.org/package/semver/).


## Usage

A common use case is to throw an exception at application startup, 
if Node.js version is not compatible with the one set in `package.json`.

```js
const fastify = require('fastify')()
const engines = require('../package.json').engines

// register plugin with some options
fastify.register(require('fastify-check-runtime-env'), {
  // nodeStrictCheckAtStartup: true, // same as default
  nodeVersionCheckAtStartup: true,
  nodeVersionExpected: engines.node
  // nodeVersionExpected: '<=10.13.0 >=200.0.0', // sample failing test
  // onCheckMismatch: 'exception' // throw an exception // same as default
})

fastify.listen(3000)
// curl http://127.0.0.1:3000/ => returning the home page, if current Node.js versio in compatible with the expected one
```

In the [example](./example/) folder there are some simple server scripts 
that uses the plugin (inline but it's the same using it from npm registry).


## Requirements

Fastify ^3.3.0 , Node.js 10 LTS (10.13.0) or later.

Note that plugin releases 0.x are for Fastify 2.x, 3.x are for Fastify 3.x, etc.


## Note

The plugin decorate Fastify and expose some functions:
- `CheckRuntimeEnv`, the checkers implementation, as a class (RuntimeEnvChecker); 
  but note that to use it you need to wait for this plugin to be 
  fully loaded and initialized

Plugin options are:
- `onCheckMismatch`, define what to do if a checker fails (Node.js version 
  does not match with the expected one, JavaScript not in strict mode, etc); 
  by default 'exception' to raise an Error, 
  but could be 'warning' (to log a message in Fastify logs), 
  or 'exit' (to stop current Node.js process) with exit code 1
- `nodeStrictCheckAtStartup`, flag to tell (when true) to check JavaScript 
  strict mode; by default true (safer and already enforced as default mode 
  in modern JavaScript code using classes, ES Modules, etc)
- `nodeVersionCheckAtStartup`, flag to tell (when true) to check Node.js version 
  at application startup; by default false
- 'nodeVersion' the current Node.js version (by default 'process.version')
- `nodeVersionExpected`, the semver string with the expected Node.js version (by default empty, so must be manually provided, for example reading 'package.json' attribute 'engines.node' if specified)

all plugin options are optional, and have a default value.


## License

Licensed under [Apache-2.0](./LICENSE).

----
