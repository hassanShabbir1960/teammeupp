import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updatesession',
  templateUrl: './updatesession.component.html',
  styleUrls: ['./updatesession.component.css']
})
export class UpdatesessionComponent implements OnInit {

  session;
  player;
  opponent;
  dataRcvd;
  message;
  messageClass;
  winner;
  winnerPlayer = false;
  winnerOpponent = false;
  playerRanking;
  opponentRanking;
  selectPlayer = false;
  selectOpponent = false;

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) { }

  setPlayerRanking(event) {
    if (event != -1) {
      this.playerRanking = event;
      this.selectPlayer = true;
      console.log(this.playerRanking);
    }
  }
  setOpponentRanking(event) {
    if (event != -1) { 
      this.selectOpponent = true;
      this.opponentRanking = event;
      console.log(this.opponentRanking);
    }
  }
  selectWinner(username) {
    if (username == this.player.username) {
      this.winner = this.player.username;
      this.winnerPlayer = true;
      this.winnerOpponent = false;
      this.message = this.player.username + " is winner!"
      this.messageClass = 'alert alert-primary'
    } else {
      this.winner = this.opponent.username;
      this.winnerOpponent = true;
      this.winnerPlayer = false;
      this.message = this.opponent.username + " is winner!"
      this.messageClass = 'alert alert-primary'
    }
    console.log("Winner: ", this.winner);
  }
  doneEvaluate() {
    var pRanking = this.player.playerRanking + "-" + this.playerRanking;
    var oRanking = undefined;
    if (this.session.type == 'Game') {
      oRanking = this.opponent.playerRanking + "-" + this.opponentRanking;
    }
    this.authService.saveEvaluation(this.session._id ,this.winner,this.player,this.opponent, pRanking, oRanking).subscribe(data => {
      console.log(data);
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alert alert-danger';
      } else {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      }
    })
  }

  ngOnInit() {
    this.authService.getSessions().subscribe(data => {
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alert alert-danger';
      } else {
        for (let index = 0; index < this.dataRcvd.message.length; index++) {
          if (this.dataRcvd.message[index]._id == this.route.snapshot.paramMap.get('sessionId')) 
            this.session = this.dataRcvd.message[index];
        }
        // this.session = this.dataRcvd.message;
        console.log("Session: ", this.session);
      }
      this.message = "Choose a winner!"
      this.messageClass = 'alert alert-primary'
    });

    this.authService.getPlayers().subscribe(data => {
      this.dataRcvd = data;
      console.log("Players:", this.dataRcvd)
      this.dataRcvd.message.forEach(player => {
        if (player._id == this.session.player) {this.player = player; }
        if (this.session.type == 'Game') {
          if (player._id == this.session.opponentPlayer) {this.opponent = player; }
        }
      });
    });

    this.authService.getCoaches().subscribe(data => {
      this.dataRcvd = data;
      console.log("Coaches: ", this.dataRcvd);
      this.dataRcvd.message.forEach(coach => {
        if (coach._id == this.session.opponentCoach) {this.opponent = coach; this.selectOpponent = true; }
      });
      console.log("Player:" + this.player);
      console.log("opponent: "+ this.opponent);
    });
  }

}
