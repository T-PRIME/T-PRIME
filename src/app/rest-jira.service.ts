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

  atualizaComponente(response, componente: Array<any>, usuarios: Array<any>, campo) {
    var _x = 0;
    for (var _i = 0; response.body.total > _i) {
      if (_x < usuarios.length) {
        
        if (response.body.issues[_i].fields.issuetype.name == "Merge (Sub-tarefa)") {
          var user = response.body.issues[_i].fields.customfield_10046.name;
        }else if (campo == "pacemergenciais" || campo == "codificadas" || campo == "rejeitadas") {
          var user = response.body.issues[_i].fields.customfield_10048.name;
        }else{
          var user = response.body.issues[_i].fields.assignee.name;
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
          case "codificadas": {
            componente[_x].codificadas++;        
            break;
          }
          case "rejeitadas": {
            componente[_x].rejeitadas++;        
            break;
          }
          case "abertasmais30dias": {
            componente[_x].abertasmais30dias++;         
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
}