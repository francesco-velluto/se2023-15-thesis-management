const CronoJob = require('../CronoJob');

const teacherNotifsService = require('../service/teachernotifs.service');
const emailNotifier = require('../notifiers/email.notifier');
const applicationEmailTemplate = require('../../templates/application.template');

/**
 * This class represents a Crono Job that will retry to send an email notification to teachers.
 * The job will be scheduled to run every 5 minutes.
 * The job will query the database for all the teachers that have SMTP Rejected email notification.
 * The job will retry to send the email notification to the teachers.
 */
class RetrySendTeacherNotificationEmail extends CronoJob {
    /**
     * The schedule for the job to run.
     * The job will run every 5 minutes.
     *
     * @returns {string} The schedule for the job to run.
     */
    get schedule() {
        return '*/1 * * * *';
    }

    /**
     * The function that will be run by the job.
     * The function will query the database for all the teachers that have SMTP Rejected email notification.
     * The function will retry to send the email notification to the teachers.
     */
    async run() {
        try {
            let resendSuccessNotificationIds = [];
            let resendFailedNotificationIds = [];

            const toResend = await teacherNotifsService.getSMTPRejectedEmailTeacherNotifications();
            for (const notification of toResend) {
                const notificationId = notification.id;

                const notificationDestination = notification.email;
                const notificationSubject = notification.subject;

                const notificationContent = notification.content;

                let notificationHTMLContent = "";

                switch (notification.campaign) {
                    case "New Application":
                        notificationHTMLContent = applicationEmailTemplate.getEmailBody(notificationContent.student, notificationContent.supervisor, notificationContent.proposal_id, notificationContent.proposal_title, notification.proposal_expiration_date, notificationContent.application_date, notificationContent.application_id);
                        break;
                    default:
                        throw new Error("Invalid notification campaign for teacher notification with id " + notificationId + ": " + notification.campaign);
                }

                try {
                    await emailNotifier.sendEmailNotification(notificationId, notificationDestination, notificationSubject, notificationHTMLContent)

                    console.info("[CRONO-MODULE][RetrySendTeacherNotificationEmail] Email notification with id " + notificationId + " sent to " + notificationDestination + " successfully");
                    resendSuccessNotificationIds.push(notificationId);

                    await teacherNotifsService.updateTeacherNotificationStatus(notificationId, "SMTP Accepted");
                } catch (err) {
                    console.error("[CRONO-MODULE][RetrySendTeacherNotificationEmail] Error sending email notification with id " + notificationId + " to " + notificationDestination + ": " + err.message);
                    resendFailedNotificationIds.push(notificationId);
                }
            }

            console.info("[CRONO-MODULE][RetrySendTeacherNotificationEmail] Email notifications sent successfully: " + resendSuccessNotificationIds.length);
            console.info("[CRONO-MODULE][RetrySendTeacherNotificationEmail] Email notifications failed to send: " + resendFailedNotificationIds.length);

            return {resendSuccess: resendSuccessNotificationIds, resendFailed: resendFailedNotificationIds};
        } catch (e) {
            console.error("[CRONO-MODULE][RetrySendTeacherNotificationEmail] Error in run of the job: " + e.message);
            throw e;
        }
    }
}

module.exports = RetrySendTeacherNotificationEmail;