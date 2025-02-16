import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendServiceService } from '../services/backend-service.service';
import { NotificationService } from '../services/notification.service';
import { CreateClientObject, EditClientObject } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-client',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditClientComponent {


  constructor( private backendService: BackendServiceService, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute ) {}

  parentClientId: number = NaN

  emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  validationActive: boolean = false

  fetchSuccessful: boolean = true

  editedClient: EditClientObject = {
    name: '',
    email: '',
    description: '',
    comment: ''
  }

  ngOnInit(): void {
    if (this.route.parent) {
      this.route.parent.params.subscribe(params => {
        this.parentClientId = params['clientId'];
      });
    } else {
      console.error('No parent route found');
    }
    this.getClientById(this.parentClientId)
    }
  
  getClientById(clientId: number) {
    this.backendService.getClientById(clientId).subscribe(
      data => {
        this.editedClient.name = data.name
        this.editedClient.email = data.email
        this.editedClient.description = data.description
        this.editedClient.comment = data.comment
      },
      error => {
        console.error('Error fetching client name', error);
      }
    );
  }

  editClient() {
    this.validationActive = true
    if (
      this.isFilledOut(this.editedClient.name) &&
      this.isValidEmail(this.editedClient.email)
    ) {
      this.backendService.editClient(this.parentClientId, this.editedClient).subscribe(
        data => {
          this.notificationService.showNotification('confirmation', `Successfully edited the client ${this.editedClient.name}`);
          this.router.navigate([`/client/${this.parentClientId}`]).then(() => {
            this.reloadCurrentRoute();
        });
        },
        error => {
          this.notificationService.showNotification('warning', 'There was a problem editing the client');
          console.error('Error editing client', error);
        }
      );
    }
    else {
      this.notificationService.showNotification('warning', 'There are still invalid inputs');
    }
    
  }

  moveBack() {
    this.router.navigate([`/client/${this.parentClientId}`]).then(() => {
      this.reloadCurrentRoute();
    });
  }
  
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
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
}
