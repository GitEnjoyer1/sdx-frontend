import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendServiceService } from '../backend-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@Injectable({providedIn: 'root'})
export class ClientComponent {

  clients: any[] = [];


  constructor(private router: Router, private backendService: BackendServiceService) {}
  
  ngOnInit(): void {
    this.getClients();
    console.log(this.clients);
    }

  getClients(): void {
    this.backendService.getClients().subscribe(
      data => {
        this.clients = data;
        console.log(this.clients);
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }

  goToDetails(id: number) {
    this.router.navigate(['/client', id]); 
  }
  

}
