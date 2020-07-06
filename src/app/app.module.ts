import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BaseComponent } from './base/base.component';
//import { OrderModule } from 'ngx-order-pipe'; /* use inbuilt pipe */


@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    OrderByPipe
    
  ],
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot(),
    BrowserModule,
    //OrderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
