const Pool = require("pg").Pool;
require("dotenv").config();
const devConfig = `postgresql://${process.env.dbUserUp}:${process.env.dbPassUp}@${process.env.dbHostUp}:${process.env.dbPortUp}/${process.env.dbNameUp}`;

const pool = new Pool({
  connectionString: devConfig,
});

module.exports = pool;
