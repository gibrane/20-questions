var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('fbtest', {
        title: '22 Questions'
    });
});
module.exports = router;