import { ReplaySubject, Subscription } from 'rxjs';

export class PubSub {
    private static events: any = {};

    static publish(eventName: string, data: any): void {
        PubSub.getSubjectByEventName(eventName).next(data);
    }

    static subscribe(eventName: string, callback: (data?: any) => any): Subscription
        | boolean {
        if (!PubSub.isCallback(callback)) {
            return false;
        }

        return PubSub.getSubjectByEventName(eventName).subscribe(callback);
    }

    static unsubscribe(subscriber: Subscription): void {
        if (subscriber) {
            subscriber.unsubscribe();
        }
    }

    static unsubscribeAll(subscribers: any[]): void {
        if (subscribers) {
            subscribers.forEach((subscriber: Subscription) => {
                if (subscriber instanceof Subscription) {
                    subscriber.unsubscribe();
                }
            });
        }
    }

    static dispose(eventName: string): void {
        if (PubSub.events[eventName]) {
            PubSub.getSubjectByEventName(eventName).unsubscribe();
            delete PubSub.events[eventName];
        }
    }

    static disposeEvents(events: string[]): void {
        events.forEach((eventName: string) => PubSub.dispose(eventName));
    }

    protected static getSubjectByEventName(eventName: string): ReplaySubject<any> {
        if (!PubSub.events[eventName]) {
            PubSub.events[eventName] = new ReplaySubject(1);
        }

        return PubSub.events[eventName];
    }

    protected static isCallback(callback: (data?: any) => any): boolean {
        if (!callback || typeof callback !== 'function') {
            console.warn('Callback is missing! Subscription cancelled!');

            return false;
        }

        return true;
    }
}
