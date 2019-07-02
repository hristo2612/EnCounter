import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { quotes } from '../shared/quotes';
import { images } from '../shared/images';
import { challenges } from '../shared/challenges';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-counter',
  templateUrl: 'counter.page.html',
  styleUrls: ['counter.page.scss']
})
export class CounterPage implements OnInit {

  quotes: any[] = [];
  images: any[] = [];
  challenges: any[] = [];
  currentDay;
  currentQuote = '';
  currentImage = '/assets/background.jpeg';
  currentChallengeNumber = 1;
  currentChallenge: any = { subscribe: '', description: '' };
  completeChallenges = false;
  counters = {
    people: {},
    connections: {},
    men: {},
    women: {}
  };
  fullDate: string;
  animationGoing = false;

  constructor(private storage: Storage, private alertCtrl: AlertController, private http: HttpClient) {

  }

  ngOnInit() {
    const date = new Date();
    this.fullDate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
    this.currentDay = new Date().getDate();
    this.quickSetup();
    this.setCounters();
    this.setQuote();
    this.setImage();
    this.setChallenge();
  }

  quickSetup() {
    this.counters.people[this.fullDate] = 0;
    this.counters.connections[this.fullDate] = 0;
    this.counters.men[this.fullDate] = 0;
    this.counters.women[this.fullDate] = 0;
  }

  setQuote() {
    this.quotes = quotes;
    this.currentQuote = quotes[this.currentDay - 1];
  }

  setImage() {
    this.images = images;
    this.http.get(this.images[this.currentDay - 1], { responseType: 'blob' }).subscribe((res) => {
      if (res.type === 'image/jpeg') {
        this.currentImage = this.images[this.currentDay - 1];
      }
    });
  }

  setChallenge() {
    this.challenges = challenges;
    this.storage.get('savedDay').then((savedDay) => {
      if (savedDay) {
        if (this.challenges.length >= savedDay.challenge) {
          if (this.currentDay !== savedDay.day) {
              this.currentChallenge = challenges[savedDay.challenge];
              this.currentChallengeNumber = savedDay.challenge + 1;
              this.storage.set('savedDay', { day: this.currentDay, challenge: savedDay.challenge + 1 });
          } else {
              if (savedDay.challenge > 1) {
                this.currentChallenge = challenges[savedDay.challenge - 1];
                this.currentChallengeNumber = savedDay.challenge;
              } else {
                this.currentChallenge = challenges[0];
                this.currentChallengeNumber = 1;
              }
          }
        } else {
          this.completeChallenges = true;
        }
      } else {
        this.currentChallenge = challenges[0];
        this.currentChallengeNumber = 1;
        this.storage.set('savedDay', { day: this.currentDay, challenge: 1 });
      }
    });
  }

  showInfo(header, message) {
    this.presentAlert(header, message);
  }

  setCounters() {
    this.storage.get('counters').then((counters) => {
      if (counters) {
        console.log(counters);
        this.counters = counters;
        if ((!counters.people[this.fullDate] ||
          !counters.connections[this.fullDate] ||
          !counters.men[this.fullDate] ||
          !counters.women[this.fullDate]
          ) &&
          (counters.people[this.fullDate] !== 0 &&
          counters.connections[this.fullDate] !== 0 &&
          counters.men[this.fullDate] !== 0 &&
          counters.women[this.fullDate] !== 0)) {
            this.quickSetup();
            this.storage.set('counters', this.counters);
        }
      } else {
        this.storage.set('counters', this.counters);
      }
    });
  }

  increaseValue(type) {
    this.changeValue(type, 1);
    this.changeValue('connections', 1);
    if (!this.animationGoing) {
      this.animationGoing = true;
      document.querySelector('.connection-number').classList.toggle('pulse');
      document.querySelector('.connection-title').classList.toggle('enlarge');
      setTimeout(() => {
        this.animationGoing = false;
        document.querySelector('.connection-number').classList.toggle('pulse');
        document.querySelector('.connection-title').classList.toggle('enlarge');
      }, 805);
    }
  }

  decreaseValue(type) {
    this.changeValue(type, -1);
    this.changeValue('connections', -1);
  }

  changeValue(type, increment) {
    if (this.counters[type][this.fullDate] === 0 && increment === -1) {
      return;
    }
    this.counters[type][this.fullDate] += increment;
    this.storage.set('counters', this.counters);
  }

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}

