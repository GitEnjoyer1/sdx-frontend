import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendServiceService } from '../services/backend-service.service';
import { NotificationService } from '../services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientObject, CreateClientObject, CreateUserObject } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateUserComponent {

  constructor( private backendService: BackendServiceService, private notificationService: NotificationService, private router: Router,  private route: ActivatedRoute ) {}
  
  parentClientId: number = NaN;

  clientUidRange: number[] = [];
  clientGidRange: number[] = [];

  occupiedUids: number[] = [0];
  occupiedGids: number[] = [0];

  emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  validationActive: boolean = false;

  fetchSuccessful: boolean = true;

  newUser: CreateUserObject = {
    name: '',
    email: '',
    uid: NaN,
    gid: NaN,
    operatingSystem: '',
    clientId: NaN,
    description: '',
    comment: ''
  }


  ngOnInit() {
    if (this.route.parent) {
      this.route.parent.params.subscribe(params => {
        const clientId = params['clientId'];
        this.parentClientId = clientId;
        this.newUser.clientId = this.parentClientId;
      });
    } else {
      console.error('No parent route found');
    }
    this.getClientRangesById(this.parentClientId);
    this.getUserIds(this.parentClientId);
    console.log(this.newUser.clientId)
    }

  getClientRangesById(id: number) {
    this.backendService.getClientRangesById(id).subscribe(
      data => {
        this.clientUidRange = data.uid_range;
        this.clientGidRange = data.gid_range;
      },
      error => {
        this.notificationService.showNotification('warning', 'There was a problem getting the ID Ranges');
        console.error('Error fetching client name', error);
      }
    );
  }

  getUserIds(clientId: number) {
    this.backendService.getUsersIds(clientId).subscribe(users => {
      users.forEach((user: { uid: any; gid: any; }) => {
        this.occupiedUids.push(user.uid);
        this.occupiedGids.push(user.gid);
      });

    },
    error => {
      this.notificationService.showNotification('warning', 'There was a problem getting the IDs');
      console.error('Error fetching user IDs', error);
    });
  }

  setUid() {
    if (Math.max(...this.occupiedUids) + 1 < Math.max(...this.clientUidRange)) { // excluding upper end of uidRange. range of 1000 - 2000 contains 1001, 1002, ..., 1999
      this.newUser.uid = Math.max(...this.occupiedUids) + 1
    }
    else {
      this.notificationService.showNotification('warning', 'Your Client has reached its maximum amount of UIDs');
    }
  } 

  setGid() {
    if (Math.max(...this.occupiedGids) + 1 < Math.max(...this.clientGidRange)) { // excluding upper end of uidRange. range of 1000 - 2000 contains 1001, 1002, ..., 1999
      this.newUser.gid = Math.max(...this.occupiedGids) + 1
    }
    else {
      this.notificationService.showNotification('warning', 'Your Client has reached its maximum amount of GIDs');
    }
  }
  createUser() {
    this.validationActive = true
    if (
      this.isFilledOut(this.newUser.name) &&
      this.isValidEmail(this.newUser.email) &&
      this.isValidUid(this.newUser.uid) &&
      this.isValidGid(this.newUser.gid) &&
      this.isFilledOut(this.newUser.operatingSystem)
    ) {
      this.backendService.createUser(this.parentClientId, this.newUser).subscribe(
        data => {
          this.notificationService.showNotification('confirmation', `Successfully created the new User ${this.newUser.name}`);
          this.router.navigate([`/client/${this.parentClientId}`]);
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
    this.router.navigate(['/']);
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

  isValidUid(uid: number) {
    if (this.validationActive) {
      return uid > Math.max(...this.occupiedUids) && uid < Math.max(...this.clientUidRange)
    } 
    return undefined;
    }

    isValidGid(gid: number) {
      if (this.validationActive) {
        return gid > Math.max(...this.occupiedGids) && gid < Math.max(...this.clientGidRange)
      } 
      return undefined;
      }
}

