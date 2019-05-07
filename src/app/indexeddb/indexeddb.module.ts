import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { IndexeddbRoutingModule } from './indexeddb-routing.module';
import { IndexeddbComponent } from './indexeddb.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [IndexeddbComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    IndexeddbRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class IndexeddbModule {}
