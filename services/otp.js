const nodemailer = require('nodemailer');

async function otpSend(email,otp){
    const transporter = nodemailer.createTransport({
        service : "gmail",
        host : "smtp.gmail.com",
        port : 587,
        secure : false,
        auth : {
            user : process.env.MAIL_USER,
            pass : process.env.MAIL_PASS
        }
    });
    await transporter.sendMail({
        from: process.env.MAIL_USER, 
        to: [email,"sree2002cr@gmail.com"],
        subject: "Login OTP", 
        text: "OTP",
        html: `<b>${otp}</b><h3> is your login otp</h3>`
    });
} 

module.exports = otpSend;