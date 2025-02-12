import { Component, CUSTOM_ELEMENTS_SCHEMA, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendServiceService } from '../backend-service.service';
import { UserObject } from '../../utils/interfaces';
import { NotificationService } from '../notification.service';
import { CommonModule, NgIf } from '@angular/common';
import { ErrorPageComponent } from '../error-page/error-page.component';


@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, NgIf, ErrorPageComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserDetailComponent {

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendServiceService, private notificationService: NotificationService){}

  fetchSuccessful: boolean = true

  clientName: string = ''

  parentClientId: number = 0

  user: UserObject = {
    id: 0,
    name: '',
    email: '',
    uid: 0,
    gid: 0,
    operatingSystem: '',
    clientId: 0,
    description: '',
    comment: ''
  };


  ngOnInit() {
    if (this.route.parent) {
      this.route.parent.params.subscribe(params => {
        const clientId = params['clientId'];
        this.parentClientId = clientId
      });
    } else {
      console.error('No parent route found');
    }
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.getUserById(this.parentClientId, userId)
      this.getClientNamebyId(this.parentClientId)

    });
  }

  getUserById(clientId: number, userId: number): void {
    this.backendService.getUserById(clientId, userId).subscribe(
      data => {
        this.user.id = data.id;
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.uid = data.uid; // directly map uid_range to uidRange
        this.user.gid = data.gid; // directly map gid_range to gidRange
        this.user.operatingSystem = data.operating_system; // directly map gid_range to gidRange
        this.user.clientId = data.client_id; // directly map gid_range to gidRange
        this.user.description = data.description;
        this.user.comment = data.comment;
        console.log("data: ", data)
      },
      error => {
        this.fetchSuccessful = false
        console.log("error: ", error)

        console.error('Error fetching user', error);
      }
    );
  }

  deleteUser(id: number): void {
    this.backendService.deleteUser(id).subscribe(
      data => {
        this.router.navigate([`/client/${this.user.clientId}`]);
        this.notificationService.showNotification('confirmation', `Successfully deleted the user ${this.user.name}`)
      },
      error => {
        this.notificationService.showNotification('warning', 'There was a problem deleting the user.');
        console.error('Error fetching user', error);
      }
    );
  }

  getClientNamebyId(id: number) {
    this.backendService.getClientNameById(id).subscribe(
      data => {
        this.clientName = data;
      },
      error => {
        this.clientName = 'Not available'
        console.error('Error fetching client name', error);
      }
    );
  }

}
