require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express()

const connection = require('./api/config/db')


// Ensure that the connection is etablished with the DB
connection.once('open', () => {
    console.log("DB connected.");
})

// Enable Cross-origin resource sharing

const cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(cookieParser());
app.use(express.json())
app.use(express.static('public'));
// set the view engine to ejs
app.set('view engine', 'ejs');

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`Successfully served on port: ${PORT}.`);
})

const userRoutes = require('./api/controllers/api.controller')
const dashboardRoutes = require('./api/controllers/dashboard.controller')
const defaultRoutes = require('./api/routes/default')

app.use('/', defaultRoutes)
app.use('/api', userRoutes)
app.use('/dashboard', dashboardRoutes)

//404
app.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('errors-handling/404', { url: req.url, active_page: "404" });
      return;
    }
  
    // respond with json
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
  
    // default to plain-text. send()
    res.type('txt').send('Not found');
  });