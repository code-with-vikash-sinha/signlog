const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail", // you can use Outlook, Yahoo, etc.
    auth: {
        user: "sinhaharsh596@gmail.com",   // replace with your email
        pass: "bmiiyubmkuwkxipy",     // app password (not your normal Gmail password)
    },
});

module.exports = transporter;
