'use strict';

/**
 * Student model
 */
module.exports = function Student(
  student_id = '',
  surname = '',
  name = '',
  gender = '',
  nationality = '',
  email = '',
  cod_degree = '',
  enrollment_year = 0
) {
  this.student_id = student_id;
  this.surname = surname;
  this.name = name;
  this.gender = gender;
  this.nationality = nationality;
  this.email = email;
  this.cod_degree = cod_degree;
  this.enrollment_year = enrollment_year;
};
