var Game = require('../models/game')


exports.insert = function(req, res) {
    var game = new Game();
    game.game = req.body.game;
    game.courts = req.body.courts;
    game.courtNames = req.body.courtNames;

    error = game.validateSync();
    if (error) {
        res.send("Something is wrong with the values entered!" + error);
    } else {
        game.save(function(err) {
            if(err){
                res.send("Email already exists! Duplicate Email.")
            } else{
                res.send(game.game + " added succesfully to MongoDB");
            }
        });
    }
}