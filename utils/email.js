const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1) create a transporter
    const transport = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        auth: {
            user: process.env.NODEMAILER_USERNAME,
            pass: process.env.NODEMAILER_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOption = {
        from: 'Mohsen Ghaderi <mohsenghaderi.1994@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.text
        //html:
    };

    // 3) send the email
    await transport.sendMail(mailOption);
};

module.exports = sendEmail;
