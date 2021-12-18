const nodemailer = require('nodemailer');



let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    servce:'gmail',
    port: 465,
    requireTLS: true,
    secure: true,
    auth: {
        user:"digitienda01@gmail.com",
        pass:'digitiendaPass'
    }
});
let sendEmail ={
    sendData: userdata =>{
        var mailOptions = {
            from: '"DIGITIENDA"<digitienda01@gmail.com>',
            to: userdata.email,
            subject: 'Código de verificación para registro de cuenta DIGITIENDA',
            text: userdata.name+" estás a un paso de formar parte de la gran comunidad de DIGITIENDA, tu código de verificación es el siguiente: "+ userdata.code 
        };
        return new Promise((resolve, reject)=>{
            transporter.sendMail(mailOptions,(error,info)=>{
              if (error){
                console.log('Mail hasn´t been sent yet');
                console.log(error);
                return resolve(-1);
              }
			  return resolve(1);
            });
        });
    }
};
module.exports = sendEmail;