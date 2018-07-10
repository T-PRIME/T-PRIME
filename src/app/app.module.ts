import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThfModule } from '@totvs/thf-ui';
import { HttpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndmanutprimeComponent } from './indmanutprime/indmanutprime.component';
import { IndperfprimeComponent } from './indperfprime/indperfprime.component';
import { BacklogmanutprimeComponent } from './backlogmanutprime/backlogmanutprime.component';
import { IndclienteComponent } from './indcliente/indcliente.component';
import { PrincipalComponent } from './principal/principal.component';



@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    IndmanutprimeComponent,
    IndperfprimeComponent,
    BacklogmanutprimeComponent,
    IndclienteComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    ThfModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
