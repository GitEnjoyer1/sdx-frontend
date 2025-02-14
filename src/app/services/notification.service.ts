import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  showNotification(type: "general" | "confirmation" | "warning" | undefined, text: string){
    const headerElement = document.querySelector('sdx-header');
    if (headerElement) {
        headerElement.showNotification({ description: text, type: type });
    }
    else {
        console.warn('sdx-header is not available in the DOM at the time this method was called.');
    }
  }
}
