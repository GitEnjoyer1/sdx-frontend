import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendServiceService } from '../services/backend-service.service';
import { NotificationService } from '../services/notification.service';
import { EditUserObject } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditUserComponent {


  constructor( private backendService: BackendServiceService, private notificationService: NotificationService, private router: Router, private route: ActivatedRoute ) {}

  parentClientId: number = NaN

  parentUserId: number = NaN

  emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  validationActive: boolean = false

  fetchSuccessful: boolean = true

  editedUser: EditUserObject = {
    name: '',
    email: '',
    operatingSystem: '',
    description: '',
    comment: ''
  }

  ngOnInit(): void {
    // accessing the grandparent route as we are two levels deep
    if (this.route.parent?.parent) {
      this.route.parent.parent.params.subscribe(params => {
        this.parentClientId = params['clientId'];
      });

      // additionally subscribe to the parent route to get userId
      this.route.parent.params.subscribe(params => {
        this.parentUserId = params['userId'];
      });
    } else {
      console.error('No parent route found');
    }
    this.getUserById(this.parentClientId, this.parentUserId);
}

  
  getUserById(clientId: number, userId: number) {
    this.backendService.getUserById(clientId, userId).subscribe(
      data => {
        this.editedUser.name = data.name
        this.editedUser.email = data.email
        this.editedUser.operatingSystem = data.operatingSystem
        this.editedUser.description = data.description
        this.editedUser.comment = data.comment
      },
      error => {
        console.error('Error fetching user', error);
      }
    );
  }

  editUser() {
    this.validationActive = true
    if (
      this.isFilledOut(this.editedUser.name) &&
      this.isValidEmail(this.editedUser.email) &&
      this.isFilledOut(this.editedUser.operatingSystem)
    ) {
      this.backendService.editUser(this.parentClientId, this.parentUserId, this.editedUser).subscribe(
        data => {
          this.notificationService.showNotification('confirmation', `Successfully edited the user ${this.editedUser.name}`);
          this.router.navigate([`/client/${this.parentClientId}/user/${this.parentUserId}`]).then(() => {
            this.reloadCurrentRoute();
        });
        },
        error => {
          this.notificationService.showNotification('warning', 'There was a problem editing the user');
          console.error('Error editing user', error);
        }
      );
    }
    else {
      this.notificationService.showNotification('warning', 'There are still invalid inputs');
    }
    
  }

  moveBack() {
    this.router.navigate([`/client/${this.parentClientId}/user/${this.parentUserId}`]).then(() => {
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



