'use strict';

const db = require("./db");
const Proposal = require("../model/Proposal");



module.exports = {

    /**
    * Get all the active proposals from the system
    */
    getAllProposals: async () => {

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
    },

    getProposalById: (proposal_id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT t.name AS supervisor_name, t.surname AS supervisor_surname, p.* FROM proposals p JOIN teacher t ON p.supervisor_id = t.id WHERE p.proposal_id = $1', [proposal_id])
                .then(result => {
                    if (result.length === 0) {
                        console.error(`Error in getProposalById - proposal_id: ${proposal_id} not found`);
                        reject({ status: 404, data: "Proposal not found" });
                    } else {
                        let proposal = result.rows[0];

                        // get the names of each programme of the proposal
                        // we cannot use the 'WHERE cod_degree IN $1' because it is not supported by the pg library
                        // we will use a workaround with ANY
                        db.query('SELECT * FROM degree WHERE cod_degree = ANY($1)', [proposal.programmes])
                            .then(degrees_result => {
                                let degrees = degrees_result.rows;
                                proposal.programmes = degrees;
                                resolve({ status: 200, data: proposal });
                            }).catch(error => {
                                console.log("Error in getProposalById - cannot get programmes: ", error);
                                reject({ status: 500, data: "Internal Server Error" });
                        });
                    }
                })
                .catch(error => {
                    console.log("Error in getProposalById: ", error);
                    reject({ status: 500, data: "Internal Server Error" });
                });
        });
    }
}



