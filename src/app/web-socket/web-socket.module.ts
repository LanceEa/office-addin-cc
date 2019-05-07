import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSocketRoutingModule } from './web-socket-routing.module';
import { WebSocketComponent } from './web-socket.component';

@NgModule({
  declarations: [WebSocketComponent],
  imports: [
    CommonModule,
    WebSocketRoutingModule
  ]
})
export class WebSocketModule { }
