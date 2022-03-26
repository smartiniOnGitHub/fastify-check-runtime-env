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

const fastify = require('fastify')()

const k = {
  protocol: 'http',
  address: '0.0.0.0',
  port: 3000
}

const engines = require('../package.json').engines

// register plugin with some options (as a sample)
fastify.register(require('../src/plugin'), {
  // nodeStrictCheckAtStartup: true, // same as default
  nodeVersionCheckAtStartup: true,
  nodeVersionExpected: engines.node
  // onCheckMismatch: 'exception' // throw an exception // same as default
})

// example to handle a sample home request to serve a static page, optional here
fastify.get('/', function (req, reply) {
  const path = require('path')
  const scriptRelativeFolder = path.join(__dirname, path.sep)
  const fs = require('fs')
  const stream = fs.createReadStream(path.join(scriptRelativeFolder, 'home.html'))
  reply.type('text/html; charset=utf-8').send(stream)
})

fastify.listen(k.port, k.address, (err, address) => {
  if (err) throw err
  console.log(`Server listening on ${address}`)
})

fastify.ready(() => {
  const routes = fastify.printRoutes()
  console.log(`Available Routes:\n${routes}`)
})
