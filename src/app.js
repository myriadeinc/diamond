'use strict';

const express = require('express');
const routes = require('src/routes');
const bodyParser = require('body-parser');
const config = require("src/util/config.js");
const metrics = require('src/util/metrics.js');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Cache-Control, Pragma, Origin, '+
      'Authorization, Content-Type, '+
      ' X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

app.enable('trust proxy');
app.disable('x-powered-by');
app.use(bodyParser.json());


app.use('/v1', routes);

app.get('/healthcheck', (req, res, next) => {
  const route = req.originalUrl;
  const end = metrics.httpRequestDurationMicroseconds.startTimer();
  res.sendStatus(200);
  end({ route, code: res.statusCode, method: req.method })
});

app.get('/prometheus', async (req, res) => {


  const a = await metrics.registry.metrics()
  console.dir(a)
  // res.end('as')
  // res.setHeader('Content-Type', metrics.registry.contentType)
  res.send(a)
});
module.exports = app;
