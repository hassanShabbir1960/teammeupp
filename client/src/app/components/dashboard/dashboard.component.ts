import { Component, OnInit, Type, ɵbypassSanitizationTrustResourceUrl } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { interval } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import Chart from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  message;
  messageClass;
  username;
  email;
  role;
  lastLogin = null;
  dataRcvd;
  roleSelect = false;
  Roles = [
    'player',
    'coach',
  ];
  messageSession;
  userRole = this.Roles[0];
  playerRanking = 0;
  opponentRanking = 0;
  games = [];
  Interests = [];
  selectSchedule = false;
  selectPlayerRanking = false;
  selectOpponentRanking = false;
  selectInterests = false;
  sessions:any = [];
  messageClassSession;
  name;
  _id;
  interestNames;
  attendenceMarked;

  weekdays = [
  {"name": "Monday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Tuesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Wednesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Thursday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Friday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Saturday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Sunday", "status": false, "checked": 0, time: {hour: 13, minute: 30}}
  ]

  players = [];
  coaches=[];
  coachSessions=[]; // For showing Sessions of a specific coach
  coachPlayers = [];
  playerPractices =[];
  playerMatches=[];
  notifications = new Set([]);

  // chart colors
  colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];

  /* large line chart */
  chLine = document.getElementById("chLine");
  chartData = {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    datasets: [{
      data: [589, 445, 483, 503, 689, 692, 634],
      backgroundColor: 'transparent',
      borderColor: this.colors[0],
      borderWidth: 4,
      pointBackgroundColor: this.colors[0]
    },
    {
      data: [639, 465, 493, 478, 589, 632, 674],
      backgroundColor: this.colors[3],
      borderColor: this.colors[1],
      borderWidth: 4,
      pointBackgroundColor: this.colors[1]
    }]
  };

  constructor( private authService: AuthService, private router: Router, private toastService: ToastService) { }

  decodeRanking(Ranking) {
    if (Ranking == 1) {
      return 'Beginner';
    } else if (Ranking == 2) {
      return 'Medium';
    } else if (Ranking == 3) {
      return 'Advance';
    } else {
      return undefined
    }
  }

  showSuccess(message, header) {
    this.toastService.show(message, {
      classname: 'bg-success text-light',
      delay: 5000,
      autohide: true,
      headertext: header
    });
  }
  showError(message, header) {
    this.toastService.show(message, {
      classname: 'bg-danger text-light',
      delay: 5000 ,
      autohide: true,
      headertext: header
    });
  }
  showDefault(message, header) {
    this.toastService.show(message, {
      classname: 'bg-primary text-light',
      delay: 5000 ,
      autohide: true,
      headertext: header
    });
  }

  setPlayerRanking(val) {
    this.playerRanking = val;
    console.log(val);
    this.selectPlayerRanking = true;
  }
  setOpponentRanking(val) {
    this.opponentRanking = val;
    console.log(val);
    this.selectOpponentRanking = true;
  }
  selectLevel(game, event) {
    for (let index = 0; index < this.Interests.length; index++) {
      var saveGame = this.Interests[index].split("-");
      console.log(saveGame[0]);
      if (saveGame[0] == game) {
        if (event.target.value == -1) {
          console.log("Incorrect");
        }
        var level = event.target.value;
        this.Interests[index] = saveGame[0] + "-" + level;
        console.log(this.Interests);
      }
      if (this.checkInterests()) {
        this.selectInterests = true;
      } else this.selectInterests = false;
    }
    // console.log(event);
  }
  selectGame(game) {
    // var interest:String = game
    for (let index = 0; index < this.games.length; index++) {
      if (this.games[index].name == game && this.games[index].checked == 0) {
        this.games[index].status = true;
        this.games[index].checked = 1;
        console.log(game)
        this.Interests.push(game);
      }
      else if (this.games[index].name == game && this.games[index].checked == 1) {
        this.games[index].status = false;
        this.games[index].checked = 0;
        const n = this.Interests.indexOf(game);
        if (index > -1) {
          this.Interests.splice(n, 1);
        }
      }
    }
    if (this.checkInterests()) {
      this.selectInterests = true;
    } else this.selectInterests = false;
    console.log(this.Interests);
  }
  checkInterests() {
    for (let index = 0; index < this.Interests.length; index++) {
      if (this.Interests[index].indexOf("-") == -1) {
        return false;
      }
    }
    return true;
  }

  selectDay(day) {
    for (let index = 0; index < this.weekdays.length; index++) {
      if (this.weekdays[index].name == day && this.weekdays[index].checked == 0) {
        this.weekdays[index].status = true;
        this.weekdays[index].checked = 1;
        this.selectSchedule = true;
        console.log(day)
      }
      else if (this.weekdays[index].name == day && this.weekdays[index].checked == 1) {
        this.weekdays[index].status = false;
        this.weekdays[index].checked = 0;
        if (!this.checkSchedule()) {
          this.selectSchedule = false;
        } else this.selectSchedule = true;
      }
    }
    console.log(this.weekdays)
  }

  checkSchedule() {
    for (let index = 0; index < this.weekdays.length; index++) {
      if (this.weekdays[index].checked == 1) {
        return true;
      }
    }
    return false;
  }

  interestGames() {
    var games = []
    this.Interests.forEach(interest => {
      var game = interest.split("-");
      games.push(game[0]);
    });
    return games;
  }

  saveSchedule(){
    var schdule = []
    var games = this.interestGames();
    var gameIndex = 0;
    for (let index = 0; index < this.weekdays.length; index++) {
      if(this.weekdays[index].checked == 1 && this.weekdays[index].status == true) {
        schdule.push({name: this.weekdays[index].name, time: this.weekdays[index].time, game:games[gameIndex]})
        ++gameIndex;
        if (gameIndex == games.length) gameIndex = 0;
      }
    }
    console.log(schdule);
    console.log("Interests: " + this.Interests);
    this.authService.updateScheduleInterests(schdule, this.username, this.Interests).subscribe(data => {
          this.dataRcvd = data;
          console.log(this.dataRcvd)
          if(!this.dataRcvd.success) {
              this.messageClass = 'alert alert-danger';
              this.message = this.dataRcvd.message;
          } else {
              this.messageClass = 'alert alert-success';
              this.message = this.dataRcvd.message;
              setTimeout(() => {
                this.router.navigate(['/profile']);
              }, 1000);
          }
    })
  }

  isPlayer(){
    return this.role=='player';
  }
  isCoach(){
    return this.role=='coach';
  }
  isAdmin(){
    return this.role=='admin';
  }

  deletePlayer(username){
    this.authService.deletePlayer(username).subscribe(data =>{
      // console.log(data);
      this.dataRcvd=data;
      if(!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
      } else {
          this.messageClass = 'alert alert-success';
          this.message = this.dataRcvd.message;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
      }
    });
  }

  deleteCoach(username){
    this.authService.deleteCoach(username).subscribe(data =>{
      // console.log(data);
      this.dataRcvd=data;
      if(!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
      } else {
          this.messageClass = 'alert alert-success';
          this.message = this.dataRcvd.message;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 0);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 0);
      }
    });
  }

  createPlayer(){
    setTimeout(() => {
      this.router.navigate(['/createplayer']);
    }, 0);
  }

  createCoach(){
    setTimeout(() => {
      this.router.navigate(['/createcoach']);
    }, 0);
  }

  updatePlayer(username){
    setTimeout(() => {
      this.router.navigate(['/updateplayer', username]);
    }, 0);
  }

  updateCoach(username){
    setTimeout(() => {
      this.router.navigate(['/updatecoach', username]);
    }, 0);
  }

  evaluateSession(sessionId){
    console.log(sessionId);
    setTimeout(() => {
      this.router.navigate(['/updatesession', sessionId]);
    }, 0);
  }

  subSet(setA, setB) {
    if (setA.size > setB.size) return false;
    else {
      setA.forEach(element => {
        if (!setB.has(element)) return false;
      });
      return true;
    }
  }

  play(game){
    setTimeout(() => {
      this.router.navigate(['/play', game]);
    }, 0);
  }

  getRank(session){
    var rankings;
    if (session.player._id==this._id){
      rankings = session.result[0].split('-');
    } else { // (session.opponentPlayer._id==this._id)
      rankings = session.result[1].split('-');
    }

    var rankString=rankings[1];
    if (rankString=="Beginner"){
      if(rankings[0]=="Medium") rankString+=" (-1)";
      else if (rankings[0]=="Advance") rankString+=" (-2)";
      else rankString+=" (±0)";

    } else if(rankString=="Medium"){
      if(rankings[0]=="Beginner") rankString+=" (+1)";
      else if (rankings[0]=="Advance") rankString+=" (-1)";
      else rankString+=" (±0)";

    } else { // Advance
      if(rankings[0]=="Medium") rankString+=" (+1)";
      else if (rankings[0]=="Beginner") rankString+=" (+2)";
      else rankString+=" (±0)";
    }
    return rankString;

  }

  ngOnInit() {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      console.log("Profile: ")
      console.log(this.dataRcvd);
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      this.role = this.dataRcvd.message.role;
      this.name = this.dataRcvd.message.name;
      this._id=this.dataRcvd.message._id;

      this.authService.getSessions().subscribe(data => {
        this.dataRcvd = data;
        if (!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
        } else {
          this.sessions = this.dataRcvd.message;
        }
      });

      this.authService.getCoaches().subscribe(data => {
        this.dataRcvd = data;
        if (!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
        } else {
          // this.coaches = this.dataRcvd.message;
          
            for (let index = 0; index < this.dataRcvd.message.length; index++) {
              this.coaches.push({
                _id: this.dataRcvd.message[index]._id,
                name: this.dataRcvd.message[index].name,
                username: this.dataRcvd.message[index].username,
                email: this.dataRcvd.message[index].email,
                password: this.dataRcvd.message[index].password,
                role: this.dataRcvd.message[index].role,
              });
            }
          }
      });

      // this.authService.getNotifications().subscribe(data => {
      //   this.dataRcvd = data;
      //   if (!this.dataRcvd.success) {
      //     this.message = this.dataRcvd.message;
      //     this.messageClass = 'alert alert-danger'
      //   } else {
      //     this.notifications = this.dataRcvd.message;
      //     this.notifications.forEach(notification => {
      //       this.showSuccess(notification.message, notification.header);
      //     });
      //   }
      // })

      this.authService.getPlayers().subscribe(data => {
        this.dataRcvd = data;
        if (!this.dataRcvd.success) {
          this.messageClass = 'alert alert-danger';
          this.message = this.dataRcvd.message;
        } else {
          // console.log("Message: ", this.dataRcvd);
          // this.players = this.dataRcvd.message;
          for (let index = 0; index < this.dataRcvd.message.length; index++) {
            // console.log("Player");
            this.players.push({
              name: this.dataRcvd.message[index].name,
              username: this.dataRcvd.message[index].username,
              email: this.dataRcvd.message[index].email,
              password: this.dataRcvd.message[index].password,
              role: this.dataRcvd.message[index].role,
              opponentRanking: this.dataRcvd.message[index].opponentRanking,
              playerRanking: this.dataRcvd.message[index].playerRanking,
              Interests: this.dataRcvd.message[index].Interests,
              lastLogin: this.dataRcvd.message[index].lastLogin,
              schedule: this.dataRcvd.message[index].schedule,
              attendenceTime: this.dataRcvd.message[index].attendenceTime,
              attendenceMarked: this.dataRcvd.message[index].attendenceMarked,
              _id : this.dataRcvd.message[index]._id
            });
            // console.log(this.players[index]);
          }
          // console.log("Players : ", this.players);
        }
      });

      if (this.role == 'player') {
        this.lastLogin = this.dataRcvd.message.lastLogin;
        this.authService.getPlayer().subscribe(data => {
          this.dataRcvd=data;
          if(!this.dataRcvd.success){
            console.log("Player not found!");
          } else {
            this.Interests=this.dataRcvd.message.Interests;
            this.attendenceMarked=this.dataRcvd.message.attendenceMarked;
            this.interestNames=this.interestGames();
            console.log(this.Interests);
            // console.log("Got current player!");
            // console.log("Sessions:", this.sessions);
            this.sessions.forEach(session => {
              // console.log(session);
              if(session.type=="Game" && (session.player==this._id || session.opponentPlayer==this._id)){
                this.playerMatches.push(session);
              } else if (session.player==this._id){ // Practice
                this.playerPractices.push(session);
              }
            });
            // console.log("Player Matches", this.playerMatches);
            // console.log("Player Practices", this.playerPractices);

            

            this.playerPractices.forEach(session => {
              this.players.forEach(player => {
                if(session.player==player._id) {session.player=player; session.oppPlayer = false;}
              });
              this.coaches.forEach(coach => {
                if(session.opponentCoach==coach._id) session.opponentCoach=coach;
              });
            });

            this.playerMatches.forEach(session => {
              this.players.forEach(player => {
                if(session.player==player._id){ session.player=player; session.oppPlayer = true;}
                else if(session.opponentPlayer==player._id) session.opponentPlayer=player;
              });
            });

          }
        });
      }
      else if (this.role=='admin'){
        this.authService.getCoaches().subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No coaches found!");
          }
        });
      } else if(this.role=='coach') {
        // Get coach players
        this.authService.getCoach(this.username).subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("Coach not found!");
          } else {
            console.log("Coach is here");
            for (let index = 0; index < this.players.length; index++) {
              this.dataRcvd.message.players.forEach(player => {
                if (player == this.players[index]._id) this.coachPlayers.push(this.players[index]);
              });
            }
            console.log("Coach players: ", this.coachPlayers);
            this.sessions.forEach(session => {
              if(session.evaluator==this.dataRcvd.message._id) this.coachSessions.push(session);
            });
            console.log(this.coachSessions);

            this.coachSessions.forEach(session => {
              if(session.type=='Game'){
                this.players.forEach(player => {
                  if(session.player==player._id){ session.player=player; session.oppPlayer = true;}
                  else if(session.opponentPlayer==player._id) session.opponentPlayer=player;
                });
              } else {
                this.players.forEach(player => {
                  if(session.player==player._id) {session.player=player; session.oppPlayer = false;}
                });
                this.coaches.forEach(coach => {
                  if(session.opponentCoach==coach._id) session.opponentCoach=coach;
                });
              }
              console.log(session);
            });
          }
        });
      }
    });

    this.authService.getGames().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        console.log("No games found!");
      }else {
        for (let index = 0; index < this.dataRcvd.message.length; index++) {
          this.games.push({name: this.dataRcvd.message[index].name, status: false, checked: 0});
        }
      }
      console.log("gameS:", this.games);
    });
    
    
      interval(10000).pipe(flatMap(() => this.authService.getNotifications())).subscribe(data => {
        this.dataRcvd = data;
        if (!this.dataRcvd.success) {

        } else {
          this.toastService.toasts.forEach(toast => {
            this.toastService.remove(toast);
          });
          
          this.notifications = new Set([]);
          this.dataRcvd.message.forEach(Notification => {
            if (!Notification.shown) this.notifications.add(Notification);
          });
          // console.log("old: ", this.notifications);
          this.notifications.forEach(notification => {
            this.showSuccess(notification.message, notification.header);
          });
          this.notifications.forEach(Notification => {
            this.authService.showNotification(Notification._id).subscribe(data => {
              console.log(data);
            })
          });
        }
    });
  }
}
