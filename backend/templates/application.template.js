"use strict";

require('dotenv').config({ path: '../../../.env' });

module.exports = {
    getEmailSubject: (student) => {
        return student + " has applied for your thesis proposal!";
    },

    getEmailBody: (student, supervisor, proposal_id, proposal_title, proposal_expiration_date, application_date, application_id) => {
        return `
            <html>
                <head>
                    <style type="text/css">
                        .email-btn {
                            text-decoration: none;
                            background-color: #FFFFFF;
                            padding: 8px 16px;
                            border-radius: 4px;
                            border: 1px solid rgba(0, 0, 0, 0.15);
                            font-weight: bold;
                        }
                        
                        .styled-table {
                            border-collapse: collapse;
                            margin: 25px 0;
                            font-size: 0.9em;
                            font-family: sans-serif;
                            min-width: 400px;
                            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                        }
                        
                        .styled-table thead tr {
                            background-color: #003576;
                            color: #ffffff;
                            text-align: left;
                        }
                        
                        .styled-table th,
                        .styled-table td {
                            padding: 12px 15px;
                        }
                        
                        .styled-table tbody tr {
                            border-bottom: 1px solid #dddddd;
                        }
                        
                        .styled-table tbody tr:nth-of-type(even) {
                            background-color: #f3f3f3;
                        }
                        
                        .styled-table tbody tr:last-of-type {
                            border-bottom: 2px solid #009879;
                        }
                        
                        .styled-table tbody tr.active-row {
                            font-weight: bold;
                            color: #009879;
                        }
                    </style>
                </head>
                <body>
                    <p>Dear professor ${supervisor},</p>
                    <p><b>${student}</b> has just applied for your thesis proposal <strong>${proposal_title}</strong>!</p>
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th colspan="2"><b>${proposal_title}</b></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Student</b></td>
                                <td>${student}</td>
                            </tr>
                            <tr>
                                <td><b>Application Date</b></td>
                                <td>${application_date}</td>
                            </tr>
                            <tr>
                                <td><b>Proposal Expiration Date</b></td>
                                <td>${proposal_expiration_date}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a class="email-btn" href="http://localhost:${process.env.FRONTEND_PORT}/applications/${application_id}">View application details</a>
                    <a class="email-btn" href="http://localhost:${process.env.FRONTEND_PORT}/proposals/${proposal_id}">View proposal details</a>
                </body>
            </html>
        `;
    }
}