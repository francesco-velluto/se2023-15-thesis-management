'use strict';

const db = require("./db");
const Proposal = require("../model/Proposal");

module.exports = {
    getAllProposals: () => {
        // TODO
    },

    getProposalById: (proposal_id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT t.name AS supervisor_name, t.surname AS supervisor_surname, p.* FROM proposals p JOIN teacher t ON p.supervisor_id = t.id WHERE p.proposal_id = $1', [proposal_id])
                .then(result => {
                    if (result.length === 0) {
                        console.error(`Error in getProposalById - proposal_id: ${proposal_id} not found`);
                        reject({ status: 404, data: "Proposal not found" });
                    } else {
                        resolve({status: 200, data: result.rows[0]});
                    }
                })
                .catch(error => {
                    console.log("Error in getProposalById: ", error);
                    reject({ status: 500, data: "Internal Server Error" });
                });
        });
    }
}
