import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';

@Injectable()
export class AuthGuard implements CanActivate {
  
  users = [
    'diogo.vieira',
    'eduardo.martinez',
    'evandro.pattaro', 
    'joao.balbino',
    'julio.silva',
    'leonardo.magalhaes', 
    'tiago.bertolo',      
    'vitor.pires',   
    'wesley.lossani',       
    'yuri.porto',
    'caio.felipe',
    'renato.campos',
    'carlos.pestana',
    'douglas.morato',
    'michelle.rolli',
    'rodrigo.sartorio',
    'chrystian.souza',
    'daniella.perez',
    'denis.braga',
    'viu',
    'iolanda.cipriano',
    'patricia.nogueira',
    'renataka',
    'rosana.marques',
    'rosemeirem'
     ]

  constructor(private router: Router, private restJiraService: RestJiraService, private thfAlert: ThfDialogService ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      if (this.restJiraService.userAuth()){
        if (route.routeConfig.path == "indperfprime" || route.routeConfig.path == "indrejectprime") {
          for (var _i = 0; this.users.length > _i; _i++) {
            if (this.restJiraService.userLogado == this.users[_i]) {
              return true;
            }
          }
          this.thfAlert.alert({title: "Usuário Não Autorizado!", message: "Usuário não autorizado. Entre em contato com caio.felipe@totvs.com.br."});
          return false;
        }else{
          return true;
        }
      }
      
      this.router.navigate(['/login']);
      return false;
  }
}
