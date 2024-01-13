"use strict";

/**
 * Crono Process will use another SMTP connection to avoid
 * issues with the main SMTP connection.
 */


require('dotenv').config({ path: '../../../.env' });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

module.exports = {
    sendEmailNotification: (notificationId, destination, subject, htmlContent) => {
        return new Promise((resolve, reject) => {
            // delete all \n and \t from htmlContent
            htmlContent = htmlContent.replaceAll("\n", "");
            htmlContent = htmlContent.replaceAll("\t", "");

            const mailOptions = {
                from: process.env.SMTP_USERNAME,
                to: destination,
                subject: subject,
                html: htmlContent
            };

            console.info("[CRONO-MODULE][EMAIL-NOTIFIER]: Sending email notification with id " + notificationId + " to " + destination);
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error("[CRONO-MODULE][EMAIL-NOTIFIER]: Error sending email notification with id " + notificationId + " to " + destination + ": " + err);
                    
                    // resolve with null value instead of rejecting, so that the promise is not rejected and the application can continue
                    resolve(null);
                } else {
                    console.info("[CRONO-MODULE][EMAIL-NOTIFIER]: Email notification with id " + notificationId + " sent to " + destination + " successfully");
                    resolve(info);
                }
            });
        });
    }
}