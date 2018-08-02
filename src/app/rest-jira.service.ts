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

    //this.headers.set("Authorization", "Basic anVsaW8uc2lsdmE6SnVsITE5OTczOTgz");
    this.opts.headers = this.headers;

    return this.http.get("http://10.171.66.178:80/api/rest/api/latest/filter/" + codFiltro, this.opts).map(res => res.json());
  }

  getIssues(filtro, fields?: string) {

    //this.headers.set("Authorization", "Basic anVsaW8uc2lsdmE6SnVsITE5OTczOTgz");
    this.opts.headers = this.headers;
    this.params.set("maxResults", "20000");
    this.params.set("jql", filtro);
    this.params.set("fields", fields);
    this.opts.params = this.params;

    return this.http.get("http://10.171.66.178:80/api/rest/api/latest/search", this.opts).map(res => res.json());

  }
  
  getComments(issue) {

    return this.http.get("http://10.171.66.178:80/api/rest/api/latest/issue/"+issue+"/comment").map(res => res.json());
  }

   atualizaBacklog(response, componente, usuarios: Array<any>, campo,tipo) {
    var _x = 0;
    var user;
    var libera;
    this.processos ++
    if (tipo > 2) {
      for (var _i = 0; response.total > _i;) {
        if (_x < usuarios.length) {
          
          if (campo == "pacemergenciais" && response.issues[_i].fields.customfield_10048 != undefined) {
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
            eval("componente[_x]." + campo + ".total++");
            eval("componente[_x]." + campo + ".issues.push(response.issues[_i])");
            if (campo != "abertasmais30dias") {
                componente[_x].totalbacklog.total++;
                componente[_x].totalbacklog.issues.push(response.issues[_i]);
            }
            _i++;
          }
        }
      }
    }else{
      if (tipo != 2) {
        if (tipo == 0) {
          eval("componente.publico." + campo + ".total = response.total");
          eval("componente.publico." + campo + ".issues = response.issues");
        }else{
          eval("componente.privado." + campo + ".total = response.total");
          eval("componente.privado." + campo + ".issues = response.issues");
        }
      }else{
        eval("componente." + campo + ".total = response.total");
        eval("componente." + campo + ".issues = response.issues");
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
        
        if (response.issues[_i].fields.issuetype.name == "Merge (Sub-tarefa)" && response.issues[_i].fields.customfield_10046 != undefined) {
          user = response.issues[_i].fields.customfield_10046.name;
        }else if ((campo == "Codificadas" || campo == "Rejeitadas" || campo == "Retrabalho") && response.issues[_i].fields.customfield_10048 != undefined) {
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
          eval("componente[_x]."+campo+".total++");
          eval("componente[_x]."+campo+".issues.push(response.issues[_i])");
          _i++;
        }
      }
    }
    if (this.execReq.indexOf("Codificadas") >= 0 && this.execReq.indexOf("Retrabalho") >= 0 && this.execReq.indexOf("Rejeitadas") >= 0) {
      for (var _y = 0; usuarios.length > _y; _y++) {
        if (componente[_y].Codificadas.total > 0) {
          componente[_y].percretrabalho = Math.round((componente[_y].Retrabalho.total * 100) / componente[_y].Codificadas.total);
        }
        componente[_y].produtividade = Math.round((componente[_y].Codificadas.total + componente[_y].Rejeitadas.total - componente[_y].Retrabalho.total) / diasUteis * 100);
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
      case "CriPrivAms": {
          dadosChart[0].criaXResolv.criPrivAms.total = response.total;
          dadosChart[0].criaXResolv.criPrivAms.issues = response.issues;
        break;
      }
      case "CriPublic": {
        dadosChart[0].criaXResolv.criPublic.total = response.total;
        dadosChart[0].criaXResolv.criPublic.issues = response.issues;
        break;
      }
      case "ResPrivAms": {
        dadosChart[0].criaXResolv.resPrivAms.total = response.total;
        dadosChart[0].criaXResolv.resPrivAms.issues = response.issues;
        break;
      }
      case "ResPublic": {
        dadosChart[0].criaXResolv.resPublic.total = response.total;
        dadosChart[0].criaXResolv.resPublic.issues = response.issues;
        break;
      }
      case "CriDataPrev": {
        dadosChart[2].criaXResolvDataPrev.criDataPrev.total = response.total;
        dadosChart[2].criaXResolvDataPrev.criDataPrev.issues = response.issues;
        break;
      }
      case "ResDataPrev": {
        dadosChart[2].criaXResolvDataPrev.resDataPrev.total = response.total;
        dadosChart[2].criaXResolvDataPrev.resDataPrev.issues = response.issues;
        break;
      }      
      case "CodPrivAms": {
        dadosChart[3].entDetalhada.codPrivAms.total = response.total;
        dadosChart[3].entDetalhada.codPrivAms.issues = response.issues;
        break;
      }
      case "RetPrivAms": {
        dadosChart[3].entDetalhada.retPrivAms.total = response.total;
        dadosChart[3].entDetalhada.retPrivAms.issues = response.issues;
        break;
      }
      case "RejPrivAms": {
        dadosChart[3].entDetalhada.rejPrivAms.total = response.total;
        dadosChart[3].entDetalhada.rejPrivAms.issues = response.issues;
        break;
      }
      case "CanPrivAms": {
        dadosChart[3].entDetalhada.canPrivAms.total = response.total;
        dadosChart[3].entDetalhada.canPrivAms.issues = response.issues;
        break;
      }   
      case "CodPublic": {
        dadosChart[3].entDetalhada.codPublic.total = response.total;
        dadosChart[3].entDetalhada.codPublic.issues = response.issues;
        break;
      }
      case "RetPublic": {
        dadosChart[3].entDetalhada.retPublic.total = response.total;
        dadosChart[3].entDetalhada.retPublic.issues = response.issues;
        break;
      }
      case "RejPublic": {
        dadosChart[3].entDetalhada.rejPublic.total = response.total;
        dadosChart[3].entDetalhada.rejPublic.issues = response.issues;
        break;
      }
      case "CanPublic": {
        dadosChart[3].entDetalhada.canPublic.total = response.total;
        dadosChart[3].entDetalhada.canPublic.issues = response.issues;
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
                    dadosChart[1].abertasVersao[posVersao].issues.push(response.issues[_i]);
                    break;
                  }
                }
              }
            }else{
              dadosChart[1].abertasVersao[posVersao].quant++;
              dadosChart[1].abertasVersao[posVersao].issues.push(response.issues[_i]);
            }
          }
        }
        break;
      }
      case "entProjeto": {
        var posProjeto = -1;
        var posMprimesp = -1;
        for (var _i = 0; response.issues.length > _i; _i++) {
          for (var _x = 0; dadosChart[4].entProjeto.length > _x; _x++) {
            if (dadosChart[4].entProjeto[_x][0] == response.issues[_i].key.split("-")[0]) {
              posProjeto = _x;
              if (response.issues[_i].key.split("-")[0] == "MPRIMESP") {
                posMprimesp = _x;
              }
              break;
            }else{
              posProjeto = -1;
            }
          }

          if (posProjeto < 0) {
            if (response.issues[_i].key.split("-")[0] == "MPBS") {
              if (posMprimesp < 0){
                dadosChart[4].entProjeto.push(["MPRIMESP", 1]);    
              }else{
                dadosChart[4].entProjeto[posMprimesp][1]++;    
              }
            }else{
              dadosChart[4].entProjeto.push([response.issues[_i].key.split("-")[0], 1]);
            }
          }else{
            dadosChart[4].entProjeto[posProjeto][1]++;
          }
        }
      }

      default:
        break;
    }

    if (this.execReq.length == 16) {
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
    while (dataDe.toString().substring(0,15) != dataAte.toString().substring(0,15)) {
      if (dataDe.getDay() != 0 && dataDe.getDay() != 6) {
        diasUteis++
      }
      dataDe.setDate(dataDe.getDate() + 1);
    }

    return diasUteis
  }

  formatDate(data) {
    if (data === null) {
      return "";
    }
    data = new Date(data);
    return data.toLocaleString().toString().substring(0,10);
  }
  
  detectarMobile() { 
    if ( navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)) 
    {
      return true;
    }else{
      return false;
    }
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
