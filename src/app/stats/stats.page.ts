import { Component, ViewChild, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-stats',
  templateUrl: 'stats.page.html',
  styleUrls: ['stats.page.scss']
})
export class StatsPage implements OnInit {
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;

  doughnutChart: any;
  lineChart: any;

  constructor(private storage: Storage, private loadingController: LoadingController) {
  }

  ngOnInit() {
    this.presentLoading();
    setTimeout(() => {
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['New People', 'Men', 'Women'],
          datasets: [{
            data: [12, 19, 3],
            backgroundColor: [
              '#33b5e5',
              '#4285F4',
              '#aa66cc'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56'
            ]
          }]
        }

      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'New People',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [1, 2, 3, 7, 10, 1, 4],
              spanGaps: false,
            }
          ]
        }
      });
    }, 420);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading',
      duration: 500
    });
    await loading.present();
  }

}
