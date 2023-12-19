'use strict';

/**
 * Thesis Request model
 */
module.exports = function ThesisRequest(
    request_id = '',
    title = '',
    description = '',
    supervisor_id = '',
    student_id = '',
    co_supervisor_id = '',
    approval_date = undefined,
    status = ''
) {
    this.request_id = request_id;
    this.title = title;
    this.description = description;
    this.supervisor_id = supervisor_id;
    this.student_id = student_id;
    this.co_supervisor_id = co_supervisor_id;
    this.approval_date = approval_date;
    this.status = status;
};
