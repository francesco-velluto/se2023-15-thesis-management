'use strict';

const db = require("./db");
const Proposal = require("../model/Proposal");

/**
 * Get all the active proposals from the system
 */
exports.getAllProposals = async () => {

    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM proposals")
        .then((rows) =>{
            if(rows.lenght == 0){
                console.error('[BACKEND-SERVER] Error in getAllProposals');
                        reject({ status: 404, data: 'proposals not found' });
            }
            resolve({status: 200, data: rows.rows});

        }).catch((err) => {
            console.error('[BACKEND-SERVER] Error in getAllProposals', err);
            reject({ status: 500, data: 'Internal server error' });
        });
    })
}

