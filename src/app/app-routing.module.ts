import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'web-worker',
    loadChildren: () => import('./web-worker/web-worker.module').then(m => m.WebWorkerModule)
  },
  {
    path: 'indexed-db',
    loadChildren: () => import('./indexeddb/indexeddb.module').then(m => m.IndexeddbModule)
  },
  {
    path: 'web-socket',
    loadChildren: () => import('./web-socket/web-socket.module').then(m => m.WebSocketModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
