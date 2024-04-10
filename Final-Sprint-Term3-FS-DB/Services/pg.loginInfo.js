const { Pool } = require('pg');

const poolConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const createdPool = new Pool(poolConfig);

module.exports = createdPool;