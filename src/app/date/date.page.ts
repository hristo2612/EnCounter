import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PubSub } from '../shared/pub-sub';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-date',
  templateUrl: './date.page.html',
  styleUrls: ['./date.page.scss'],
})
export class DatePage implements OnInit {
  time: any = '13:20';
  duplicated: any = false;

  constructor(private storage: Storage, private navCtrl: NavController, private toastController: ToastController, private localNotifications: LocalNotifications) { }

  ngOnInit() {
  }

  onChanged(time) {
    this.time = time.detail.value;
  }

  addTime() {
    this.storage.get('reminders').then((data) => {
      const reminders = data || [];
      this.duplicated = false;
      reminders.forEach(element => {
        if (element.time === this.time) {
          this.duplicated = true;
        }
      });
      if (!this.duplicated) {
        reminders.push({ time: this.time, checked: true });
        this.setNotification(this.time);
      } else {
        this.presentToast();
      }
      return this.storage.set('reminders', reminders);
    }).then(() => {
      PubSub.publish('setReminders', true);
      if (!this.duplicated) {
        this.navCtrl.back();
      }
    });
  }

  setNotification(time) {
    const hourString = time.split(':')[0];
    const minuteString = time.split(':')[1];
    const id = Number(hourString + minuteString);
    const hour = Number(hourString);
    const minute = Number(minuteString);
    (this.localNotifications as any).schedule([
      {
        id,
        title: 'Track your encounters',
        text: 'See what\'s your score!',
        trigger: { every: { hour, minute, second: 11 }, count: 1 },
        data: { id, name: 'Encounter Notification' }
      }
    ]);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'You already have a reminder for the current time.',
      duration: 3000
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }

}
