import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThfModule } from '@totvs/thf-ui';
import { HttpModule } from '@angular/http';
import { ChartModule } from '@progress/kendo-angular-charts';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { IndmanutprimeComponent } from './indmanutprime/indmanutprime.component';
import { IndperfprimeComponent } from './indperfprime/indperfprime.component';
import { BacklogmanutprimeComponent } from './backlogmanutprime/backlogmanutprime.component';
import { IndclienteComponent } from './indcliente/indcliente.component';
import { PrincipalComponent } from './principal/principal.component';
import { EquipeComponent } from './equipe/equipe.component';
import { RestJiraService } from './rest-jira.service';
import { RestZenService } from './rest-zen.service';
import { RestTrelloService } from './rest-trello.service';
import { AuthGuard } from './guards/auth.guard';
import { IndrejectprimeComponent } from './indrejectprime/indrejectprime.component';




@NgModule({
  declarations: [
    AppComponent,
    IndmanutprimeComponent,
    IndperfprimeComponent,
    BacklogmanutprimeComponent,
    IndclienteComponent,
    PrincipalComponent,
    EquipeComponent,
    IndrejectprimeComponent
  ],
  imports: [
    BrowserModule,
    ThfModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpModule,
    ChartModule
  ],
  providers: [RestJiraService, AuthGuard, RestZenService, RestTrelloService],
  bootstrap: [AppComponent]
})
export class AppModule { }
