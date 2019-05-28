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

For example, a common use case is to throw an exception at application startup, 
if Node.js version is not compatible with the one set in `package.json`.

Note that all Chechers features exposed here are in the the library [check-runtime-env](https://npmjs.org/package/check-runtime-env/).


## Usage

TODO: ...


In the [example](./example/) folder there are some simple server scripts 
that uses the plugin (inline but it's the same using it from npm registry).


## Requirements

Fastify ^2.1.0 , Node.js 8 LTS (8.9.x) or later.


## Note

The plugin decorate Fastify and expose some functions:
- `CheckRuntimeEnv`, the checkers implementation, as a class (RuntimeEnvChecker)

Plugin options are:
- `onNodeVersionMismatch`, define what to do if Node.js version 
  does not match with the expected one; by default 'exception' to raise an Error, 
  but could be 'warning' (to log a message in Fastify logs), 
  or 'exit' (to stop current Node.js process)
- `nodeVersionCheckAtStartup` flag to tell (when true) to check Node.js version 
  at application startup; by default true

all plugin options are optional, and have a default value.


## License

Licensed under [Apache-2.0](./LICENSE).

----
