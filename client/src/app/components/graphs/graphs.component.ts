import { Component, OnInit } from '@angular/core';
import { Chart } from 'node_modules/chart.js';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {
  sessions:any = [];
  allSessions: any = [];
  dataRcvd:any = [];
  username;
  players = [];
  email;
  role;
  _id;
  name;
  Url;
  toShow = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {    
    var temp = window.location.href.split('/');
    this.Url = temp[temp.length - 1];
    if (this.Url != 'dashboard') this.toShow = true;
    console.log("URL: ", this.Url);
      this.authService.getProfile().subscribe(data => {
        this.dataRcvd = data;
        console.log("Profile: ")
        console.log(this.dataRcvd);
        this.username = this.dataRcvd.message.username;
        this.email = this.dataRcvd.message.email;
        this.role = this.dataRcvd.message.role;
        this.name = this.dataRcvd.message.name;
        this._id=this.dataRcvd.message._id;
        console.log("_id", this._id);
        this.authService.getSessions().subscribe(data => {
          this.dataRcvd = data;
          if(!this.dataRcvd.success) console.log("ERR", this.dataRcvd.message);
          else {
            this.allSessions = this.dataRcvd.message;
            this.dataRcvd.message.forEach(session => {
              if(session.player == this._id) this.sessions.push(session);
              else if (session.opponentPlayer == this._id) this.sessions.push(session); 
            });
            console.log(this.sessions);
            var labels = ['Initial'];
            var winnings = [];
            this.sessions.forEach(session => {
              labels.push(session.game);
              if (session.player == this._id && session.winner != undefined) {
                var rankings = session.result[0].split('-');
                // console.log(rankings);
                winnings.push(rankings);
              } else if (session.opponentPlayer == this._id && session.winner != undefined) {
                var rankings = session.result[1].split('-');
                // console.log(rankings);
                winnings.push(rankings);
              }
            });
            var actualData = [];
            winnings.forEach(win => {
              var tempTuple = [];
              if (win[0] == 'Beginner') tempTuple.push(0);
              else if (win[0] == 'Medium') tempTuple.push(1);
              else if (win[0] == 'Advance') tempTuple.push(2);
              if (win[1] == 'Beginner') tempTuple.push(0);
              else if (win[1] == 'Medium') tempTuple.push(1);
              else if (win[1] == 'Advance') tempTuple.push(2);
              actualData.push(tempTuple);
            });
            var dataset = [];
            actualData.forEach(point => {
              dataset.push(point[0]);
            });
            var yLabels = {
              0: 'Beginner', 1: 'Medium', 2: 'Advance'
            }
            
            dataset.push(actualData[actualData.length - 1][1]);
            var dataset2 = [0, 0, 0];
            for (let i = 0; i < dataset.length; ++i ) {
              if (dataset[i] == 0) {
                dataset2[0]++;
              } else if (dataset[i] == 1) {
                dataset2[1]++;
              } else if (dataset[i] == 2) {
                dataset2[2]++;
              }
              console.log(dataset2);
            };
            console.log("All sessions: ", this.allSessions);
            var labels3 = ['Tennis', 'Table Tennis', 'Badminton', 'Squash'];
            var dataset3 = [0, 0, 0, 0];
            this.allSessions.forEach(session => {
              if (session.game == 'Tennis') ++dataset3[0];
              else if (session.game == 'Table Tennis') ++dataset3[1];
              else if (session.game == 'Badminton') ++dataset3[2];
              else if (session.game == 'Squash') ++dataset3[3];
            });
            console.log(dataset, dataset2);
            console.log(dataset);
            var playerStats:any = document.getElementById('player-stats');
            var ctx = playerStats.getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Your History of Rankings!',
                        backgroundColor: '#00d1b2',
                        borderColor: '#777',
                        data: dataset
                    }]
                },

                // Configuration options go here
                options: {
                  scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Rankings'
                      },
                      ticks: {
                        callback: function(value, index, values) {
                            // for a value (tick) equals to 8
                            return yLabels[value];
                            // 'junior-dev' will be returned instead and displayed on your chart
                        }
                      }
                    }],
                    xAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Your sessions'
                      }
                    }]
                  }   
                }
            });
            
             if (this.Url != 'dashboard') {new Chart(document.getElementById("player-stats2"), {
                type: 'doughnut',
                data: {
                  labels: ['Beginner', 'Medium', 'Advance'],
                  datasets: [
                    {
                      label: "Ranking sums!",
                      backgroundColor: ["#0099FF", "#339933","#FFCC33","#FF3366","#c45850"],
                      data: dataset2
                    }
                  ]
                },
                options: {
                  title: {
                    display: true,
                    text: 'Your most consistent rankings!'
                  }
                }
            });

            new Chart(document.getElementById("player-stats3"), {
              type: 'polarArea',
              data: {
                labels: labels3,
                datasets: [
                  {
                    label: "Game sessions!",
                    backgroundColor: ["#0099FF", "#339933","#FFCC33","#FF3366","#c45850"],
                    data: dataset3
                  }
                ]
              },
              options: {
                title: {
                  display: true,
                  text: 'Count of Sessions of games!',
                }
              }
          });}


          }
        })
        
      });

    }
  }

