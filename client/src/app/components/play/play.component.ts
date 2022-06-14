import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  player;
  message;
  messageClass;
  onlinePlayers = [];
  dataRcvd;
  players = [];
  coaches = [];
  sessionGame:String;
  selectedOpponent;
  selectedEvaluator;
  courts = [];
  selectedCourt;
  _id;

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) { }

  selectOpponent(_id) {
    this.selectedOpponent=_id;
  }

  isInterested(Interests){
    Interests.forEach(interest => {
      if(this.sessionGame.localeCompare(interest.split("-")[0]) == 0) return true;
    });
    return false;
  }

  returnToDashboard(){
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 0);
  }

  initiateGame() {
    console.log("Initiating Game");
    console.log(this.selectedOpponent);
    // Check opponent
    if (this.selectedOpponent=='an interested player'){
      // Go through online players
      // Else leave as is
      for (let i = 0; i < this.players.length; i++) {
        if(this.players[i]._id==this._id){
          this.players.splice(i, 1);
          break;
        }
      }

      // Get random opponent
      if(this.players.length>0){
        this.selectedOpponent=this.players[Math.floor((Math.random() * this.players.length))];
      }
    }
    console.log(this.player);
    console.log(this.selectedOpponent);
    // Get court and evaluator
    this.selectedCourt=this.courts[Math.floor((Math.random() * this.courts.length))];
    this.selectedEvaluator=this.coaches[Math.floor((Math.random() * this.coaches.length))];
    this.authService.createSession(this.player, this.selectedOpponent, this.sessionGame, this.selectedCourt, this.selectedEvaluator).subscribe(data => {
      this.dataRcvd = data;
      if(!this.dataRcvd.success) {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alart alert-danger';
      } else {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    });

    // Generate notification 
    if(this.selectedOpponent=='an interested player'){
      this.authService.addNotification(this.player.username, 'admin', 'Game Initiated', this.player.username + ' wants to play a game with '+this.selectedOpponent+'!', Date.now()).subscribe(data => {
        console.log(data);
      });
    } else {
      this.authService.addNotification(this.player.username, 'admin', 'Game Initiated', this.player.username + ' wants to play a game with '+this.selectedOpponent.username+'!', Date.now()).subscribe(data => {
        console.log(data);
      });
    }
  }

  ngOnInit() {
    this.selectedOpponent='an interested player';
    this.authService.getProfile().subscribe(data =>{
      this.dataRcvd=data;
      if (!this.dataRcvd.success) console.log("Error getting profile");
      else {
        this._id=this.dataRcvd.message._id;
      }
    });

    this.authService.getPlayer().subscribe(data =>{
      this.dataRcvd=data;
      if (!this.dataRcvd.success) console.log("Error getting player");
      else {
        this.player=this.dataRcvd.message;
      }
    });

    this.sessionGame = this.route.snapshot.paramMap.get("game");
    this.authService.getOnlinePlayers().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
      } else {
        this.onlinePlayers=this.dataRcvd.message;
      }
      for (let index = 0; index < this.onlinePlayers.length; index++) {
        for (let i = 0; i < this.onlinePlayers[index].Interests.length; i++) {
          var interest = this.onlinePlayers[index].Interests[i];
          interest = interest.split("-");
          if (this.sessionGame.localeCompare(interest[0]) == 0) this.players.push(this.onlinePlayers[index]);
        }
      }
    });
    this.authService.getOnlineCoaches().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
      } else {
        this.coaches = this.dataRcvd.message;
      }
      for (let index = 0; index < this.coaches.length; index++) {
        this.players.push(this.coaches[index]);
      }
    });
    this.authService.getCourts(this.sessionGame).subscribe(data => {
      // console.log(data);
      this.dataRcvd = data;
      for (let index = 0; index < this.dataRcvd.message.length; index++) {
        // console.log(this.dataRcvd.message[index]);
        if (this.dataRcvd.message[index].name == this.sessionGame) {
          this.courts = this.dataRcvd.message[index].courtNames;
          break;
        }
      }
      // console.log(this.courts);
    })
  }

}
