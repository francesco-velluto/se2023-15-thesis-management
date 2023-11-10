'use strict';

const db = require("./db");
const Proposal = require("../model/Proposal");

/**
 * Get all proposals from the system
 */
exports.getAllProposals = async () => {
    //TO DO 
}

exports.getProposalsFieldsAndTypes = async () => {

    try{

        const result = db.query(`SELECT column_name, data_type
                            FROM information_schema.columns
                            WHERE table_name = 'proposals';`);

        return result.rows;

    } catch(error){
        console.log(error);
        throw error;
    }
    
}

