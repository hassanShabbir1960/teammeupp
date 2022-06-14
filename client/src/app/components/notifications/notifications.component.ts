import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }
  notifications = [];
  dataRcvd:any = [];

  ngOnInit(): void {
    this.authService.getNotifications().subscribe(data => {
      this.dataRcvd = data;
      this.notifications = this.dataRcvd.message;
    })
  }

}
