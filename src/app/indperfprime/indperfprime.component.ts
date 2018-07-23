import { Component, OnInit, ViewChild } from '@angular/core';
import { ThfSelectOption } from '@totvs/thf-ui/components/thf-field';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { ThfGridColumn  } from '@totvs/thf-ui/components/thf-grid';
import { text } from '@angular/core/src/render3/instructions';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { isEmpty } from 'rxjs/operator/isEmpty';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';



@Component({
  selector: 'app-indperfprime',
  templateUrl: './indperfprime.component.html',
  styleUrls: ['./indperfprime.component.css'],
  providers: [RestJiraService]
})
export class IndperfprimeComponent implements OnInit {

  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  loadButton = false;
  labelButton = "Gerar Indicadores";
  colperf: Array<ThfTableColumn>;
  itemsperf: Array<any>;
  //Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  categchartPerf = [[], [], [], [], [], [], [], [], [], []];
  serieschartPerf = [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]]; 
  usuarios: Array<any>;
  jqlFiltro: Array<any>
  startDate: Date;
  endDate: Date;
  timeini = " 00:00"
  timeFim = " 23:59"
  diasUteis: number;
  now: Date;
  columnsGrid: Array<ThfGridColumn>;
  itemsGrid: Array<any>;



  constructor(public restJiraService: RestJiraService, private thfAlert: ThfDialogService ) { };
 
  ngOnInit() {

    this.columnsGrid = this.getColumns();
    this.now = new Date();

    var diaIni = 1
    //var diaFim = ((new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0 )).getDate());
    var diaFim = this.now.getDate();
    var mes = this.now.getMonth();
    var ano = this.now.getFullYear();

    this.startDate = new Date(ano,mes,diaIni);
    this.endDate = new Date(ano,mes,diaFim);
    this.limpaTabela();      

    this.usuarios = [
      { user: 'diogo.vieira', total: 0, label:"Diogo Vieira" },
      { user: 'eduardo.martinez', total: 0, label:"Eduardo Martinez"  },
      { user: 'evandro.pattaro', total: 0 , label:"Evandro Pattaro" },
      { user: 'joao.balbino', total: 0 , label:"João Balbino" },
      { user: 'julio.silva', total: 0, label:"Julio Silva"  },
      { user: 'leonardo.magalhaes', total: 0 , label:"Leonardo Barbosa" },
      { user: 'tiago.bertolo', total: 0 , label:"Tiago Bertolo" },
      { user: 'vitor.pires', total: 0 , label:"Vitor Pires" },      
      { user: 'wesley.lossani', total: 0 , label:"Wesley Lossani" },
      { user: 'yuri.porto', total: 0 , label:"Yuri Porto" }
      
    ];      
    
    //Chart1
    this.categchart1 = this.getCategchart1();
  }

  gerarIndicadores() {

    if ( (this.startDate == undefined || this.endDate == undefined) || (this.startDate.toString() == "" || this.endDate.toString() == "") ){
      this.thfAlert.alert({title: "Campos obrigatorios!", message: "Preencha os campos de período."});
      return;
    }
    this.loadButton = true;
    this.labelButton = "Gerando indicadores..." 

    this.limpaTabela();    
    
    var dataDe = new Date(this.startDate.toString().substring(0,10));
    var dataAte = new Date(this.endDate.toString().substring(0,10));
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter("59157").subscribe(response => this.getPerf(response.jql, "Retrabalho"));
    this.restJiraService.getFilter("59150").subscribe(response => this.getPerf(response.jql, "Codificadas"));
    this.restJiraService.getFilter("59154").subscribe(response => this.getPerf(response.jql, "Rejeitadas"));
    this.restJiraService.getFilter("59155").subscribe(response => this.getPerf(response.jql, "Canceladas"));   
    
  }

   getPerf(filtro, campo) {

      var filtroEdit = filtro
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "startOfMonth()", "'"+ this.startDate.toString().substring(0,10)+this.timeini+"'");
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "endOfMonth()", "'"+this.endDate.toString().substring(0,10)+this.timeFim+"'");

      this.restJiraService.getIssues(filtroEdit).subscribe( response => { 
        var fimExecucao = this.restJiraService.atualizaPerf(response, this.itemsperf, this.usuarios, campo, this.diasUteis);
        if (fimExecucao) {
          this.atualizaGrafico();
       } } );
  }  

  limpaTabela(){
    var zeraGrafico = [0,0,0,0,0,0,0,0,0,0];
    this.itemsperf = [
      { analista: 'Diogo Vieira', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Eduardo Martinez', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Evandro Pattaro', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'João Balbino', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Julio Silva', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Leonardo Barbosa', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Tiago Bertolo', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Vitor Pires', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Wesley Lossani', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0},
      { analista: 'Yuri Porto', Codificadas: {total: 0, issues: [ ]}, Rejeitadas: {total: 0, issues: [ ]}, Canceladas: {total: 0, issues: [ ]}, Retrabalho: {total: 0, issues: [ ]}, percretrabalho:0, produtividade: 0}
      
      ];
    
  this.colperf = [
    { column: 'analista', label: 'Analista'},
    { column: 'codificadas', label: 'Codificadas', type: 'number'},
    { column: 'rejeitadas', label: 'Rejeitadas', type: 'number'},
    { column: 'canceladas', label: 'Canceladas', type: 'number'},
    { column: 'retrabalho', label: 'Retrabalho', type: 'number' },
    ];  

  this.serieschart1 = this.getSeriesChart1(zeraGrafico, zeraGrafico, zeraGrafico);
  for (var _i = 0; this.serieschartPerf.length > _i; _i++) {
    this.serieschartPerf[_i] = this.getSeriesChart2(0, 0, 0, 0, 0);
  }

  }

  atualizaGrafico() {

    var dadosRet = [0,0,0,0,0,0,0,0,0,0];
    var dadosTrab = [0,0,0,0,0,0,0,0,0,0];
    var dadosProd = [0,0,0,0,0,0,0,0,0,0];
   
    for (var _i = 0; this.serieschartPerf.length > _i; _i++) {
        this.serieschartPerf[_i] = this.getSeriesChart2(this.itemsperf[_i].Codificadas.total, this.itemsperf[_i].Rejeitadas.total, this.itemsperf[_i].Canceladas.total, 
        this.itemsperf[_i].Retrabalho.total, this.itemsperf[_i].percretrabalho.total);
    }

    for (var _a = 0; this.itemsperf.length > _a; _a++) {
       dadosRet[_a] = this.itemsperf[_a].percretrabalho;
       dadosTrab[_a] = this.itemsperf[_a].Codificadas.total + this.itemsperf[_a].Rejeitadas.total;
       dadosProd[_a] = this.itemsperf[_a].produtividade;
       this.itemsperf[_a].percretrabalho = this.itemsperf[_a].percretrabalho.toString() + "%";
       this.itemsperf[_a].produtividade = this.itemsperf[_a].produtividade.toString() + "%";
    }
    this.serieschart1 = this.getSeriesChart1(dadosRet, dadosTrab, dadosProd);
    this.loadButton = false;
    this.labelButton = "Gerar Indicadores";
    
  }

  openModal(formData, usuario) {
    
    this.itemsGrid = [];
    for (var _i = 0; this.itemsperf.length > _i; _i++) {
      if (this.itemsperf[_i].analista == usuario) {
        console.log(eval("this.itemsperf[_i]."+formData.series.name+".issues.length"));
        for (var _x = 0; eval("this.itemsperf[_i]."+formData.series.name+".issues.length") > _x; _x++) {
          this.itemsGrid.push({
            issue:    eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].key"),
            nomeFant: eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.customfield_11071.value"),
            summary: eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.summary"),
            sla:      this.restJiraService.formatDate(eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.customfield_11080")),
            dtAcordo: this.restJiraService.formatDate(eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.customfield_11039")),
            dtPSLA:   this.restJiraService.formatDate(eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.customfield_11040")),
            reporter: eval("this.itemsperf[_i]."+formData.series.name+".issues[_x].fields.reporter.displayName")
          });
        } 
      }
    }
    console.log(formData);
    this.thfModal.open();
  }

  private getSeriesChart1(dadosRet, dadosTrab, dadosProd): Array<ThfColumnChartSeries> {
    return [
      { name: 'Issues Trabalhadas', data: dadosTrab },
      { name: '% Produtividade', data: dadosProd },
      { name: '% Retrabalho', data: dadosRet},
      ];
  }
  private getSeriesChart2(dadosCod, dadosRej, dadosCanc, dadosRet, dadosPercRet): Array<ThfColumnChartSeries> {
    return [
      { name: 'Codificadas', data: [dadosCod]},
      { name: 'Canceladas', data: [dadosCanc] },
      { name: 'Rejeitadas', data: [dadosRej] },
      { name: 'Retrabalho', data: [dadosRet] },
    ];
  }  
  private getCategchart1(): Array<string> {
    return [ 'Diogo Saravando', 'Eduardo Martinez', 'Evandro Pattaro', 'João Balbino', 
    'Julio Silva', 'Leonardo Barbosa', 'Tiago Bertolo', 'Vitor Pires', 'Wesley Lossani', 'Yuri Porto' ];
  }     

  primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Fechar'
  };

  getColumns(): Array<ThfGridColumn> {
    return [
      { column: 'issue', label: 'Issue', type: 'string', width: 18},
      { column: 'nomeFant', label: 'Nome Fantasia', type: 'string', width: 27},
      { column: 'summary', label: 'Summary' , type: 'string', width: 31},
      { column: 'sla', label: 'SLA', type: 'date', width: 13},
      { column: 'dtAcordo', label: 'Dt. Acordo', type: 'date', width: 13},
      { column: 'dtPSLA', label: 'Pausa SLA', type: 'date', width: 13},
      { column: 'reporter', label: 'Reporter', type: 'string', width: 15 }
    ];
  }
}
