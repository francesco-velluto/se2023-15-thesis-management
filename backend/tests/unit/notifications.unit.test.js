const nodemailer = require('nodemailer');
const emailNotifier = require('../../notifiers/email.notifier');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn(),
    }),
}));

beforeEach(() => {
    // comment these lines if you want to see console prints during tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "info").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
});

describe('Email Notifier', () => {
    beforeEach(() => {
        nodemailer.createTransport().sendMail.mockClear();
    });

    it('Should return info when sendMail is successful', async () => {
        const mockInfo = "Mock info";
        nodemailer.createTransport().sendMail.mockImplementation((mailOptions, callback) => {
            callback(null, mockInfo);
        });

        const result = await emailNotifier.sendEmailNotification('1', 'studentname.studentsurname@example.com', 'Test Subject', 'Test Content');

        expect(result).toEqual(mockInfo);
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
            from: process.env.SMTP_USERNAME,
            to: 'studentname.studentsurname@example.com',
            subject: 'Test Subject',
            html: 'Test Content',
        }, expect.any(Function));
    });

    it('Should return null when sendMail encounters an error', async () => {
        nodemailer.createTransport().sendMail.mockImplementation((mailOptions, callback) => {
            callback("Mock error", null);
        });

        const result = await emailNotifier.sendEmailNotification('1', 'studentname.studentsurname@example.com', 'Test Subject', 'Test Content');

        expect(result).toBeNull();
        expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
            from: process.env.SMTP_USERNAME,
            to: 'studentname.studentsurname@example.com',
            subject: 'Test Subject',
            html: 'Test Content',
        }, expect.any(Function));
    });
});