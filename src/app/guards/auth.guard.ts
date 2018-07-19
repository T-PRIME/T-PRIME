import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RestJiraService } from '../rest-jira.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private restJiraService: RestJiraService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (this.restJiraService.userAuth()){
        return true;
      }
      
      this.router.navigate(['/login']);
      return false;
  }
}
