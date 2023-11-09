"use strict";

const express = require('express');
const app = express();

require('dotenv').config({ path: '../.env' });

const cors = require('cors');

const db = require("./service/db");

const api = require('./routes/api');

const corsOrigin = `http://localhost:${process.env.FRONTEND_PORT}`
console.info(`[BACKEND-SERVER] CORS requests allowed from ${corsOrigin}`);
const corsOptions = {
    origin: [corsOrigin],
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api);

const connectDB = async () => {
    console.info('[BACKEND-SERVER] Attempting to connect to the database server');

    let isConnected = false;
    while (!isConnected) {
        try {
            await db.connect();
            console.info('[BACKEND-SERVER] Connected to the database successfully');
            isConnected = true;
        } catch (e) {
            console.error('[BACKEND-SERVER] Failed to connect to the database, retrying in 1 second');
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

connectDB()
    .then(() => {
        app.listen(process.env.BACKEND_SERVER_PORT, () => {
            console.info(`[BACKEND-SERVER] Server is listening on port ${process.env.BACKEND_SERVER_PORT}`);
        });
    })
    .catch((e) => {
        console.error('[BACKEND-SERVER] Failed to startup the server');
        console.error(e);
        process.exit(1);
    });

// TODO : testing db connection