import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndmanutprimeComponent } from './indmanutprime/indmanutprime.component';
import { IndperfprimeComponent } from './indperfprime/indperfprime.component';
import { BacklogmanutprimeComponent } from './backlogmanutprime/backlogmanutprime.component';

const routes: Routes = [
  { path: 'backlogmanutprime', component: BacklogmanutprimeComponent },
  { path: 'indmanutprime', component: IndmanutprimeComponent },
  { path: 'indperfprime', component: IndperfprimeComponent },
  { path: 'hello-world', component: HelloWorldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }