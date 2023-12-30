"use strict";

const db = require("./db");

module.exports = {
    insertNewCronoLog: (job_name, event, details) => {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO cronologs (job_name, event, details) VALUES ($1, $2, $3)", [job_name, event, details])
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}