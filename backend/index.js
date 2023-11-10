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

// set up of the authentication
const authentication = require('./controllers/authentication');
authentication.inializeAuthentication(app);     // it should be set before the route settings

app.use('/api', api);

app.listen(process.env.BACKEND_SERVER_PORT, () => {
    console.info('[BACKEND-SERVER] Server successfully started on port ' + process.env.BACKEND_SERVER_PORT);
});