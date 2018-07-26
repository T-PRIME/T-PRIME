import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { ThfGridColumn  } from '@totvs/thf-ui/components/thf-grid';
import { ChartComponent } from '@progress/kendo-angular-charts';
import { saveAs } from '@progress/kendo-file-saver';
import { exportPDF,exportImage, Group,Text } from '@progress/kendo-drawing';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-indmanutprime',
  templateUrl: './indmanutprime.component.html',
  styleUrls: ['./indmanutprime.component.css'],
  providers: [RestJiraService]
})
export class IndmanutprimeComponent implements OnInit {

  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;
  
  loadButton = false;
  isHideLoading = true;
  labelButton = "Gerar Indicadores";
  //Chart 2 Column
  categchart2: Array<any>;
  serieschart2: Array<any>;
  //Chart 4 Column
  serieschart4: Array<any>;  
  //Chart 5 Column
  serieschart5: Array<any>;   
  //Chart 6 Pie
  categchart6: Array<any>;
  serieschart6: Array<any>;
  //Chart 1 Column
  categchart7: Array<any>;
  serieschart7: Array<any>;  

  columnsGrid: Array<ThfGridColumn>;
  itemsGrid: Array<any>;

  startDate: Date;
  endDate: Date;
  timeini = " 00:00"
  timeFim = " 23:59"
  diasUteis: number;
  dadosChart: Array<any>;
<<<<<<< HEAD
  now: Date;  
=======
  now: Date;

  @ViewChild("IssuesCriadas") IssuesCriadas: ChartComponent;
  @ViewChild("IssuesAbertas") IssuesAbertas: ChartComponent;
  @ViewChild("DataPrevCriados") DataPrevCriados: ChartComponent;
  @ViewChild("EnrtregaDetalhada") EnrtregaDetalhada: ChartComponent;
>>>>>>> t-prime-desenv

  constructor(private restJiraService: RestJiraService, private thfAlert: ThfDialogService) {};

  ngOnInit() {
    
    this.now = new Date();
    var diaIni = 1
    var diaFim = ((new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0 )).getDate());
    var mes = this.now.getMonth();
    var ano = this.now.getFullYear();
    this.columnsGrid = this.getColumns();

    this.startDate = new Date(ano,mes,diaIni);
    this.endDate = new Date(ano,mes,diaFim);

    this.limpaTabela();  

    //Chart2
    this.categchart2 = this.getCategchart1();  
    //Chart6
    this.categchart6 = this.getCategchart6();
    //Chart7
    this.categchart7 = this.getCategchart1();
  }

  private getCategchart1(): Array<string> {
    return [ 'Privado e A.M.S', 'Público'];
  }
  private getCategchart6(): Array<string> {
    return [ 'Criados', 'Resolvidos'];
  } 
  private getSeriesChart2(dadosChart): Array<any> {
    return [
      { name: 'Criados', data: [dadosChart[0].criaXResolv.criPrivAms.total, dadosChart[0].criaXResolv.criPublic.total]},
      { name: 'Resolvidos', data: [dadosChart[0].criaXResolv.resPrivAms.total, dadosChart[0].criaXResolv.resPublic.total]}  
    ];
  }
  private getSeriesChart4(dadosChart): Array<any> {
    return [
      { name: '11', data: [dadosChart[1].abertasVersao[0].quant]},
      { name: '12.1.6', data: [dadosChart[1].abertasVersao[1].quant]},  
      { name: '12.1.7', data: [dadosChart[1].abertasVersao[2].quant]},
      { name: '12.1.16', data: [dadosChart[1].abertasVersao[3].quant]},
      { name: '12.1.17', data: [dadosChart[1].abertasVersao[4].quant]}
    ];
  }
  private getSeriesChart5(dadosChart): Array<any> {
    var dadosRet = [];
    dadosChart[4].entProjeto.sort(function(a,b){
      return (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : 0);
    });
    for (var _i = 0; dadosChart[4].entProjeto.length > _i && _i < 10; _i ++) {
      dadosRet.push({name: dadosChart[4].entProjeto[_i][0], data: [dadosChart[4].entProjeto[_i][1]] });
    }

  return dadosRet;
  }  
  private getSeriesChart6(dadosChart): Array<any> {
    return [{
      data: [{category: 'Criados', value: dadosChart[2].criaXResolvDataPrev.criDataPrev.total},
              {category: 'Resolvidos', value: dadosChart[2].criaXResolvDataPrev.resDataPrev.total}]
  }];
  }
  private getSeriesChart7(dadosChart): Array<any>{
    return [
      { name: 'Codificadas', data: [dadosChart[3].entDetalhada.codPrivAms.total, dadosChart[3].entDetalhada.codPublic.total]},
      { name: 'Retrabalho', data: [dadosChart[3].entDetalhada.retPrivAms.total, dadosChart[3].entDetalhada.retPublic.total]},
      { name: 'Rejeitadas', data: [dadosChart[3].entDetalhada.rejPrivAms.total, dadosChart[3].entDetalhada.rejPublic.total]},
      { name: 'Canceladas', data: [dadosChart[3].entDetalhada.canPrivAms.total, dadosChart[3].entDetalhada.canPublic.total]}
      
    ];
  }

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

  primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Fechar'
  };

  limpaTabela(){

    this.dadosChart = [
      {criaXResolv: {
          criPrivAms: {total: 0, issues: [ ]}, 
          criPublic: {total: 0, issues: [ ]}, 
          resPrivAms: {total: 0, issues: [ ]}, 
          resPublic: {total: 0, issues: [ ]} } 
      },
      {abertasVersao: [
        {versao: "11", quant: 0, issues: []},
        {versao: "12.1.6", quant: 0, issues: []},
        {versao: "12.1.7", quant: 0, issues: []},
        {versao: "12.1.16", quant: 0, issues: []},
        {versao: "12.1.17", quant: 0, issues: []},] },
      {criaXResolvDataPrev: {
        criDataPrev: {total: 0, issues: [ ]}, 
        resDataPrev: {total: 0, issues: [ ]} } },
      {entDetalhada: {
        codPrivAms: {total: 0, issues: [ ]}, 
        retPrivAms: {total: 0, issues: [ ]}, 
        rejPrivAms: {total: 0, issues: [ ]}, 
        canPrivAms: {total: 0, issues: [ ]}, 
        codPublic: {total: 0, issues: [ ]}, 
        retPublic: {total: 0, issues: [ ]}, 
        rejPublic: {total: 0, issues: [ ]}, 
        canPublic: {total: 0, issues: [ ]} } 
      },
      {entProjeto: []
      }
    ];
    
    this.serieschart2 = this.getSeriesChart2(this.dadosChart);
    this.serieschart4 = this.getSeriesChart4(this.dadosChart);
    this.serieschart6 = this.getSeriesChart6(this.dadosChart);
    this.serieschart7 = this.getSeriesChart7(this.dadosChart);

  }

  geraIndicadores() {
    if ( (this.startDate == undefined || this.endDate == undefined) || (this.startDate.toString() == "" || this.endDate.toString() == "") ){
      this.thfAlert.alert({title: "Campos obrigatorios!", message: "Preencha os campos de período."});
      return;
    }
    this.loadButton = true;
    this.isHideLoading = false;
    this.labelButton = "Gerando indicadores..." 

    this.limpaTabela();    
    var dataDe = new Date(this.startDate);
    var dataAte = new Date(this.endDate);
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter("59608").subscribe(response => this.getManut(response.jql, "CriPrivAms"));    
    this.restJiraService.getFilter("59609").subscribe(response => this.getManut(response.jql, "CriPublic"));    
    this.restJiraService.getFilter("59607").subscribe(response => this.getManut(response.jql, "ResPrivAms"));  
    this.restJiraService.getFilter("59606").subscribe(response => this.getManut(response.jql, "ResPublic"));  
    this.restJiraService.getFilter("59377").subscribe(response => this.getManut(response.jql, "abertasVersao"));  
    this.restJiraService.getFilter("59624").subscribe(response => this.getManut(response.jql, "CriDataPrev"));  
    this.restJiraService.getFilter("59625").subscribe(response => this.getManut(response.jql, "ResDataPrev"));  
    this.restJiraService.getFilter("59626").subscribe(response => this.getManut(response.jql, "CodPrivAms"));  
    this.restJiraService.getFilter("59629").subscribe(response => this.getManut(response.jql, "RetPrivAms"));  
    this.restJiraService.getFilter("59630").subscribe(response => this.getManut(response.jql, "RejPrivAms"));  
    this.restJiraService.getFilter("59631").subscribe(response => this.getManut(response.jql, "CanPrivAms"));  
    this.restJiraService.getFilter("59632").subscribe(response => this.getManut(response.jql, "CodPublic"));  
    this.restJiraService.getFilter("59634").subscribe(response => this.getManut(response.jql, "RetPublic"));  
    this.restJiraService.getFilter("59635").subscribe(response => this.getManut(response.jql, "RejPublic"));  
    this.restJiraService.getFilter("59633").subscribe(response => this.getManut(response.jql, "CanPublic"));
    this.restJiraService.getFilter("60607").subscribe(response => this.getManut(response.jql, "entProjeto", "key"));
        
  }
  getManut(filtro, chart , fields?: string) {

      var filtroEdit = filtro
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "startOfMonth()", "'"+this.startDate.toString().substring(0,10)+this.timeini+"'");
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "endOfMonth()", "'"+this.endDate.toString().substring(0,10)+this.timeFim+"'");

      this.restJiraService.getIssues(filtroEdit, fields).subscribe( response => { 
        var fimExecucao = this.restJiraService.AtualizaManut(response, this.dadosChart, chart, this.diasUteis);
        if (fimExecucao) {
          this.atualizaGrafico();
       } } );  
  }

  atualizaGrafico() {
    this.serieschart2 = this.getSeriesChart2(this.dadosChart);
    this.serieschart4 = this.getSeriesChart4(this.dadosChart);
    this.serieschart6 = this.getSeriesChart6(this.dadosChart);
    this.serieschart7 = this.getSeriesChart7(this.dadosChart);
    this.serieschart5 = this.getSeriesChart5(this.dadosChart);
    this.loadButton = false;
    this.isHideLoading = true;
    this.labelButton = "Gerar Indicadores";
  }

<<<<<<< HEAD
=======
  public pdf(){
    
    const content = new Group();

    var visualIssuesCriadas = this.IssuesCriadas.exportVisual({width:520,heigth:400});
    var visualIssuesAbertas = this.IssuesAbertas.exportVisual({width:520,heigth:400});
    var visualDataPrevCriados = this.DataPrevCriados.exportVisual({width:520,heigth:400});
    var visualEnrtregaDetalhada = this.EnrtregaDetalhada.exportVisual({width:520,heigth:400});
    var URIPDF;

    content.append(visualIssuesCriadas);
    content.append(visualIssuesAbertas);
    content.append(visualDataPrevCriados);
    content.append(visualEnrtregaDetalhada);

    exportPDF(content, {
      paperSize: "A4",
      title: "Indicadores Manutenção Prime - Backlog",
      landscape:false,
      multiPage: true,
      margin: { left: "1cm", top: "6cm", right: "0cm", bottom: "1cm" }
     }).then((dataURI) => {
       saveAs(dataURI, 'chart.pdf');
     });  
  }

>>>>>>> t-prime-desenv
  openModal(formData, chart) {
    
    var itemChart = "";
    var posItemChart;
    this.itemsGrid = [];

    if (chart == "criaXResolv") {
      posItemChart = 0;
      if (formData.category == "Privado e A.M.S") {
        itemChart = formData.series.name.toLowerCase().substring(0,3)+"PrivAms.";
      }else{
        itemChart = formData.series.name.toLowerCase().substring(0,3)+"Public.";
      }
    }else if (chart == "abertasVersao") {
      var pos = this.dadosChart[1].abertasVersao.map(function(e) { return e.versao; });
      chart = chart+"["+pos.indexOf(formData.series.name)+"]";
      posItemChart = 1;
    }else if (chart == "criaXResolvDataPrev") {
      itemChart = formData.category.toLowerCase().substring(0,3)+"DataPrev.";
      posItemChart = 2;      
    }else if (chart == "entDetalhada") {
      posItemChart = 3;
      if (formData.category == "Privado e A.M.S") {
        itemChart = formData.series.name.toLowerCase().substring(0,3)+"PrivAms.";
      }else{
        itemChart = formData.series.name.toLowerCase().substring(0,3)+"Public.";
      }

    }

    for (var _x = 0; eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues.length") > _x; _x++) {

      this.itemsGrid.push({
            issue:    eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].key"),
            nomeFant: eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.customfield_11071.value"),
            summary: eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.summary"),
            sla:      this.restJiraService.formatDate(eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.customfield_11080")),
            dtAcordo: this.restJiraService.formatDate(eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.customfield_11039")),
            dtPSLA:   this.restJiraService.formatDate(eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.customfield_11040")),
            reporter: eval("this.dadosChart[posItemChart]."+chart+"."+itemChart+"issues[_x].fields.reporter.displayName")
      });
    }
    this.thfModal.open();
  }

}
