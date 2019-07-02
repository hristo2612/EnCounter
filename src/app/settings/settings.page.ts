import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { PubSub } from '../shared/pub-sub';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit, OnDestroy {
  reminders: any[] = [];
  subscribers: any[] = [];

  constructor(private storage: Storage, private navCtrl: NavController, private localNotifications: LocalNotifications) {

  }

  ngOnInit() {
    this.setReminders();
    const setRemindersSubscriber = PubSub.subscribe('setReminders', () => {
      this.setReminders();
    });

    this.subscribers.push(setRemindersSubscriber);
  }

  ngOnDestroy() {
    PubSub.unsubscribeAll(this.subscribers);
  }

  setReminders() {
    this.storage.get('reminders').then((data) => {
      this.reminders = data || [];
    });
  }

  deleteReminder(index) {
    this.localNotifications.clear(Number(this.reminders[index].time.split(':').join('')));
    this.reminders.splice(index, 1);
    this.storage.set('reminders', this.reminders);
  }

  addReminder() {
    this.navCtrl.navigateForward('date');
  }

  onToggleChange(event, time) {
    if (!event.detail.checked) {
      this.reminders.forEach((r) => {
        if (r.time === time) {
          this.localNotifications.clear(Number(r.time.split(':').join('')));
        }
      });
    }
  }
}
