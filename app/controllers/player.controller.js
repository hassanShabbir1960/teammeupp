var Player = require('../models/player')
var passport = require('passport');

exports.insert = function(req, res) {
    var player = new Player();

    player.playerName = req.body.playerName;
    player.email = req.body.email;
    player.setPassword(req.body.password);
    player.playerRanking = req.body.playerRanking;
    player.opponentRanking = req.body.opponentRanking;
    player.playerInterest = req.body.playerInterest;

    error = player.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        player.save(function(err) {
            var token = player.generateToken();
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(player.playerName + " added succesfully to MongoDB! Token: " + token);
            }
        });
    }
}

exports.update = function(req, res) {
    var conditions = { _id: req.params.id };

    Player.update(conditions, req.body).then(player => {
        if (!player) { return res.status(404).send();}
        return res.status(200).json(player);
    });
};

exports.getAll = function(req, res) {
    var obj = (req.body);
    var playerID = obj.id;
    var query = Player.find({}).sort({ _id: -1 });
    
    query.exec(function (err, response) {
        if (err) {
            return res.status(400).json({ status: 400, data: err, message: "Error" });
        }
        else {
            return res.status(200).json({ status: 200, data: response, message: "Success" });
        }
    });
};

exports.getPlayerbyEmail = function(req, res) {
    var conditions = { email: req.params.email };
    var query = Player.findOne(conditions);
    console.log("Got here!!!!!");
    query.exec(function(err, response) {
        if(err) return res.status(400).json({ status: 400, data: err, message: "Error" });
        else return res.status(200).json({ status: 200, data: response, message: "Success" });
    });
}

exports.getPlayer = function(req, res) {
    var conditions = { _id: req.params.id };
    var query = Player.findById(conditions);

    query.exec(function(err, response) {
        if(err) return res.status(400).json({ status: 400, data: err, message: "Error" });
        else return res.status(200).json({ status: 200, data: response, message: "Success" });
    });
};

exports.login = function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        var token;
        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }
  
        // If a user is found
        if(user){
            console.log("User Logged in!");
            token = user.generateToken();
            res.status(200);
            res.json({
            "token" : token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);  
};


