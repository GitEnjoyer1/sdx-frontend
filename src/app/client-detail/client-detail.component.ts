import { Component, CUSTOM_ELEMENTS_SCHEMA, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendServiceService } from '../backend-service.service';
import { ClientObject } from '../../utils/interfaces';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';
import { ErrorPageComponent } from '../error-page/error-page.component';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, ErrorPageComponent],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientDetailComponent {

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendServiceService, private notificationService: NotificationService){}

  fetchSuccessful: boolean = true

  client: ClientObject = {
    id: 0,
    name: '',
    email: '',
    uidRange: [],
    gidRange: [],
    description: '',
    comment: ''
  };

    users: any = {};

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getClientById(id)
    })
    this.getUsers();
  }

  getClientById(id: number): void {
    this.backendService.getClientById(id).subscribe(
      data => {
        this.client.id = data.id;
        this.client.name = data.name;
        this.client.email = data.email;
        this.client.uidRange = data.uid_range; // directly map uid_range to uidRange
        this.client.gidRange = data.gid_range; // directly map gid_range to gidRange
        this.client.description = data.description;
        this.client.comment = data.comment;
      },
      error => {
        this.fetchSuccessful = false
        console.error('Error fetching client', error);
      }
    );
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

  getUsers(): void {
    this.backendService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }
}
