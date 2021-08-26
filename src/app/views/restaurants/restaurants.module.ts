import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantsComponent } from './restaurants.component';
import { RestaurantsRoutingModule } from './restaurants-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RestaurantsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ RestaurantsComponent ]
})
export class RestaurantsModule { }
