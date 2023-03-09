import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse>>;
  constructor(private serverService: ServerService) {}
  
  ngOnInit(): void {
    this.appState$ = this.serverService.servers$
    .pipe(
      map(response => {
        return { dataState}
      })
    )
  }
}
