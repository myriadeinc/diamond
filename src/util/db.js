'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const Sequelize = require('sequelize');

delete require('pg').native;

const getOptions = (opt, log) => {
  if (opt.dialect_options) {
    opt.dialectOptions = opt.dialect_options;
    delete opt.dialect_options;
  }

  const Options = _.defaults({}, opt, {
    dialect: 'postgres',
    database: 'postgres',
    username: null,
    password: null,
    logging: false,
    define: {
      freezeTableName: true,
      paranoid: true,
      timestamps: true,
    },
    migrations: {
      model_name: 'Migration',
    },
    operatorsAliases: false,
  });

  Options.define.schema = Options.schema;
  delete Options.schema;

  if (Options.logging && log) {
    Options.logging = log;
  }
  return Options;
};

const initSchema = async (log) => {
  const schemaName = Options.define.schema;
  const res = await DB.sequelize.query(`SELECT schema_name FROM `+
  ` information_schema.schemata `+
  `WHERE schema_name = '${schemaName}'`,
  {type: DB.sequelize.QueryTypes.SELECT});

  if (0 === res.length) {
    log.info(`Schema ${schemaName} does not exist, creating it now`);
    await DB.sequelize.createSchema(`"${schemaName}"`);
  }
};

const initModels = async (modelPath, log) => {
  const modelFiles = fs.readFileSync(modelPath);
  for (const file of modelFiles) {
    const filePath = path.resolve(modelPath, file);
    try {
      const model = require(filePath);
      if (model.sequelize && model.name) {
        DB.Model[model.name] = model;
        log.info('Loaded DB model:', model.name);
      }
    } catch (err) {
      log.info('Unable to load DB model:', model.name);
    }
  }
};

const DB = {

  Sequelize: Sequelize,
  sequelize: {},
  umzug: {},
  Model: {},

  init: async (opt = null, log = null) => {
    DB.sequelize = new Sequelize(getOptions(opt, log));
    await initSchema(log);
    await initModels(opt.model_path, log);
  },

  close: async () => {
    await DB.sequelize.connectionManager.close();
  },
};

module.exports = DB;
