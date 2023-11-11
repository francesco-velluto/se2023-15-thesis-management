'use strict';

/**
 * Application model
 */
module.exports = function Application(
  application_id = -1,
  thesis_id = '',
  id = '',
  status = '',
  application_date = null
) {
  this.application_id = application_id;
  this.thesis_id = thesis_id;
  this.id = id;
  this.status = status;
  this.application_date = application_date;
};
