const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '40943130@gm.nfu.edu.tw',
        pass: 'jjbb ytjd fgwc wpog',
    }
});

exports.sendVerificationEmail = async (email, token) => {
    const url = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    const mailOptions = {
        from: '"MyApp" 40943130@gm.nfu.edu.tw',
        to: email,
        subject: 'Please verify your account',
        html: `<p>請點擊下方連結驗證帳號：</p><a href="${url}">${url}</a>`
    };

    return transporter.sendMail(mailOptions);
};