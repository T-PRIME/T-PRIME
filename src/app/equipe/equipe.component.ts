import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit {

  contact = {
    name: 'Mr. Dev Totvs',
    email: 'dev.totvs@totvs.com',
    phone: '47912012015'
  };

  callContact(phone) {
    window.open('tel:'+phone);
  }

  sendContact(email) {
    window.open('mailto:'+email);
  }

  constructor() { }

  ngOnInit() {
  }

}
