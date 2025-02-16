import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendServiceService } from '../services/backend-service.service';
import { UserObject } from '../../utils/interfaces';
import { NotificationService } from '../services/notification.service';
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

  parentClientId: number = NaN

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
        this.parentClientId = params['clientId'];
      });
    } else {
      console.error('No parent route found');
    }
    this.route.params.subscribe(params => {
      this.user.id = params['userId'];

      this.getUserById(this.parentClientId, this.user.id)
      this.getClientNameById(this.parentClientId)

    });
  }

  getUserById(clientId: number, userId: number): void {
    this.backendService.getUserById(clientId, userId).subscribe(
      data => {
        this.user = data;
      },
      error => {
        this.fetchSuccessful = false
        console.error("error: ", error)

        console.error('Error fetching user', error);
      }
    );
  }

  deleteUser(clientId: number, userId: number): void {
    this.backendService.deleteUser(clientId, userId).subscribe(
      data => {
        this.router.navigate([`/client/${this.parentClientId}`]).then(() => {
          this.reloadCurrentRoute();
      });
        this.notificationService.showNotification('confirmation', `Successfully deleted the user ${this.user.name}`)
      },
      error => {
        this.notificationService.showNotification('warning', 'There was a problem deleting the user.');
        console.error('Error fetching user', error);
      }
    );
  }

  getClientNameById(clientId: number) {
    this.backendService.getClientNameById(clientId).subscribe(
      data => {
        this.clientName = data;
      },
      error => {
        this.clientName = 'Not available'
        console.error('Error fetching client name', error);
      }
    );
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
