import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { NotAuthGuard } from './guard/notAuth.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast/toast.component';
import { CreateplayerComponent } from './components/CRUD/createplayer/createplayer.component';
import { CreatecoachComponent } from './components/CRUD/createcoach/createcoach.component';
import { UpdatecoachComponent } from './components/CRUD/updatecoach/updatecoach.component';
import { UpdateplayerComponent } from './components/CRUD/updateplayer/updateplayer.component';

import { FormModalComponent } from './components/form-modal/form-modal.component';
import { SessionComponent } from './components/session/session.component';
import { CreatesessionComponent } from './components/CRUD/createsession/createsession.component';
import { UpdatesessionComponent } from './components/CRUD/updatesession/updatesession.component';
import { PlayComponent } from './components/play/play.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { GraphsComponent } from './components/graphs/graphs.component';
import { AboutComponent } from './components/about/about.component';
import { StatsComponent } from './components/stats/stats.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ToastComponent,
    CreateplayerComponent,
    CreatecoachComponent,
    UpdatecoachComponent,
    UpdateplayerComponent,
    FormModalComponent,
    SessionComponent,
    CreatesessionComponent,
    UpdatesessionComponent,
    PlayComponent,
    NotificationsComponent,
    GraphsComponent,
    AboutComponent,
    StatsComponent

  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    NgbModule
  ],
  entryComponents: [FormModalComponent],
  providers: [ AuthService, AuthGuard, NotAuthGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
