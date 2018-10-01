import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class RestZenService {

  private processos: number = 0;
  private headers = new Headers();
  private params = new URLSearchParams();
  private opts = new RequestOptions();    
  public token = "";
  private zCredenc = "Basic anYudGRpLnBvcnRhaXNAdG90dnMuY29tLmJyL3Rva2VuOmd2RXpXa21TRDJOVHU4andNdjdRamtYUVpyeEtWbHNDT09xZWtMNWc="

  constructor(private http: Http) { }

  getToken() {

    var options = {
      "method": "POST",
      "body": "grant_type=client_credentials",
      "hostname": [
        "apimanager-homolog",
        "totvs",
        "com"
      ],
      "path": [
        "api",
        "token"
      ],
      "headers": {
        "Authorization": "Basic eUpZTTNBU2h4UzFtTEFqSFdWUW9pMjU4c1VZYTpYOEpuaUhNZUVWUFMyUlM4WGI0ZDBPZU4xVkVh",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      }
    };    

    this.http.get("http://localhost:4200/api/token", options).map(res => res.json()).subscribe(response => {
      this.token = response.access_token
    },
    error => { console.log("erro requisição do token");
    });
    
    return this.token;

  }

  getCodOrg(token, idOrg) {

    this.headers.set("Authorization-zendesk", this.zCredenc);
    this.headers.set("Authorization", "Bearer " + token);
    //this.params.set("Cookies", "")
    this.opts.headers = this.headers;    

    return this.http.get("http://localhost:4200/api/zendesk/1.0/search?query="+idOrg+"%20type:organization", this.opts).map(res => res.json());
  }

  getTickets(token, idCliente, page) {

    this.headers.set("Authorization-zendesk", this.zCredenc);
    this.headers.set("Authorization", "Bearer " + token);
    this.opts.headers = this.headers;

    return this.http.get("http://localhost:4200/api/zendesk/1.0/tickets?organization_id="+idCliente+"&page="+page, this.opts).map(res => res.json());

  }

  getIssues(codOrg, codTickets) {

    this.opts.headers = this.headers;
    this.params.set("maxResults", "20000");
    this.params.set("jql", ' "Código da Organização"  = "' + codOrg.trim() + '" AND "Ticket" in (' + codTickets + ')');
    this.opts.params = this.params;

    return this.http.get("http://localhost:4200/rest/api/latest/search", this.opts).map(res => res.json());    
  }

  /*getCookie() {

    this.headers = new Headers();
    this.params = new URLSearchParams();
    this.headers.set("Access-Control-Expose-Headers", "x-content-type-options");
    this.opts.headers = this.headers;
    this.opts.params = this.params;

    return this.http.get("http://localhost:4200/zen/agent/dashboard", this.opts);    

  }*/
}
