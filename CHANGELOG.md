# Change Log

## [4.0.0](https://github.com/smartiniOnGitHub/fastify-healthcheck/releases/tag/4.0.0) (2022-07-22)
[Full Changelog](https://github.com/smartiniOnGitHub/fastify-healthcheck/compare/3.0.0...4.0.0)
Summary Changelog:
- Updated requirements to Fastify '^4.0.0' and Fastify-plugin '^4.0.0'; 
  update code with related changes
- Updated all dependencies to latest (for Node.js 14 LTS)
- Use 'check-runtime-env' latest release ('~0.4.0') with new features
- Update and simplified example and test code
- Update documentation from sources with JSDoc

## [3.0.0](https://github.com/smartiniOnGitHub/fastify-check-runtime-env/releases/tag/3.0.0) (2022-03-27)
Summary Changelog:
- Update dependencies to Fastify 3.x (and Node.js 10 LTS)
- Use 'check-runtime-env' latest release ('~0.3.0') with new features
- Ensure all works again

## [0.2.0](https://github.com/smartiniOnGitHub/fastify-check-runtime-env/releases/tag/0.2.0) (2022-03-27)
Summary Changelog:
- Update dependencies, but keep compatibility with Fastify 2.x (and Node.js 8 LTS)
- Use 'check-runtime-env' latest release ('~0.3.0') with new features
- Use Node.js assertions but in strict mode now
- Ensure all works again
- Feature: add new plugin option 'nodeStrictCheckAtStartup' 
  to check if JavaScript is in strict mode (by default true) 
  otherwise an exception will be raised at plugin startup 
  (safer option, to be sure to use modern code/settings)
- Breaking Change: rename plugin option 'onNodeVersionMismatch' 
  into 'onCheckMismatch'; now this setting defines the behavior for checker 
  failures on 'nodeStrictCheckAtStartup' and 'nodeVersionCheckAtStartup' options
- Note: this is last release for Fastify 2.x

## [0.1.0](https://github.com/smartiniOnGitHub/fastify-check-runtime-env/releases/tag/0.1.0) (2019-06-06)
Summary Changelog:
- First release
- Decorate Fastify with checkers and verifiers from
  [check-runtime-env](https://npmjs.org/package/check-runtime-env/) release '~0.2.0'
- Implement Node.js version check at startup (by default false), with some options

----
