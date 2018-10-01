import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';

@Injectable()
export class RestTrelloService {

  private headers = new Headers();
  private params = new URLSearchParams();
  private opts = new RequestOptions();    

  constructor(private http: Http) { }

  buscaClientes() {

    this.params = new URLSearchParams();
    this.params.set("fields","name");
    this.params.set("key","2094922271ef8480358bc1d9bb89dc86");
    this.params.set("token","c1841d2405a9b19aa51ecc6156dfdd76479cd43ba6ccc2733a4074cacb1d9693");
    this.opts.params = this.params;

    return this.http.get("https://api.trello.com/1/boards/T9JYvFqP/cards", this.opts).map(res => res.json());

  }

  getDadosCli(idCliente) {

    this.params = new URLSearchParams();
    this.params.set("fields","desc");
    this.params.set("key","2094922271ef8480358bc1d9bb89dc86");
    this.params.set("token","c1841d2405a9b19aa51ecc6156dfdd76479cd43ba6ccc2733a4074cacb1d9693");
    this.opts.params = this.params;

    return this.http.get("https://api.trello.com/1/boards/T9JYvFqP/cards/"+idCliente, this.opts).map(res => res.json());
  }

}
