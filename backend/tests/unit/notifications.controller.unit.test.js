"use strict";

const emailNotifierController = require('../../controllers/email.notifier');
const studentsService = require("../../service/students.service");
const teachersService = require("../../service/teachers.service");
const applicationDecisionEmailTemplate = require("../../templates/application.decision.template");
const studentnotifsService = require("../../service/studentnotifs.service");
const emailNotifier = require("../../notifiers/email.notifier");
const proposalService = require("../../service/proposals.service");
const teachernotifsService = require('../../service/teachernotifs.service');
const applicationTemplate = require('../../templates/application.template');

beforeEach(() => {
    jest.resetAllMocks();
    // comment these lines if you want to see console prints during tests
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "info").mockImplementation(() => { });
    jest.spyOn(console, "error").mockImplementation(() => { });
});


describe('T1 - Email Notifier', () => {
    it('T1.1 | Should send an updated application status email', async () => {

        const mockStudentData = {
            email: 'studentname.studentsurnme@example.com',
            surname: 'studentsurname',
            name: 'studentname'
        }

        const mockTeacherData = {
            surname: 'teachersurname',
            name: 'teachername'
        }

        const updatedApplication = {
            student_id: 'student1',
            id: '1',
            proposal_id: '1',
            status: 'accepted',
            application_date: '16-03-2023'
        }

        studentsService.getStudentById = jest.fn().mockResolvedValue({ data: mockStudentData });
        teachersService.getTeacherById = jest.fn().mockResolvedValue({ data: mockTeacherData });
        applicationDecisionEmailTemplate.getEmailSubject = jest.fn().mockReturnValue('Your application for the thesis proposal has been accepted!');
        applicationDecisionEmailTemplate.getEmailBody = jest.fn().mockReturnValue('Email body in html!');
        studentnotifsService.createNewStudentNotification = jest.fn().mockResolvedValue({ notificationId: '1' });
        studentnotifsService.updateStudentNotificationStatus = jest.fn().mockImplementation(() => { });
        emailNotifier.sendEmailNotification = jest.fn().mockResolvedValue(true);

        await emailNotifierController.sendUpdateApplicationStatusEmail(updatedApplication, 'teacher1', { proposal_id: '1', title: 'test' }, 'accepted');

        expect(studentsService.getStudentById).toHaveBeenCalledTimes(1);
        expect(teachersService.getTeacherById).toHaveBeenCalledTimes(1);
        expect(applicationDecisionEmailTemplate.getEmailSubject).toHaveBeenCalledTimes(1);
        expect(applicationDecisionEmailTemplate.getEmailBody).toHaveBeenCalledTimes(1);
        expect(studentnotifsService.createNewStudentNotification).toHaveBeenCalledTimes(1);
        expect(studentnotifsService.updateStudentNotificationStatus).toHaveBeenCalledTimes(1);

    });

    it('T1.2 | Should throw an error if the mail cannot be sent', async () => {

        const mockStudentData = {
            email: 'studentname.studentsurnme@example.com',
            surname: 'studentsurname',
            name: 'studentname'
        }

        const mockTeacherData = {
            surname: 'teachersurname',
            name: 'teachername'
        }

        const updatedApplication = {
            student_id: 'student1',
            id: '1',
            proposal_id: '1',
            status: 'accepted',
            application_date: '16-03-2023'
        }

        studentsService.getStudentById = jest.fn().mockResolvedValue({ data: mockStudentData });
        teachersService.getTeacherById = jest.fn().mockResolvedValue({ data: mockTeacherData });
        applicationDecisionEmailTemplate.getEmailSubject = jest.fn().mockReturnValue('Your application for the thesis proposal has been accepted!');
        applicationDecisionEmailTemplate.getEmailBody = jest.fn().mockReturnValue('Email body in html!');
        studentnotifsService.createNewStudentNotification = jest.fn().mockResolvedValue({ notificationId: '1' });
        emailNotifierController.sendEmailNotification = jest.fn().mockImplementation(() => { return false; });
        studentnotifsService.updateStudentNotificationStatus = jest.fn().mockImplementation(() => { });

        try {
            await emailNotifierController.sendUpdateApplicationStatusEmail(updatedApplication, 'teacher1', { proposal_id: '1', title: 'test' }, 'accepted');
        } catch (err) {
            expect(err).toEqual(Error("Error occurred in email notifier"));
        }

    })
});

describe('T2 - sendNewApplicationEmail', () => {
    const proposal_id = "P001";
    const student_id = "S001";

    const newApplication = {
        id: 'A001',
        student_id: student_id,
        proposal_id: proposal_id,
        status: 'accepted',
        application_date: '16-03-2023'
    };

    const proposal = {
        proposal_id: proposal_id,
        title: "New Proposal",
        supervisor_id: "T001",
        keywords: ["Keyword1", "Keyword2"],
        type: "Experimental",
        groups: ["GroupA"],
        description: "Test description",
        required_knowledge: "Node.js, PostgreSQL",
        notes: "Test notes",
        expiration_date: "2024-12-31",
        level: "Master",
        programmes: ["Master of science"],
    };

    const student = {
        id: student_id,
        surname: "Surname",
        name: "Name",
        gender: "F",
        nationality: "French",
        email: "student@example.com",
        cod_degree: 'MS001',
        enrollment_year: "2018"
    };

    it('T2.1 | Should send a warning of a new applications inserted by email', async () => {
        proposalService.getProposalById = jest.fn().mockResolvedValue({ data: proposal });
        studentsService.getStudentById = jest.fn().mockResolvedValue({ data: student });        
        applicationTemplate.getEmailSubject = jest.fn().mockReturnValue('Your application for the thesis proposal has been accepted!');
        applicationTemplate.getEmailBody = jest.fn().mockReturnValue('Email body in html!');
        teachernotifsService.createNewTeacherNotification = jest.fn().mockResolvedValue({ notificationId: newApplication.id });
        teachernotifsService.updateTeacherNotificationStatus = jest.fn().mockImplementation(() => { });
        emailNotifier.sendEmailNotification = jest.fn().mockResolvedValue(true);

        await emailNotifierController.sendNewApplicationEmail(newApplication.id, newApplication.application_date, newApplication.proposal_id, newApplication.student_id);

        expect(proposalService.getProposalById).toHaveBeenCalledTimes(1);
        expect(studentsService.getStudentById).toHaveBeenCalledTimes(1);
        expect(applicationTemplate.getEmailSubject).toHaveBeenCalledTimes(1);
        expect(applicationTemplate.getEmailBody).toHaveBeenCalledTimes(1);
        expect(teachernotifsService.createNewTeacherNotification).toHaveBeenCalledTimes(1);
        expect(teachernotifsService.updateTeacherNotificationStatus).toHaveBeenCalledTimes(1);
    });

    it('T2.2 | Should throw an error if the mail cannot be sent', async () => {
        proposalService.getProposalById = jest.fn().mockResolvedValue({ data: proposal });
        studentsService.getStudentById = jest.fn().mockResolvedValue({ data: student });        
        applicationTemplate.getEmailSubject = jest.fn().mockReturnValue('Your application for the thesis proposal has been accepted!');
        applicationTemplate.getEmailBody = jest.fn().mockReturnValue('Email body in html!');
        teachernotifsService.createNewTeacherNotification = jest.fn().mockResolvedValue({ notificationId: newApplication.id });
        teachernotifsService.updateTeacherNotificationStatus = jest.fn().mockImplementation(() => { });
        emailNotifier.sendEmailNotification = jest.fn().mockImplementation(() => { return false; });
        
        try {
            await emailNotifierController.sendNewApplicationEmail(newApplication.id, newApplication.application_date, newApplication.proposal_id, newApplication.student_id);
        } catch (err) {
            expect(err).toEqual(Error("Error occurred in email notifier"));
        }
    })
});