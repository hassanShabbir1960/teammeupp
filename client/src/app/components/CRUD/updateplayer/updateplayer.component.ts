import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-updateplayer',
  templateUrl: './updateplayer.component.html',
  styleUrls: ['./updateplayer.component.css']
})
export class UpdateplayerComponent implements OnInit {

  
  form: FormGroup;
  message;
  messageClass;
  username;
  email;
  role;
  lastLogin = null;
  dataRcvd;
  name;
  // password;
  processing = false;
  playerRanking = 0;
  opponentRanking = 0;
  showPlayerContent = false;
  games = [];
  Interests = [];
  selectSchedule = false;
  selectPlayerRanking = false;
  selectOpponentRanking = false;
  selectInterests = false;
  oldplayer;

  weekdays = [
  {"name": "Monday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Tuesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Wednesday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Thursday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Friday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Saturday", "status": false, "checked": 0, time: {hour: 13, minute: 30}},
  {"name": "Sunday", "status": false, "checked": 0, time: {hour: 13, minute: 30}}
  ]

  constructor( private formbuilder: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute ) { this.updateForm(); };

  updateForm() {
    this.form = this.formbuilder.group({
      name: ['', Validators.required]
    }); 
  };

  // Function to disable the registration form
  disableForm() {
    // this.form.controls['email'].disable();
    // this.form.controls['username'].disable();
    // this.form.controls['password'].disable();
    // this.form.controls['confirm'].disable();
    this.form.controls['name'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['name'].enable();
    // this.form.controls['email'].enable();
    // this.form.controls['username'].enable();
    // this.form.controls['password'].enable();
    // this.form.controls['confirm'].enable();
  }

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
  
  saveSchedule(){
    var schedule = []
    for (let index = 0; index < this.weekdays.length; index++) {
      if(this.weekdays[index].checked == 1 && this.weekdays[index].status == true) {
        schedule.push({name: this.weekdays[index].name, time: this.weekdays[index].time})
      }
    }
    return schedule;
  }

  submitUpdatePlayer() {
    const newplayer=this.oldplayer;
    newplayer.username=this.route.snapshot.paramMap.get('username');
    newplayer.name=this.form.get('name').value;
    newplayer.role= 'player';
    newplayer.opponentRanking= this.decodeRanking(this.playerRanking);
    newplayer.playerRanking= this.decodeRanking(this.opponentRanking);
    newplayer.Interests= this.Interests;
    newplayer.schedule = this.saveSchedule();

    console.log(newplayer)
    this.authService.updatePlayer(newplayer).subscribe(data => {
        this.dataRcvd = data;
        this.processing = true;
        this.disableForm();
        if(!this.dataRcvd.success) {
            this.messageClass = 'alert alert-danger';
            this.message = this.dataRcvd.message;
            this.processing = false;
            this.enableForm();
        } else {
            this.messageClass = 'alert alert-success';
            this.message = this.dataRcvd.message;
            setTimeout(() => {
                this.router.navigate(['/dashboard']);
            }, 1000);
        }
        console.log(data);
    });
    // this.saveSchedule();
    console.log("Player updated.");
  };

  ngOnInit(): void {    
    this.username=this.route.snapshot.paramMap.get('username');
    this.authService.getPlayer().subscribe(data => {
      this.oldplayer = data;
      console.log(this.oldplayer);
    });
    this.authService.getGames().subscribe(data => {
    this.dataRcvd = data;
    if (!this.dataRcvd.success) {
      console.log("No games found!");
    }else {
      for (let index = 0; index < this.dataRcvd.message.length; index++) {
        this.games.push({name: this.dataRcvd.message[index].name, status: false, checked: 0});
      }
      console.log(this.games);
    }
  });
  }

}
