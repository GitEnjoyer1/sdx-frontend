import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
@Injectable({providedIn: 'root'})
export class ClientComponent {

  response: any = ""
  errorMessage: string = ""

  constructor(private http: HttpClient) {}
  

  getClients() {
    this.http.get('http://localhost:3000/clients').pipe(
      map(response => {
        console.log(response);
        return response;
      }),
      catchError(error => {
        console.error('There was an error!', error);
        throw error; // Let the app keep running by returning an empty result.
      })
    ).subscribe();
  }
}
