import { Component, CUSTOM_ELEMENTS_SCHEMA, numberAttribute } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { BackendServiceService } from '../services/backend-service.service'; 
import { ClientObject } from '../../utils/interfaces';
import { NotificationService } from '../services/notification.service'; 
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { filter } from 'rxjs';
import { UserDetailComponent } from '../user-detail/user-detail.component';

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
  isCreateUserActive = false

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendServiceService, private notificationService: NotificationService){
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(event => {
      // Within subscribe block, events are ensured to be of type NavigationEnd
      const navEnd = event as NavigationEnd;
      this.isUserDetailActive = navEnd.urlAfterRedirects.includes('/user/');
      this.isCreateUserActive = navEnd.urlAfterRedirects.includes('/create-user');

    });
  }

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

  async ngOnInit() {
      this.route.params.subscribe(async params => {
      const clientId = params['clientId'];
      try {
        await this.getClientById(clientId);
        this.getUsers(clientId);
      } catch (err) {
        console.error('Error fetching client', err);
      }
    })
  }

  onActivate(event: any) {
    if (event instanceof UserDetailComponent) {
      this.isUserDetailActive = true;
    } else {
      this.isUserDetailActive = false;
    }
  }

  getClientById(clientId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.backendService.getClientById(clientId).subscribe(
        data => {
          this.client.id = data.id;
          this.client.name = data.name;
          this.client.email = data.email;
          this.client.uidRange = data.uid_range; // directly map uid_range to uidRange
          this.client.gidRange = data.gid_range; // directly map gid_range to gidRange
          this.client.description = data.description;
          this.client.comment = data.comment;
          resolve();
        },
        error => {
          this.fetchSuccessful = false
          this.notificationService.showNotification('warning', 'There was a problem trying to fetch the client details');
          console.error('Error fetching client', error);
        }
      );
    });
  }


  deleteClient(id: number): void {
    this.backendService.deleteClient(id).subscribe(
      data => {
        this.router.navigate(['/']);
        this.notificationService.showNotification('confirmation', `Successfully deleted the client ${this.client.name}`)
      },
      error => {
        this.notificationService.showNotification('warning', 'There was a problem deleting the client.');
        console.error('Error fetching client', error);
      }
    );
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
