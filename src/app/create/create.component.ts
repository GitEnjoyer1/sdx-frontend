import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BackendServiceService } from '../backend-service.service';
import { ClientObject } from '../../utils/interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateComponent {

  constructor( private backendService: BackendServiceService ) {}
  
  clients: any[] = [];

  maxUid: number = 0;
  maxGid: number = 0;

  fetchSuccessful: boolean = true

  uidRangeLength: number = 1000;
  gidRangeLength: number = 1000;

  logLength() {
    console.log(this.uidRangeLength)
  }


  ngOnInit(): void {
    this.getClients(); // also runs getOccupiedRanges()
  }

  getMaxIds(clients: ClientObject[]): void {
    this.maxUid = Math.max(...clients.map(o => o.uidRange[1]))
    this.maxGid = Math.max(...clients.map(o => o.gidRange[1]))
    console.log(this.maxUid, this.maxGid)
  }
  

  getClients(): void {
    this.backendService.getClients().subscribe(
      data => {
        this.clients = data;
        console.log(this.clients)
        this.getMaxIds(this.clients);
      },
      error => {
        this.fetchSuccessful=false
        console.error('Error fetching clients', error);
      }
    );
  }

  



}

