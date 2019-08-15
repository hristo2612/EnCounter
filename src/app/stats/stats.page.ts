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
  counters: any;
  connections: any;
  women: any;
  men: any;
  people: any;
  womenThisMonth: any;
  menThisMonth: any;
  peopleThisMonth: any;
  currentMonth: any;
  allDates: any;
  allPeople: any;
  allConnections: any;
  allMen: any;
  allWomen: any;

  constructor(private storage: Storage, private loadingController: LoadingController) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.presentLoading();
    this.currentMonth = (new Date()).getMonth();
    this.loadData();
  }

  loadData() {
    this.storage.get('counters').then((counters) => {
      if (counters) {
        this.counters = counters;
        this.people = counters.people;
        this.connections = counters.connections;
        this.men = counters.men;
        this.women = counters.women;

        this.populateDonutChart();
        this.populateLineChart();
        this.createCharts();

      } else {
        console.log('No data to show');
      }
    });
  }

  populateDonutChart() {
    this.peopleThisMonth = this.populateDonutGivenTarget(this.people);
    this.menThisMonth = this.populateDonutGivenTarget(this.men);
    this.womenThisMonth = this.populateDonutGivenTarget(this.women);
  }

  populateLineChart() {
    this.allDates = this.populateDates(this.counters);
    this.allConnections = this.populateLineGivenTarget(this.connections);
    this.allMen = this.populateLineGivenTarget(this.men);
    this.allWomen = this.populateLineGivenTarget(this.women);
    this.allPeople = this.populateLineGivenTarget(this.people);
  }

  populateDates(counters) {
    const dates = [];
    for (const property in counters) {
      if (counters.hasOwnProperty(property)) {
        const currentObj = counters[property];
        for (const dateKey in currentObj) {
          if (currentObj.hasOwnProperty(dateKey)) {
            const formattedDate = dateKey.replace(/-/g, '/');
            if (dates.indexOf(formattedDate) < 0) {
              dates.push(formattedDate);
            }
          }
        }
      }
    }
    return dates;
  }

  populateLineGivenTarget(target) {
    const values = [];
    for (const property in target) {
      if (target.hasOwnProperty(property)) {
        values.push(target[property]);
      }
    }

    return values;
  }

  populateDonutGivenTarget(target) {
    let total = 0;
    for (const property in target) {
      if (target.hasOwnProperty(property)) {
        const splitDate = property.split('-');
        const month = splitDate[1];
        if (Number(month) === this.currentMonth) {
          total += target[property];
        }
      }
    }

    return total;
  }

  createCharts() {
    setTimeout(() => {
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['New People', 'Men', 'Women'],
          datasets: [{
            data: [this.peopleThisMonth, this.menThisMonth, this.womenThisMonth],
            backgroundColor: [
              '#33b5e5',
              '#4285F4',
              '#aa66cc'
            ],
            hoverBackgroundColor: [
              '#21a2d1',
              '#36A2EB',
              '#9551b8'
            ]
          }]
        }

      });

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
        type: 'line',
        data: {
          // tslint:disable-next-line:max-line-length
          labels: this.allDates,
          datasets: [
            {
              label: 'New People',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(51, 181, 229,0.4)',
              borderColor: 'rgba(51, 181, 229,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(51, 181, 229,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(51, 181, 229,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.allPeople,
              spanGaps: false,
            },
            {
              label: 'Men',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(66, 133, 244,0.4)',
              borderColor: 'rgba(66, 133, 244,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(66, 133, 244,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(66, 133, 244,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.allMen,
              spanGaps: false,
            },
            {
              label: 'Women',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(170, 102, 204,0.4)',
              borderColor: 'rgba(170, 102, 204,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(170, 102, 204,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(170, 102, 204,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.allWomen,
              spanGaps: false,
            },
            {
              label: 'Connections',
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(0, 200, 81,0.4)',
              borderColor: 'rgba(0, 200, 81,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(0, 200, 81,1)',
              pointBackgroundColor: '#fff',
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(0, 200, 81,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: this.allConnections,
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
