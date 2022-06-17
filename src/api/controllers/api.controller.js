//express
const router = require('express').Router()

//middlewares
const auth = require('../middleware/api.auth')
const Log = require('../middleware/log')
//models
const Info = require('../models/info.model')
const User = require('../models/user.model')
const AuditedUser = require('../models/audit.model');
const AuditedUserHistory = require('../models/audit.history.model');
const Events = require('../models/audit.events.model')
//packages
const generateApiKey = require('generate-api-key');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

//DEBUG MODE
const debug_mode = process.env.DEBUG_MODE
console.log(debug_mode)
function clog(comment,data){

  if (debug_mode === "true"){

    console.log(comment + JSON.stringify(data));
  
  }

}

// Parsing function for events

function Parsing(data, line, replace){

  var parsed = data.split('\n')[line];

  

  if(!(replace === null || replace === "" || replace === undefined)){
    var replaced = parsed.replace(/\s/g, '')
    var replaced_ = replaced.replace(replace, '')
  
    return replaced_
  }else{

    return parsed
  }

}



// Audited Data Related - Mass data
router.route('/push/data').post(auth, (req, res) => {
  const newUser = new AuditedUser(req.body)

  newUser.save()
      .then(user => res.json(user))
      .catch(err => res.status(400).json("Error! " + err))
})

// Audited Data Related - Info about DC host
router.route('/push/data/:domain').post(auth, (req, res) => {
  

  const Domain = req.params.domain;

  const ObjectGUID = req.body.ObjectGUID;
  const SAMAccountName = req.body.SAMAccountName;
  const whenchanged = req.body.whenchanged;
  const whencreated = req.body.whencreated;
  const Enabled = req.body.Enabled;
  const UserPrincipalName = req.body.UserPrincipalName;
  const DisplayName = req.body.DisplayName;
  const PasswordLastSet = req.body.PasswordLastSet;


  const body = {
    "ObjectGUID": ObjectGUID,
    "Domain": Domain,
    "SAMAccountName": SAMAccountName,
    "DisplayName": DisplayName,
    "UserPrincipalName": UserPrincipalName,
    "whenchanged": whenchanged,
    "whencreated": whencreated,
    "PasswordLastSet": PasswordLastSet,
    "Enabled": Enabled

  }
  
  const filter = {ObjectGUID: ObjectGUID};

  const newEntry = new AuditedUserHistory(body)

  clog("body", body);

  if (!(ObjectGUID && SAMAccountName && whenchanged && whencreated)) {
    res.status(400).send("Missing JSON key(s).");
  }else{

  newEntry.save((err, users) => {

    if(err) {
      Log.push_log({
        file: 'api.controller.js',
        line: '45',
        info: err,
        type: 'error'
    });
    }

      //clog("save:", users);

      AuditedUser.updateOne(filter, body, {upsert: true}, (err, users) => {
        if(err) {
              Log.push_log({
                file: 'api.controller.js',
                line: '58',
                info: err,
                type: 'error'
              }, function(){
                res.status(400).json("Error! " + err)
              });

        }

        //clog("update:",users);

        res.json(users);
        
      })

  })
  }
})
// Audited Data Related - Info about DC host
router.route('/push/events/:domain').post(auth, (req, res) => {
  

  const Domain = req.params.domain;
  const Message = req.body.Message;


  const EventID = req.body.EventID;
  const DisplayName = req.body.DisplayName;
  const MachineName = req.body.MachineName;
  const TimeCreated = req.body.TimeCreated;
  const TaskDisplayName = req.body.TaskDisplayName;
  const RecordID = req.body.RecordID;
  const Action = Parsing(Message, 0)
  const Subject_AccountName = Parsing(Message, 4, "AccountName:")
  const Subject_DomainName = Parsing(Message, 5, "AccountDomain:")
  const Target_AccountName = Parsing(Message, 10, "AccountName:")
  const Target_DomainName = Parsing(Message, 11, "AccountDomain:")

  const body = {
    "EventID": EventID,
    "Domain": Domain,
    "DisplayName": DisplayName,
    "MachineName": MachineName,
    "TimeCreated": TimeCreated,
    "Action": Action,
    "Subject_AccountName": Subject_AccountName,
    "Subject_DomainName": Subject_DomainName,
    "Target_AccountName": Target_AccountName,
    "Target_DomainName": Target_DomainName,
    "TaskDisplayName": TaskDisplayName,
    "RecordID": RecordID

  }
  
  const newEntry = new Events(body)

  clog("body", body);

  if (!(RecordID && Message && Domain)) {
    res.status(400).send("Missing JSON key(s).");
  }else{

  newEntry.save((err, events) => {

    if(err) {
      Log.push_log({
        file: 'api.controller.js',
        line: '45',
        info: err,
        type: 'error'
    });

    res.status(400).send(err);

    }

    res.json(events);

  })
  }
})



// Audited Data Related - Info about DC host
router.route('/push/info').post(auth, (req, res) => {
 
  const filter = {ID: req.body.ID};
  
  Info.updateOne(filter, req.body, {upsert: true})
      .then(info => res.json(info))
      .catch(err => res.status(400).json("Error! " + err))
})


router.route('/audit/reports/:Domain').get(auth, async (req, res) => {
  const Domain = req.params.Domain;
  const filter = {Domain: Domain};
  const data = await AuditedUser.find(filter);

  res.json(data);


})

router.route('/audit/reports/events/:Domain').get(auth, async (req, res) => {
  const Domain = req.params.Domain;
  const filter = {Domain: Domain};
  const data = await Events.find(filter);

  res.json(data);


})


// Get History By User ID
router.route('/audit/users/:ObjectGUID').get(auth, async (req, res) => {
  const ObjectGUID = req.params.ObjectGUID;

  const filter = {ObjectGUID: ObjectGUID};
  


  const user_history = await AuditedUserHistory.find(filter);

  res.json(user_history);

})

router.route('/generate/apikey').post(auth, async (req, res) => {

  const APIkey = generateApiKey({ method: 'string', length: 32 });
  const encryptedAPIkey = await bcrypt.hash(APIkey, 10);
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const filter = {user_id: decoded.user_id};
  const update = {apikey: encryptedAPIkey};


  const user = await User.findOneAndUpdate(filter, update);

  res.send(APIkey);
})

router.route('/logs/delete').get(auth, async (req, res) => {

  Log.deleteAllLogs(function(err, callback){
    res.redirect('/dashboard/index');
  })

  
})

//--------------

router.route('/register').post( async (req, res) => {

// Our register logic starts here
try {

  // Get user input
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;
  const validation_token = req.body.validation_token;

  // Validate user input
  if (!(email && password && first_name && last_name && validation_token)) {
    res.status(400).send("All input is required");
  }

  if(validation_token === process.env.VALIDATION_TOKEN){
  // check if user already exist
  // Validate if user exist in our database
  const oldUser = await User.findOne({ email });

  if (oldUser) {
    
    return res.status(409).send("User Already Exist. Please Login");
  }
  //Encrypt user password and apikey
  encryptedPassword = await bcrypt.hash(password, 10);
  // Create user in our database
  const user = await User.create({
    first_name,
    last_name,
    email: email.toLowerCase(), // sanitize: convert email to lowercase
    password: encryptedPassword,
    apikey: "" //empty apikey
  });

  // Create token
  const token = jwt.sign(
    { user_id: user._id, email },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );
  // save user token
  user.token = token;
  // 
  //store token to cookies
  res.cookie('token',token, { maxAge: 7200000 })

  res.redirect("/dashboard/index")
}else{

  return res.status(409).send("Invalid validation token.");
}

} catch (err) {

  console.log(err);
}

})


// login using basic auth

router.route('/login/user').post( async (req, res) => {

  //const method = req.params.method;
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      //store token in cookies 
      res.cookie('token',token, { maxAge: 7200000 })
      res.redirect("/dashboard/index")

    }else{
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    Log.push_log({
      file: 'audit.controller.js',
      line: '183',
      info: err,
      type: 'error'
  });
    console.log(err);
  }
  // Our register logic ends here

})

// login using APIkey
router.route('/login/key').post( async (req, res) => {
  
  // Our login logic starts here
  try {
    // Get user input
    const { apikey } = req.body;
    const encryptedAPIkey = await bcrypt.hash(apikey, 10);

    // Validate user input
    if (!(apikey)) {
      res.status(400).send("Api Key is required");
    }
    const user = await User.findOne({ encryptedAPIkey });

    if (await bcrypt.compare(apikey, user.apikey)) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, encryptedAPIkey },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      // user
      res.status(200).json(user);
    }else{
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    Log.push_log({
      file: 'audit.controller.js',
      line: '183',
      info: err,
      type: 'error'
  });

    console.log(err);
  }
  // Our register logic ends here

})

module.exports = router;