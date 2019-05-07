import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { WebWorkerRoutingModule } from './web-worker-routing.module';
import { WebWorkerComponent } from './web-worker.component';

@NgModule({
  declarations: [WebWorkerComponent],
  imports: [CommonModule, WebWorkerRoutingModule, MatButtonModule]
})
export class WebWorkerModule {}
