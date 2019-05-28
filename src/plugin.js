/*
 * Copyright 2019 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

const fp = require('fastify-plugin')
const CRE = require('check-runtime-env') // get Checkers definition and related utilities

function fastifyCheckRuntimeEnv (fastify, options, next) {
  const {
    onNodeVersionMismatch = 'exception',
    nodeVersionCheckAtStartup = true
    // TODO: check if handle here even nodeVersion and nodeVersionExpected, with defaults ... wip
  } = options
  ensureIsString(onNodeVersionMismatch, 'onNodeVersionMismatch')
  ensureIsBoolean(nodeVersionCheckAtStartup, 'nodeVersionCheckAtStartup')

  // execute plugin code
  fastify.decorate('CheckRuntimeEnv', CRE)

  if (nodeVersionCheckAtStartup === true) {
    try {
      // TODO: check if this is enough (probably not) ... wip
      CRE.checkVersionOfNode()
    } catch (e) {
      console.log(e) // TODO: temp ... wip
      switch (onNodeVersionMismatch) {
        case 'warning':
          // TODO: use fastify log for a warning (or an error) ...
          break
        case 'exception':
          throw e
          // break // unreachable
        case 'exit':
          // TODO: exit with a error code ... wip
          break // temp ...
          // break // unreachable
        default:
          throw new Error(`Illegal value for serverUrlMode: '${onNodeVersionMismatch}'`)
      }
    }
  }

  next()
}

function ensureIsString (arg, name) {
  if (arg !== null && typeof arg !== 'string') {
    throw new TypeError(`The argument '${name}' must be a string, instead got a '${typeof arg}'`)
  }
}

function ensureIsBoolean (arg, name) {
  if (arg !== null && typeof arg !== 'boolean') {
    throw new TypeError(`The argument '${name}' must be a boolean, instead got a '${typeof arg}'`)
  }
}

module.exports = fp(fastifyCheckRuntimeEnv, {
  fastify: '^2.1.0',
  name: 'fastify-check-runtime-env'
})
