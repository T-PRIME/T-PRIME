import { Component, OnInit } from '@angular/core';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { ThfSelectOption, ThfCheckboxGroupOption } from '@totvs/thf-ui/components/thf-field';



@Component({
  selector: 'app-indmanutprime',
  templateUrl: './indmanutprime.component.html',
  styleUrls: ['./indmanutprime.component.css']
})
export class IndmanutprimeComponent implements OnInit {
  
  //Chart 1 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;  
  //Chart 2 Column
  categchart2: Array<string>;
  serieschart2: Array<ThfColumnChartSeries>;
  //Chart 3 Pie
  categchart3: Array<string>;
  serieschart3: Array<ThfPieChartSeries>;
  //Chart 4 Column
  serieschart4: Array<ThfColumnChartSeries>;  
  //Chart 5 Column
  serieschart5: Array<ThfColumnChartSeries>;
  //Chart 6 Pie
  categchart6: Array<string>;
  serieschart6: Array<ThfPieChartSeries>;
  //Chart 1 Column
  categchart7: Array<string>;
  serieschart7: Array<ThfColumnChartSeries>;  

  ngOnInit() {
    //Chart1
    this.categchart1 = this.getCategchart1();
    this.serieschart1 = this.getSeriesChart1();    
    //Chart2
    this.categchart2 = this.getCategchart1();
    this.serieschart2 = this.getSeriesChart2();
    //Chart3
    this.categchart3 = this.getCategchart3();
    this.serieschart3 = this.getSeriesChart3();    
    //Chart4
    this.serieschart4 = this.getSeriesChart4();    
    //Chart5
    this.serieschart5 = this.getSeriesChart5();
    //Chart6
    this.categchart6 = this.getCategchart6();
    this.serieschart6 = this.getSeriesChart6();
    //Chart7
    this.categchart7 = this.getCategchart1();
    this.serieschart7 = this.getSeriesChart7(); 
  }

  private getCategchart1(): Array<string> {
    return [ 'Privado e A.M.S', 'Público'];
  }
  private getCategchart3(): Array<string> {
    return [ 'Teste de Unidade', 'Teste Integrado'];
  }  
  private getCategchart6(): Array<string> {
    return [ 'Criados', 'Resolvidos'];
  } 
  private getSeriesChart1(): Array<ThfColumnChartSeries> {
    return [
      { name: 'A Vencer', data: [3,5]},
      { name: 'Pacotes Emergenciais', data: [4,6] },
      { name: 'Vencidos', data: [2,7] }
      
    ];
  }
  private getSeriesChart2(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Criados', data: [8,5] },
      { name: 'Resolvidos', data: [9,6] }  
    ];
  }
  private getSeriesChart3(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'Teste de Unidade', value: 150},
              {category: 'Teste integrado', value: 300}]
  }];
  }
  private getSeriesChart4(): Array<ThfColumnChartSeries> {
    return [
      { name: 'P11', data: [8] },
      { name: 'P12.1.6', data: [9] },  
      { name: 'P12.1.7', data: [9] },
      { name: 'P12.1.16', data: [9] },
      { name: 'P12.1.17', data: [9] }
    ];
  }
  private getSeriesChart5(): Array<ThfColumnChartSeries> {
    return [
      { name: 'A Vencer', data: [8] },
      { name: 'Pacotes Emergenciais', data: [9] },  
      { name: 'Vencidos', data: [9] }
      
    ];
  }
  private getSeriesChart6(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'Criados', value: 50},
              {category: 'Resolvidos', value: 200,}]
  }];
  }
  private getSeriesChart7(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Codificadas', data: [3,5] },
      { name: 'Retrabalho', data: [4,6] },
      { name: 'Rejeitadas', data: [2,7] },
      { name: 'Associadas', data: [2,7] },
      { name: 'Canceladas', data: [2,7] }
      
    ];
  }
}
