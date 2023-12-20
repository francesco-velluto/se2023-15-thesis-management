"use strict";

const db = require("./db");

module.exports = {
    getSMTPRejectedEmailTeacherNotifications: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT tn.*, t.email FROM teachernotifs tn JOIN teacher t ON t.id = tn.teacher_id WHERE channel = 'Email' AND status = 'SMTP Rejected'", (err, res) => {
                if (err)
                    reject(err);

                resolve(res.rows);
            });
        });
    },

    updateTeacherNotificationStatus: (notification_id, status) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE teachernotifs SET status = $1, lastupdate = NOW() WHERE id = $2";

            db.query(query, [status, notification_id])
                .then((result) => {
                    console.info("[CRONO-MODULE] Teacher notification with id " + notification_id + " updated successfully");
                    resolve();
                })
                .catch((err) => {
                    console.error("[CRONO-MODULE] Error while updating teacher notification with id " + notification_id + ": " + err);
                    reject(err);
                });
        });
    }
}