var express = require('express');
var request = require('request');
var router = express.Router();
/* GET home page. */
var words = [];

function getWord(res) {
    request("http://www.setgetgo.com/randomword/get.php?len=6", function (error, response, body) {
        words.push(body);
        if (words.length === 1) {
            res.send(words);
            words = [];
        }
        else {
            setTimeout(function () {
                getWord(res);
            }, 60);
        }
    })
}
router.get('/roomname', function (req, res, next) {
    getWord(res);
});
module.exports = router;