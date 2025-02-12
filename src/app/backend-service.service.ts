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
  return this.http.get<any>('http://localhost:3000/clients').pipe(
    map(response => {
      return response.map((client: any) => {
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          uidRange: client.uid_range,
          gidRange: client.gid_range,
          description: client.description,
          comment: client.comment,
        };
      });
    })
  );
}

getClientById(id: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${id}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

getClientNameById(id: number): Observable<string> {
  return this.http.get<ClientObject>(`http://localhost:3000/clients/${id}`).pipe(
    map((client: ClientObject) => client.name)
  );
}

deleteClient(id: number): Observable<any> {
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

getUsers(clientId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}`).pipe(
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

getUserById(clientId: number, userId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}&id=${userId}`).pipe(
    map(response => {
      console.log(clientId, userId)
      console.log(response)
      // Perform any transformation here if necessary
      return response;
    })
  );
}

deleteUser(clientId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/users?client_id=${clientId}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

createUser(clientId: number, client: ClientObject): Observable<any> {
  return this.http.post(`http://localhost:3000/users?client_id=${clientId},`, client).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}


}
