"use strict";

const emailNotifierController = require('../../controllers/email.notifier');
const studentsService = require("../../service/students.service");
const teachersService = require("../../service/teachers.service");
const applicationDecisionEmailTemplate = require("../../templates/application.decision.template");
const studentnotifsService = require("../../service/studentnotifs.service");
const emailNotifier = require("../../notifiers/email.notifier");

beforeEach(() => {
    jest.resetAllMocks();
    // comment these lines if you want to see console prints during tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});


describe('Email Notifier', () => {
    it('Should send an updated application status email', async () => {

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
        studentnotifsService.updateStudentNotificationStatus = jest.fn().mockImplementation(() => {});
        emailNotifier.sendEmailNotification = jest.fn().mockResolvedValue(true);

        await emailNotifierController.sendUpdateApplicationStatusEmail(updatedApplication, 'teacher1', { proposal_id: '1', title: 'test' }, 'accepted');

        expect(studentsService.getStudentById).toHaveBeenCalledTimes(1);
        expect(teachersService.getTeacherById).toHaveBeenCalledTimes(1);
        expect(applicationDecisionEmailTemplate.getEmailSubject).toHaveBeenCalledTimes(1);
        expect(applicationDecisionEmailTemplate.getEmailBody).toHaveBeenCalledTimes(1);
        expect(studentnotifsService.createNewStudentNotification).toHaveBeenCalledTimes(1);
        expect(studentnotifsService.updateStudentNotificationStatus).toHaveBeenCalledTimes(1);

    } );

    it('Should throw an error if the mail cannot be sent', async () => {

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
        studentnotifsService.updateStudentNotificationStatus = jest.fn().mockImplementation(() => {});

        try{
            await emailNotifierController.sendUpdateApplicationStatusEmail(updatedApplication, 'teacher1', { proposal_id: '1', title: 'test' }, 'accepted');
        } catch(err){
            expect(err).toEqual(Error("Error occurred in email notifier"));
        }
        
    } )
});