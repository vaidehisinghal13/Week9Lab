const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();

const app = express();
const port = 3000;

// create a pool connection to PostgreSQL
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
  ssl: { rejectUnauthorized: false } // needed for remote TAMU DB
});

// graceful shutdown when you stop the server
process.on('SIGINT', function () {
  pool.end();
  console.log('Application successfully shutdown');
  process.exit(0);
});

app.set('view engine', 'ejs');

// home page route
app.get('/', (req, res) => {
  const data = { name: 'Vaidehi' };
  res.render('index', data);
});

// user page route – queries database
app.get('/user', (req, res) => {
  let teammembers = [];
  pool.query('SELECT * FROM teammembers;')
    .then(query_res => {
      for (let i = 0; i < query_res.rowCount; i++) {
        teammembers.push(query_res.rows[i]);
      }
      const data = { teammembers: teammembers };
      console.log(teammembers);
      res.render('user', data);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
