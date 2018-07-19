import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndmanutprimeComponent } from './indmanutprime/indmanutprime.component';
import { IndperfprimeComponent } from './indperfprime/indperfprime.component';
import { BacklogmanutprimeComponent } from './backlogmanutprime/backlogmanutprime.component';
import { IndclienteComponent } from './indcliente/indcliente.component';
import { PrincipalComponent } from './principal/principal.component';
import { EquipeComponent } from './equipe/equipe.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'backlogmanutprime', component: BacklogmanutprimeComponent, canActivate: [AuthGuard] },
  { path: 'indmanutprime', component: IndmanutprimeComponent, canActivate: [AuthGuard] },
  { path: 'indperfprime', component: IndperfprimeComponent, canActivate: [AuthGuard] },
  { path: 'indcliente', component: IndclienteComponent, canActivate: [AuthGuard] },
  { path: 'equipe', component: EquipeComponent, canActivate: [AuthGuard] },
  { path: '', component: PrincipalComponent, canActivate: [AuthGuard] },
  { path: 'login', component: AppComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }