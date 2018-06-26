import { Component, OnInit } from '@angular/core';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { text } from '@angular/core/src/render3/instructions';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';
import { Filtro } from '../filtro';




@Component({
  selector: 'app-indperfprime',
  templateUrl: './indperfprime.component.html',
  styleUrls: ['./indperfprime.component.css'],
  providers: [RestJiraService]
})
export class IndperfprimeComponent implements OnInit {

  
  columns: Array<ThfTableColumn>;
  items: Array<any>;
  colperf: Array<ThfTableColumn>;
  itemsperf: Array<any>;
  //Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  usuarios: Array<any>;
  jqlFiltro: Filtro[];
  public teste: any;

  constructor(public restJiraService: RestJiraService ) { }
 
  ngOnInit() {
    this.columns = [
      { column: 'analista', label: 'Analista'},
      { column: 'avencer', label: 'A Vencer', type: 'number'},
      { column: 'pacemergenciais', label: 'Pacotes Emergenciais', type: 'number' },
      { column: 'vencidos', label: 'Vencidos' , type: 'number'},
      { column: 'totalbacklog', label: 'Total Backlog' , type: 'number'},
      { column: 'abertasmais30dias', label: 'Abertas > 30 dias' , type: 'number'} 
      ];

    this.items = [
      { analista: 'Diogo Francisco Vieira Saravando', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
      { analista: 'Eduardo Karpischek Martinez', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },      
      { analista: 'João Paulo de Souza Balbino', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
      { analista: 'Julio Fernando da Silva Santos', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },      
      { analista: 'Leonardo Magalhães Barbosa ', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
      { analista: 'Vitor Pires', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },      
      { analista: 'Tiago Bertolo', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
      { analista: 'Wesley Lossani', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
      { analista: 'Yuri Milan Porto', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 191 },
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

    this.itemsperf = [
      { analista: 'Vitor Pires', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Yuri Milan Porto', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Leonardo Magalhães Barbosa ', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'João Paulo de Souza Balbino', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Julio Fernando da Silva Santos', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Eduardo Karpischek Martinez', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Tiago Bertolo', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Wesley Lossani', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80},      
      { analista: 'Diogo Francisco Vieira Saravando', codificadas: 5, rejeitadas: 3, canceladas: 10, retrabalho: 191, percretrabalho:20, produtividade: 80}
    ];

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

    //Chart1
    this.categchart1 = this.getCategchart1();
    this.serieschart1 = this.getSeriesChart1();
    console.log(this.jqlFiltro);
    //this.restJiraService.getFilter();
  }
   
  private getCategchart1(): Array<string> {
  return [ 'Vitor Pires', 'Yuri Milan Porto','Leonardo Magalhães Barbosa' ,'João Paulo de Souza Balbino' ,'Julio Fernando da Silva Santos',
           'Eduardo Karpischek Martinez', 'Tiago Bertolo' ,'Wesley Lossani' ,'Diogo Francisco Vieira Saravando' ];
  }
  private getSeriesChart1(): Array<ThfColumnChartSeries> {
  return [
    { name: 'Retrabalho', data: [3,5,4,5,12,20,1,9,20]},
    { name: 'Issues Trabalhadas', data: [4,6,4,5,12,15,12,20,9] },
    { name: 'Produtividade', data: [2,7,4,5,12,20,12,20,9] }  
    ];
      
  }

  gerarIndicadores() {
    
    this.restJiraService.getFilter("59121").end(response => this.getTest(response.body.jql, "avencer"));
    this.restJiraService.getFilter("59123").end(response => this.getTest(response.body.jql, "pacemergenciais"));
    this.restJiraService.getFilter("59124").end(response => this.getTest(response.body.jql, "vencidos"));
    
  }

    getTest(filtro, campo) {

      this.restJiraService.getIssues(filtro).end( response => this.restJiraService.
      atualizaComponente(response, this.items, this.usuarios, campo);
  }
}