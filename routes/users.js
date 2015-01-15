var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    db.collection('userlist').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser.
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function(err, result) {
        res.send(
        	(result === 1) ? { msg: '' } : { msg:'error: ' + err }
        );
    });
});

/*
 * MODIFY to modifyuser.
 */
router.put('/modifyuser/:id', function(req, res) {
    var db = req.db;
    var userToModify = req.params.id;
	db.collection('userlist').updateById(userToModify, req.body, {safe:true, multi:false}, function(err, result) {
	res.send(
		(result === 1) ? { success: 1 } : { success:0, msg: err }
	);
	});
});

module.exports = router;
