"use strict";

require('dotenv').config({ path: '../../../.env' });

module.exports = {
    getEmailSubject: (application_decision) => {
        return `Your application for the thesis proposal has been ${application_decision.toLowerCase()}!`;
    },

    getEmailBody: (application_decision, proposal_id, proposal_title, application_date, student, supervisor) => {
        let decision_color = application_decision === "Accepted" ? "#007c00" : "#a60000";
        let button_text = application_decision === "Accepted" ? "View thesis details" : "View all your applications";
        let button_href = application_decision === "Accepted" ? `http://localhost:${process.env.FRONTEND_PORT}/proposals/${proposal_id}` : `http://localhost:${process.env.FRONTEND_PORT}/applications`;

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
                            background-color: ${decision_color};
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
                    <title>${application_decision} application to thesis proposal</title>
                </head>
                <body>
                    <p>Dear ${student},</p>
                    <p>Your application for the thesis proposal 
                        <b>${proposal_title}</b> 
                        has been 
                        <b>${application_decision}</b>!
                    </p>
                    <table class="styled-table">
                        <thead>
                            <tr>
                                <th colspan="2"><b>${application_decision}</b>!</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><b>Thesis Title</b></td>
                                <td>${proposal_title}</td>
                            </tr>
                            <tr>
                                <td><b>Application Date</b></td>
                                <td>${application_date}</td>
                            </tr>
                            <tr>
                                <td><b>Supervisor</b></td>
                                <td>${supervisor}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a class="email-btn" href="${button_href}">${button_text}</a>
                </body>
            </html>
        `;
    }
}