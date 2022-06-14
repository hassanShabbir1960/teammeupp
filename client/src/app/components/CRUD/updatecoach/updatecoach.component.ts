import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-updatecoach',
  templateUrl: './updatecoach.component.html',
  styleUrls: ['./updatecoach.component.css']
})
export class UpdatecoachComponent implements OnInit {

  
  form: FormGroup;
  message;
  messageClass;
  role;
  lastLogin = null;
  dataRcvd;
  username;
  name;
  password;
  processing = false;
  oldcoach;
  players=[];

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
    this.form.controls['name'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['name'].enable();
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

  togglePlayer(username){
    for (let i = 0; i < this.players.length; i++) {
      if(this.players[i].username==username){
        this.players[i].marked=!this.players[i].marked;
        break;
      }
    }
  }

  updateCoachPlayers(){
    var arr=[];
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].marked){
        arr.push(this.players[i]._id);
      }
    }
    console.log("Updated coach players");
    console.log(arr);
    return arr;
  }

  submitUpdateCoach() {
    const newcoach = this.oldcoach;
    newcoach.name= this.form.get('name').value;
    newcoach.username=this.route.snapshot.paramMap.get('username');
    newcoach.players=this.updateCoachPlayers();
    // console.log(this.oldcoach);
    // console.log(newcoach);
    this.authService.updateCoach(newcoach).subscribe(data => {
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
        // console.log(data);
    });
    console.log("Coach updated.");
  };

  ngOnInit(): void { 
    this.username=this.route.snapshot.paramMap.get('username');   
    this.authService.getCoach(this.route.snapshot.paramMap.get('username')).subscribe(data => {
      this.oldcoach = data;
      console.log('Previous players: ', this.oldcoach.players);
    });
    this.authService.getPlayers().subscribe(data => {
      this.dataRcvd = data;
      console.log('All players: ', this.dataRcvd);

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
            _id: this.dataRcvd.message[index]._id,
            marked:false
          });
        }
        console.log(this.players);
      }
    });
  }

}
