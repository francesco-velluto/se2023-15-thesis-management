'use strict';

/**
 * Application model
 */
module.exports = function Application(
  proposal_id = '',
  id = '',
  status = '',
  application_date = null
) {
  this.proposal_id = proposal_id;
  this.id = id;
  this.status = status;
  this.application_date = application_date;
};
