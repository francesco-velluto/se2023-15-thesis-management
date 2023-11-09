"use strict";

require('dotenv').config({path:'../.env'})
const { Client } = require('pg');

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'Thesis-Management-System',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

console.info('[BACKEND-SERVER] Connecting to Postgres database at ' + process.env.DB_HOST + ':5432 using username: ' + process.env.DB_USER);
db.connect()
    .then(() => console.info('[BACKEND-SERVER] Database connection established'))
    .catch(err => {
        console.error('[BACKEND-SERVER] Error connecting to database', err.stack)
        process.exit(1);
    });

module.exports = db;