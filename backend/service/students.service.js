"use strict";

const db = require("./db");
const Student = require("../model/Student");


/**
 * Get a student by his Id
 * 
 */

exports.getStudentById = async(student_id)=>{
    let query = "SELECT * FROM student WHERE id = $1";

    try{
        const res = await db.query(query, [student_id]);

        if(res.rows.length === 0)
            throw new Error("This student doesn't exist");
        const student = res.rows[0];
        return new Student(
            student.id,
            student.surname,
            student.name,
            student.gender,
            student.nationality,
            student.email,
            student.cod_degree,
            student.enrollment_year
        );
    }catch(error){
        console.log("Error in getStudentById: ", error);
        return error;
    }
}