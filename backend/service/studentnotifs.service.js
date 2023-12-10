"use strict";

const db = require("./db");

module.exports = {
    createNewStudentNotification: (student_id, campaign, subject, content) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO studentnotifs (channel, student_id, campaign, subject, content, status, lastupdate) VALUES ('Email', $1, $2, $3, $4, 'SMTP Pending', NOW()) RETURNING id";

            db.query(query, [student_id, campaign, subject, content])
                .then((result) => {
                    if(result.rows.length === 0)
                        throw new Error("Insert query returned no rows");

                    let notificationId = result.rows[0].id;

                    console.info("[BACKEND-SERVER] New SMTP Pending email student notification with id " + notificationId + " created successfully for student id " + student_id);
                    resolve({ notificationId });
                })
                .catch((err) => {
                    console.error("[BACKEND-SERVER] Error while creating new SMTP Pending email student notification for student id " + student_id + ": " + err);
                    reject(err);
                });
        });
    },

    updateStudentNotificationStatus: (notification_id, status) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE studentnotifs SET status = $1, lastupdate = NOW() WHERE id = $2";

            db.query(query, [status, notification_id])
                .then((result) => {
                    console.info("[BACKEND-SERVER] Student notification with id " + notification_id + " updated successfully");
                    resolve();
                })
                .catch((err) => {
                    console.error("[BACKEND-SERVER] Error while updating student notification with id " + notification_id + ": " + err);
                    reject(err);
                });
        });
    }
}