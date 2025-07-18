import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'danger';

export interface NotificationState {
  message: string;
  type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _state$ = new BehaviorSubject<NotificationState | null>(null);

  get state$() {
    return this._state$.asObservable();
  }

  show(message: string, type: NotificationType = 'danger') {
    this._state$.next({ message, type });
    setTimeout(() => this.clear(), 5000);
  }

  clear() {
    this._state$.next(null);
  }
}
