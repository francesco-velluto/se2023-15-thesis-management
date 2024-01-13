"use strict";

const db = require("./db");

module.exports = {
    createNewTeacherNotification: (teacher_id, campaign, subject, content) => {
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO teachernotifs (channel, teacher_id, campaign, subject, content, status, lastupdate) VALUES ('Email', $1, $2, $3, $4, 'SMTP Pending', NOW()) RETURNING id";

            db.query(query, [teacher_id, campaign, subject, content])
                .then((result) => {
                    if(result.rows.length === 0)
                        throw new Error("Insert query returned no rows");

                    let notificationId = result.rows[0].id;

                    console.info("[BACKEND-SERVER] New SMTP Pending email teacher notification with id " + notificationId + " created successfully for teacher id " + teacher_id);
                    resolve({ notificationId });
                })
                .catch((err) => {
                    console.error("[BACKEND-SERVER] Error while creating new SMTP Pending email teacher notification for teacher id " + teacher_id + ": " + err);
                    reject(err);
                });
        });
    },

    updateTeacherNotificationStatus: (notification_id, status) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE teachernotifs SET status = $1, lastupdate = NOW() WHERE id = $2";

            db.query(query, [status, notification_id])
                .then((result) => {
                    console.info("[BACKEND-SERVER] teacher notification with id " + notification_id + " updated successfully");
                    resolve();
                })
                .catch((err) => {
                    console.error("[BACKEND-SERVER] Error while updating teacher notification with id " + notification_id + ": " + err);
                    reject(err);
                });
        });
    }
}