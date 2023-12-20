const studentsService = require("../service/students.service");
const teachersService = require("../service/teachers.service");
const emailNotifier = require("../notifiers/email.notifier");
const applicationDecisionEmailTemplate = require("../notifiers/templates/application.decision.template");
const applicationEmailTemplate = require("../notifiers/templates/application.template");
const studentnotifsService = require("../service/studentnotifs.service");
const teachernotifsService = require("../service/teachernotifs.service");
const dayjs = require("dayjs");
const proposalsService = require("../service/proposals.service");
const studentService = require("../service/students.service");

/**
 * Send an email to the student to notify him that his application has been accepted/rejected
 * This function is called by the acceptOrRejectApplication controller
 */
exports.sendUpdateApplicationStatusEmail = async (updatedApplication, teacher_id, proposal, status) => {
    const studentId = updatedApplication.student_id;

    const student = (await studentsService.getStudentById(studentId)).data;
    const teacher = (await teachersService.getTeacherById(teacher_id)).data;

    const destinationEmail = student.email;
    const studentFullName = student.surname + " " + student.name;
    const teacherFullName = teacher.surname + " " + teacher.name;

    const proposalId = proposal.proposal_id;
    const proposalTitle = proposal.title;
    const applicationId = updatedApplication.id;
    const applicationDate = dayjs(updatedApplication.application_date).format("dddd, DD/MM/YYYY");

    const emailSubject = applicationDecisionEmailTemplate.getEmailSubject(status);
    const contentData = { application_id: applicationId, application_decision: status, proposal_id: proposalId, proposal_title: proposalTitle, application_date: applicationDate, student: studentFullName, supervisor: teacherFullName }
    const emailBody = applicationDecisionEmailTemplate.getEmailBody(status, proposalId, proposalTitle, applicationDate, studentFullName, teacherFullName);

    // Memorize in the database the notification to be sent to the student, it is still not sent
    const { notificationId } = await studentnotifsService.createNewStudentNotification(studentId, "Application Decision", emailSubject, contentData);

    // Send the email to the student
    let emailNotifierResponse = await emailNotifier.sendEmailNotification(notificationId, destinationEmail, emailSubject, emailBody);

    if (emailNotifierResponse) { 
        // The email has been sent, update the status of the notification in the database
        await studentnotifsService.updateStudentNotificationStatus(notificationId, "SMTP Accepted");
    } else {
        // The email has not been sent, update the status of the notification in the database
        await studentnotifsService.updateStudentNotificationStatus(notificationId, "SMTP Rejected");
        throw Error("Error occurred in email notifier");
    }
};

exports.sendNewApplicationEmail = async (application_id, application_date, proposal_id, student_id) => {
    // get the proposal and supervisor data
    const proposalData = await proposalsService.getProposalById(proposal_id);
    const { supervisor_id, supervisor_name, supervisor_surname, supervisor_email, title, expiration_date } = proposalData.data;
    const supervisor = supervisor_surname + " " + supervisor_name;

    // get the student data
    const studentData = await studentService.getStudentById(student_id);
    const student = studentData.data.surname + " " + studentData.data.name;

    const applicationDate = dayjs(application_date).format("dddd, DD/MM/YYYY");
    const expirationDate = dayjs(expiration_date).format("dddd, DD/MM/YYYY");

    // the email content data
    const contentData = { supervisor_id, student_id, application_id, proposal_id, supervisor, student, applicationDate, proposal_title: title, proposal_expiration_date: expirationDate};

    const emailSubject = applicationEmailTemplate.getEmailSubject(student);
    const emailBody = applicationEmailTemplate.getEmailBody(student, supervisor, proposal_id, title, expirationDate, applicationDate, application_id);

    // Memorize in the database the notification to be sent to the teacher, it is still not sent
    const { notificationId } = await teachernotifsService.createNewTeacherNotification(supervisor_id, "New Application", emailSubject, contentData);

    // Send the email to the teacher
    let emailNotifierResponse = await emailNotifier.sendEmailNotification(notificationId, supervisor_email, emailSubject, emailBody);

    if (emailNotifierResponse) {
        // The email has been sent, update the status of the notification in the database
        await teachernotifsService.updateTeacherNotificationStatus(notificationId, "SMTP Accepted");
    } else {
        // The email has not been sent, update the status of the notification in the database
        await teachernotifsService.updateTeacherNotificationStatus(notificationId, "SMTP Rejected");
        throw Error("Error occurred in email notifier");
    }
}