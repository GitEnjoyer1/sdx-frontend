import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ClientObject, CreateClientObject, CreateUserObject, EditClientObject, EditUserObject } from '../../utils/interfaces';
import { CreateUserComponent } from '../create-user/create-user.component';

@Injectable({
  providedIn: 'root'
})
export class BackendServiceService {

  constructor(private http: HttpClient) { }

getClients(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/clients')
}

getClientById(clientId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${clientId}`)
}

getClientNameById(clientId: number): Observable<string> {
  return this.http.get<ClientObject>(`http://localhost:3000/clients/${clientId}`).pipe(
    map((client: ClientObject) => client.name)
  );
}

getClientRangesById(clientId: number): Observable<{ uidRange: number[]; gidRange: number[]; }> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}`).pipe(
      map((client: any) => {
        return {
          uidRange: client.uidRange,
          gidRange: client.gidRange,
        };
      })
    );
}

deleteClient(clientId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/clients/${clientId}`)
}

createClient(newClient: CreateClientObject): Observable<any> {
  return this.http.post('http://localhost:3000/clients', newClient)
}

editClient(clientId: number, editedClient: EditClientObject): Observable<any> {
  return this.http.patch(`http://localhost:3000/clients/${clientId}`, editedClient)
}

getUsers(clientId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}`)
}

getUsersIds(clientId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}`).pipe(
    map(response => {
      return response.map((user: any) => {
        return {
          uid: user.uid,
          gid: user.gid,
        };
      });
    })
  );
}

getUserById(clientId: number, userId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${clientId}/users/${userId}?client_id=${clientId}&id=${userId}`)
}

deleteUser(clientId: number, userId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/clients/${clientId}/users/${userId}?client_id=${clientId}&id=${userId}`)
}

createUser(clientId: number, user: CreateUserObject): Observable<any> {
  return this.http.post(`http://localhost:3000/clients/${clientId}/users`, user)
}

editUser(clientId: number, userId: number, editedUser: EditUserObject): Observable<any> {
  return this.http.patch(`http://localhost:3000/clients/${clientId}/users/${userId}`, editedUser)
}

}
