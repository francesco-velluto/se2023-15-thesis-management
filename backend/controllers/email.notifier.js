const studentsService = require("../service/students.service");
const teachersService = require("../service/teachers.service");
const emailNotifier = require("../notifiers/email.notifier");
const applicationDecisionEmailTemplate = require("../notifiers/templates/application.decision.template");
const studentnotifsService = require("../service/studentnotifs.service");
const dayjs = require("dayjs");

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