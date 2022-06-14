const mongoose = require('mongoose');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const config = require('./config/database');
const morgan = require('morgan');
const passport = require("passport");
const cors = require('cors');
const Game = require('./app/models/game');

//local modules or models...
const api = require('./app/routes/api')(router);
require("./app/models/player");
require("./app/config/auth"); 

var port  = process.env.port || 3000;   //port we would be listening on, first argument is for deployment tools will come back to it later...

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use('/api', api);

//mongodb connection...
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, function(err) {
    if (err) console.log("MongoDB disconnected, err" + err);
    else console.log("MongoDB Connected!");
});

var db = mongoose.connection;
db.once('open', function() {
    var games = [
        { "name": "Tennis", "courtNames": ["TenC1", "TenC2", "TenC3", "TenC4", "TenC5", "TenC5", "TenC6", "TenC7", "TenC8", "TenC9", "TenC10"] },
        { "name": "Badminton", "courtNames": ["BDM1", "BDM2", "BDM3", "BDM4", "BDM5", "BDM6", "BDM7", "BDM8"]},
        { "name": "Table Tennis", "courtNames": ["TT1", "TT2", "TT3", "TT4", "TT5", "TT6", "TT7", "TT8", "TT9", "TT10", "TT11", "TT12", "TT13", "TT14", "TT15", "TT16", "TT17", "TT18", "TT19", "TT20"]},
        { "name": "Squash", "courtNames": ["Sq1", "Sq2", "sq3", "Sq4", "Sq5", "sq6"]}
    ];
    
    Game.collection.remove({});
    Game.collection.insert(games, function(err, docs) {
        if (err) console.log(err);
        else console.log("Multiple games added!");
    });

})

app.listen(port, function() {
    console.log("Server running on " + port);
});
