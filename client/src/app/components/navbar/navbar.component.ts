import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor( public authService: AuthService, private router: Router) { }
  notificationCount;
  showTag = true;
  dataRcvd:any = [];
  onLogoutClick() {
    console.log("HERE");
    this.authService.logout();
    // this.router.navigate(['/']);
  }

  ngOnInit() {
    this.authService.getNotifications().subscribe(data => {
      this.dataRcvd = data;
      this.notificationCount = this.dataRcvd.message.length;
      if (this.notificationCount == 0) {
        this.showTag = false;
      }
      console.log(this.notificationCount);
    })
  }

}
