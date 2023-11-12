'use strict';

/**
 * Application model
 */
module.exports = function Application(
  thesis_id = '',
  id = '',
  status = '',
  application_date = null
) {
  this.thesis_id = thesis_id;
  this.id = id;
  this.status = status;
  this.application_date = application_date;
};
