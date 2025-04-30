import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { envConfig } from './env.js';

const transporter = nodemailer.createTransport({
    service: envConfig.EMAIL_SMTP_SERVICE_NAME,
    host: envConfig.EMAIL_SMTP_HOST,
    port: envConfig.EMAIL_SMTP_PORT,
    secure: envConfig.EMAIL_SMTP_SECURE,
    auth: {
        user: envConfig.EMAIL_SMTP_USER,
        pass: envConfig.EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});

export const sendEmail = async ({ from, to, subject, html }) => {
    const result = await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });

    return result;
};

export const renderMailHtml = async (template, data) => {
    const content = await ejs.renderFile(path.join('views', `mail/${template}`), data);
    return content;
};

