'use strict';

/**
 * Proposal model
 */
module.exports = function Proposal(
<<<<<<< HEAD
  thesis_id = '',
=======
  proposal_id = '',
>>>>>>> origin/main
  title = '',
  supervisor_id = '',
  keywords = [],
  type = '',
  groups = [],
  description = '',
  required_knowledge = '',
  notes = '',
  expiration_date = undefined,
  level = '',
  cds_programmes = []
) {
  this.proposal_id = proposal_id;
  this.title = title;
  this.supervisor_id = supervisor_id;
  this.keywords = keywords;
  this.type = type;
  this.groups = groups;
  this.description = description;
  this.required_knowledge = required_knowledge;
  this.notes = notes;
  this.expiration_date = expiration_date;
  this.level = level;
  this.cds_programmes = cds_programmes;
};
