import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-createsession',
  templateUrl: './createsession.component.html',
  styleUrls: ['./createsession.component.css']
})
export class CreatesessionComponent implements OnInit {

  
  message;
  messageClass;
  onlinePlayers = [];
  dataRcvd;
  players = [];
  coaches = [];
  sessionGame:String;
  selectedPlayer1;
  selectedPlayer2;
  courts = [];
  selectedCourt;
  selectedEvaluator;
  courtChosen=false;
  evaluatorChosen=false;
  role;

  constructor(private authService: AuthService, private router: Router,private route: ActivatedRoute) { }

  

  selectPlayer1(username) {
    this.players.forEach(player => {
      if (player.username == username) {
        player.selectedTable1 = true;
        this.selectedPlayer1 = player;
        this.selectedPlayer2 = undefined;
        player.selectedTable2 = false;
      } else if (player.selectedTable1 == true) {
        player.selectedTable1 = false;
      }
    });
  }
  selectPlayer2(username) {
    this.players.forEach(player => {
      if (player.username == username) {
        this.selectedPlayer2 = player;
        player.selectedTable2 = true;
      }
    });
  }

  selectCourt(court) {
    console.log(court);
    this.selectedCourt = court;
    this.courtChosen=true;
  }

  selectEvaluator(evaluator) {
    console.log(evaluator);
    this.selectedEvaluator = evaluator;
    this.evaluatorChosen=true;
  }

  createSession() {
    this.authService.createSession(this.selectedPlayer1, this.selectedPlayer2, this.sessionGame, this.selectedCourt, this.selectedEvaluator).subscribe(data => {
      this.dataRcvd = data;
      if(!this.dataRcvd.success) {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alart alert-danger';
      } else {
        this.message = this.dataRcvd.message;
        this.messageClass = 'alert alert-success';
        setTimeout(() => {
          this.router.navigate(['/session']);
        }, 1000);
      }
    })
  }

  ngOnInit() {
    // Player
    this.authService.getProfile().subscribe(data =>{
      this.dataRcvd=data;
      if (!this.dataRcvd.success) console.log("Error getting profile");
      else {
        this.role=this.dataRcvd.message.role;
      }
    });

    // Admin
    this.sessionGame = this.route.snapshot.paramMap.get("game");
    this.authService.getOnlinePlayers().subscribe(data => {
      // console.log(data);
      this.dataRcvd = data;
      if (!this.dataRcvd.success) {
      } else {
        this.onlinePlayers = this.dataRcvd.message;
      }
      console.log("Online Players: ", this.onlinePlayers);
      for (let index = 0; index < this.onlinePlayers.length; index++) {
        for (let i = 0; i < this.onlinePlayers[index].Interests.length; i++) {
          var interest = this.onlinePlayers[index].Interests[i];
          interest = interest.split("-")
          if (this.sessionGame.localeCompare(interest[0]) == 0) this.players.push(this.onlinePlayers[index]);
        }
      }
      console.log(this.players);
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
      this.players.forEach(player => {
        player.selectedTable1 = false;
        player.selectedTable2 = false;
      });
      console.log(this.players);
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
      console.log(this.courts);
      this.selectedCourt = this.courts[this.courts.length-1];
    })
    
  }

}
