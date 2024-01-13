"use strict";

const db = require("./db");

module.exports = {
    getSMTPRejectedEmailStudentNotifications: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT sn.*, s.email FROM studentnotifs sn JOIN student s ON sn.student_id = s.id WHERE channel = 'Email' AND status = 'SMTP Rejected'", (err, res) => {
                if (err)
                    reject(err);

                resolve(res.rows);
            });
        });
    },

    updateStudentNotificationStatus: (notification_id, status) => {
        return new Promise((resolve, reject) => {
            const query = "UPDATE studentnotifs SET status = $1, lastupdate = NOW() WHERE id = $2";

            db.query(query, [status, notification_id])
                .then((result) => {
                    console.info("[CRONO-MODULE] Student notification with id " + notification_id + " updated successfully");
                    resolve();
                })
                .catch((err) => {
                    console.error("[CRONO-MODULE] Error while updating student notification with id " + notification_id + ": " + err);
                    reject(err);
                });
        });
    }
}