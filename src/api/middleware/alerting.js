const Alerts = require('../models/alert.model.js')
const nodemailer = require('nodemailer');

function sendNotification(type, to, subject, text){

    switch(type){
        case 'SMTP':
            var transporter = nodemailer.createTransport({
                host: process.env.SMTP_SERVER,
                port: process.env.SMTP_PORT, 
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });
          
            var mailOptions = {
                from: process.env.EMAIL_USER,
                to: to,
                subject: subject,
                text: text
            };
    
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            }); 
        case 'SES':
            //WORK IN PROGRESS
            
        case 'AZURE':
    }



}

const Alerting = function (data){

Alerts.find({}, function (err, triggers){
    if(!(triggers === null || triggers === undefined)){
        for (trigger of triggers){

        let Trigger_ = trigger["Trigger"];
        let Type_ = trigger["Type"];
        let To_ = trigger["To"];

            if(Trigger_ == data[Type_]){

                sendNotification(To_, `${Trigger_} has been triggered.`, data["Message"])

            }
        }
    
    }})
    
}

module.exports = Alerting;
