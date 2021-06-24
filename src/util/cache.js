'use strict';

const redis = require('promise-redis')();
const _ = require('lodash');


let redisClient;

const Cache = {

  init: async (conf) => {
    redisClient = await redis.createClient(conf);
  },

  parse: (rawString) => {
    let val = rawString;
    try {
      val = JSON.parse(val);
    } catch (err) {}
    return val;
  },

  stringify: (value) => {
    let val = value;
    if (!_.isString(val)) {
      val = JSON.stringify(val);
    }
    return val;
  },

  put: (key, value, namespace='') => {
    const prefixed_key = `${namespace}::${key}`;
    // For now, set expiry to 1 hour
    return redisClient.set(prefixed_key, Cache.stringify(value),"EX", 3600);
  },

  get: (key, namespace='') => {
    const prefixed_key = `${namespace}::${key}`;
    return redisClient.get(prefixed_key)
      .then((res) => {
        return Cache.parse(res);
      });
  },

  delete: (key, namespace='') => {
    const prefixed_key = `${namespace}::${key}`;
    return redisClient.del(prefixed_key);
  },

  close: () => {
    redisClient.quit();
  },
};

module.exports = Cache;
