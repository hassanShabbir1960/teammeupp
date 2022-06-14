const crypto = require('crypto');
var Admin = require('../models/admin')


exports.insert = function(req, res) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

    var admin = new Admin();
    admin.username = req.body.username;
    admin.email = req.body.email;
    admin.password = req.body.password;

    error = admin.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        admin.save(function(err) {
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(admin.username + " added succesfully to MongoDB");
            }
        });
    }
}