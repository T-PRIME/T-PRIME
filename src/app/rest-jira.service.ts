import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class RestJiraService {

  public loginOk = false;
  public request: any;
  private execReq = [];
  private processos: number = 0;
  private headers = new Headers();
  private params = new URLSearchParams();
  private opts = new RequestOptions();  
  
  constructor(private http: Http) { } 

  getFilter(codFiltro) {

    this.opts.headers = this.headers;

    return this.http.get("http://10.171.66.178:80/api/rest/api/latest/filter/" + codFiltro, this.opts).map(res => res.json());
  }

  getIssues(filtro) {

    this.opts.headers = this.headers;
    this.params.set("maxResults", "500");
    this.params.set("jql", filtro);
    this.opts.params = this.params;

    return this.http.get("http://10.171.66.178:80/api/rest/api/latest/search", this.opts).map(res => res.json());

  }

   atualizaBacklog(response, componente, usuarios: Array<any>, campo,tipo) {
    var _x = 0;
    var user;
    var libera;
    this.processos ++
    if (tipo > 2) {
      for (var _i = 0; response.total > _i;) {
        if (_x < usuarios.length) {
          
          if (campo == "pacemergenciais") {
            user = response.issues[_i].fields.customfield_10048.name;
          }else if (response.issues[_i].fields.assignee == undefined) {
            user = "unassigned";
          }else {
            user = response.issues[_i].fields.assignee.name;
          }
          

          if (usuarios[_x].user != user) {
            if (usuarios.find(x => x.user == user) != undefined) {
              for (_x = 0; usuarios.length > _x; _x++){
                if (usuarios[_x].user === user) {
                break;
                }
              }
            }else{
              _x = 0;
              _i++;
            } 
          }
          if (user === usuarios[_x].user) {
            _i++;
            eval("componente[_x]." + campo + "++");
            if (campo != "abertasmais30dias") {
                componente[_x].totalbacklog++;
            }
          }
        }
      }
    }else{
      if (tipo != 2) {
        if (tipo == 0) {
          eval("componente.publico." + campo + " = response.total");
        }else{
          eval("componente.privado." + campo + " = response.total");
        }
      }else{
        eval("componente." + campo + " = response.total");
      }
   }
   
   if(this.processos > 15){
   		this.processos = 1
   }

		return this.processos
  }
  
  atualizaPerf(response, componente: Array<any>, usuarios: Array<any>, campo, diasUteis) {
    var _x = 0;
    var user;
    this.execReq.push(campo);
    for (var _i = 0; response.total > _i;) {
      if (_x < usuarios.length) {
        
        if (response.issues[_i].fields.issuetype.name == "Merge (Sub-tarefa)") {
          user = response.issues[_i].fields.customfield_10046.name;
        }else if (campo == "codificadas" || campo == "rejeitadas") {
          user = response.issues[_i].fields.customfield_10048.name;
        }else if (response.issues[_i].fields.assignee != undefined) {
          user = response.issues[_i].fields.assignee.name;
        }

        if (usuarios[_x].user != user) {
          if (usuarios.find(x => x.user == user) != undefined) {
            for (_x = 0; usuarios.length > _x; _x++){
              if (usuarios[_x].user === user) {
              break;
              }
            }
          }else{
            _x = 0;
            _i++;
          } 
        }

        if (user === usuarios[_x].user) {
          _i++;
          eval("componente[_x]."+campo+"++");
        }
      }
    }
    if (this.execReq.indexOf("codificadas") >= 0 && this.execReq.indexOf("retrabalho") >= 0 && this.execReq.indexOf("rejeitadas") >= 0) {
      for (var _y = 0; usuarios.length > _y; _y++) {
        if (componente[_y].codificadas > 0) {
          componente[_y].percretrabalho = Math.round((componente[_y].retrabalho * 100) / componente[_y].codificadas);
        }
        componente[_y].produtividade = Math.round((componente[_y].codificadas + componente[_y].rejeitadas - componente[_y].retrabalho) / diasUteis * 100);
      }
      this.execReq = [];
      return true;
    }else{
      return false;
    }
  }

  AtualizaManut(response, dadosChart, chart, diasUteis) {

    this.execReq.push(chart);
    switch (chart) {
      case "CriadasPrivAms": {
          dadosChart[0].criaXResolv.criadasPrivAms = response.total;
        break;
      }
      case "CriadasPublic": {
        dadosChart[0].criaXResolv.criadasPublic = response.total;
        break;
      }
      case "ResolvPrivAms": {
        dadosChart[0].criaXResolv.resolvPrivAms = response.total;
        break;
      }
      case "ResolvPublic": {
        dadosChart[0].criaXResolv.resolvPublic = response.total;
        break;
      }
      case "CriadasDataPrev": {
        dadosChart[2].criaXResolvDataPrev.criadasDataPrev = response.total;
        break;
      }
      case "ResolvDataPrev": {
        dadosChart[2].criaXResolvDataPrev.resolvDataPrev = response.total;
        break;
      }      
      case "CodPrivAms": {
        dadosChart[3].entDetalhada.codPrivAms = response.total;
        break;
      }
      case "RetPrivAms": {
        dadosChart[3].entDetalhada.retPrivAms = response.total;
        break;
      }
      case "RejPrivAms": {
        dadosChart[3].entDetalhada.rejPrivAms = response.total;
        break;
      }
      case "CancPrivAms": {
        dadosChart[3].entDetalhada.cancPrivAms = response.total;
        break;
      }   
      case "CodPublic": {
        dadosChart[3].entDetalhada.codPublic = response.total;
        break;
      }
      case "RetPublic": {
        dadosChart[3].entDetalhada.retPublic = response.total;
        break;
      }
      case "RejPublic": {
        dadosChart[3].entDetalhada.rejPublic = response.total;
        break;
      }
      case "CancPublic": {
        dadosChart[3].entDetalhada.cancPublic = response.total;
        break;
      }               
      case "abertasVersao": {
        var posVersao = 0;
        for (var _i = 0; response.total > _i; _i++) {
          
          if (response.issues[_i].fields.versions.length > 0) {
            if (dadosChart[1].abertasVersao[posVersao].versao != response.issues[_i].fields.versions[0].name) {
              if (dadosChart[1].abertasVersao.find(x => x.versao == response.issues[_i].fields.versions[0].name) != undefined) {
                for (var _x = 0; dadosChart[1].abertasVersao.length > _x; _x++){
                  if (dadosChart[1].abertasVersao[_x].versao == response.issues[_i].fields.versions[0].name) {
                    posVersao = _x;
                    dadosChart[1].abertasVersao[posVersao].quant++;
                    break;
                  }
                }
              }
            }else{
              dadosChart[1].abertasVersao[posVersao].quant++;
            }
          }
        }
      }

      default:
        break;
    }

    if (this.execReq.length == 15) {
      this.execReq = [];
      return true;
    }else{
      return false;
    }
  }

  ReplaceAll(jql:string, oldvalue: string , newValue: string){

    let continua: boolean = true
    let achou: number = 0
    let busca: string
                
    jql = jql.toString().toUpperCase()
    oldvalue = oldvalue.toString().toUpperCase()
    newValue = newValue.toString().toUpperCase()
                
    while (continua) {
        achou = jql.toString().search(oldvalue)
        if (achou > 0) {
            jql = jql.toString().replace(oldvalue, newValue )
                        
        }else{continua = false}                
        
    }
                
    return jql
  }

  calcDias(dataDe, dataAte) {
    
    var diasUteis = 1;
    while (dataDe.toString() != dataAte.toString()) {
      if (dataDe.getDay() != 0 && dataDe.getDay() != 6) {
        diasUteis++
      }
      dataDe.setDate(dataDe.getDate() + 1);
    }

    return diasUteis
  }

  autenticar(login, password) {

    this.headers.set("Authorization", "Basic "+window.btoa(login+":"+password));    
    this.opts.headers = this.headers;

    return this.http.get("http://10.171.66.178:80/api/rest/auth/latest/session", this.opts)
    .map(res => res.json());
  }

  userAuth() {
    return this.loginOk;
  }    
}