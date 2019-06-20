import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { quotes } from '../shared/quotes';
import { images } from '../shared/images';
import { challenges } from '../shared/challenges';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
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

  constructor(private storage: Storage, private alertCtrl: AlertController, private http: HttpClient) {

  }

  ngOnInit() {
    this.currentDay = new Date().getDate();
    this.setQuote();
    this.setImage();
    this.setChallenge();
    this.storage.get('counters').then((counters) => {
      if (counters) {
        console.log(counters);
      }
    });
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

  async presentAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}

