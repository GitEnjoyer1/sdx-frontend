import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ClientObject } from '../utils/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  constructor(private http: HttpClient) { }

  getClients(): Observable<any> {
    return this.http.get('http://localhost:3000/clients').pipe(
      map(response => {
        // Perform any transformation here if necessary
        return response;
      })
    );
}

getClientsById(id: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${id}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

deleteClients(id: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/clients/${id}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

createClients(id: number, client: ClientObject): Observable<any> {
  return this.http.post(`http://localhost:3000/clients/${id},`, client).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

getUsers(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/users').pipe(
    map(response => {
      return response.map((user: any) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          uid: user.uid,
          gid: user.gid,
          operatingSystem: user.operating_system,
          clientId: user.client_id,
          description: user.description,
          comment: user.comment,
        };
      });
    })
  );
}



}
