const nodemailer = require('nodemailer');



let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    servce:'gmail',
    port: 465,
    requireTLS: true,
    secure: true,
    auth: {
        user:"ecastoreofficial@gmail.com",
        pass:'ecaStore12$'
    }
});
let sendEmail ={
    sendData: userdata =>{
        var mailOptions = {
            from: '"EcaStore"<ecastoreofficial@gmail.com>',
            to: userdata.email,
            subject: 'Código de verificación para registro de cuenta EcaStpre',
            text: userdata.name+" estás a un paso de formar parte de la gran comunidad de EcaStore, tu código de verificación es el siguiente: "+ userdata.code 
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