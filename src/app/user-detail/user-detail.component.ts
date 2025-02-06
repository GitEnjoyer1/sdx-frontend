import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getUserById(id);
    })
  }

  getUserById(id: number): void {
    this.backendService.getUserById(id).subscribe(
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
      },
      error => {
        this.fetchSuccessful = false
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

}
