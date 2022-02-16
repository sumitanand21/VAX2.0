import { Component } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public socket: any;
  message;
  constructor(private websocket: WebsocketService) {
  }


}
