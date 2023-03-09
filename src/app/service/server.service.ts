import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { stat } from 'fs';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private readonly apiUrl = 'any';

  constructor(
    private http: HttpClient
  ) { }

  //option 1: to retrieve a list of all servers by sending http request in the backend
 /* getServers(): Observable<CustomResponse>{
    return this.http.get<CustomResponse>('http://localhost:8080/server/list');
  }*/

  // option 2: define an observable that return a list of servers
  servers$ = <Observable<CustomResponse>> 
  this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ = (server: Server) => <Observable<CustomResponse>>
   this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
 .pipe(
   tap(console.log),
   catchError(this.handleError)
 );

 delete$ = (serverId: number) => <Observable<CustomResponse>>
 this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
.pipe(
  tap(console.log),
  catchError(this.handleError)
);

/*Filter all servers by a specific status*/
filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
new Observable<CustomResponse>(
  suscriber => {
  console.log(response);
  // to admit a new value to suscriber
  suscriber.next( 
  // case 1:  check if status is ALL, the user wants to see all severs, no filter needed
  status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} :
 // case 2/3: check if status of server is UP or DOWN
  {
    ...response,
    message: response.data.servers
    .filter(server => server.status === status).length > 0 ? `Servers filtered by
     ${status === Status.SERVER_UP ? 'SERVER UP' : 'SERVER DOWN'} status`: `No servers of ${status} found`,
     // filter the actual data
     data: {servers: response.data.servers
      .filter(server => server.status === status) }
  }
  );
  suscriber.complete(); 
  }
)
.pipe(
 tap(console.log),
 catchError(this.handleError)
);

  private handleError(error: HttpErrorResponse): Observable<unknown>{
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status} `);
  }
}
