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



exports.insertProposal = async (supervisor_id, proposal) => {
  try {
    const result = await db.query(
      `INSERT INTO proposals 
        (proposal_id, title, supervisor_id, keywords, type,
        groups, description, required_knowledge, notes,
        expiration_date, level, programmes, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *;`,
      [
        proposal.proposal_id,
        proposal.title,
        supervisor_id,
        proposal.keywords,
        proposal.type,
        proposal.groups || [],
        proposal.description,
        proposal.required_knowledge,
        proposal.notes || "",
        proposal.expiration_date,
        proposal.level,
        proposal.programmes,
        'active'
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


exports.getAllProposals = async (cod_degree) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT p.proposal_id, p.title, t.surname as supervisor_surname, t.\"name\" as supervisor_name, " +
            "p.keywords, p.\"type\", p.\"groups\", p.description, p.required_knowledge, p.notes, " +
            "p.expiration_date, p.\"level\", array_agg(d.title_degree) as \"degrees\" " +
            "FROM proposals p " +
            "JOIN teacher t ON p.supervisor_id = t.id " +
            "JOIN unnest(p.programmes) AS prog ON true " +
            "JOIN degree d ON prog = d.cod_degree " +
            "WHERE cod_degree = '" + cod_degree + "' AND p.expiration_date >= current_date " +
            "GROUP BY p.proposal_id, p.title, supervisor_surname, supervisor_name, p.keywords, p.\"type\", p.\"groups\", " +
            "p.description, p.required_knowledge, p.notes, p.expiration_date, p.\"level\" " +
            "ORDER BY p.proposal_id")
            .then((rows) => {
                if (rows.lenght == 0) {
                    console.error('[BACKEND-SERVER] Error in getAllProposals');
                    reject({ status: 404, data: 'proposals not found' });
                }

                resolve({ status: 200, data: rows.rows });

            }).catch((err) => {
            console.error('[BACKEND-SERVER] Error in getAllProposals', err);
            reject({ status: 500, data: 'Internal server error' });
        });
    })
}

exports.getProposalById = (proposal_id) => {
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



