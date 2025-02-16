import { Component, CUSTOM_ELEMENTS_SCHEMA, numberAttribute } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackendServiceService } from '../services/backend-service.service'; 
import { ClientObject } from '../../utils/interfaces';
import { NotificationService } from '../services/notification.service'; 
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { filter, forkJoin } from 'rxjs';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ErrorPageComponent, RouterOutlet],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientDetailComponent {
  
  isUserDetailActive = false;
  isCreateUserActive = false;
  isEditClientActive = false;

  clientId: number = NaN
  fetchSuccessful: boolean = true;
  usersEmpty: boolean = false;

  client: ClientObject = {
    id: 0,
    name: '',
    email: '',
    uidRange: [],
    gidRange: [],
    description: '',
    comment: ''
  };

  users: any = [];

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendServiceService, private notificationService: NotificationService){
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(event => {
      const navEnd = event as NavigationEnd;
      this.isUserDetailActive = navEnd.urlAfterRedirects.includes('/user/');
      this.isCreateUserActive = navEnd.urlAfterRedirects.includes('/create-user');
      this.isEditClientActive = navEnd.urlAfterRedirects.includes('/edit');
    });
  }

  async ngOnInit() {
      this.route.params.subscribe(async params => {
      this.clientId = params['clientId'];
      if (!this.isCreateUserActive && !this.isUserDetailActive && !this.isEditClientActive) { // stop detail component from making requests if other components are active
        try {
          await this.getClientById(this.clientId);
          this.getUsers(this.clientId);
        } catch (error) {
          console.error('Error fetching client', error);
        }
      }
    })
  }

  getClientById(clientId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backendService.getClientById(clientId).subscribe(
        data => {
          this.client = data
          resolve()
        },
        error => {
          this.fetchSuccessful = false
          this.notificationService.showNotification('warning', 'There was a problem trying to fetch the client details');
          console.error('Error fetching client', error);
          reject()
        }
      );
    });
  }


  deleteClient(id: number): void {
   // Get an array of observables for the delete user requests.
    const deleteUserObservables = this.users.map((user: { id: number; }) => this.backendService.deleteUser(this.clientId, user.id));

   // Use forkJoin to process all delete user requests.
    forkJoin(deleteUserObservables).subscribe({
      next: () => {
       // After all users have been deleted, delete the client.
        this.backendService.deleteClient(id).subscribe(
          data => {
            this.router.navigate(['/']);
            this.notificationService.showNotification('confirmation', `Successfully deleted the client ${this.client.name}`);
          },
          error => {
            this.notificationService.showNotification('warning', 'There was a problem deleting the client.');
            console.error('Error deleting client', error);
          }
        );
      },
      error: error => {
       // Handle errors from deleting users here.
        console.error('Error deleting users', error);
        this.notificationService.showNotification('warning', 'There was a problem deleting the users.');
      }
    });
  }

  getUsers(clientId: number): void {
    this.backendService.getUsers(clientId).subscribe(
      data => {
        this.users = data;
        if (this.users == false) {
          this.usersEmpty = true;
        }
      },
      error => {
        this.fetchSuccessful = false
        this.notificationService.showNotification('warning', 'There was a problem trying to fetch the users');
        console.error('Error fetching users', error);
      }
    );
  }
}
