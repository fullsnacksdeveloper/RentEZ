const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rentez_app',
  password: 'tamii',
  port: 5432
});

module.exports = pool;