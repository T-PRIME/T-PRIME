import { Component, OnInit } from '@angular/core';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { text } from '@angular/core/src/render3/instructions';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';




@Component({
  selector: 'app-indperfprime',
  templateUrl: './indperfprime.component.html',
  styleUrls: ['./indperfprime.component.css'],
  providers: [RestJiraService]
})
export class IndperfprimeComponent implements OnInit {

  colperf: Array<ThfTableColumn>;
  itemsperf: Array<any>;
  //Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  usuarios: Array<any>;
  jqlFiltro: Array<any>
  public teste: any;
  startDate: string;
  endDate: string;
  diasUteis: number;

  constructor(public restJiraService: RestJiraService ) { }
 
  ngOnInit() {

    this.limpaTabela();      

    this.usuarios = [
      { user: 'diogo.vieira', total: 0 },
      { user: 'eduardo.martinez', total: 0 },
      { user: 'joao.balbino', total: 0 },
      { user: 'julio.silva', total: 0 },
      { user: 'leonardo.magalhaes', total: 0 },
      { user: 'tiago.bertolo', total: 0 },
      { user: 'vitor.pires', total: 0 },      
      { user: 'wesley.lossani', total: 0 },
      { user: 'yuri.porto', total: 0 }, 
      
    ];      
  }

  gerarIndicadores() {

    this.limpaTabela();    
    var dataDe = new Date(this.startDate.substring(0,10));
    var dataAte = new Date(this.endDate.substring(0,10));
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter("59157").end(response => this.getPerf(response.body.jql, "retrabalho"));
    this.restJiraService.getFilter("59150").end(response => this.getPerf(response.body.jql, "codificadas"));
    this.restJiraService.getFilter("59154").end(response => this.getPerf(response.body.jql, "rejeitadas"));
    this.restJiraService.getFilter("59155").end(response => this.getPerf(response.body.jql, "canceladas"));

    //Chart1
    this.categchart1 = this.getCategchart1();
    this.serieschart1 = this.getSeriesChart1();  
    
  }

   getPerf(filtro, campo) {

      var filtroEdit = filtro
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "startOfMonth()", this.startDate.substring(0,10));
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "endOfMonth()", this.endDate.substring(0,10));

      this.restJiraService.getIssues(filtroEdit).end( response => this.restJiraService.
      atualizaPerf(response, this.itemsperf, this.usuarios, campo, this.diasUteis));
  }  

  limpaTabela(){
    this.itemsperf = [
      { analista: 'Diogo Francisco Vieir  a Saravando', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},
      { analista: 'Eduardo Karpischek Martinez', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'João Paulo de Souza Balbino', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Julio Fernando da Silva Santos', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},   
      { analista: 'Leonardo Magalhães Barbosa ', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},   
      { analista: 'Tiago Bertolo', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Vitor Pires', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},                  
      { analista: 'Wesley Lossani', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Yuri Milan Porto', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      
      ];
    
  this.colperf = [
    { column: 'analista', label: 'Analista'},
    { column: 'codificadas', label: 'Issues Codificadas', type: 'number'},
    { column: 'rejeitadas', label: 'Issues Rejeitadas', type: 'number'},
    { column: 'canceladas', label: 'Issues Canceladas', type: 'number'},
    { column: 'retrabalho', label: 'Retrabalho', type: 'number' },
    { column: 'percretrabalho', label: '% Retrabalho', type: 'number' },
    { column: 'produtividade', label: 'Produtividade' , type: 'number'}
    ];  

   }

  private getSeriesChart1(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Retrabalho', data: [0,0,0,0,0,0,0,0,0]},
      { name: 'Issues Trabalhadas', data: [4,6,4,5,12,15,12,20,9] },
      { name: 'Produtividade', data: [2,7,4,5,12,20,12,20,9] }  
      ];
  }
  private getCategchart1(): Array<string> {
    return [ 'Diogo Francisco Vieira Saravando', 'Eduardo Karpischek Martinez', 'João Paulo de Souza Balbino', 'Julio Fernando da Silva Santos',
    'Leonardo Magalhães Barbosa', 'Tiago Bertolo', 'Vitor Pires', 'Wesley Lossani', 'Yuri Milan Porto' ];
  }  
}