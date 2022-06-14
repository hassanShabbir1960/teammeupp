import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createcoach',
  templateUrl: './createcoach.component.html',
  styleUrls: ['./createcoach.component.css']
})
export class CreatecoachComponent implements OnInit {

  
  form: FormGroup;
  message;
  messageClass;
  username;
  email;
  role;
  dataRcvd;
  name;
  password;
  processing = false;
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

  constructor( private formbuilder: FormBuilder, private authService: AuthService, private router: Router ) { this.createForm(); };

  createForm() {
    this.form = this.formbuilder.group({
      email: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(5), // Minimum length is 5 characters
        Validators.maxLength(30), // Maximum length is 30 characters
        this.validateEmail // Custom validation
      ])],
      // Username Input
      username: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15), // Maximum length is 15 characters
        this.validateUsername // Custom validation
      ])],
      // Password Input
      password: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(8), // Minimum length is 8 characters
        Validators.maxLength(35), // Maximum length is 35 characters
        this.validatePassword // Custom validation
      ])],
      // Confirm Password Input
      confirm: ['', Validators.required], // Field is required
      name: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirm')}); 
  };

  validateEmail(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Test email against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid email
    } else {
      return { 'validateEmail': true } // Return as invalid email
    }
  }

  // Function to validate username is proper format
  validateUsername(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    // Test username against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid username
    } else {
      return { 'validateUsername': true } // Return as invalid username
    }
  }

  // Function to validate password
  validatePassword(controls) {
    // Create a regular expression
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    // Test password against regular expression
    if (regExp.test(controls.value)) {
      return null; // Return as valid password
    } else {
      return { 'validatePassword': true } // Return as invalid password
    }
  }

  // Funciton to ensure passwords match
  matchingPasswords(password, confirm) {
    return (group: FormGroup) => {
      // Check if both fields are the same
      if (group.controls[password].value === group.controls[confirm].value) {
        return null; // Return as a match
      } else {
        return { 'matchingPasswords': true } // Return as error: do not match
      }
    }
  }

  // Function to disable the registration form
  disableForm() {
    this.form.controls['email'].disable();
    this.form.controls['username'].disable();
    this.form.controls['password'].disable();
    this.form.controls['confirm'].disable();
    this.form.controls['name'].disable();
  }

  // Function to enable the registration form
  enableForm() {
    this.form.controls['name'].enable();
    this.form.controls['email'].enable();
    this.form.controls['username'].enable();
    this.form.controls['password'].enable();
    this.form.controls['confirm'].enable();
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

  checkSchedule() {
    for (let index = 0; index < this.weekdays.length; index++) {
      if (this.weekdays[index].checked == 1) {
        return true;
      }
    }
    return false;
  }
  
  saveSchedule(){
    var schdule = []
    for (let index = 0; index < this.weekdays.length; index++) {
      if(this.weekdays[index].checked == 1 && this.weekdays[index].status == true) {
        schdule.push({name: this.weekdays[index].name, time: this.weekdays[index].time})
      }
    }
    console.log(schdule);
    this.authService.updateSchedule(schdule, this.username).subscribe(data => {
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

  submitCreateCoach() {
    const coach = {
      email: this.form.get('email').value,
      name: this.form.get('name').value,
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      role: 'coach',
      players: [] // Update this after updating the form
    }

    console.log(coach);
    this.authService.registerCoach(coach).subscribe(data => {
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
    this.saveSchedule();
    console.log("Coach created.");
  };

  ngOnInit(): void {    
  }

}
