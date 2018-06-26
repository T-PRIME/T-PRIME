import { Component, OnInit } from '@angular/core';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { text } from '@angular/core/src/render3/instructions';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';




@Component({
  selector: 'app-backlogmanutprime',
  templateUrl: './backlogmanutprime.component.html',
  styleUrls: ['./backlogmanutprime.component.css'],
  providers: [RestJiraService]
})
export class BacklogmanutprimeComponent implements OnInit {

  columns: Array<ThfTableColumn>;
  items: Array<any>;

  //Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  usuarios: Array<any>;
  //jqlFiltro: Filtro[];
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
    this.restJiraService.getFilter("59121").end(response => this.getTest(response.body.jql, "avencer"));
    this.restJiraService.getFilter("59123").end(response => this.getTest(response.body.jql, "pacemergenciais"));
    this.restJiraService.getFilter("59124").end(response => this.getTest(response.body.jql, "vencidos"));
    this.restJiraService.getFilter("59124").end(response => this.getTest(response.body.jql, "abertasmais30dias"));
    
  }

    getTest(filtro, campo) {

      this.restJiraService.getIssues(filtro).end( response => this.restJiraService.
      atualizaComponente(response, this.items, this.usuarios, campo);
  }

  limpaTabela(){

    this.items = [
      { analista: 'Diogo Francisco Vieira Saravando', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Eduardo Karpischek Martinez', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },      
      { analista: 'João Paulo de Souza Balbino', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Julio Fernando da Silva Santos', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },      
      { analista: 'Leonardo Magalhães Barbosa ', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Vitor Pires', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },      
      { analista: 'Tiago Bertolo', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Wesley Lossani', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Yuri Milan Porto', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
    ];
  }
}