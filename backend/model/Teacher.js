'use strict';

/**
 * Teacher model
 */
module.exports = function Teacher(
  teacher_id = '',
  surname = '',
  name = '',
  email = '',
  cod_group = '',
  cod_department = ''
) {
  this.teacher_id = teacher_id;
  this.surname = surname;
  this.name = name;
  this.email = email;
  this.cod_group = cod_group;
  this.cod_department = cod_department;
};
