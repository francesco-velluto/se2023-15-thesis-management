"use strict";

const express = require('express');
const cors = require('cors');
const api = require('./routes/api');

const app = express();

const corsOptions = {
    origin: [`http://localhost:${process.env.FRONTEND_PORT}`],
    credentials: true
}

console.info('[BACKEND-SERVER] Allowing CORS requests from http://localhost:' + process.env.FRONTEND_PORT);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);

module.exports = app;
