import nodemailer from 'nodemailer';
import {
  SENDER_EMAIL,
  SENDER_PASSWORD,
  MAIL_HOST
} from '$env/static/private';

export async function attachemail(subject, content, userEmail) {
    const transporter = nodemailer.createTransport({
        host: MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: SENDER_EMAIL,
            pass: SENDER_PASSWORD
        }
    });

    const mailOptions = {
        from: SENDER_EMAIL,
        to: userEmail,
        subject,
        html: `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1 { color: #A020F0; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
}
