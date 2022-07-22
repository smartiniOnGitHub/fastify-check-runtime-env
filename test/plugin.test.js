/*
 * Copyright 2019-2022 the original author or authors.
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

const assert = require('assert').strict
const test = require('tap').test
// const sget = require('simple-get').concat
const Fastify = require('fastify')

const nodeVersion = process.version
assert(nodeVersion !== null)
const engines = require('../package.json').engines
assert(engines !== null)

const plugin = require('../src/plugin')
assert(plugin !== null)

test('ensure decorator functions (exposed by the plugin) exists', (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(require('../src/plugin')) // configure this plugin with its default options

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)

    t.comment('testing decorators')
    // ensure CheckRuntimeEnv constructor function exist in Fastify decorators ...
    t.ok(fastify.hasDecorator('CheckRuntimeEnv'))
    const CRE = fastify.CheckRuntimeEnv
    // optional, add some assertions with standard Node.js assert statements, as a sample
    assert(CRE !== null)
    assert(typeof CRE === 'function')
    t.ok(CRE)
    t.equal(typeof CRE, 'function')

    t.end()
  })
})

test('ensure objects exported by index script, exists and are of the right type', (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(require('../src/plugin')) // configure this plugin with its default options

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)

    t.comment('testing RuntimeEnvChecker class')
    const REC = fastify.CheckRuntimeEnv
    t.ok(REC)
    t.equal(typeof REC, 'function')
    t.ok(engines)

    t.throws(function () {
      const rec = new REC()
      assert(rec === null) // never executed
    }, Error, 'Expected exception when creating a RuntimeEnvChecker instance')

    t.end()
  })
})

test('ensure plugin instancing with node version check works well', (t) => {
  t.comment('testing RuntimeEnvChecker with node version check at startup')
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(plugin, {
    nodeVersionCheckAtStartup: true,
    nodeVersionExpected: engines.node
  }) // configure this plugin with some custom options
  assert(plugin !== null) // to ensure execution flow is right here

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!err)
    t.end()
  })
})

test('ensure plugin instancing with node version check works well, to handle failure (missing mandatory parameter)', (t) => {
  t.comment('testing RuntimeEnvChecker with node version check at startup')
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(plugin, {
    nodeVersionCheckAtStartup: true
    // do not specify nodeVersionExpected, so exception expected
  }) // configure this plugin with some custom options
  fastify.after((err) => {
    t.ok(err)
    t.equal(typeof err, 'object')
    t.equal(err.message, 'RuntimeEnvChecker - the string \'expectedVersion\' must be not empty')
  })
  assert(plugin !== null) // to ensure execution flow is right here

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!err)
    t.end()
  })
})

test('ensure plugin instancing with node version check works well, to handle failure (not satisfying version)', (t) => {
  t.comment('testing RuntimeEnvChecker with node version check at startup')
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })
  fastify.register(plugin, {
    nodeVersionCheckAtStartup: true,
    // specify a nodeVersionExpected but not satisfied, so exception expected
    nodeVersionExpected: '<=14.15.0 >=200.0.0'
  }) // configure this plugin with some custom options
  fastify.after((err) => {
    t.ok(err)
    t.equal(typeof err, 'object')
    t.ok(err.message)
    t.ok(err.message.startsWith('RuntimeEnvChecker - found version'))
    t.ok(err.message.endsWith('expected version \'<=14.15.0 >=200.0.0\''))
  })
  assert(plugin !== null) // to ensure execution flow is right here

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!err)
    t.end()
  })
})

test('ensure plugin instancing with node version check (but warnings as outcome), works well', (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  t.comment('testing RuntimeEnvChecker with node version check at startup')
  fastify.register(plugin, {
    nodeStrictCheckAtStartup: true, // same as default
    nodeVersionCheckAtStartup: true,
    nodeVersionExpected: engines.node,
    onCheckMismatch: 'warning' // log a warning
  }) // configure this plugin with some custom options
  assert(plugin !== null) // to ensure execution flow is right here

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!err)

    t.comment('testing RuntimeEnvChecker (inner) feature that return a boolean')
    const CRE = fastify.CheckRuntimeEnv
    t.ok(CRE)
    const compatible = CRE.isVersionCompatible(nodeVersion, engines.node)
    t.strictSame(compatible, true)

    t.end()
  })
})

test('ensure plugin instancing with node version check (but warnings as outcome), works well, to handle failure (not satisfying version) without exception', (t) => {
  const fastify = Fastify()
  t.teardown(() => { fastify.close() })

  t.comment('testing RuntimeEnvChecker with node version check at startup')
  fastify.register(plugin, {
    nodeStrictCheckAtStartup: true, // same as default
    nodeVersionCheckAtStartup: true,
    nodeVersionExpected: '<=14.15.0 >=200.0.0',
    onCheckMismatch: 'warning' // log a warning
  }) // configure this plugin with some custom options
  assert(plugin !== null) // to ensure execution flow is right here

  fastify.listen({ port: 0 }, (err, address) => {
    t.error(err)
    t.ok(!err)

    t.comment('testing RuntimeEnvChecker (inner) feature that return a boolean')
    const CRE = fastify.CheckRuntimeEnv
    // t.ok(CRE)
    const compatible = CRE.isVersionCompatible(nodeVersion, '<=14.15.0 >=200.0.0')
    t.strictSame(compatible, false)

    // additional tests, to show generic boolean checker usage
    t.throws(function () {
      const checkCompatible = CRE.checkBoolean(compatible)
      assert(checkCompatible === false) // never executed
    }, Error, 'Expected exception when checking a false boolean value/condition')

    // check strict mode
    // long way
    const safe = CRE.isStrictMode()
    t.ok(safe)
    t.equal(safe, true)
    const ensureSafeMode = CRE.checkBoolean(safe)
    t.ok(ensureSafeMode)
    // short way
    const checkSafeMode = CRE.checkStrictMode()
    t.ok(checkSafeMode)

    // additional tests, to test ESModule detection/checker
    const isESModuleThisSource = CRE.isESModule(__filename)
    t.notOk(isESModuleThisSource)
    const isESModuleThisProject = CRE.isESModule(null, __dirname)
    t.notOk(isESModuleThisProject)
    const isESModuleThisSourceOrThisProject = CRE.isESModule(__filename, __dirname)
    t.notOk(isESModuleThisSourceOrThisProject)
    t.throws(function () {
      const ensureIsESMod = CRE.checkESModule(__filename, __dirname)
      assert(ensureIsESMod === true) // never executed, but false anyway
    }, Error, 'Expected exception when checking for ES Module on a non-esm source/folder')

    t.end()
  })
})
