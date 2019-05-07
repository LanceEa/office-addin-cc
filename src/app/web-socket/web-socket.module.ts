import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSocketRoutingModule } from './web-socket-routing.module';
import { WebSocketComponent } from './web-socket.component';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [WebSocketComponent],
  imports: [CommonModule, WebSocketRoutingModule, MatButtonModule]
})
export class WebSocketModule {}
