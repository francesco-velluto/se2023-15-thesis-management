"use strict";

require('dotenv').config()
const { Client } = require('pg');

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'Thesis-Management-System',
    password: process.env.DB_PASSORWORD,
    port: 5432,
});

db.connect();

module.exports = db;