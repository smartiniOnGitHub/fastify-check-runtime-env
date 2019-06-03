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

const assert = require('assert')
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
  t.plan(4)
  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(require('../src/plugin')) // configure this plugin with its default options

  fastify.listen(0, (err) => {
    t.error(err)

    t.comment('testing decorators')
    // ensure CheckRuntimeEnv constructor function exist in Fastify decorators ...
    t.ok(fastify.hasDecorator('CheckRuntimeEnv'))
    const CRE = fastify.CheckRuntimeEnv
    // optional, add some assertions with standard Node.js assert statements, as a sample
    assert(CRE !== null)
    assert(typeof CRE === 'function')
    t.ok(CRE)
    t.strictEqual(typeof CRE, 'function')
  })
})

test('ensure objects exported by index script, exists and are of the right type', (t) => {
  t.plan(5)

  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  fastify.register(require('../src/plugin')) // configure this plugin with its default options

  fastify.listen(0, (err) => {
    t.error(err)

    t.comment('testing RuntimeEnvChecker class')
    const REC = fastify.CheckRuntimeEnv
    t.ok(REC)
    t.strictEqual(typeof REC, 'function')
    t.ok(engines)

    t.throws(function () {
      const rec = new REC()
      assert(rec === null) // never executed
    }, Error, 'Expected exception when creating a RuntimeEnvChecker instance')
  })
})

test('ensure plugin instancing with node version check works well', (t) => {
  t.plan(1)

  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  /*
  // TODO: cleanup test code ... wip
  t.throws(function () {
    fastify.register(plugin, {
      nodeVersionCheckAtStartup: true
    }) // configure this plugin with some custom options
    assert(plugin !== null) // never executed
  }, Error, 'Expected exception when registering the plugin with wrong options')
   */
  /*
  // TODO: cleanup test code ... wip
  try {
    fastify.register(plugin, {
      nodeVersionCheckAtStartup: true
    }) // configure this plugin with some custom options
    assert(plugin !== null) // never executed
  } catch (e) {
    t.error(e)
  }
   */
  fastify.register(plugin, {
    nodeVersionCheckAtStartup: true,
    // TODO: try even without nodeVersionExpected ... wip
    nodeVersionExpected: engines.node
    // nodeVersionExpected: '>=16.0.0' // TODO: try even with a failure test ... wip
  }) // configure this plugin with some custom options
  assert(plugin !== null) // never executed

  fastify.listen(0, (err) => {
    t.error(err)
    t.comment('testing RuntimeEnvChecker with node version check at startup')
  })
})

test('ensure plugin instancing with node version check works well', (t) => {
  t.plan(4)

  const fastify = Fastify()
  t.tearDown(fastify.close.bind(fastify))
  // t.tearDown(fastify.close())

  // TODO: check if/how to handle async errors here ... wip
  /*
  // t.throws(function () {
  t.rejects(async function () {
  // t.expectUncaughtException(async function () {
    / *
    try {
      // await fastify.register(plugin, {
      fastify.register(plugin, {
        nodeVersionCheckAtStartup: true
        // do not specify nodeVersionExpected, so exception expected
      }) // configure this plugin with some custom options
      assert(plugin !== null) // never executed
    } catch (e) {
      t.error(e)
      t.comment('testing RuntimeEnvChecker with node version check at startup')
      throw e
    }
     * /
    await fastify.register(plugin, {
      nodeVersionCheckAtStartup: true
      // do not specify nodeVersionExpected, so exception expected
    }) // configure this plugin with some custom options
    assert(plugin !== null) // never executed

    fastify.listen(0, (err) => {
      t.error(err)
      t.comment('testing RuntimeEnvChecker with node version check at startup')
    })
  }, Error, 'Expected exception when registering the plugin with wrong options')
  // })
   */
  fastify.register(plugin, {
    nodeVersionCheckAtStartup: true
    // do not specify nodeVersionExpected, so exception expected
  }) // configure this plugin with some custom options
  // }).after((err) => {
  fastify.after((err) => {
    // t.comment('after: ' + err) // TODO: temp ...
    // t.error(err)
    t.ok(err)
    t.strictEqual(typeof err, 'object')
    t.strictEqual(err.message, `RuntimeEnvChecker - the string 'expectedVersion' must be not empty`)
    // if (err) throw err
    // t.comment('after: end') // TODO: temp ...
  })
  assert(plugin !== null) // never executed
  // t.ok(plugin)

  fastify.listen(0, (err) => {
    // t.comment(('listen: ' + err)) // TODO: temp ...
    t.error(err)
    // t.ok(err)
    t.comment('testing RuntimeEnvChecker with node version check at startup')
    // if (err) t.threw(err)
    // t.comment('listen: end') // TODO: temp ...
  })
  // t.end()
})
