const Player = require('../models/player');
const Coach = require('../models/coach');
const Game = require('../models/game');
const Session = require('../models/session');
const Admin = require('../models/admin');
const Notification = require('../models/notification');
const jwt = require('jsonwebtoken');
const config = require('../../config/database')
var bcrypt = require('bcrypt-nodejs');

module.exports = (router => {
    
    router.get('/gamesList', (req, res) => {
        Game.find({}, function(err, games) {
            res.json({success: true, message: games});
         });
    })

    router.post('/register', (req, res) => {
        if(!req.body.email) {
            res.json({ success: false, message: "Email not found!"});           //this is all just validation testing, hoping it doesn't break...
        } else {
            if (!req.body.username) {
                res.json({ success: false, message: "Username not found!"});
            } else {
                if (!req.body.password) {
                    res.json({ success: false, message: "Password not found!"});
                } else {
                    if (!req.body.name) {
                        res.json({ success: false, message: "name not found!"});
                    } else {
                        if(req.body.role == 'player') {
                            console.log(req.body);
                            var player = Player({
                                username: req.body.username,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password,
                                name: req.body.name,
                                opponentRanking: req.body.opponentRanking,
                                playerRanking: req.body.playerRanking,
                                playerInterest: req.body.playerInterest,
                                Interests: req.body.Interests,
                                lastLogin: null
                            });
                            player.save((err) => {
                                if(err) {
                                    if(err.code === 11000) {
                                        console.log(err);
                                        if(err.keyValue.hasOwnProperty('username')) {
                                            res.json({ success: false, message: "Choose a unique username!" });
                                        } else if (err.keyValue.hasOwnProperty('email')) {
                                            res.json({ success: false, message: "Choose a unique email!" });
                                        }
                                    } else {
                                        res.json({ success: false, message: "Could not save user! Error: " + err });
                                    };
                                } else {
                                    res.json({ success: true, message: "Player Saved!"});
                                };
                            });
                        } else if (req.body.role == 'coach') {
                            console.log(req.body);
                            var coach = Coach({
                                username: req.body.username,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password,
                                name: req.body.name
                            });
                            coach.save((err) => {
                                if(err) {
                                    if(err.code === 11000) {
                                        console.log(err);
                                        if(err.keyValue.hasOwnProperty('username')) {
                                            res.json({ success: false, message: "Coach: Choose a unique username!" });
                                        } else if (err.keyValue.hasOwnProperty('email')) {
                                            res.json({ success: false, message: "Coach: Choose a unique email!" });
                                        }
                                    } else {
                                        res.json({ success: false, message: "Could not save user! Error: " + err});
                                    };
                                } else {
                                    res.json({ success: true, message: "Coach Saved!"});
                                };
                            });
                        
                        } else if (req.body.role == 'admin') {
                            console.log(req.body);
                            var admin = Admin({
                                username: req.body.username,
                                email: req.body.email.toLowerCase(),
                                password: req.body.password,
                                role: req.body.role
                            });
                            console.log('here in api.js');
                            admin.save((err) => {
                                if(err) {
                                    if(err.code === 11000) {
                                        console.log(err);
                                        if(err.keyValue.hasOwnProperty('username')) {
                                            res.json({ success: false, message: "Admin: Choose a unique username!" });
                                        } else if (err.keyValue.hasOwnProperty('email')) {
                                            res.json({ success: false, message: "Admin: Choose a unique email!" });
                                        }
                                    } else {
                                        res.json({ success: false, message: "Could not save user! Error: " + err});
                                    };
                                } else {
                                    res.json({ success: true, message: "Admin Saved!"});
                                };
                            });
                        }
                    }
                }
            }
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
          res.json({ success: false, message: 'No username was provided' });
        } else {
          if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided.' });
          } else {
              if(req.body.role == 'player') {
                    Player.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are a ' + req.body.role + "." });
                            } else {
                                const validPassword = user.comparePassword(req.body.password);
                                if (!validPassword) {
                                    res.json({ success: false, message: 'Password invalid' });
                                } else {
                                    //   res.json({ success: true, message: "Logged IN!"});
                                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                    if (user.lastLogin != null) {
                                        var newPlayer = user;
                                        newPlayer.lastLogin = Date.now();
                                        console.log(newPlayer);
                                        Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                                            if (err) console.log("success: false, message: Some error occured! + err");
                                            console.log("success: true, message: Records entered succesfully! Welcome!");
                                        })
                                    }
                                    res.json({ success: true, message: 'Successfully logged in ' + req.body.username + '!', token: token, user: { username: user.username, lastLogin: user.lastLogin } });
                                }
                            }
                        }
                    }
                    });
                } else if (req.body.role == 'coach') {
                    Coach.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are a ' + req.body.role + "." });
                            } else {
                                const validPassword = user.comparePassword(req.body.password);
                                if (!validPassword) {
                                    res.json({ success: false, message: 'Password invalid' });
                                } else {
                                    //   res.json({ success: true, message: "Logged IN!"});
                                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                    res.json({ success: true, message: 'Successfully logged in ' + req.body.username + '!', token: token, user: { username: user.username } });
                                }
                            }
                        }
                    }
                    });
                } else if (req.body.role == 'admin') {
                    Admin.findOne({ username: req.body.username }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            if (!user) {
                                res.json({ success: false, message: 'Username not found.' });
                            } else {
                            if(user.role != req.body.role) {
                                res.json({ success: false, message: 'Please ensure that you are an ' + req.body.role + "." });
                            } else {
                                const validPassword = user.comparePassword(req.body.password);
                                if (!validPassword) {
                                    res.json({ success: false, message: 'Password invalid' });
                                } else {
                                    //   res.json({ success: true, message: "Logged IN!"});
                                    const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                                    res.json({ success: true, message: 'Successfully logged in ' + req.body.username + '!', token: token, user: { username: user.username } });
                                }
                            }
                        }
                    }
                    });
                }
          }
        }
      });

     

      router.post('/updatepriorities', (req, res) => {
          console.log(req.body);
          Player.findOne({ username: req.body.username }, (err, user) => {
            var newPlayer = user;
            newPlayer.Interests = req.body.priorities;
            newPlayer.priorities = true;
            console.log(newPlayer);
            Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                if (err) console.log("success: false, message: Some error occured! + err");
                console.log("success: true, message: Records entered succesfully! Welcome!");
            });
        });
      })

      router.post('/addSchedule', (req, res) => {
          console.log(req.body);
          if (!req.body.username) {
            res.json({ success: false, message: "username not found!"});
          } else {
              if (!req.body.schedule) {
                res.json({ success: false, message: "Schdule not found!"}); 
              } else {
                if(!req.body.Interests) {
                    res.json({ success: false, message: "Interests not found!"});
                } else {
                    Player.findOne({ username: req.body.username }, (err, user) => {
                        var newPlayer = user;
                        newPlayer.schedule = req.body.schedule;
                        newPlayer.Interests = req.body.Interests;
                        newPlayer.lastLogin = Date.now();
                        console.log(newPlayer);
                        Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                            if (err) res.json({success: false, message: "Some error occured! + err"});
                            else res.json({success: true, message: "Records entered succesfully! Welcome!"});
                        });
                    });
                }
              }
          }
      })

      router.post("/markattendence", (req, res) => {
          console.log(req.body);
          if (!req.body.username) {
              res.json({ success: false, message: "username not found!" });
          } else {
              if(req.body.role == 'player') {
                Player.findOne({ username: req.body.username }, (err, user) => {
                    var newPlayer = user;
                    newPlayer.checkinTime = Date.now();
                    newPlayer.attendenceMarked = true;
                    console.log(newPlayer);
                    Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                        if (err) res.json({success: false, message: "Some error occured!" + err});
                        res.json({success: true, message: "Records entered succesfully! Welcome!"});
                    })
                });
              }
              else if (req.body.role == 'coach') {
                Coach.findOne({ username: req.body.username }, (err, coach) => {
                    var newcoach = coach;
                    newcoach.status = true;
                    console.log(newcoach);
                    Coach.findOneAndUpdate({username: req.body.username}, newcoach,  function(err, doc) {
                        if (err) res.json({success: false, message: "Some error occured!" + err});
                        else res.json({success: true, message: "Records entered succesfully! Welcome!"});
                    })
                });
              }
          }
      })

      router.post("/unmarkattendence", (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: "username not found!" });
        } else {
            if(req.body.role == 'player') {
                Player.findOne({ username: req.body.username }, (err, user) => {
                    var newPlayer = user;
                    // newPlayer.checkinTime = Date.now();
                    newPlayer.attendenceMarked = false;
                    console.log(newPlayer);
                    Player.findOneAndUpdate({username: req.body.username}, newPlayer,  function(err, doc) {
                        if (err) res.json({success: false, message: "Some error occured!" + err});
                        res.json({success: true, message: "Records entered succesfully! Welcome!"});
                    })
                });
              }
              else if (req.body.role == 'coach') {
                Coach.findOne({ username: req.body.username }, (err, coach) => {
                    var newcoach = coach;
                    newcoach.status = false;
                    console.log(newcoach);
                    Coach.findOneAndUpdate({username: req.body.username}, newcoach,  function(err, doc) {
                        if (err) res.json({success: false, message: "Some error occured!" + err});
                        else res.json({success: true, message: "Records entered succesfully! Welcome!"});
                    })
                });
              }
        }
    })

      router.post('/games', (req, res) => {
        if (!req.body.name) {
            res.json({success: false, message: "Game name not provided!"});
        } else {
            if (!req.body.courtNames) {
                res.json({success: false, message: "Please specify number of courts."});
            } else {
                var game = Game({
                    name: req.body.name,
                    courtNames: req.body.courtNames
                });
                game.save((err) => {
                    if(err) {
                        if(err.code === 11000) {
                            console.log(err);
                            if(err.keyValue.hasOwnProperty('name')) {
                                res.json({ success: false, message: "Choose a unique game name!" });
                            }
                        } else {
                            res.json({ success: false, message: "Could not save game! Error: " + err });
                        };
                    } else {
                        res.json({ success: true, message: "Game Saved!"});
                    };
                });
            }
        }
    });

    router.get("/logout", (req, res) => {
        console.log(req.body);
    });

    router.use(function(req, res, next) {
        console.log(req.headers);
        const token = req.headers['authorization'];
        if (!token) res.json({success: false, message: "No token provided."});
        else jwt.verify(token,  config.secret, function(err, result) {
            if(err) res.json({ success: false, message: "Token invalid: " + err});
            else { 
                req.result = result;
                next();
            }
        })
    });
    
    router.get('/getplayer', (req, res) => {
        console.log('api/getplayer')
        console.log(req.body);
        console.log(req.result.userId);
        Player.findOne({ _id: req.result.userId }).select('_id username email role name playerRanking opponentRanking Interests attendenceMarked').exec((err, player) => {
            console.log(player);
            if (err) res.json({success: false, message: "Couldn't find selected fields! " + err});
            else res.json({success: true, message: player});
        });
    });

    router.get('/getcoach', (req, res) => {
        console.log(req.body);
        Coach.findOne({ _id: req.result.userId }).select('_id username email role name password players').exec((err, coach) => {
            if (err) res.json({success: false, message: "Some error occured!" + err});
            res.json({success: true, message: coach});
        });
    });

    router.get('/profile', (req, res) => {
        Player.findOne({ _id: req.result.userId }).select('_id username email name role lastLogin attendenceMarked opponentRanking playerRanking Interests schedule priorities').exec((err, player) => {
            if (err) res.json({success: false, message: "Couldn't find selected fields! " + err });
            else if(!player) {
                console.log("No player found, checking coaches.");
                Coach.findOne({ _id: req.result.userId }).select('username email role name').exec((err, coach) => {
                    if (err) res.json({success: false, message: "Couldn't find selescted fields for coach!" + err});
                    else if(!coach) {
                        console.log("No coach found, checking admins");
                        Admin.findOne({ _id: req.result.userId }).select('username email role name').exec((err, admin) => {
                            if(err) res.json({ success: false, message: "Couldn't find selected fields for admin!" + err});
                            else if(!admin) {
                                console.log("No admin found");
                                res.json({success: false, message: "No profile found for the user"});
                            }
                            else res.json({success: true, message: admin });
                        });
                    } else res.json({success: true, message: coach});
                });
            } else {
                res.json({success: true, message: player });
            }
        })
    });
    
    router.get('/playersList', (req, res) => {
        Player.find({}, function(err, players) {
            res.json({success: true, message: players});
         });
    })
    
    router.get('/coachesList', (req, res) => {
        Coach.find({}, function(err, coaches) {
            res.json({success: true, message: coaches});
         });
    })

    router.post('/updateCoach', (req, res) => {
        console.log(req.body);

        Coach.findOne({ username: req.body.coach.username }).select('username email role name password players').exec((err, coach) => {
            console.log(coach);
            var newCoach = coach;
            newCoach.name = req.body.coach.name;
            newCoach.players = req.body.coach.players;
            // console.log(req.body);
            // console.log(req.body.coach.players);
            // console.log(newCoach);
            // console.log(newCoach.players);
            Coach.findOneAndUpdate({username: req.body.coach.username}, newCoach,  function(err, doc) {
                if (err) res.json({success: false, message: "Some error occured!" + err});
                res.json({success: true, message: "Records entered succesfully! Welcome!"});
            })
        });
    })

    router.post('/updatePlayer', (req, res) => {
        console.log(req.body);

        Player.findOne({ username: req.body.player.username }).select('username email role name playerRanking opponentRanking Interests schedule').exec((err, player) => {
            console.log(player);
            var newPlayer = player;
            console.log(req.body);
            newPlayer.name = req.body.player.name;
            newPlayer.Interests = req.body.player.Interests;
            newPlayer.playerRanking = req.body.player.playerRanking;
            newPlayer.opponentRanking = req.body.player.opponentRanking;
            newPlayer.schedule = req.body.player.schedule;
            // newPlayer.password = req.body.player.password;
            console.log(newPlayer);
            Player.findOneAndUpdate({username: req.body.player.username}, newPlayer,  function(err, doc) {
                if (err) res.json({success: false, message: "Some error occured!" + err});
                res.json({success: true, message: "Records entered succesfully! Welcome!"});
            })
        });
    })

    router.post('/deletePlayer', (req, res) => {
        console.log(req.body);
        Player.findOneAndDelete({username: req.body.username}, function(err, doc) {
            if (err) res.json({success: false, message: "Some error occured!" + err});
            res.json({success: true, message: "Record deleted"});
        })
    })

    router.post('/deleteCoach', (req, res) => {
        console.log(req.body);
        Coach.findOneAndDelete({username: req.body.username}, function(err, doc) {
            if (err) res.json({success: false, message: "Some error occured!" + err});
            res.json({success: true, message: "Record deleted"});
        })
    })

    router.get("/getonlineplayers", (req, res) => {
        console.log("Getting all online players!");
        Player.find({}, function(err, players) {
            var onlinePlayers = [];
            players.forEach(element => {
                if (element.attendenceMarked) {
                    onlinePlayers.push(element);
                }
            });
            console.log(onlinePlayers);
            if (onlinePlayers.length == 0) {
                res.json({success: false, message: "No player online!"});
            } else res.json({success: true, message: onlinePlayers});
        })
    })

    // router.get("/getonlineinterestedplayers", (req, res) => {
    //     // console.log("Getting all online players!");
    //     console.log(req.body);
    //     Player.find({}, function(err, players) {
    //         var onlinePlayers = [];
    //         players.forEach(element => {
    //             if (element.attendenceMarked) {
    //                 onlinePlayers.push(element);
    //             }
    //         });
    //         console.log(onlinePlayers);
    //         if (onlinePlayers.length == 0) {
    //             res.json({success: false, message: "No player online!"});
    //         } else res.json({success: true, message: onlinePlayers});
    //     })
    // })

    router.get("/getonlinecoaches", (req, res) => {
        console.log("Getting all online coaches!");
        Coach.find({}, function(err, coaches) {
            var onlineCoaches = [];
            coaches.forEach(element => {
                if (element.status) {
                    onlineCoaches.push(element);
                }
            });
            console.log(onlineCoaches);
            if (onlineCoaches.length == 0) {
                res.json({success: false, message: "No coach online!"});
            } else res.json({success: true, message: onlineCoaches});
        })
    });

    router.post("/createsession", (req, res) => {
        console.log('inside /api/createsession');
        console.log(req.body);
        var opponentPlayer = undefined;
        var opponentCoach = undefined; 
        var type = "Game";
        if (req.body.opponent.role == 'coach') {
            opponentCoach = req.body.opponent._id;
            type = "Practice";
        } else opponentPlayer = req.body.opponent._id;
        var session = Session ({
            player: req.body.player._id,
            opponentCoach: opponentCoach,
            opponentPlayer: opponentPlayer,
            status: true,
            game: req.body.game,
            court: req.body.court,
            type: type,
            evaluator: req.body.evaluator
        });
        console.log(session);
        session.save((err) => {
            if(err) {
                res.json({ success: false, message: "Could not save session! Error: " + err });
            } else {
                res.json({ success: true, message: "Session Created!"});
            };
        });
    })


    router.get('/getsessions', (req, res) => {
        Session.find({}, function(err, sessions) {
            console.log(sessions);
            if (sessions.length == 0) {
                res.json({success: false, message: "No sessions found!"});
            } else {
                res.json({success: true, message: sessions});
            }
        });
    });

    router.get('/getsession', (req, res) => {
        console.log(req.headers);
        Session.findOne({_id: req.headers.id}).select('_id status type result player opponentCoach opponentPlayer game court evaluator winner result').exec((err, session) => {
            if (err) res.json({success: false, message: "Couldn't find the session!" + err});
            else res.json({success: true, message: session});
        });
    })

    router.post('/updateevaluation', (req, res) => {
        console.log(req.body);
        Session.findOne({_id: req.body.ID}).select('_id status type result player opponentCoach opponentPlayer game court evaluator winner result').exec((err, session) => {
            if (err) res.json({success: false, message: "Couldn't find the session!" + err});
            else {
                var newSession = session;
                newSession.winner = req.body.winner;
                newSession.result = req.body.pRanking;
                newSession.result.push(req.body.oRanking);
                newSession.status = false;
                var newPlayer = req.body.player;
                var rankings = req.body.pRanking.split('-');
                console.log(rankings);
                newPlayer.playerRanking = rankings[1];
                Player.findOneAndUpdate({_id: req.body.player._id}, newPlayer, function(err, doc) {
                    if (err) console.log("Could not update player Ranking!");
                    else console.log("Player ranking updated!");
                });
                if (session.type == 'Game') {
                    newPlayer = req.body.opponent;
                    var rankings = req.body.oRanking.split('-');
                    newPlayer.playerRanking = rankings[1];
                    Player.findOneAndUpdate({_id: req.body.opponent._id}, newPlayer, function(err, doc) {
                        if (err) console.log("Could not update opponent player Ranking!");
                        else console.log("Opponent Player ranking updated!");
                    });
                }
                Session.findOneAndUpdate({_id: req.body.ID}, newSession,  function(err, doc) {
                    if (err) res.json({success: false, message: "Some error occured!" + err});
                    res.json({success: true, message: "Records entered succesfully! Welcome!"});
                });
            }
        })
    })

    router.post('/shownnotification', (req, res) => {
        console.log(req.body);
        Notification.findOne({_id: req.body.ID}).select('sender receiver header message time').exec((err, notification) => {
            if (err) res.json({success: false, message: "Couldn't find the notification!" + err});
            else {
                console.log(notification);
                var newNotification = notification;
                newNotification.shown = true;
                Notification.findOneAndUpdate({_id: req.body.ID}, newNotification, function(err, doc) {
                    if (err) console.log("Could not update notificaion!");
                    else console.log("Notification shown!");
                });
            };
        });
    });

    router.post('/addnotification', (req, res) => {
        var notification = Notification({
            sender: req.body.sender,
            receiver: req.body.receiver,
            header: req.body.header,
            message: req.body.message,
            time: req.body.time,
            shown: false
        })
        notification.save((err) => {
            if(err) {
                res.json({success: false, message: 'Notification not saved!'});
            } else {
                res.json({ success: true, message: "Notification Saved!"});
            };
        });
    });
    router.post('/deletenotification', (req, res) => {
        Notification.findOneAndDelete({sender: req.body.sender}, function(err, doc) {
            if (err) res.json({success: false, message: "Some error occured!" + err});
            res.json({success: true, message: "Record deleted"});
        })
    })

    router.get('/getnotifications', (req, res) => {
        Notification.find({}, function(err, notifications) {
            if (notifications.length == 0) {
                res.json({success: false, message: "No new notifications!"});
            } else {
                res.json({success: true, message: notifications});
            }
        })
    })

    return router;
});

