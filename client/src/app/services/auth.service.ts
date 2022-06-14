import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  backendServer = "http://localhost:3000/";
  authToken;
  user;
  game;
  role;

  constructor( private http: HttpClient ) { }

  registerPlayer(user) {
    return this.http.post(this.backendServer + "api/register", user).pipe(map(res => res));
  };

  registerCoach(user) {
    return this.http.post(this.backendServer + "api/register", user).pipe(map(res => res));
  };

  registerAdmin(user) {
    return this.http.post(this.backendServer + "api/register", user).pipe(map(res => res));
  };

  login(user) {
    return this.http.post(this.backendServer + "api/login", user).pipe(map(res => res));
  }

  getPlayer() {
    this.loadToken();
    // console.log(username);
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
    console.log(appHeaders);
    return this.http.get(this.backendServer + "api/getplayer", {headers:appHeaders}).pipe(map(res => res));
  }

  getCoach(username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "api/getcoach", {headers:appHeaders}).pipe(map(res => res));
  }


  getGames() {
    return this.http.get(this.backendServer + "api/gamesList").pipe(map(res => res));
  }

  getPlayers() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "api/playersList",  {headers: appHeaders});
  }

  getCoaches() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + "api/coachesList",  {headers: appHeaders});
  }

  setGame(game) {
    return this.http.post(this.backendServer + "api/games", game).pipe(map(res => res));
  }

  logout() {
    // this.updateStatus();
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loadToken() {
    this.authToken = localStorage.getItem('token');
    this.user = localStorage.getItem('user');
    this.role = localStorage.getItem('role').slice(1, -1);
    // console.log(this.authToken);
  };

  updateStatus() {
    var username = this.user.username;
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    console.log(username, appHeaders);
    setTimeout(() => {
      console.log(username);
    }, 2000 )
  }

  storeUserData(token, user, role) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('role', JSON.stringify(role));
    this.authToken = token;
    this.user = user;
    this.role = role;
  }

  markAttendence(username, role) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "api/markattendence", {username, role}, {headers: appHeaders}).pipe(map(res => res));
  }

  unMarkAttendence(username, role) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "api/unmarkattendence", {username, role}, {headers: appHeaders}).pipe(map(res => res));
  }

  updateSchedule(schedule, username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "api/addSchedule", {schedule, username}, {headers: appHeaders}).pipe(map(res => res));
  }

  updateScheduleInterests(schedule, username, Interests) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    console.log(Interests);
    return this.http.post(this.backendServer + "api/addSchedule", {schedule, username, Interests}, {headers: appHeaders}).pipe(map(res => res));
  }
  

  updatePriorities(priorities, username) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + "api/updatepriorities", {priorities, username}, {headers: appHeaders}).pipe(map(res => res));
  }

  getProfile() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get(this.backendServer + 'api/profile', {headers: appHeaders});
  }

  loggedIn() {
    if (localStorage.getItem('token') != null) {
        return true;
    }
    return false;
  };

  isAdmin() {
    this.loadToken();
    if ("admin".localeCompare(this.role) == 0) return true;
    return false;
  }
  isPlayer() {
    this.loadToken();
    if ("player".localeCompare(this.role) == 0) return true;
    return false;
  }

  deletePlayer(username){
    var token = this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + 'api/deletePlayer', {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  deleteCoach(username){
    var token = this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post(this.backendServer + 'api/deleteCoach', {username}, {headers: appHeaders}).pipe(map(res => res));
  }

  updateCoach(coach) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post("api/updateCoach", {coach}, {headers: appHeaders}).pipe(map(res => res));
  };

  updatePlayer(player) {
    console.log(player);
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.post("api/updatePlayer", {player}, {headers: appHeaders}).pipe(map(res => res));
  };

  getOnlinePlayers() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get("api/getonlineplayers", {headers: appHeaders}).pipe(map(res => res));
  }

  getOnlineCoaches() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken  
    });
    return this.http.get("api/getonlinecoaches", {headers: appHeaders}).pipe(map(res => res));
  }

  getCourts(game) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
    return this.http.get("api/gamesList", {headers: appHeaders}).pipe(map(res => res));
  }

  createSession(player, opponent, game, court, evaluator) {
    this.loadToken();
    console.log(player, opponent, game, court, evaluator);
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
    return this.http.post("api/createsession", {player, opponent, game, court, evaluator}, {headers: appHeaders}).pipe(map(res => res));
  }

  getSessions() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken
    });
    return this.http.get("api/getsessions", {headers:appHeaders}).pipe(map(res => res));
  }

  getSession(sessionId) {

    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
      'ID': sessionId
    });
    return this.http.get('api/getsession', {headers: appHeaders}).pipe(map(res => res));
  }

  saveEvaluation(ID, winner,player, opponent, pRanking, oRanking) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
    return this.http.post('api/updateevaluation', {ID, winner, player, opponent, pRanking, oRanking}, {headers: appHeaders}).pipe(map(res => res));
  }

  addNotification(sender, receiver, header, message, time) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
    return this.http.post('api/addnotification', {sender, receiver, header, message, time}, {headers: appHeaders}).pipe(map(res => res));
  }
  deleteNotification(sender, receiver, header, message, time) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
    return this.http.post('api/deletenotification', {sender, receiver, header, message, time}, {headers: appHeaders}).pipe(map(res => res));
  }
  getNotifications() {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
    return this.http.get('api/getnotifications', {headers: appHeaders}).pipe(map(res => res));
  }
  showNotification(ID) {
    this.loadToken();
    let appHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.authToken,
    });
    return this.http.post('api/shownnotification', {ID}, {headers:appHeaders}).pipe(map(res => res));
  }
}
