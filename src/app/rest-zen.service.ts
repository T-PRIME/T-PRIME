import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';


@Injectable()
export class RestZenService {

  private headers = new Headers();
  private params = new URLSearchParams();
  private opts = new RequestOptions();    
  public token = "";
  private zCredenc = "Basic anYudGRpLnBvcnRhaXNAdG90dnMuY29tLmJyL3Rva2VuOmd2RXpXa21TRDJOVHU4andNdjdRamtYUVpyeEtWbHNDT09xZWtMNWc="

  constructor(private http: Http) { }

  getToken() {

    var options: any = {
      "method": "POST",
      "body": "grant_type=client_credentials",
      "hostname": [
        "apimanager",
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

    this.http.get("http://10.171.66.178:80/api/api/token", options).map(res => res.json()).subscribe(response => {
      this.token = response.access_token
    },
    error => { console.log("erro requisição do token");
    });
    
    return this.token;

  }

  getCodOrg(token, idOrg) {

    this.headers.set("Authorization-zendesk", this.zCredenc);
    this.headers.set("Authorization", "Bearer " + token);
    this.opts.headers = this.headers;    

    return this.http.get("https://apimanager.totvs.com/api/zendesk/1.0/search?query="+idOrg+"%20type:organization", this.opts).map(res => res.json());
  }

  getTickets(token, idCliente, page) {

    this.headers.set("Authorization-zendesk", this.zCredenc);
    this.headers.set("Authorization", "Bearer " + token);
    this.opts.headers = this.headers;

    return this.http.get("https://apimanager.totvs.com/api/zendesk/1.0/tickets?organization_id="+idCliente+"&page="+page, this.opts).map(res => res.json());

  }

  getIssues(jql) {

    this.opts.headers = this.headers;
    this.params.set("maxResults", "20000");
    this.params.set("jql", jql);
    this.opts.params = this.params;

    return this.http.get("http://10.171.66.178:80/jira/rest/api/latest/search", this.opts).map(res => res.json());    
  }
}
