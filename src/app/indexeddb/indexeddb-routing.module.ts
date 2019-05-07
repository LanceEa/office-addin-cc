import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexeddbComponent } from './indexeddb.component';

const routes: Routes = [
  {
    path: '',
    component: IndexeddbComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexeddbRoutingModule {}
