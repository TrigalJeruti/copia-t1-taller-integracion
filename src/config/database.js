require('dotenv').config();

const config = {
    default: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: process.env.DB_DIALECT || 'postgres',
      database: process.env.DB_NAME,
      host: process.env.DB_HOST || '127.0.0.1',
    },
    development: {
      extend: 'default',
      database: process.env.DB_NAME,
    },
    test: {
      extend: 'default',
      database: process.env.DB_NAME,
    },
    production: {
      extend: 'default',
      use_env_variable: 'DATABASE_URL',
    },
  };
  
  Object.keys(config).forEach((configKey) => {
    const configValue = config[configKey];
    if (configValue.extend) {
      config[configKey] = { ...config[configValue.extend], ...configValue };
    }
  });
  
  module.exports = config;







/* const { Sequelize } = require('sequelize');

const db = new Sequelize( 'tarea1tallerint', 'postgres', 'cmhtd281', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = db; */