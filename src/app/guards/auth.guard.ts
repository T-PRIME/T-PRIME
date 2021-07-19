import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';

// tslint:disable:max-line-length

@Injectable()
export class AuthGuard implements CanActivate {

  users = [
    'eduardo.martinez',
    'evandro.pattaro',
    'julio.silva',
    'vitor.pires',
    'wesley.lossani',
    'caio.felipe',
    'carlos.pestana',
    'douglas.morato',
    'michelle.rolli',
    'rodrigo.sartorio',
    'daniella.perez',
    'viu',
    'patricia.nogueira',
    'renataka',
    'rosana.marques',
    'rosemeirem',
    'oliveira.eder',
    'fernando.luis',
    'luis.fernando',
    'm.helmers',
    'elisangela.petry'
     ];

  constructor(private router: Router, private restJiraService: RestJiraService, private thfAlert: ThfDialogService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (this.restJiraService.userAuth()) {
        if (route.routeConfig.path === 'indperfprime' || route.routeConfig.path === 'indrejectprime') {
          for (let _i = 0; this.users.length > _i; _i++) {
            if (this.restJiraService.userLogado === this.users[_i]) {
              return true;
            }
          }
          this.thfAlert.alert({title: 'Usuário Não Autorizado!', message: 'Usuário não autorizado. Entre em contato com caio.felipe@totvs.com.br.'});
          return false;
        } else {
          return true;
        }
      }

      this.router.navigate(['/login']);
      return false;
  }
}
