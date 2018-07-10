import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  background: string;

  constructor() { }

  ngOnInit() {
    this.background = '/assets/images/Imagem1.png';
  }

}
