"use strict";

const db = require("./db");
const Proposal = require("../model/Proposal");

const rowToProposal = (row) => {
  return new Proposal(
    row.thesis_id,
    row.title,
    row.supervisor_id,
    row.keywords,
    row.type,
    row.groups,
    row.description,
    row.required_knowledge,
    row.notes,
    row.expiration_date,
    row.level,
    row.cds_programmes
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
      `INSERT INTO thesis 
        (thesis_id, title, supervisor_id, keywords, type,
        groups, description, required_knowledge, notes,
        expiration_date, level, cds_programmes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *;`,
      [
        proposal.thesis_id, // TO-DO: generate a new thesis ID
        proposal.title,
        proposal.supervisor_id,
        proposal.keywords,
        proposal.type,
        proposal.groups,
        proposal.description,
        proposal.required_knowledge,
        proposal.notes,
        proposal.expiration_date,
        proposal.level,
        proposal.cds_programmes,
      ]
    );
    return rowToProposal(result.rows[0]);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
