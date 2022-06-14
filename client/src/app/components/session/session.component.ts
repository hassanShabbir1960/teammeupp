import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css']
})
export class SessionComponent implements OnInit {

  messagePlayer;
  messageClassPlayer;
  messageCoach;
  messageClassCoach;
  messageSession;
  messageClassSession;
  Players = [];
  Coaches = [];
  dataRcvd;
  sessions = [];

  constructor(public authService: AuthService, private router: Router) { }

  createSession(game) {
    console.log(game);
    setTimeout(() => {
      this.router.navigate(['/createsession', game]);
    }, 0);
  }

  ngOnInit() {
    this.authService.getPlayers().subscribe(data => {
      this.dataRcvd = data;
      console.log(this.dataRcvd.message);
      if (!this.dataRcvd.success) {
        this.messageClassPlayer = 'alert alert-danger';
        this.messagePlayer = this.dataRcvd.message;
      } else {
        this.Players = this.dataRcvd.message;
      }
    });

    this.authService.getCoaches().subscribe(data => {
      this.dataRcvd = data;
      console.log(this.dataRcvd.message);
      if (!this.dataRcvd.success) {
        this.messageClassCoach = 'alert alert-danger';
        this.messageCoach = this.dataRcvd.message;
      } else {
        this.Coaches = this.dataRcvd.message;
      }
    });

    this.authService.getSessions().subscribe(data => {
      this.dataRcvd = data;
      console.log("session ", this.dataRcvd.message);
      if (!this.dataRcvd.success) {
        this.messageClassSession = 'alert alert-danger';
        this.messageSession = this.dataRcvd.message;
      } else {
        this.sessions = this.dataRcvd.message;
        this.sessions.forEach(session => {
          if (session.type == 'Practice') {
            this.Players.forEach(player => {
              if (player._id == session.player) { session.player = player; session.oppPlayer = false; }
            })
            this.Coaches.forEach(coach => {
              if (coach._id == session.opponentCoach) session.opponentCoach = coach;
            })
          } else {
            this.Players.forEach(player => {
              if (player._id == session.player) { session.player = player; session.oppPlayer = true; }
              else if (player._id == session.opponentPlayer) session.opponentPlayer = player;
            });
          }
          for (let j = 0; j < this.Coaches.length; j++) {
            console.log(this.Coaches[j]._id);
            if(this.Coaches[j]._id==session.evaluator) session.evaluatorUsername=this.Coaches[j].username;
          }
        }); 
      }
    })
    // for (let i = 0; i < this.sessions.length; i++) {
    //   console.log(this.sessions[i].evaluator);
    // }
  };

}
