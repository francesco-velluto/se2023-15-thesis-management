'use strict';

/**
 * Application model
 */
module.exports = function Application(
  id = '',
  proposal_id = '',
  student_id = '',
  status = '',
  application_date = null
) {
  this.id = id;
  this.proposal_id = proposal_id;
  this.student_id = student_id;
  this.status = status;
  this.application_date = application_date;
};
