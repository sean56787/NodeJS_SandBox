//信箱驗證 預設不啟用此功能

const nodemailer = require('nodemailer');
const senderEmail = '';
const appPassword = '';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: senderEmail,
        pass: appPassword, // 輸入GOOGLE應用程式密碼才能使用email驗證功能
    }
});

exports.sendVerificationEmail = async (email, token) => { 
    if(senderEmail == '' || appPassword == ''){
        throw new Error('need sender email / GmailAppPwd');
    }

    const url = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    const mailOptions = {                   // 信件相關設定
        from: `"MyApp" ${senderEmail}`,
        to: email,
        subject: 'Please verify your account',
        html: `<p>請點擊下方連結驗證帳號：</p><a href="${url}">${url}</a>`
    };
    
    return transporter.sendMail(mailOptions);
};