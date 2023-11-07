'use strict';

/**
 * Career model
 */
module.exports = function Career(
  id = '',
  cod_course = '',
  title_course = '',
  cfu = -1,
  grade = -1,
  date = undefined
) {
  this.id = id;
  this.cod_course = cod_course;
  this.title_course = title_course;
  this.cfu = cfu;
  this.grade = grade;
  this.date = date;
};
