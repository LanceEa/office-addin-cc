import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebWorkerComponent } from './web-worker.component';

const routes: Routes = [
  {
    path: '',
    component: WebWorkerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebWorkerRoutingModule {}
