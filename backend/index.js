"use strict";

const express = require('express');
const morgan = require('morgan');

const app = express();

require('dotenv').config({ path: '../.env' });

const cors = require('cors');

const db = require("./service/db");

const api = require('./routes/api');

console.info('[BACKEND-SERVER] Allowing CORS requests from http://localhost:' + process.env.FRONTEND_PORT);
const corsOptions = {
    origin: [`http://localhost:${process.env.FRONTEND_PORT}`],
    credentials: true
}

app.use(cors(corsOptions));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

// set up of the authentication
const authentication = require('./controllers/authentication');
authentication.inializeAuthentication(app, db);

// TODO: testing the authentication service
const { authUser } = require('./service/authentication');
authUser("david.lee@example.com", "S003");
authUser("chen.li@example.com", "T004");


app.listen(process.env.BACKEND_SERVER_PORT, () => {
    console.info('[BACKEND-SERVER] Server started and listening on port ' + process.env.BACKEND_SERVER_PORT);
});

// TODO : testing db connection
