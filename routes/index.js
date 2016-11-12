var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: '20 Questions'
    });
});
router.get('/:id', function (req, res, next) {
    res.render('index', {
        title: '20 Questions'
        , id: req.params.id
    });
});
module.exports = router;