const router = require('express').Router()

//redirect / to /dashboard/index
router.route('/').get( (req, res) => {

    res.redirect('/dashboard/index')
  })






module.exports = router;