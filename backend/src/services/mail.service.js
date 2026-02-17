import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        User: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

export async function sendEmail({ to, subject, text }) {
    await transporter.sendEmail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
}