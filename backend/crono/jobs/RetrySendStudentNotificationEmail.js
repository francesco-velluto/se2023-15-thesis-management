const CronoJob = require('../CronoJob');

const studentNotifsService = require('../service/studentnotifs.service');
const emailNotifier = require('../notifiers/email.notifier');
const applicationDecisionEmailTemplate = require('../../templates/application.decision.template');

/**
 * This class represents a Crono Job that will retry to send an email notification to students.
 * The job will be scheduled to run every 5 minutes.
 * The job will query the database for all the students that have SMTP Rejected email notification.
 * The job will retry to send the email notification to the students.
 */
class RetrySendStudentNotificationEmail extends CronoJob {
    /**
     * The schedule for the job to run.
     * The job will run every 5 minutes.
     *
     * @returns {string} The schedule for the job to run.
     */
    get schedule() {
        return '*/5 * * * *';
    }

    /**
     * The function that will be run by the job.
     * The function will query the database for all the students that have SMTP Rejected email notification.
     * The function will retry to send the email notification to the students.
     */
    async run() {
        try {
            let resendSuccessNotificationIds = [];
            let resendFailedNotificationIds = [];

            const toResend = await studentNotifsService.getSMTPRejectedEmailStudentNotifications();
            for (const notification of toResend) {
                const notificationId = notification.id;

                const notificationDestination = notification.email;
                const notificationSubject = notification.subject;

                const notificationCamapign = notification.campaign;

                let notificationHTMLContent = "";

                switch (notificationCamapign) {
                    case "Application Decision":
                        notificationHTMLContent = applicationDecisionEmailTemplate.getEmailBody(notification.content.application_decision, notification.content.proposal_id, notification.content.proposal_title, notification.content.application_date, notification.content.student, notification.content.supervisor);
                        break;
                    default:
                        throw new Error("Invalid notification campaign for student notification with id " + notificationId + ": " + notificationCamapign);
                }

                try {
                    await emailNotifier.sendEmailNotification(notificationId, notificationDestination, notificationSubject, notificationHTMLContent)

                    console.info("[CRONO-MODULE][RetrySendStudentNotificationEmail] Email notification with id " + notificationId + " sent to " + notificationDestination + " successfully");
                    resendSuccessNotificationIds.push(notificationId);

                    await studentNotifsService.updateStudentNotificationStatus(notificationId, "SMTP Accepted");
                } catch (err) {
                    console.error("[CRONO-MODULE][RetrySendStudentNotificationEmail] Error sending email notification with id " + notificationId + " to " + notificationDestination + ": " + err.message);
                    resendFailedNotificationIds.push(notificationId);
                }
            }

            console.info("[CRONO-MODULE][RetrySendStudentNotificationEmail] Email notifications sent successfully: " + resendSuccessNotificationIds.length);
            console.info("[CRONO-MODULE][RetrySendStudentNotificationEmail] Email notifications failed to send: " + resendFailedNotificationIds.length);

            return {resendSuccess: resendSuccessNotificationIds, resendFailed: resendFailedNotificationIds};
        } catch (e) {
            console.error("[CRONO-MODULE][RetrySendStudentNotificationEmail] Error in run of the job: " + e.message);
            throw e;
        }
    }
}

module.exports = RetrySendStudentNotificationEmail;