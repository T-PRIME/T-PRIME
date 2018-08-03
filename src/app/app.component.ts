import { Component, OnInit } from '@angular/core';
import { ThfMenuItem } from '@totvs/thf-ui/components/thf-menu';
import { ThfPageLogin, ThfPageLoginLiterals } from '@totvs/thf-ui/components/thf-page';
import { Router } from '@angular/router';
import { RestJiraService } from './rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  mostraMenu = false;
  customLiterals: ThfPageLoginLiterals;

  menus: Array<ThfMenuItem> = [
    
    { label: 'Indicadores Prime', icon: 'company', subItems: [  
      { label: 'Indicadores Por Cliente', link: './indcliente' }
    ]},
    { label: 'Manutenção Prime', icon: 'share', subItems: [
      { label: 'Backlog Manutenção Prime', link: './backlogmanutprime' },
      { label: 'Indicadores Manutenção Prime', link: './indmanutprime' },
      { label: 'Indicadores Performance Manutenção Prime', link: './indperfprime' },
      { label: 'Indicadores Rejeição Prime', link: './indrejectprime' },
      { label: 'Equipe Manutenção Prime', link: './equipe' }
    ]}
  ];

  constructor(private router: Router,
    private restJiraService: RestJiraService,
    private thfDialogService: ThfDialogService) { };

  ngOnInit() {

    if (document.getElementById("menu") != undefined) {
      location.reload();
    }
    
    this.restJiraService.autenticar("", "").subscribe(data => {
        this.restJiraService.loginOk = true;
        this.restJiraService.userLogado = data.name;
        this.mostraMenu = true;
        this.router.navigate(['/']);
      }, error => { }
    );
    
    this.customLiterals = {
      title: 'Faça o login!',
      loginErrorPattern: 'Login obrigatório',
      loginPlaceholder: 'Insira seu usuário de acesso. Ex: jose.silva',
      passwordErrorPattern: 'Senha invalida!',
      passwordPlaceholder: 'Insira sua senha de acesso',
      rememberUser: 'Lembrar usuário',
      submitLabel: 'Acessar sistema',
      forgotPassword: 'Esqueceu sua senha?'
    };
  }

  isAuth(formData) {
    
    this.restJiraService.autenticar(formData.login, formData.password).subscribe(data => {
        this.restJiraService.loginOk = true;
        this.restJiraService.userLogado = formData.login;
        this.mostraMenu = true;
        this.router.navigate(['/']);
      }, error => {
        if (error.status == "401") {
          this.thfDialogService.alert({
          title: 'Acesso negado!',
          message: 'login ou senha invalidos.'
          });
        }else{
          this.thfDialogService.alert({
          title: 'Erro de sincronismo!',
          message: 'Falha de conexão com JIRA! Codigo: ' + error.status + " - " + error.statusText
          });
        }
      }
    );
  }
}