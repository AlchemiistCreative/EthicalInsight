//express
const router = require('express').Router()

//middlewares
const auth = require('../middleware/dashboard.auth')
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



router.route('/').get( (req, res) => {
  res.redirect('/dashboard/index')
})

router.route('/register').get( (req, res) => {
    const active_page = "register";

    res.render('register', {
      active_page: active_page
    })
  })

router.route('/login').get( (req, res) => {
    const active_page = "login";
    res.render('login', {
      active_page: active_page
    })

})

router.route('/test').get( (req, res) => {
    Log.push_log({
      file: 'audit.controller.js',
      line: '183',
      info: 'test',
      type: 'error'
  });

  })


router.route('/index').get(auth, async (req, res) => {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user_id = {user_id: decoded.user_id};
    const today = new Date();
    const date = today.toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });;
    const count = await Info.countDocuments()
    const active_page = "index";


    User.getUserById(user_id, function(err, user){
      //check err
      if (err) throw err;

      Info.find(function(err, infos){
        if (err) throw err;

        Log.getAllLogs(function(err, logs){
          if (err) throw err;

            res.render('index', {
              first_name: user.first_name,
              last_name: user.last_name,
              email: user.email,  
              date: date,
              infos: infos,
              count: count,
              active_page: active_page,
              logs: logs
            })

        })
      })

    })
})
  

//Generate APIKey (need to have a valid token)
router.route('/settings').get(auth, async (req, res) => {

    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user_id = {user_id: decoded.user_id};
    const today = new Date();
    const date = today.toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });;
    const count = await Info.countDocuments()
    const active_page = "settings";


    User.getUserById(user_id, function(err, user){
      //check err
      if (err) throw err;

      Info.find(function(err, infos){

        Log.getAllLogs(function(err, logs){
          if (err) throw err;

          res.render('settings', {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,  
            date: date,
            infos: infos,
            count: count,
            active_page: active_page,
            logs: logs
          })
        
        })

      })

    })
})


router.route('/generate/api/key').get(auth, async (req, res) => {

  const APIkey = generateApiKey({ method: 'string', length: 32 });
  const encryptedAPIkey = await bcrypt.hash(APIkey, 10);
  const token = req.cookies.token; 
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const filter = {user_id: decoded.user_id};
  const update = {apikey: encryptedAPIkey};
  const user = await User.findOneAndUpdate(filter, update);

  res.status(200).json(APIkey);
})



router.route('/audit/reports/domain/:domain').get(auth, async (req, res) => {
  
  const domain_name = req.params.domain;
  const token = req.cookies.token
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const user_id = {user_id: decoded.user_id};
  const today = new Date();
  const date = today.toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const active_page = "reports";
  const total_users = await AuditedUser.countDocuments()
  const total_enabled_users = await AuditedUser.countDocuments({Enabled: true})
  const total_disabled_users = await AuditedUser.countDocuments({Enabled: false})

  User.getUserById(user_id, function(err, user){
    //check err
    if (err) throw err;

    Info.getInfoByName(domain_name, function(err, infos){
      if (err) throw err;


      if(!(infos)){
        res.send(domain_name + " is not a valid domain name.")
      }else{
        let last_run = infos.last_run
        let last_run_date = new Date(parseInt(last_run.substr(6)));

        let last_run_date_ = last_run_date.toLocaleTimeString('en-us', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute:'2-digit',
          second: '2-digit'
        }); 

        Log.getAllLogs(function(err, logs){
          if (err) throw err;
  
          res.render('reports', {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,  
            date: date,
            active_page: active_page,
            logs: logs,
            domain_name: infos.Domain,
            last_run: last_run_date_,
            total_users: total_users,
            total_enabled_users: total_enabled_users,
            total_disabled_users: total_disabled_users
          })
        })
      }
    })
  })
})

// Advanced Audit report page

router.route('/audit/reports/events/:domain').get(auth, async (req, res) => {
  
  const domain_name = req.params.domain;
  const token = req.cookies.token
  const decoded = jwt.verify(token, process.env.TOKEN_KEY);
  const user_id = {user_id: decoded.user_id};
  const today = new Date();
  const date = today.toLocaleString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });;
  const total_events = await Events.countDocuments({})
  const total_created_users = await Events.countDocuments({Action: { "$regex": "enabled", "$options": "i" }})
  const total_deleted_users = await Events.countDocuments({Action: { "$regex": "deleted", "$options": "i" }})
  const active_page = "report_events";

  User.getUserById(user_id, function(err, user){
    //check err
    if (err) throw err;

    Info.getInfoByName(domain_name, function(err, infos){
      if (err) throw err;


      if(!(infos)){
        res.send(domain_name + " is not a valid domain name.")
      }else{
        let last_run = infos.last_run
        let last_run_date = new Date(parseInt(last_run.substr(6)));

        let last_run_date_ = last_run_date.toLocaleTimeString('en-us', {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute:'2-digit',
          second: '2-digit'
        }); 

        Log.getAllLogs(function(err, logs){
          if (err) throw err;
  
          res.render('reports', {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,  
            date: date,
            active_page: active_page,
            logs: logs,
            domain_name: infos.Domain,
            last_run: last_run_date_,
            total_events: total_events,
            total_created_users: total_created_users,
            total_deleted_users: total_deleted_users
          })
        })
      }
    })
  })
})



// Get History By User ID
router.route('/audit/reports/users/:ObjectGUID').get(auth, async (req, res) => {
  const ObjectGUID = req.params.ObjectGUID;

  const filter = {ObjectGUID: ObjectGUID};
  


  const user_history = await AuditedUserHistory.find(filter);

  res.send(user_history);

})

router.route('/logout').get(auth, async (req, res) => {
  
  res.clearCookie("token");
  res.redirect('/')
})

module.exports = router;