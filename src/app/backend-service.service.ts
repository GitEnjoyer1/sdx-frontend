import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get('http://localhost:3000/clients').pipe(
      map(response => {
        // Perform any transformation on the response here if necessary
        return response;
      }),
      catchError(error => {
        console.error('There was an error!', error);
        return throwError(() => error); 
      })
    );
  }
}
