"use strict";

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const api = require('./routes/api');

const app = express();

const corsOptions = {
    origin: [`http://localhost:${process.env.FRONTEND_PORT}`],
    credentials: true
}

console.info('[BACKEND-SERVER] Allowing CORS requests from http://localhost:' + process.env.FRONTEND_PORT);
app.use(cors(corsOptions));

app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up of the authentication
const authentication = require('./controllers/authentication');
authentication.inializeAuthentication(app);     // it should be set before the route settings

app.use('/api', api);

module.exports = app;
