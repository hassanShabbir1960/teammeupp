import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  dataRcvd:any = {};
  message;
  messageClass;
  processing = false;
  roleSelect = false;
  Roles = [
    'player',
    'coach',
    'admin'
  ];
  userRole = this.Roles[0];
  playerRanking = 0;
  opponentRanking = 0;
  showPlayerContent = false;
  games = [];
  Interests = [];

  constructor( private formbuilder: FormBuilder, private authService: AuthService, private router: Router ) { this.createForm(); };


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

  submitRegistration() {
    console.log(this.userRole);
    if (this.userRole == 'player') {
      const player = {
        email: this.form.get('email').value,
        name: this.form.get('name').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value,
        role: this.userRole,
        opponentRanking: this.decodeRanking(this.playerRanking),
        playerRanking: this.decodeRanking(this.opponentRanking),
        Interests: this.Interests
      }

      console.log(player);
      this.authService.registerPlayer(player).subscribe(data => {
          this.dataRcvd = data;
          this.processing = true;
          this.roleSelect = true;
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
      console.log("Player created.");
    } else if (this.userRole=='coach') {
      const coach = {
        email: this.form.get('email').value,
        name: this.form.get('name').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value,
        role: this.userRole,
        opponentRanking: this.decodeRanking(this.playerRanking),
        playerRanking: this.decodeRanking(this.opponentRanking),
        Interests: this.Interests
      }

      console.log(coach);
      this.authService.registerCoach(coach).subscribe(data => {
          this.dataRcvd = data;
          this.processing = true;
          this.roleSelect = true;
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
      console.log("Coach Created");
    } else if (this.userRole=='admin') {
      const admin = {
        email: this.form.get('email').value,
        username: this.form.get('username').value,
        password: this.form.get('password').value,
        role: this.userRole,
        name: this.form.get('name').value
      }
      // console.log(admin);
      this.authService.registerAdmin(admin).subscribe(data => {
          this.dataRcvd = data;
          this.processing = true;
          this.roleSelect = true;
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
      console.log("Admin Created");
    }
  };
  selectRole(val) {
    if (val.target.value == -1){
      this.roleSelect = false;
    }
    else{
      this.roleSelect = true;
      this.userRole = val.target.value;
      if (this.userRole == 'player') {console.log("player"); this.showPlayerContent = true}
      else {this.showPlayerContent = false; }
    }
  }
  ngOnInit(): void {  
  }
}
