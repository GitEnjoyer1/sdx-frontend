import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendServiceService } from '../services/backend-service.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { ClientObject, CreateClientObject } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateComponent {

  constructor( private backendService: BackendServiceService, private notificationService: NotificationService, private router: Router ) {}
  
  clients: any[] = [];

  maxUid: number = 0;
  maxGid: number = 0;

  emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  validationActive: boolean = false

  fetchSuccessful: boolean = true

  uidRangeLength: number = 1000;
  gidRangeLength: number = 1000;

  newClient: CreateClientObject = {
    name: '',
    email: '',
    uidRange: [NaN, NaN],
    gidRange: [NaN, NaN],
    description: '',
    comment: ''
  }

  ngOnInit(): void {
  }

  getMaxUid(clients: ClientObject[]): void {
    this.maxUid = Math.max(...clients.map(o => o.uidRange[1]))
  }

  getMaxGid(clients: ClientObject[]): void {
    this.maxGid = Math.max(...clients.map(o => o.gidRange[1]))
  }



  setUidRange() {
    if (this.uidRangeLength.toString().length > 0 && this.uidRangeLength <= 5000) {
      this.backendService.getClients().subscribe(
        data => {
          this.clients = data;
          this.getMaxUid(this.clients);
          this.newClient.uidRange[0] = this.maxUid;
          this.newClient.uidRange[1] = +this.maxUid + +this.uidRangeLength;
        },
        error => {
          this.notificationService.showNotification('warning', 'There was a problem getting your UID-Range');
          console.error('Error fetching clients', error);
        }
      );
    }
    else {
    this.notificationService.showNotification('warning', 'Enter a valid UID-Range length');
  }
  }

  setGidRange() {
    if (this.gidRangeLength.toString().length > 0 && this.gidRangeLength <= 5000) {
      this.backendService.getClients().subscribe(
        data => {
          this.clients = data;
          this.getMaxGid(this.clients);
          this.newClient.gidRange[0] = this.maxGid;
          this.newClient.gidRange[1] = 0
          this.newClient.gidRange[1] = +this.maxGid + +this.gidRangeLength; // using unary plus (+) operator to convert to number before adding
        },
        error => {
          this.notificationService.showNotification('warning', 'There was a problem getting your GID-Range');
          console.error('Error fetching clients', error);
        }
      );
    }
    else {
      this.notificationService.showNotification('warning', 'Enter a valid GID-Range length');
    }
    
  }

  createClient() {
    this.validationActive = true
    if (
      this.isFilledOut(this.newClient.name) &&
      this.isValidEmail(this.newClient.email) &&
      this.isValidRangeLength(this.uidRangeLength) &&
      this.isValidRangeLength(this.gidRangeLength) &&
      this.isValidRange(this.newClient.uidRange) &&
      this.isValidRange(this.newClient.gidRange)
    ) {
      this.backendService.createClient(this.newClient).subscribe(
        data => {
          this.notificationService.showNotification('confirmation', `Successfully created the new client ${this.newClient.name}`);
          this.router.navigate(['/']);
        },
        error => {
          this.notificationService.showNotification('warning', 'There was a problem creating the client');
          console.error('Error creating client', error);
        }
      );
    }
    else {
      this.notificationService.showNotification('warning', 'There are still invalid inputs');
    }
    
  }

  moveBack() {
    this.router.navigate([`/`]);
  }

  isFilledOut(value: any): boolean | undefined {
    if (this.validationActive) {
      return value.toString().length > 0;
    }
    return undefined
  }

  isValidEmail(value: string): boolean | undefined {
    if (this.validationActive) {
      return (this.emailRegex.test(value));
    } 
    return undefined;
    }

    isValidRangeLength(value: number): boolean | undefined {
      if (this.validationActive) {
        return value > 0 && value <= 5000;
      }
      return undefined
    }

    isValidRange(value: number[]) {
      if (this.validationActive) {
        return value[0] && value[1]
      }
      return undefined
    }

}

