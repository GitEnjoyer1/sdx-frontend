import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendServiceService } from '../backend-service.service';
import { CommonModule } from '@angular/common';


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

  response: any = "";

  constructor(private http: HttpClient, private backendService: BackendServiceService) {}
  
  ngOnInit(): void {
    this.getClients();
    console.log(this.response);
    }

  getClients(): void {
    this.backendService.getClients().subscribe(
      data => {
        this.response = data;
        console.log(this.response);
      },
      error => {
        console.error('Error fetching clients', error);
      }
    );
  }
}
