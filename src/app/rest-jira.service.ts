import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


var unirest = require('unirest');


@Injectable()
export class RestJiraService {

  public request: any;
  private execReq = [];
  
  constructor() { } 

  getFilter(codFiltro) {

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
    return true
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
          case "testedeintegrado": {
            componente[_x].integrado++;         
            break;
          }
          case "testedeunidade": {
            componente[_x].unidade++;         
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

  AtualizaManut(response, dadosChart, chart, diasUteis) {

    this.execReq.push(chart);
    switch (chart) {
      case "CriadasPrivAms": {
          dadosChart[0].criaXResolv.criadasPrivAms = response.body.total;
        break;
      }
      case "CriadasPublic": {
        dadosChart[0].criaXResolv.criadasPublic = response.body.total;
        break;
      }
      case "ResolvPrivAms": {
        dadosChart[0].criaXResolv.resolvPrivAms = response.body.total;
        break;
      }
      case "ResolvPublic": {
        dadosChart[0].criaXResolv.resolvPublic = response.body.total;
        break;
      }
      case "CriadasDataPrev": {
        dadosChart[2].criaXResolvDataPrev.criadasDataPrev = response.body.total;
        break;
      }
      case "ResolvDataPrev": {
        dadosChart[2].criaXResolvDataPrev.resolvDataPrev = response.body.total;
        break;
      }      
      case "CodPrivAms": {
        dadosChart[3].entDetalhada.codPrivAms = response.body.total;
        break;
      }
      case "RetPrivAms": {
        dadosChart[3].entDetalhada.retPrivAms = response.body.total;
        break;
      }
      case "RejPrivAms": {
        dadosChart[3].entDetalhada.rejPrivAms = response.body.total;
        break;
      }
      case "CancPrivAms": {
        dadosChart[3].entDetalhada.cancPrivAms = response.body.total;
        break;
      }   
      case "CodPublic": {
        dadosChart[3].entDetalhada.codPublic = response.body.total;
        break;
      }
      case "RetPublic": {
        dadosChart[3].entDetalhada.retPublic = response.body.total;
        break;
      }
      case "RejPublic": {
        dadosChart[3].entDetalhada.rejPublic = response.body.total;
        break;
      }
      case "CancPublic": {
        dadosChart[3].entDetalhada.cancPublic = response.body.total;
        break;
      }               
      case "abertasVersao": {
        var posVersao = 0;
        for (var _i = 0; response.body.total > _i; _i++) {
          
          if (response.body.issues[_i].fields.versions.length > 0) {
            if (dadosChart[1].abertasVersao[posVersao].versao != response.body.issues[_i].fields.versions[0].name) {
              if (dadosChart[1].abertasVersao.find(x => x.versao == response.body.issues[_i].fields.versions[0].name) != undefined) {
                for (var _x = 0; dadosChart[1].abertasVersao.length > _x; _x++){
                  if (dadosChart[1].abertasVersao[_x].versao == response.body.issues[_i].fields.versions[0].name) {
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