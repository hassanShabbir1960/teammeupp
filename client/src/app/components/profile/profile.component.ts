import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormModalComponent } from '../form-modal/form-modal.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name= "";
  username= "";
  email= "";
  role= "";
  playerRanking= "";
  opponentRanking= "";
  Interests=[];
  attendence= false;
  lastLogin= Date.now();
  schedule= [];
  priorities= false;
  dataRcvd;
  game;
  games=[];
  addedGames = [];
  interestsTemp = [];
  prioritySubmit = false;
  players=[];
  coaches=[];
  attendenceToggle = document.getElementById("attendenceToggle");

  constructor( private authService: AuthService, public toastService: ToastService, private modalService: NgbModal) { }
  showSuccess() {
    this.toastService.show('Your attendence is marked!', {
      classname: 'bg-success text-light',
      delay: 30000,
      autohide: true,
      headertext: 'Attendence'
    });
  }
  showError() {
    this.toastService.show('You unmarked your attendence!', {
      classname: 'bg-danger text-light',
      delay: 30000 ,
      autohide: true,
      headertext: 'Attendence'
    });
  }

  addGame(){
    this.addedGames.push(this.game);
    this.authService.setGame(this.game).subscribe(data => {
      console.log(this.addedGames);
    })
    this.game = '';
  }

  markAttendence() {
    if (!this.attendence) {
      this.showSuccess();
      this.attendence = true;
      this.authService.markAttendence(this.username, this.role).subscribe(data => {
        console.log("Attendence marked!");
        this.authService.addNotification(this.username, 'admin', 'Attendence', this.username + ' is online!', Date.now()).subscribe(data => {
          console.log(data);
        });
      })
    } else {
      this.attendence = false;
      this.showError();
      this.authService.unMarkAttendence(this.username, this.role).subscribe(data => {
        console.log("Attendence unmarked!");
        this.authService.deleteNotification(this.username, 'admin', 'Attendence', this.username + ' is online!', Date.now()).subscribe(data => {
          console.log(data);
        });
      })
    } 
  };

  openFormModal() {
    const modalRef = this.modalService.open(FormModalComponent);
    modalRef.componentInstance.id = 10; // should be the id

    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
  pruneInterests() {
    for (let index = 0; index < this.interestsTemp.length; index++) {
      var fields = this.interestsTemp[index].split('-');
      var name = fields[0];
      var level = fields[1];
      this.Interests.push({name: name, level: level, priority: "Low"});
    }
    console.log(this.Interests);
  }

  joinInterests() {
    this.interestsTemp = []
    for (let index = 0; index < this.Interests.length; index++) {
      var interest = this.Interests[index].name + "-" + this.Interests[index].level + "-" + this.Interests[index].priority;
      this.interestsTemp.push(interest);
    }
    console.log(this.interestsTemp);
  }

  selectPriority(name, event) {
    console.log(name);
    for (let index = 0; index < this.Interests.length; index++) {
      if (this.Interests[index].name == name) {
        this.Interests[index].priority = event.target.value;
      }
    }
    console.log(this.Interests);
  }

  savePriorities() {
    this.joinInterests();
    this.authService.updatePriorities(this.interestsTemp, this.username).subscribe(data => {
      console.log(data);
    })
    this.prioritySubmit = true;
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

  isPresent(){
    return this.attendence;
  }

  ngOnInit(): void {
    this.authService.getProfile().subscribe(data => {
      this.dataRcvd = data;
      console.log("Profile: ");
      console.log(this.dataRcvd);
      this.username = this.dataRcvd.message.username;
      this.email = this.dataRcvd.message.email;
      this.role = this.dataRcvd.message.role;
      this.name=this.dataRcvd.message.name;
      if (this.role == 'player'){
        this.lastLogin = this.dataRcvd.message.lastLogin;
        this.interestsTemp=this.dataRcvd.message.Interests;
        this.pruneInterests();
        console.log(this.Interests);
        this.playerRanking=this.dataRcvd.message.playerRanking;
        this.opponentRanking=this.dataRcvd.message.opponentRanking;
        this.schedule= this.dataRcvd.message.schedule;
        this.attendence = this.dataRcvd.message.attendenceMarked;
        this.prioritySubmit = this.dataRcvd.message.priorities;
        console.log(this.schedule);
        // this.schedule.game="Badminton";
        console.log(typeof(this.schedule[0]));
      }
      else{ // Admin or Coach
        this.authService.getPlayers().subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No players found!");
          } else {
            for (let index = 0; index < this.dataRcvd.message.length; index++) {
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
            }
            console.log(this.players);
          }
        });
      }
      if (this.role=='admin'){
        this.authService.getCoaches().subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No coaches found!");
          }else {
            for (let index = 0; index < this.dataRcvd.message.length; index++) {
              this.coaches.push({
                name: this.dataRcvd.message[index].name,
                username: this.dataRcvd.message[index].username,
                email: this.dataRcvd.message[index].email,
                password: this.dataRcvd.message[index].password,
                role: this.dataRcvd.message[index].role,
                players: this.dataRcvd.message[index].players
              });
            }
            console.log(this.coaches);
          }
        });
      } else if(this.role=='coach') {
        // Get coach players
        this.authService.getCoach(this.username).subscribe(data => {
          this.dataRcvd = data;
          if (!this.dataRcvd.success) {
            console.log("No players found!");
          } else {
            console.log("Coach is here");
            var l=this.players.length;
            for (let i = 0; i < l; ++i) {
              if (this.players[i]._id!=this.dataRcvd.message.players[i]){
                this.players.splice(i, 1);
                --i;
                --l;
              }
            }
            console.log("Coach players: ", this.players);
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
    });
  }

}
