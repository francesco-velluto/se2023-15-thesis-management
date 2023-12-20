"use strict";

const db = require("./db");
const Proposal = require("../model/Proposal");

 exports.rowToProposal = (row) => {
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
    row.programmes,
    row.archived,
    row.deleted
  );
};

exports.insertProposal = async (proposal) => {
  try {
    const result = await db.query(
      `INSERT INTO proposals
        (proposal_id, title, supervisor_id, keywords, type,
        groups, description, required_knowledge, notes,
        expiration_date, level, programmes, archived, deleted)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
        false,
        false
      ]
    );
    return this.rowToProposal(result.rows[0]);
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
    db.query(
      'SELECT p.proposal_id, p.title, t.surname as supervisor_surname, t."name" as supervisor_name, ' +
        'p.keywords, p."type", p."groups", p.description, p.required_knowledge, p.notes, ' +
        'p.expiration_date, p."level", array_agg(d.title_degree) as "degrees" ' +
        "FROM proposals p " +
        "JOIN teacher t ON p.supervisor_id = t.id " +
        "JOIN unnest(p.programmes) AS prog ON true " +
        "JOIN degree d ON prog = d.cod_degree " +
        "JOIN virtual_clock vc ON vc.prop_name = 'virtual_date' AND p.expiration_date >= vc.prop_value " + //! VIRTUAL_CLOCK: remove this line in production
        "WHERE cod_degree = $1 " +
        // "AND p.expiration_date >= current_date " + //! VIRTUAL_CLOCK: uncomment this line in production
        "AND p.archived = false AND p.deleted = false " +
        'GROUP BY p.proposal_id, p.title, supervisor_surname, supervisor_name, p.keywords, p."type", p."groups", ' +
        'p.description, p.required_knowledge, p.notes, p.expiration_date, p."level" ' +
        "ORDER BY p.proposal_id",
      [cod_degree]
    )
      .then((rows) => {
        if (rows.length == 0) {
          console.error("[BACKEND-SERVER] Error in getAllProposals");
          reject({ status: 404, data: "proposals not found" });
        }
        resolve({ status: 200, data: rows.rows });
      })
      .catch((err) => {
        console.error("[BACKEND-SERVER] Error in getAllProposals", err);
        reject({ status: 500, data: "Internal server error" });
      });
  });
};

exports.getAllProfessorProposals = async (prof_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT p.proposal_id, p.title, t.surname as supervisor_surname, t."name" as supervisor_name, ' +
        'p.keywords, p."type", p."groups", p.description, p.required_knowledge, p.notes, ' +
        'p.expiration_date, p."level", array_agg(d.title_degree) as "degrees" ' +
        "FROM proposals p " +
        "JOIN teacher t ON p.supervisor_id = t.id " +
        "JOIN unnest(p.programmes) AS prog ON true " +
        "JOIN degree d ON prog = d.cod_degree " +
        "JOIN virtual_clock vc ON vc.prop_name = 'virtual_date' AND p.expiration_date >= vc.prop_value " + //! VIRTUAL_CLOCK: remove this line in production
        "WHERE p.supervisor_id = $1 " +
        // "AND p.expiration_date >= current_date " + //! VIRTUAL_CLOCK: uncomment this line in production
        "AND p.archived = false AND p.deleted = false " +
        'GROUP BY p.proposal_id, p.title, supervisor_surname, supervisor_name, p.keywords, p."type", p."groups", ' +
        'p.description, p.required_knowledge, p.notes, p.expiration_date, p."level" ' +
        "ORDER BY p.proposal_id",
      [prof_id]
    )
      .then((rows) => {
        if (rows.length == 0) {
          console.error("[BACKEND-SERVER] Error in getAllProfessorProposals");
          reject({ status: 404, data: "proposals not found" });
        }

        resolve({ status: 200, data: rows.rows });
      })
      .catch((err) => {
        console.error("[BACKEND-SERVER] Error in getAllProfessorProposals", err);
        reject({ status: 500, data: "Internal server error" });
      });
  });
};

/**
 *
 * @param {string} proposal_id
 *
 * @returns  { Promise<{ status: Integer, data: Proposal }>}
 */
exports.getProposalById = (proposal_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT t.id as supervisor_id, t.name AS supervisor_name, t.surname AS supervisor_surname, t.email AS supervisor_email, p.* FROM proposals p JOIN teacher t ON p.supervisor_id = t.id WHERE p.proposal_id = $1",
      [proposal_id]
    )
      .then((result) => {
        if (result.rows.length === 0) {
          console.error(
            `Error in getProposalById - proposal_id: ${proposal_id} not found`
          );
          reject({ status: 404, data: "The proposal has not been found!" });
        } else {
          let proposal = result.rows[0];

          // get the names of each programme of the proposal
          // we cannot use the 'WHERE cod_degree IN $1' because it is not supported by the pg library
          // we will use a workaround with ANY
          db.query("SELECT * FROM degree WHERE cod_degree = ANY($1)", [
            proposal.programmes,
          ])
            .then((degrees_result) => {
              let degrees = degrees_result.rows;
              proposal.programmes = degrees;

              // get names of each group of the proposal
              db.query('SELECT * FROM "group" WHERE cod_group = ANY($1)', [
                proposal.groups,
              ])
                .then((group_result) => {
                  let group = group_result.rows;
                  proposal.groups = group;

                resolve({ status: 200, data: proposal });
              })
              .catch((error) => {
                console.log(
                  "Error in getProposalById - cannot get groups: ",
                  error
                );
                reject({ status: 500, data: "Internal Server Error" });
              });
            })
            .catch((error) => {
              console.log(
                "Error in getProposalById - cannot get programmes: ",
                error
              );
              reject({ status: 500, data: "Internal Server Error" });
            });
        }
      })
      .catch((error) => {
        console.log("Error in getProposalById: ", error);
        reject({ status: 500, data: "Internal Server Error" });
      });
  });
};

/**
 * Set the proposal as archived
 *
 * @param {number} proposal_id
 *
 * @returns {Promise<{ data: Proposal }>}
 */
exports.setProposalArchived = async (proposal_id) => {
  try {
    let queryUpdate =
      "UPDATE proposals SET archived = true where proposal_id = $1 RETURNING *";

    const { rows, rowCount } = await db.query(queryUpdate, [proposal_id]);
    if (rowCount === 0) {
      return { data: undefined };
    }

    const proposal = this.rowToProposal(rows[0]);

    return { data: proposal };
  } catch (error) {
    console.log("Error in setProposalArchived: ", error);
    throw error;
  }
};

/**
 * Delete a proposal
 *
 * @param {string} proposal_id
 *
 * @returns {data: proposalDeleted}
 */
exports.deleteProposal = async(proposal_id) =>{
  try{
    // check if the proposal exists
    let checkProposal = "select * from proposals where proposal_id = $1";

    const rows = await db.query(checkProposal, [proposal_id]);
    if(rows.rowCount === 0) {
      return {data: undefined};
    }

    let queryDelete = "update proposals set deleted = true where proposal_id = $1 RETURNING *";
    const deletedProposal = await db.query(queryDelete, [proposal_id]);

    let cancelApplicationsQuery = "update applications set status = 'Canceled' where proposal_id = $1 returning *";
    await db.query(cancelApplicationsQuery, [proposal_id]);

    return {data: deletedProposal.rows[0]};

  }catch (error) {
    console.log("Error in deleteProposal: ", error);
    throw error;
  }
}
exports.updateProposal = async (proposal) => {
  try {
    const result = await db.query(
      "UPDATE proposals SET title = $1, level = $2, keywords = $3, type = $4, " +
        "description = $5, required_knowledge = $6, notes = $7, expiration_date = $8, programmes = $9 " +
        "WHERE proposal_id = $10 RETURNING *;",
      [
        proposal.title,
        proposal.level,
        proposal.keywords,
        proposal.type,
        proposal.description,
        proposal.required_knowledge,
        proposal.notes || "",
        proposal.expiration_date,
        proposal.programmes,
        proposal.proposal_id
      ]
    );

    return { data: this.rowToProposal(result.rows[0]) };
  } catch (error) {
    console.error("Error in updateProposal: ", error);
    throw error;
  }
};
