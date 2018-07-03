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
  itens: Array<any>;
  analist: Array<any> = ["","","","","","","","","",];

  //Chart 1 Column
  categchart0: Array<string>;
  serieschart0: Array<ThfColumnChartSeries> ;

  categchart00: Array<string>;
  serieschart00: Array<ThfPieChartSeries> ;


  categchart1: Array<string>;
  serieschart: Array<any> = [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]]; 
  usuarios: Array<any>;
  //jqlFiltro: Filtro[];
  public teste: any;

  constructor(public restJiraService: RestJiraService ) {

    this.usuarios = this.getUsers()

   }
 
  ngOnInit() {

    this.limpaTabela()

  }
  
  gerarIndicadores() {
    
    this.limpaTabela();

    this.restJiraService.getFilter("59375").end(response => this.getTest(response.body.jql, "testedeintegrado"));
    this.restJiraService.getFilter("59376").end(response => this.getTest(response.body.jql, "testedeunidade"));

    this.restJiraService.getFilter("59121").end(response => this.getTest(response.body.jql, "avencer"));
    this.restJiraService.getFilter("59123").end(response => this.getTest(response.body.jql, "pacemergenciais"));
    this.restJiraService.getFilter("59124").end(response => this.getTest(response.body.jql, "vencidos"));
    this.restJiraService.getFilter("59129").end(response => this.getTest(response.body.jql, "abertasmais30dias"));
    
  }

    getTest(filtro, campo) {

      this.restJiraService.getIssues(filtro).end( response => {
        var fim = this.restJiraService.atualizaBacklog(response, this.itens, this.usuarios, campo) 
          if (fim) {
            this.refresChart()
          }
        }
     );
  }

  limpaTabela(){

    this.itens = this.getUsers()

    for (var cont = 0; cont < this.itens.length; ++cont) {
      this.analist[cont] = this.itens[cont].analista;
      this.serieschart[cont] = this.getSeriesChart(null)
    }

    this.categchart0 = [ 'Privado e A.M.S', 'Público']
    this.serieschart0 = [
      { name: 'A Vencer', data: [0,0]},
      { name: 'Pacotes Emergenciais', data: [0,0] },
      { name: 'Vencidos', data: [0,0] } 
    ]

    this.categchart00 = [ 'Teste de Unidade', 'Teste Integrado']
    this.serieschart00 = [{
                            data: [{category: 'Teste de Unidade', value: 0},
                            {category: 'Teste integrado', value: 0}]
                         }];
       

  }
  getUsers(){
     return [
      { analista: 'Diogo Francisco Vieira Saravando', user: 'diogo.vieira',       avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Eduardo Karpischek Martinez',      user: 'eduardo.martinez',   avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Evandro Luis Barbosa Pattaro',     user: 'evandro.pattaro',    avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'João Paulo de Souza Balbino',      user: 'joao.balbino',       avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Julio Fernando da Silva Santos',   user: 'julio.silva',        avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Leonardo Magalhães Barbosa',       user: 'leonardo.magalhaes', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 }, 
      { analista: 'Tiago Bertolo',                    user: 'tiago.bertolo',      avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Vitor Pires',                      user: 'vitor.pires',        avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },      
      { analista: 'Wesley Lossani',                   user: 'wesley.lossani',     avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Yuri Milan Porto',                 user: 'yuri.porto',         avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 }, 
      
    ];
  }

  refresChart(){
    //console.log(this.itens.length)
    for (var cont = 0; cont < this.itens.length; ++cont) {
      this.serieschart[cont] = this.getSeriesChart(this.itens[cont])
    }

    this.serieschart00 = [{
                            data: [{category: 'Teste de Unidade', value: 150},
                            {category: 'Teste integrado', value: 200}]
                         }];
    this.serieschart0 = [
      { name: 'A Vencer', data: [1,2]},
      { name: 'Pacotes Emergenciais', data: [3,4] },
      { name: 'Vencidos', data: [5,6] } 
    ]

  }

  getSeriesChart(item: object){

    var retorno = [
      { name: 'Á vencer', data: [0]},
      { name: 'Pacotes Emergenciais', data: [0] },
      { name: 'Vencidos', data: [0] },  
      { name: 'Total ', data: [0] },  
      { name: 'Abertas > 30 Dias ', data: [0] }  
      ];
    if (item != null) {
      
      retorno = [
      { name: 'Á vencer', data: [item.avencer]},
      { name: 'Pacotes Emergenciais', data: [item.pacemergenciais] },
      { name: 'Vencidos', data: [item.vencidos] },  
      { name: 'Total ', data: [item.totalbacklog] },  
      { name: 'Abertas > 30 Dias ', data: [item.abertasmais30dias] }  
      ]; 
    }

    return retorno
  }

}