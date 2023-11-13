"use strict";

const db = require("./db");
const Proposal = require("../model/Proposal");

const rowToProposal = (row) => {
  return new Proposal(
    row.proposal_id,
    row.title,
    row.supervisor_id,
    row.keywords,
    row.type,
    row.groups || [],
    row.description,
    row.required_knowledge,
    row.notes || "",
    row.expiration_date,
    row.level,
    row.programmes
  );
};

/**
 * Get all proposals from the system
 */
exports.getAllProposals = async () => {
  //TO DO
};

exports.insertProposal = async (proposal) => {
  try {
    const result = await db.query(
      `INSERT INTO proposals 
        (proposal_id, title, supervisor_id, keywords, type,
        groups, description, required_knowledge, notes,
        expiration_date, level, programmes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;`,
      [
        proposal.proposal_id,
        proposal.title,
        proposal.supervisor_id,
        proposal.keywords,
        proposal.type,
        proposal.groups || [],
        proposal.description,
        proposal.required_knowledge,
        proposal.notes || "",
        proposal.expiration_date,
        proposal.level,
        proposal.programmes,
      ]
    );
    return rowToProposal(result.rows[0]);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.getMaxProposalIdNumber = async () => {
  try {
    const result = await db.query(`SELECT MAX(proposal_id) FROM proposals;`);
    const max = result.rows[0].max;
    if (max == null) return 0;
    else return Number(max.slice(1));
  } catch (err) {
    console.log(err);
    throw err;
  }
};
module.exports = {
    getAllProposals: () => {
        // TODO
    },

    getProposalById: (proposal_id) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT t.name AS supervisor_name, t.surname AS supervisor_surname, p.* FROM proposals p JOIN teacher t ON p.supervisor_id = t.id WHERE p.proposal_id = $1', [proposal_id])
                .then(result => {
                    if (result.rows.length === 0) {
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
