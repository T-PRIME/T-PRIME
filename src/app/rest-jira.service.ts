import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


var unirest = require('unirest');


@Injectable()
export class RestJiraService {

  public request: any;
  private execReq = [];
  private request2: any;
  private teste: any;
  private opts = new RequestOptions();
  private headers = new Headers();
  
  constructor(private http: Http) { } 

  getFilter(codFiltro) {

    this.opts.headers = this.headers;
    this.opts.headers.set('Authorization', 'anVsaW8uc2lsdmE6SnVsITE5OTczOTgz')

    //return this.http.get("http://jiraproducao.totvs.com.br/rest/api/latest/filter/" + codFiltro, this.opts ).map(res => res.json());

    return unirest("GET","http://jiraproducao.totvs.com.br/rest/api/latest/filter/" + codFiltro).
    auth({user: 'julio.silva',pass: 'Jul!19973983',sendImmediately: true});
  }

  getIssues(filtro) {

    return unirest("GET","http://jiraproducao.totvs.com.br/rest/api/latest/search?jql=" + filtro).query({maxResults: '500'}).
      auth({user: 'julio.silva',pass: 'Jul!19973983',sendImmediately: true});

  }

  atualizaBacklog(response, componente: Array<any>, usuarios: Array<any>, campo) {
    var _x = 0;
    var user;
    for (var _i = 0; response.body.total > _i;) {
      if (_x < usuarios.length) {
        
        if (response.body.issues[_i].fields.issuetype.name == "Merge (Sub-tarefa)") {
          user = response.body.issues[_i].fields.customfield_10046.name;
        }else if (campo == "pacemergenciais") {
          user = response.body.issues[_i].fields.customfield_10048.name;
        }else if (response.body.issues[_i].fields.assignee == undefined) {
          user = "unassigned";
        }else {
          user = response.body.issues[_i].fields.assignee.name;
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
          switch (campo) {
          case "avencer": {
            componente[_x].avencer++;
            componente[_x].totalbacklog++;
            break;
          }
          case "pacemergenciais": {
            componente[_x].pacemergenciais++; 
            componente[_x].totalbacklog++;
            break;
          }
          case "vencidos": {
            componente[_x].vencidos++;
            componente[_x].totalbacklog++;                  
            break;
          }
          case "abertasmais30dias": {
            componente[_x].abertasmais30dias++;         
            break;
          }
          default:
            break;
          }
        }
      }
    }
  }
  
  atualizaPerf(response, componente: Array<any>, usuarios: Array<any>, campo, diasUteis) {
    var _x = 0;
    var user;
    this.execReq.push(campo);
    for (var _i = 0; response.body.total > _i;) {
      if (_x < usuarios.length) {
        
        if (response.body.issues[_i].fields.issuetype.name == "Merge (Sub-tarefa)") {
          user = response.body.issues[_i].fields.customfield_10046.name;
        }else if (campo == "codificadas" || campo == "rejeitadas") {
          user = response.body.issues[_i].fields.customfield_10048.name;
        }else if (response.body.issues[_i].fields.assignee != undefined) {
          user = response.body.issues[_i].fields.assignee.name;
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
          switch (campo) {
          case "codificadas": {
            componente[_x].codificadas++;        
            break;
          }
          case "rejeitadas": {
            componente[_x].rejeitadas++;        
            break;
          }
          case "canceladas": {
            componente[_x].canceladas++;         
            break;
          }
          case "retrabalho": {
            componente[_x].retrabalho++;         
            break;
          }
          default:
            break;
          }
        }
      }
    }
    if (this.execReq.indexOf("codificadas") >= 0 && this.execReq.indexOf("retrabalho") >= 0 && this.execReq.indexOf("canceladas") >= 0 && this.execReq.indexOf("rejeitadas") >= 0) {
      for (var _y = 0; usuarios.length > _y; _y++) {
        if (componente[_y].codificadas > 0) {
          componente[_y].percretrabalho = Math.round((componente[_y].retrabalho * 100) / componente[_y].codificadas);
        }
        componente[_y].produtividade = Math.round((componente[_y].codificadas + componente[_y].canceladas - componente[_y].retrabalho) / diasUteis * 100);
      }
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
    
    var diasUteis = 0;
    while (dataDe.toString() != dataAte.toString()) {
      if (dataDe.getDay() != 0 && dataDe.getDay() != 6) {
        diasUteis++
      }
      dataDe.setDate(dataDe.getDate() + 1);
    }

    return diasUteis
  }
}