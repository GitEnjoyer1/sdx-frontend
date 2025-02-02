import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendServiceService } from '../backend-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ErrorPageComponent } from "../error-page/error-page.component";


@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, ErrorPageComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@Injectable({providedIn: 'root'})
export class ClientComponent {

  clients: any[] = [];
  fetch_successful: boolean = true


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
        this.fetch_successful=false
        console.error('Error fetching clients', error);
      }
    );
  }

  goToDetails(id: number) {
    this.router.navigate(['/client', id]); 
  }
  

}
