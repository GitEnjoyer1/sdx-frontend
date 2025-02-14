import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ClientObject, CreateClientObject, CreateUserObject } from '../../utils/interfaces';
import { CreateUserComponent } from '../create-user/create-user.component';

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

getClientById(clientId: number): Observable<any> {
  return this.http.get(`http://localhost:3000/clients/${clientId}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

getClientNameById(clientId: number): Observable<string> {
  return this.http.get<ClientObject>(`http://localhost:3000/clients/${clientId}`).pipe(
    map((client: ClientObject) => client.name)
  );
}

getClientRangesById(clientId: number): Observable<{ uid_range: number[]; gid_range: number[]; }> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}`).pipe(
    map((client: any) => {
      return {
        uid_range: client.uid_range,
        gid_range: client.gid_range
      };})
  )
}


deleteClient(clientId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/clients/${clientId}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

createClient(client: CreateClientObject): Observable<any> {
  const clientSnakeCase = {
    name: client.name,
    email: client.email,
    uid_range: client.uidRange,
    gid_range: client.gidRange,
    description: client.description,
    comment: client.comment
  };
  return this.http.post('http://localhost:3000/clients', clientSnakeCase).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

getUsers(clientId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}`).pipe(
    map(response => {
      console.log(`http://localhost:3000/clients/${clientId}/users?client_id=${clientId}`)
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
  return this.http.get(`http://localhost:3000/clients/${clientId}/users/${userId}?client_id=${clientId}&id=${userId}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

deleteUser(clientId: number, userId: number): Observable<any> {
  return this.http.delete(`http://localhost:3000/clients/${clientId}/users/${userId}?client_id=${clientId}&id=${userId}`).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}



createUser(clientId: number, user: CreateUserObject): Observable<any> {
  console.log("logging user ",user)
  const userSnakeCase = {
    name: user.name,
    email: user.email,
    uid: user.uid,
    gid: user.gid,
    operating_system: user.operatingSystem,
    client_id: user.clientId,
    description: user.description,
    comment: user.comment
  };
  console.log("loggin snakecase", userSnakeCase)
  return this.http.post(`http://localhost:3000/clients/${clientId}/users`, userSnakeCase).pipe(
    map(response => {
      // Perform any transformation here if necessary
      return response;
    })
  );
}

}
