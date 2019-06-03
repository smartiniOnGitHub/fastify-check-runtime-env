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
    nodeVersionCheckAtStartup = false,
    nodeVersion = process.version,
    nodeVersionExpected = ''
  } = options
  ensureIsString(onNodeVersionMismatch, 'onNodeVersionMismatch')
  ensureIsBoolean(nodeVersionCheckAtStartup, 'nodeVersionCheckAtStartup')
  ensureIsString(nodeVersion, 'nodeVersion')
  // ensureIsString(nodeVersionExpected, 'nodeVersionExpected')

  // execute plugin code
  fastify.decorate('CheckRuntimeEnv', CRE)

  let err = null
  if (nodeVersionCheckAtStartup === true) {
    try {
      CRE.checkVersionOfNode(nodeVersion, nodeVersionExpected)
    } catch (e) {
      err = e
      console.log(e) // TODO: temp ... wip
      switch (onNodeVersionMismatch) {
        case 'warning':
          fastify.log.warn(e)
          break
        case 'exception':
          // throw e
          // break // unreachable
          // next(e) // TODO: check if right, and if/how to avoid last next call at bottom ... wip
          break
        case 'exit':
          fastify.log.fatal(e)
          process.exit(1)
          // break // unreachable
        default:
          throw new Error(`Illegal value for serverUrlMode: '${onNodeVersionMismatch}'`)
      }
    }
  }

  next(err)
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
