import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { ThfComboOption } from '@totvs/thf-ui/components/thf-field';
import { ThfGridColumn } from '@totvs/thf-ui/components/thf-grid';
import { RestZenService } from '../rest-zen.service';
import { RestJiraService } from '../rest-jira.service';
import { RestTrelloService } from '../rest-trello.service';
import { ThfInfoOrientation } from '@totvs/thf-ui/components/thf-info';

//var readfiles = require('readfiles');

@Component({
  selector: 'app-indcliente',
  templateUrl: './indcliente.component.html',
  styleUrls: ['./indcliente.component.css']
})
export class IndclienteComponent implements OnInit {

  codOrg = "";
  zToken = "";
  pendenciasCliente = {totvs: {atendi: 0, Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0},
                       cliente: {atendi: 0, Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0}};                        
  clientesTrello: Array<any> = [];         
  infoDetalCli = [];
  infoModulosCli = [];
  tempoAtend = [];
  serviceContr = [];
  mostraDetalhes = false;              
  orientation: ThfInfoOrientation = ThfInfoOrientation.Horizontal;
  isHideLoading = true;
  //Table1
  columns: Array<ThfTableColumn>;
  items: Array<any>;
  //Chart 5 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  //Chart 3 Pie
  categchart3: Array<string>;
  serieschart3: Array<ThfPieChartSeries>;
  //Chart 4 Pie
  categchart4: Array<string>;
  serieschart4: Array<ThfPieChartSeries>;
  //Grid 1
  dataItems: Array<any> = [];
  columnsgrid: Array<ThfGridColumn> = this.getColumnsGrid();
  private fileReader = new FileReader();


  constructor(private restZenService: RestZenService, private restJiraService: RestJiraService, private restTrelloService: RestTrelloService) { }

  ngOnInit() {

    this.restZenService.getToken();
    this.getClientes();

    /*readfiles('C:/Users/julio.silva/Documents/src_bkp', {
      depth: 0
    }, function (err, content, filename) {
      if (err) throw err;
      console.log('File ' + filename + ':');
      console.log(content);
    });    */

    //this.restZenService.getCookie().subscribe(response => {console.log(response)});
    //document.cookie = "_zendesk_shared_session=-TDNXRk5DSjdIMWpmcFZGZzFwRFU4Q0ZuZHdnaUpFYktQY2dpTXJuM0poRCt3ODVIWnBVbFZyQUZySjl4NWpQazRTMmZKRDg2czZ4RmJGbHY5bkU4S3B3dDlROVRlRjdGRGo5a3FXQWlGK2V6L1YycGtqa1I2L0NRQWpqRG5KeHYtLWN2R1pKQlhOSk5NYmtVM3RXZHZOQkE9PQ%3D%3D--2c6e199b30f8491c8fb40b70266c48511bd2794c	; expires=Thu, 01 Jan 2090 00:00:00 GMT";

    this.columns = [
      { column: 'ticket', label: 'Ticket', type: 'number'},
      { column: 'status', label: 'Status'},
      { column: 'pendencia', label: 'Pendência'},
      { column: 'dtabertura', label: 'Data Abertura', type: 'date' },
      { column: 'prazo', label: 'Prazo', type: 'date' },
      { column: 'Issue', label: 'issue', type: 'string', },
      { column: 'assunto', label: 'Assunto', type:'string'},
      { column: 'obs', label: 'Observações'},
      { column: 'prioridade', label: 'Prioridade', type:'label', labels:[
        { value: 'baixo', color: 'success', label: 'Baixo' },
        { value: 'medio', color: 'success', label: 'Médio' },
        { value: 'alto', color: 'warning', label: 'Alto' },
        { value: 'critico', color: 'danger', label: 'Crítico' }
      ]},
      { column: 'modulo', label: 'Módulo'}

      ];
  
    this.items = [
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  }      
      
    ];

    //Chart5
    this.serieschart1 = this.getSeriesChart1();
    this.categchart1 = this.getCategChart1();
    //Chart3
    this.categchart3 = this.getCategchart3();
    this.serieschart3 = this.getSeriesChart3();    
    //Chart4
    this.categchart4 = this.getCategchart4();
    this.serieschart4 = this.getSeriesChart4();   
    //Grid 1
    this.columnsgrid = this.getColumnsGrid();

  }
  private getCategChart1(): Array<string> {
    return [ 'Totvs', 'Cliente'];
  }
  private getSeriesChart1(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Atendimento', data: [this.pendenciasCliente.totvs.atendi, this.pendenciasCliente.cliente.atendi] },
      { name: 'Manutenção', data: [this.pendenciasCliente.totvs.Manut, this.pendenciasCliente.cliente.Manut] },  
      { name: 'Legislação', data: [this.pendenciasCliente.totvs.Legis, this.pendenciasCliente.cliente.Legis] },
      { name: 'Customização (BSO)', data: [this.pendenciasCliente.totvs.Custo, this.pendenciasCliente.cliente.Custo] },
      { name: 'Melhoria', data: [this.pendenciasCliente.totvs.Melho, this.pendenciasCliente.cliente.Melho] },
      { name: 'Performance', data: [this.pendenciasCliente.totvs.Perfo , this.pendenciasCliente.cliente.Perfo] }   
    ];
  }
  private getCategchart3(): Array<string> {
    return [ 'Totvs', 'Cliente'];
  } 
  private getSeriesChart3(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'Totvs', value: 150},
              {category: 'Cliente', value: 300}]
  }];
  }
  private getCategchart4(): Array<string> {
    return [ 'No Prazo', 'Fora do Prazo'];
  } 
  private getSeriesChart4(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'No Prazo', value: 95},
              {category: 'Fora do Prazo', value: 5}]
  }];
  }
  
  private getColumnsGrid(): Array<ThfGridColumn> {
    return [
      { column: 'ticket', label: 'Ticket', type: 'number', width: 30},
      { column: 'status', label: 'Status', editable: true, width: 30},
      { column: 'pendencia', label: 'Pendência',editable: true, width: 28},
      { column: 'dtabertura', label: 'Data Abertura', type: 'date' , width: 30},
      { column: 'prazo', label: 'Prazo', type: 'date',editable: true , width: 30},
      { column: 'Issue', label: 'issue', type: 'string' , width: 40},
      { column: 'assunto', label: 'Assunto', type:'string', width: 40},
      { column: 'obs', label: 'Observações',editable: true, width: 40},
      { column: 'prioridade', label: 'Prioridade', width: 25},      
      { column: 'modulo', label: 'Módulo', width: 37}
    ];
  }

  limpaTabela() {

    this.infoDetalCli = [
      {campo: "Nome", valor: ""},
      {campo: "SPOC", valor: ""},
      {campo: "Código", valor: ""},
      {campo: "Degustação", valor: ""},
      {campo: "Segmento", valor: ""},
      {campo: "Tipo Atendimento", valor: ""}
    ];
    this.infoModulosCli = [
      {campo: "Backoffice", valor: ""},
      {campo: "Sped", valor: ""},
      {campo: "RH", valor: ""},
      {campo: "Varejo", valor: ""},
      {campo: "Jurídico", valor: ""},
      {campo: "Logística", valor: ""},
      {campo: "NG", valor: ""},
      {campo: "MIL", valor: ""},
      {campo: "Trade", valor: ""},
      {campo: "Saúde", valor: ""}
    ];
    this.tempoAtend = [
      {campo: "Faixa 1", valor: ""},
      {campo: "Faixa 2", valor: ""},
      {campo: "Faixa 3", valor: ""},
      {campo: "Faixa 3 BSO", valor: ""}
    ];  
    this.serviceContr = [
      {campo: "BSO", valor: ""},
      {campo: "Cloud", valor: ""},
      {campo: "Stand by", valor: ""},
      {campo: "Franquia Tickets", valor: ""},
      {campo: "Analista Dedicado", valor: ""},
      {campo: "Módulo Dedicado", valor: ""},
      {campo: "Suporte Customizado", valor: ""}
    ];

     this.dataItems = [];
     this.pendenciasCliente = {totvs: {atendi: 0, Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0},
                       cliente: {atendi: 0, Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0}};  

  }

  getClientes() {

    this.restTrelloService.buscaClientes().subscribe(response => { 
      for (var _i = 0; response.length > _i; _i++) {
        this.clientesTrello.push({label: response[_i].name, value: response[_i].id});
      }
    }, error => { });
  }


  onbotao1(idCliente) {

    this.limpaTabela();  
    this.isHideLoading = false;
    this.serieschart1 = this.getSeriesChart1();
    this.zToken = this.restZenService.token;
    console.log(this.restZenService.token);

    this.restTrelloService.getDadosCli(idCliente).subscribe(response => {

      var dadosCli = response.desc.split("#")[1].split("\n");
      var entLegais = response.desc.split("#")[3].split("\n");
      var tempoAtend = response.desc.split("#")[7].split("\n");
      var modulosCli = response.desc.split("#")[8].split("\n");
      var serviceContr = response.desc.split("#")[9].split("\n");

      for (var _i = 0; this.infoDetalCli.length > _i; _i++) {
        this.infoDetalCli[_i].valor = this.getInfo(dadosCli, "**" + this.infoDetalCli[_i].campo + ":**");
        this.infoDetalCli[_i].valor = this.restJiraService.ReplaceAll(this.infoDetalCli[_i].valor, "**",'', false);
        console.log(this.infoDetalCli[_i].valor);
      }
      for (var _i = 0; this.infoModulosCli.length > _i; _i++) {
        this.infoModulosCli[_i].valor = this.getInfo(modulosCli, "**" + this.infoModulosCli[_i].campo + ":**");
        this.infoModulosCli[_i].valor = this.restJiraService.ReplaceAll(this.infoModulosCli[_i].valor, "**",'', false);
      }   
      for (var _i = 0; this.tempoAtend.length > _i; _i++) {
        this.tempoAtend[_i].valor = this.getInfo(tempoAtend, "**" + this.tempoAtend[_i].campo + ":**");
        this.tempoAtend[_i].valor = this.restJiraService.ReplaceAll(this.tempoAtend[_i].valor, "**",'', false);
      }     
      for (var _i = 0; this.serviceContr.length > _i; _i++) {
        this.serviceContr[_i].valor = this.getInfo(serviceContr, "**" + this.serviceContr[_i].campo + ":**");
        this.serviceContr[_i].valor = this.restJiraService.ReplaceAll(this.serviceContr[_i].valor, "**",'', false);
      }             
      console.log(this.infoDetalCli);

      this.mostraDetalhes = true;

      if (this.infoDetalCli[2].valor != "") {

        this.restZenService.getCodOrg(this.zToken, this.infoDetalCli[2].valor).subscribe(response => { 

          var codOrg = response.results[0].id;

          this.restZenService.getTickets(this.zToken, codOrg, "1").subscribe(response => { 

            var tickets = response.tickets;

            if (response.next_page != undefined) {
              this.getAllTickets(tickets, codOrg);
            }else if (response.tickets.length > 0) {
              this.getIssues(response.tickets);
            }
          });
        });
      }
    },
    error => {

    });
  }

  getIssues(tickets) {

    console.log(tickets);
    var codTickets = "";

    for (var _i = 0; tickets.length > _i; _i++) {
      if (tickets.length-1 == _i){
        codTickets = codTickets+"'"+tickets[_i].id+"'"
      }else{
        codTickets = codTickets+"'"+tickets[_i].id+"',"
      }
    }
    console.log(codTickets);
    this.restZenService.getIssues(this.infoDetalCli[2].valor, codTickets).subscribe(response => { this.atualizaTela(response.issues, tickets) });
  }

  atualizaTela(issues, tickets) {

    var pendencia = "";
    var temIssue;
    var issuesCli = "";
    var status    = "";

    for (var _i = 0; tickets.length > _i; _i++) {

      temIssue = false;
      issuesCli = "";
      if (tickets[_i].status != "closed" && tickets[_i].status != "solved") {
        for (var _x = 0; issues.length > _x; _x++) {
          if (tickets[_i].id == issues[_x].fields.customfield_16701 && issues[_x].fields.status.name != "Expedido" && issues[_x].fields.status.name != "Concluido" && issues[_x].fields.status.name != "Recusada") {
            issuesCli += issues[_x].key+"; ";
            if (issues[_x].fields.status.name == "Associado") {
              eval("this.pendenciasCliente.totvs."+issues[_x].fields.parent.fields.issuetype.name.substring(0,5)+"++");
            }else if (tickets[_i].status == "pending" || tickets[_i].status == "hold") {
              if (issues[_x].fields.issuetype.name == "Epic"){
                this.pendenciasCliente.cliente.Manut++;
              }else{
                eval("this.pendenciasCliente.cliente."+issues[_x].fields.issuetype.name.substring(0,5)+"++");
              }
              console.log("this.pendenciasCliente.cliente."+issues[_x].fields.issuetype.name.substring(0,5));
              console.log(tickets[_i].id);
            }else{
              if (issues[_x].fields.issuetype.name == "Epic"){
                this.pendenciasCliente.totvs.Manut++;
              }else{              
                eval("this.pendenciasCliente.totvs."+issues[_x].fields.issuetype.name.substring(0,5)+"++");       
                console.log("this.pendenciasCliente.cliente."+issues[_x].fields.issuetype.name.substring(0,5));
                console.log(tickets[_i].id);
              }
            }
            temIssue = true;
          }
        }

        if (tickets[_i].status == "pending" || tickets[_i].status == "hold") {
          pendencia = "Cliente";
          if (!temIssue) {
            this.pendenciasCliente.cliente.atendi++
            console.log(tickets[_i].id);
          }
        }else{
          pendencia = "Totvs";
          if (!temIssue) {
            this.pendenciasCliente.totvs.atendi++
            console.log(tickets[_i].id);
          }        
        }

        switch (tickets[_i].status) {
          case "hold":
            status = "EM ESPERA";
            break;
          case "pending":
            status = "PENDENTE";
            break;
          case "open":
            status = "ABERTO";
            break;       
          case "new":
            status = "NOVO";
            break;                                
        
          default:
            break;
        }

        console.log(tickets[_i].46072927.value);
        this.dataItems.push({
          ticket: tickets[_i].id, 
          status: status, 
          pendencia: pendencia, 
          dtabertura: this.restJiraService.formatDate(tickets[_i].created_at),
          prazo: this.restJiraService.formatDate(tickets[_i].fields[386].value),
          Issue: issuesCli});
      }
    }

    this.serieschart1 = this.getSeriesChart1();    
    this.isHideLoading = true;
  }

  getAllTickets(tickets, codOrg) {

    var allTickets = tickets;
    var paginaAtu = 2;

    for (var _i = 2; _i <= 10; _i++) {
      this.restZenService.getTickets(this.zToken, codOrg, _i).subscribe(response => {

        for (var _x = 0; response.tickets.length > _x; _x++) {
          allTickets.push(response.tickets[_x]);
        }
        if (paginaAtu == 10) {
          this.getIssues(allTickets);
        }else{
          paginaAtu++;
        }
      });
    }

  }  

  getInfo(arrayInfo, campo) {
    var retorno = "";

    arrayInfo.some(function(a) {
      if (a.indexOf(campo) != -1) {
        retorno = a.substring(campo.length);
      }
    });    
    return retorno;
  }
}
