const Alerts = require('../models/alert.model.js')
const nodemailer = require('nodemailer');

function sendNotification(to, subject, text){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
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

}

const Alerting = function (data){

Alerts.find({}, function (err, triggers){
    if(!(triggers === null || triggers === undefined)){
        for (trigger of triggers){

        let Trigger_ = trigger["Trigger"];
        let Type_ = trigger["Type"];

            if(Trigger_ == data[Type_]){

                sendNotification("totofrancois03@gmail.com", `${Trigger_} has been triggered.`, data["Message"])
                console.log("TRIGGER: " + data[Type_])
            }
        }
    
    }})
    
}

module.exports = Alerting;
