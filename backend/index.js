"use strict";

const express = require('express');
const app = express();

const config = require('./config.json');

const cors = require('cors');

const api = require('./routes/api');

const corsOptions = {
    origin: ['http://localhost:3000'],
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

app.listen(config.BACKEND_SERVER_PORT, () => {
    console.info('[BACKEND-SERVER] Server successfully started on port ' + config.BACKEND_SERVER_PORT);
});