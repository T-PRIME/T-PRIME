import { Component, OnInit } from '@angular/core';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { text } from '@angular/core/src/render3/instructions';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';




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
  categchartPerf = [[], [], [], [], [], [], [], [], [], []];
  serieschartPerf = [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]]; 
  usuarios: Array<any>;
  jqlFiltro: Array<any>
  startDate: string;
  endDate: string;
  diasUteis: number;

  constructor(public restJiraService: RestJiraService, private thfAlert: ThfDialogService ) { }
 
  ngOnInit() {

    this.limpaTabela();      

    this.usuarios = [
      { user: 'diogo.vieira', total: 0 },
      { user: 'eduardo.martinez', total: 0 },
      { user: 'evandro.pattaro', total: 0 },
      { user: 'joao.balbino', total: 0 },
      { user: 'julio.silva', total: 0 },
      { user: 'leonardo.magalhaes', total: 0 },
      { user: 'tiago.bertolo', total: 0 },
      { user: 'vitor.pires', total: 0 },      
      { user: 'wesley.lossani', total: 0 },
      { user: 'yuri.porto', total: 0 } 
      
    ];      
    
    //Chart1
    this.categchart1 = this.getCategchart1();
  }

  gerarIndicadores() {

    if (this.startDate == undefined || this.endDate == undefined) {
      this.thfAlert.alert({title: "Campos obrigatorios!", message: "Preencha os campos de período."});
      return;
    }

    this.limpaTabela();    
    var dataDe = new Date(this.startDate.substring(0,10));
    var dataAte = new Date(this.endDate.substring(0,10));
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter("59157").end(response => this.getPerf(response.body.jql, "retrabalho"));
    this.restJiraService.getFilter("59150").end(response => this.getPerf(response.body.jql, "codificadas"));
    this.restJiraService.getFilter("59154").end(response => this.getPerf(response.body.jql, "rejeitadas"));
    this.restJiraService.getFilter("59155").end(response => this.getPerf(response.body.jql, "canceladas"));   
    
  }

   getPerf(filtro, campo) {

      var filtroEdit = filtro
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "startOfMonth()", this.startDate.substring(0,10));
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "endOfMonth()", this.endDate.substring(0,10));

      this.restJiraService.getIssues(filtroEdit).end( response => { 
        var fimExecucao = this.restJiraService.atualizaPerf(response, this.itemsperf, this.usuarios, campo, this.diasUteis);
        if (fimExecucao) {
          this.atualizaGrafico();
       } } );
  }  

  limpaTabela(){
    var zeraGrafico = [0,0,0,0,0,0,0,0,0,0];
    this.itemsperf = [
      { analista: 'Diogo Saravando', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},
      { analista: 'Eduardo Martinez', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Evandro Pattaro', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'João Balbino', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Julio Silva', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},   
      { analista: 'Leonardo Barbosa ', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},   
      { analista: 'Tiago Bertolo', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Vitor Pires', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},                  
      { analista: 'Wesley Lossani', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0},      
      { analista: 'Yuri Porto', codificadas: 0, rejeitadas: 0, canceladas: 0, retrabalho: 0, percretrabalho:0, produtividade: 0}    
      
      ];
    
  this.colperf = [
    { column: 'analista', label: 'Analista'},
    { column: 'codificadas', label: 'Codificadas', type: 'number'},
    { column: 'rejeitadas', label: 'Rejeitadas', type: 'number'},
    { column: 'canceladas', label: 'Canceladas', type: 'number'},
    { column: 'retrabalho', label: 'Retrabalho', type: 'number' },
    { column: 'percretrabalho', label: '% Retrabalho'}
    ];  

  this.serieschart1 = this.getSeriesChart1(zeraGrafico, zeraGrafico, zeraGrafico);

  }

  atualizaGrafico() {

    var dadosRet = [0,0,0,0,0,0,0,0,0,0];
    var dadosTrab = [0,0,0,0,0,0,0,0,0,0];
    var dadosProd = [0,0,0,0,0,0,0,0,0,0];
   
    for (var _i = 0; this.serieschartPerf.length > _i; _i++) {
        this.serieschartPerf[_i] = this.getSeriesChart2(this.itemsperf[_i].codificadas, this.itemsperf[_i].rejeitadas, this.itemsperf[_i].canceladas, 
        this.itemsperf[_i].retrabalho, this.itemsperf[_i].percretrabalho, this.itemsperf[_i].produtividade);
    }

    for (var _a = 0; this.itemsperf.length > _a; _a++) {
       dadosRet[_a] = this.itemsperf[_a].percretrabalho;
       dadosTrab[_a] = this.itemsperf[_a].codificadas + this.itemsperf[_a].rejeitadas;
       dadosProd[_a] = this.itemsperf[_a].produtividade;
       this.itemsperf[_a].percretrabalho = this.itemsperf[_a].percretrabalho.toString() + "%";
       this.itemsperf[_a].produtividade = this.itemsperf[_a].produtividade.toString() + "%";
    }
    this.serieschart1 = this.getSeriesChart1(dadosRet, dadosTrab, dadosProd);
  }

  private getSeriesChart1(dadosRet, dadosTrab, dadosProd): Array<ThfColumnChartSeries> {
    return [
      { name: '% Retrabalho', data: dadosRet},
      { name: 'Issues Trabalhadas', data: dadosTrab },
      { name: '% Produtividade', data: dadosProd }  
      ];
  }
  private getSeriesChart2(dadosCod, dadosRej, dadosCanc, dadosRet, dadosPercRet, dadosProd): Array<ThfColumnChartSeries> {
    return [
      { name: 'codificadas', data: [dadosCod]},
      { name: 'rejeitadas', data: [dadosRej] },
      { name: 'canceladas', data: [dadosCanc] },
      { name: 'retrabalho', data: [dadosRet] },
      { name: 'perc. ret', data: [dadosPercRet] },
      
    ];
  }  
  private getCategchart1(): Array<string> {
    return [ 'Diogo Saravando', 'Eduardo Martinez', 'Evandro Pattaro', 'João Balbino', 
    'Julio Silva', 'Leonardo Barbosa', 'Tiago Bertolo', 'Vitor Pires', 'Wesley Lossani', 'Yuri Porto' ];
  }     
}