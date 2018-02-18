var nodemailer = require('nodemailer');  

function sendMails (userMail,yzm,callback) {
    nodemailer.createTestAccount((err, account) => {

        // 账号设置
        let transporter = nodemailer.createTransport({
            host: 'smtp.exmail.qq.com', //定死
            port: 465, //定死
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'admin@liwend.cn', // 发送者账号 
                pass: 'eQfYXP6e2r5bixir'  // 发送者授权码
            }
        });

        // 邮件详情
        let mailOptions = {
            from: 'admin@liwend.cn', // 发送者邮箱
            to: userMail, // 收件人邮箱
            subject: '叮咚博客', // 邮件标题
            // text: 'Hello world?', // 内容
            html: '您好，欢迎注册叮咚博客，<br>您本次请求的验证码为<b>'+yzm+'</b>' // html格式的内容
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, callback);
    })
}
module.exports = sendMails;