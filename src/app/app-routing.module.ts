import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { IndmanutprimeComponent } from './indmanutprime/indmanutprime.component';
import { IndperfprimeComponent } from './indperfprime/indperfprime.component';

const routes: Routes = [
  { path: 'indmanutprime', component: IndmanutprimeComponent },
  { path: 'indperfprime', component: IndperfprimeComponent },
  { path: 'hello-world', component: HelloWorldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }