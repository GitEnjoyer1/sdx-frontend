import { Component, CUSTOM_ELEMENTS_SCHEMA, numberAttribute } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendServiceService } from '../backend-service.service';
import { ClientObject } from '../../utils/interfaces';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [NgFor],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientDetailComponent {

  constructor(private router: Router, private route: ActivatedRoute, private backendService: BackendServiceService){}

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
      this.getClientsById(id)
    })
    this.getUsers();
  }

  getClientsById(id: number): void {
    this.backendService.getClientsById(id).subscribe(
      data => {
        this.client.id = data.id;
        this.client.name = data.name;
        this.client.email = data.email;
        this.client.uidRange = data.uid_range; // directly map uid_range to uidRange
        this.client.gidRange = data.gid_range; // directly map gid_range to gidRange
        this.client.description = data.description;
        this.client.comment = data.comment;
  
        console.log(this.client);
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }

  deleteClients(id: number): void {
    this.backendService.deleteClients(id).subscribe(
      data => {
        console.log(data)
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }

  navigateToClientpage(): void {
    this.router.navigate(['/client']);
  }

  getUsers(): void {
    this.backendService.getUsers().subscribe(
      data => {
        this.users = data;
        console.log(this.users);
      },
      error => {
        console.error('Error fetching users', error);
      }
    );
  }
}
