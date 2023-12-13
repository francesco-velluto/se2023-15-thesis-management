"use strict";

require('dotenv').config({path:'../.env'})
const { Client } = require('pg');
const {readFile} = require("fs");

const inputSQLFilename = 'Thesis-Management-System.sql'; // Change this if you want to rebuild the database from a different file

const dbConnectionGeneral = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const dbConnection = new Client({
    user: process.env.DB_USER,
    host: 'localhost',
    database: 'Thesis-Management-System',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

const dropConnectionsQuery = `
    SELECT pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'Thesis-Management-System'
    AND pid <> pg_backend_pid();
`;

console.log("Are you sure you want to rebuild the database?");
console.log("You will lose all the data you stored in your local database and not written in the Thesis-Management-System.sql file");
console.log("Your local database will be aligned to the one defined and populated in the Thesis-Management-System.sql file");
console.log("If you want to continue, type 'y' and press enter");
console.log("Otherwise type 'n' and press enter");

const stdin = process.openStdin()

stdin.addListener("data", function (d) {
    let answer = d.toString().trim();

    if(answer === "y") {
        dbConnectionGeneral.connect()
            .then(() => {
                console.log('[DB-REBUILD] Connected to the general database "postgres"');
                console.log('[DB-REBUILD] Dropping all the connections to the database "Thesis-Management-System"');
                return dbConnectionGeneral.query(dropConnectionsQuery);
            })
            .then(() => {
                console.log('[DB-REBUILD] All the connections to the database "Thesis-Management-System" have been dropped');
                console.log('[DB-REBUILD] Dropping the database "Thesis-Management-System"');
                return dbConnectionGeneral.query('DROP DATABASE IF EXISTS "Thesis-Management-System"');
            })
            .then(() => {
                console.log('[DB-REBUILD] The database "Thesis-Management-System" has been dropped');
                console.log('[DB-REBUILD] Creating the database "Thesis-Management-System"');
                return dbConnectionGeneral.query('CREATE DATABASE "Thesis-Management-System" WITH TEMPLATE = template0 ENCODING = \'UTF8\' LOCALE_PROVIDER = libc LOCALE = \'it_IT.UTF-8\'');
            })
            .then(() => {
                console.log('[DB-REBUILD] The database "Thesis-Management-System" has been created');
                console.log('[DB-REBUILD] Connecting to the database "Thesis-Management-System"');
                return dbConnectionGeneral.end();
            })
            .then(() => {
                return dbConnection.connect();
            })
            .then(() => {
                console.log('[DB-REBUILD] Connected to the database "Thesis-Management-System"');
                console.log('[DB-REBUILD] Reading the file Thesis-Management-System.sql');
                return new Promise((resolve, reject) => {
                    readFile('../database/' + inputSQLFilename, 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                        }

                        // remove the line that starts with "CREATE DATABASE" because it has already been executed and gives error
                        data = data.replace(/^CREATE DATABASE.*$/gm, '');
                        // remove the line that starts with "\connect" because it is useless for local and gives error
                        data = data.replace(/^\\connect.*$/gm, '');

                        resolve(data);
                    });
                });
            })
            .then((data) => {
                console.log('[DB-REBUILD] The file Thesis-Management-System.sql has been read');
                console.log('[DB-REBUILD] Rebuilding the database "Thesis-Management-System"');
                return dbConnection.query(data);
            })
            .then(() => {
                console.log('[DB-REBUILD] The database "Thesis-Management-System" has been rebuilt');
                console.log('[DB-REBUILD] Disconnecting from the database "Thesis-Management-System"');
                return dbConnection.end();
            })
            .then(() => {
                console.log('[DB-REBUILD] Disconnected from the database "Thesis-Management-System"');
                console.log('[DB-REBUILD] Your local database has been rebuilt successfully!');
                process.exit(0);
            })
            .catch((err) => {
                console.error('[DB-REBUILD] Error while rebuilding the database: ' + err.stack);
                process.exit(1);
            });
    }
});

