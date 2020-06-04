require('dotenv').config();

module.exports = {
  // If using onine database
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres'
  },

  // development: {
  //   database: process.env.DEV_DB_DATABASE,
  //   username: process.env.DEV_DB_USER,
  //   password: process.env.DEV_DB_PASSWORD,
  //   host: '127.0.0.1',
  //   dialect: 'postgres'
  // },

  test: {
    database: process.env.TEST_DB_DATABASE,
    username: process.env.TEST_DB_USER,
    password: process.env.TEST_DB_PASSWORD,
    host: process.env.TEST_DB_HOST,
    dialect: 'postgres'
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  }
};
