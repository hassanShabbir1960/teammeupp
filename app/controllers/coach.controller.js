const crypto = require('crypto');
var Coach = require('../models/coach')


exports.insert = function(req, res) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

    var coach = new Coach();
    coach.coachName = req.body.coachName;
    coach.email = req.body.email;
    coach.password = req.body.password;

    error = coach.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        coach.save(function(err) {
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(coach.coachName + " added succesfully to MongoDB");
            }
        });
    }
}