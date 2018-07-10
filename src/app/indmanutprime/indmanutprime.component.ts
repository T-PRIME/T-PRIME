import { Component, OnInit } from '@angular/core';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { ThfSelectOption, ThfCheckboxGroupOption } from '@totvs/thf-ui/components/thf-field';
import { RestJiraService } from '../rest-jira.service';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';



@Component({
  selector: 'app-indmanutprime',
  templateUrl: './indmanutprime.component.html',
  styleUrls: ['./indmanutprime.component.css'],
  providers: [RestJiraService]
})
export class IndmanutprimeComponent implements OnInit {
  
  loadButton = false;
  labelButton = "Gerar Indicadores";
  //Chart 2 Column
  categchart2: Array<string>;
  serieschart2: Array<ThfColumnChartSeries>;
  //Chart 4 Column
  serieschart4: Array<ThfColumnChartSeries>;  
  //Chart 6 Pie
  categchart6: Array<string>;
  serieschart6: Array<ThfPieChartSeries>;
  //Chart 1 Column
  categchart7: Array<string>;
  serieschart7: Array<ThfColumnChartSeries>;  

  startDate: string;
  endDate: string;
  diasUteis: number;
  dadosChart: Array<any>;

  constructor(private restJiraService: RestJiraService, private thfAlert: ThfDialogService) {};

  ngOnInit() {

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
  private getSeriesChart2(dadosChart): Array<ThfColumnChartSeries> {
    return [
      { name: 'Criados', data: [dadosChart[0].criaXResolv.criadasPrivAms, dadosChart[0].criaXResolv.criadasPublic] },
      { name: 'Resolvidos', data: [dadosChart[0].criaXResolv.resolvPrivAms, dadosChart[0].criaXResolv.resolvPublic] }  
    ];
  }
  private getSeriesChart4(dadosChart): Array<ThfColumnChartSeries> {
    return [
      { name: 'P11', data: [dadosChart[1].abertasVersao[0].quant] },
      { name: 'P12.1.6', data: [dadosChart[1].abertasVersao[1].quant] },  
      { name: 'P12.1.7', data: [dadosChart[1].abertasVersao[2].quant] },
      { name: 'P12.1.16', data: [dadosChart[1].abertasVersao[3].quant] },
      { name: 'P12.1.17', data: [dadosChart[1].abertasVersao[4].quant] }
    ];
  }
  private getSeriesChart6(dadosChart): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'Criados', value: dadosChart[2].criaXResolvDataPrev.criadasDataPrev},
              {category: 'Resolvidos', value: dadosChart[2].criaXResolvDataPrev.resolvDataPrev,}]
  }];
  }
  private getSeriesChart7(dadosChart): Array<ThfColumnChartSeries> {
    return [
      { name: 'Codificadas', data: [dadosChart[3].entDetalhada.codPrivAms, dadosChart[3].entDetalhada.codPublic] },
      { name: 'Retrabalho', data: [dadosChart[3].entDetalhada.retPrivAms, dadosChart[3].entDetalhada.retPublic] },
      { name: 'Rejeitadas', data: [dadosChart[3].entDetalhada.rejPrivAms, dadosChart[3].entDetalhada.rejPublic] },
      { name: 'Canceladas', data: [dadosChart[3].entDetalhada.cancPrivAms, dadosChart[3].entDetalhada.cancPublic] }
      
    ];
  }
  limpaTabela(){

    this.dadosChart = [
      { criaXResolv: {criadasPrivAms: 0, criadasPublic: 0, resolvPrivAms: 0, resolvPublic: 0 } },
      { abertasVersao: [{versao: "11", quant: 0},
                        {versao: "12.1.6", quant: 0},
                        {versao: "12.1.7", quant: 0},
                        {versao: "12.1.16", quant: 0},
                        {versao: "12.1.17", quant: 0},] },
      { criaXResolvDataPrev: {criadasDataPrev: 0, resolvDataPrev: 0 } },
      {entDetalhada: {codPrivAms: 0, retPrivAms: 0, rejPrivAms: 0, cancPrivAms: 0, codPublic: 0, retPublic: 0, rejPublic: 0, cancPublic: 0 } }
      ];
    
    this.serieschart2 = this.getSeriesChart2(this.dadosChart);
    this.serieschart4 = this.getSeriesChart4(this.dadosChart);
    this.serieschart6 = this.getSeriesChart6(this.dadosChart);
    this.serieschart7 = this.getSeriesChart7(this.dadosChart);

  }

  geraIndicadores() {
    
    if (this.startDate == undefined || this.endDate == undefined) {
      this.thfAlert.alert({title: "Campos obrigatorios!", message: "Preencha os campos de período."});
      return;
    }
    this.loadButton = true;
    this.labelButton = "Carregando resultados..."

    this.limpaTabela();    
    var dataDe = new Date(this.startDate.substring(0,10));
    var dataAte = new Date(this.endDate.substring(0,10));
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    this.restJiraService.getFilter("59608").subscribe(response => this.getManut(response.jql, "CriadasPrivAms"));    
    this.restJiraService.getFilter("59609").subscribe(response => this.getManut(response.jql, "CriadasPublic"));    
    this.restJiraService.getFilter("59607").subscribe(response => this.getManut(response.jql, "ResolvPrivAms"));  
    this.restJiraService.getFilter("59606").subscribe(response => this.getManut(response.jql, "ResolvPublic"));  
    this.restJiraService.getFilter("59377").subscribe(response => this.getManut(response.jql, "abertasVersao"));  
    this.restJiraService.getFilter("59624").subscribe(response => this.getManut(response.jql, "CriadasDataPrev"));  
    this.restJiraService.getFilter("59625").subscribe(response => this.getManut(response.jql, "ResolvDataPrev"));  
    this.restJiraService.getFilter("59626").subscribe(response => this.getManut(response.jql, "CodPrivAms"));  
    this.restJiraService.getFilter("59629").subscribe(response => this.getManut(response.jql, "RetPrivAms"));  
    this.restJiraService.getFilter("59630").subscribe(response => this.getManut(response.jql, "RejPrivAms"));  
    this.restJiraService.getFilter("59631").subscribe(response => this.getManut(response.jql, "CancPrivAms"));  
    this.restJiraService.getFilter("59632").subscribe(response => this.getManut(response.jql, "CodPublic"));  
    this.restJiraService.getFilter("59634").subscribe(response => this.getManut(response.jql, "RetPublic"));  
    this.restJiraService.getFilter("59635").subscribe(response => this.getManut(response.jql, "RejPublic"));  
    this.restJiraService.getFilter("59633").subscribe(response => this.getManut(response.jql, "CancPublic"));
        
  }
  getManut(filtro, chart) {

      var filtroEdit = filtro
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "startOfMonth()", this.startDate.substring(0,10));
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, "endOfMonth()", this.endDate.substring(0,10));

      this.restJiraService.getIssues(filtroEdit).subscribe( response => { 
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
    this.loadButton = false;
    this.labelButton = "Gerar Indicadores";
  }

  onbotao1() {
    
  }
}
