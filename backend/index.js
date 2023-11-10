"use strict";

const dotenv = require('dotenv')
const app = require("./app");
const db = require("./service/db");

dotenv.config({ path: '../.env' });

console.info('[BACKEND-SERVER] Connecting to Postgres database at ' + process.env.DB_HOST + ':5432 using username: ' + process.env.DB_USER);
db.connect()
    .then(() =>  {
        console.info('[BACKEND-SERVER] Database connection established')
        app.listen(process.env.BACKEND_SERVER_PORT, () => {
            console.info('[BACKEND-SERVER] Server started and listening on port ' + process.env.BACKEND_SERVER_PORT);
        });
    })
    .catch(err => {
        console.error('[BACKEND-SERVER] Error connecting to database', err.stack)
        process.exit(1);
    });
