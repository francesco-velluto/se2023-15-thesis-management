'use strict';

/**
 * Teacher model
 */
module.exports = function Teacher(
  id = '',
  surname = '',
  name = '',
  email = '',
  cod_group = '',
  cod_department = ''
) {
  this.id = id;
  this.surname = surname;
  this.name = name;
  this.email = email;
  this.cod_group = cod_group;
  this.cod_department = cod_department;
  this.role = 0;  // role 0 is for the teacher
};
