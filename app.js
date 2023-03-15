'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const logger = require('./logger.js');

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const bodyParser = require('body-parser');

const readFile = promisify(fs.readFile);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const greeting = process.env.GREETING;

app.use('/api/greeting', (request, response) => {
  const name = (request.query && request.query.name) ? request.query.name : 'World';

  if (!greeting) {
    response.status(500);
    return response.send({ content: 'no config map' });
  }

  logger.debug('Replying to request, parameter={}', name);
  return response.send({ content: greeting.replace(/%s/g, name) });
});

// Add basic health check endpoints
app.use('/ready', (request, response) => {
  return response.sendStatus(200);
});

app.use('/live', (request, response) => {
  return response.sendStatus(200);
});

module.exports = app;
