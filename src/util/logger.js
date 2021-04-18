'use strict';
const bunyan = require('bunyan')
, bformat = require('bunyan-formatter')  
, formatOut = bformat({ outputMode: 'short', level: 'debug'});

const gelfStream = require('gelf-stream')
const config = require('src/util/config.js');

const gelfHost = config.get('fluentd_host') || 'localhost';
const gelfPort = config.get('fluentd_port') || 9999;

let streams = [];
streams.push({ stream: formatOut });
if(config.get('prod_logging')){
  streams.push({
    stream: gelfStream.forBunyan(gelfHost, gelfPort),
    type: 'raw'
  })
}


const logger = bunyan.createLogger({
  name: 'Diamond',
  streams
});

module.exports = {
  core: logger.child({component: 'core'}),
  db: logger.child({component: 'db'}),
  auth: logger.child({component: 'auth'}),
  account: logger.child({component: 'account'}),
};
