"use strict";

const { fork } = require('child_process');

const dotenv = require('dotenv')
const app = require("./app");
const db = require("./service/db");

dotenv.config({ path: '../.env' });

/**
 * Create a child process to run the crono jobs in the background.
 * Scheduling the crono jobs in the main thread would block the server
 * and prevent it from responding to requests if an unhandled issue happens in crono jobs.
 * The crono jobs are run in a separate process to prevent them from
 * blocking the main thread.
 *
 * @type {ChildProcess}
 */
const cronoProcess = fork('./crono/index.js');

cronoProcess.on('message', (msg) => {
    if (msg === 'crono-ready') {
        console.info('[BACKEND-SERVER] Received ready message from crono process.');
    }
});

cronoProcess.on('exit', (err) => {
    console.info('[BACKEND-SERVER] Crono process exited with code ' + err);
});

console.info('[BACKEND-SERVER] Connecting to Postgres database at ' + process.env.DB_HOST + ':5432');
db.connect()
    .then(() =>  {
        console.info('[BACKEND-SERVER] Database connection established')
        app.listen(process.env.REACT_APP_BACKEND_SERVER_PORT, () => {
            console.info('[BACKEND-SERVER] Server started and listening on port ' + process.env.REACT_APP_BACKEND_SERVER_PORT);
        });
    })
    .catch(err => {
        console.error('[BACKEND-SERVER] Error connecting to database', err.stack)

        // if the crono process is alive kill it before exiting
        if (cronoProcess.connected && !cronoProcess.killed)
            cronoProcess.kill();

        process.exit(1);
    });
