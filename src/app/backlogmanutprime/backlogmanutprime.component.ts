import { Component, OnInit } from '@angular/core';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';

@Component({
  selector: 'app-backlogmanutprime',
  templateUrl: './backlogmanutprime.component.html',
  styleUrls: ['./backlogmanutprime.component.css'],
  providers: [RestJiraService]
})
export class BacklogmanutprimeComponent implements OnInit {

  
  itens: Array<any>; // Dados do backlog por analista
  issuesEmAprovacao = {testedeintegrado:0, testedeunidade:0}; // Guarda dados de issues em aprovação ( posição 0 = Teste de Unidade, posição 1 = Teste integrado )
  issuesPendentes = {privado:{backlogAvencer:0, backlogPacemergenciais:0 , backlogVencidos:0},publico:{backlogAvencer:0, backlogPacemergenciais:0 , backlogVencidos:0}} ; // Guarda dados de issues em aprovação ( posição 0 = Teste de Unidade, posição 1 = Teste integrado )
  analist: Array<any> = ["","","","","","","","","",];
  usuarios: Array<any>; // Nome dos analistas dos itens
  tipo: number = 0; // (0 - Issues em aprovação ) (1 - Issues Pendentes) (2 - Issues por usuários) 
  loading: boolean = false;
  qtdRequeste: number = 0;
  textButton: string = "Gerar indicadores";
  
  //Chart 1 Column
  categchart0: Array<string>;
  serieschart0: Array<ThfColumnChartSeries> ;

  //Chart 2 Pizza 
  categchart00: Array<string>;
  serieschart00: Array<ThfPieChartSeries> ;

  // Gráficos por analista
  categchart1: Array<string>;
  serieschart: Array<any> = [[{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}], [{}]]; 
  columns: Array<ThfTableColumn>;

  
  constructor(public restJiraService: RestJiraService ) {

    this.usuarios = this.getUsers()

   }
 
  ngOnInit() {
    
    this.limpaTabela()

  }
  //
  // Require principal pelos filtros 
  //
  gerarIndicadores() {
   
    this.limpaTabela();
    this.loading = true;
    this.textButton = "Gerando indicadores..." 
    // Request dos totais de Indicadores Backlog público
    this.restJiraService.getFilter("59680").subscribe(response => this.getTest(response.jql, "backlogAvencer",0));
    this.restJiraService.getFilter("59665").subscribe(response => this.getTest(response.jql, "backlogPacemergenciais",0));
    this.restJiraService.getFilter("59666").subscribe(response => this.getTest(response.jql, "backlogVencidos",0));

    // Request dos totais de Indicadores Backlog privado
    this.restJiraService.getFilter("59679").subscribe(response => this.getTest(response.jql, "backlogAvencer",1));
    this.restJiraService.getFilter("59668").subscribe(response => this.getTest(response.jql, "backlogPacemergenciais",1));
    this.restJiraService.getFilter("59667").subscribe(response => this.getTest(response.jql, "backlogVencidos",1));

    // Request dos totais de Issues em aprovação 
    this.restJiraService.getFilter("59375").subscribe(response => this.getTest(response.jql, "testedeintegrado",2));
    this.restJiraService.getFilter("59376").subscribe(response => this.getTest(response.jql, "testedeunidade",2));

    // Request de usuários
    this.restJiraService.getFilter("59121").subscribe(response => this.getTest(response.jql, "avencer",3));
    this.restJiraService.getFilter("59123").subscribe(response => this.getTest(response.jql, "pacemergenciais",3));
    this.restJiraService.getFilter("59124").subscribe(response => this.getTest(response.jql, "vencidos",3));
    this.restJiraService.getFilter("59129").subscribe(response => this.getTest(response.jql, "abertasmais30dias",3));
  }
  //
  // Require dos jql dos filtros.
  //
  getTest(filtro, campo, tipo) {
    switch (tipo) {
      case 0:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          var fim = this.restJiraService.atualizaBacklog(response, this.issuesPendentes,[], campo, tipo) 
          if (fim == 15) {
              this.refresChart(tipo)
            }
           }
         );
      case 1:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          var fim = this.restJiraService.atualizaBacklog(response, this.issuesPendentes,[], campo, tipo) 
          if (fim == 15) {
              this.refresChart(tipo)
            }
           }
         );
        break;
      case 2:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          var fim = this.restJiraService.atualizaBacklog(response, this.issuesEmAprovacao,[], campo, tipo) 
          if (fim == 15) {
              this.refresChart(tipo)
            }
           }
         );
        break;
      case 3:
         this.restJiraService.getIssues(filtro).subscribe( response => {
          var fim = this.restJiraService.atualizaBacklog(response, this.itens, this.usuarios, campo,tipo) 
            if (fim == 15) {
              this.refresChart(tipo)
            }
           }
         );
        break;
      default:
        break;
    }
    
    
  }
  //
  // Zera os dados 
  //
  limpaTabela(){
    this.itens = this.getUsers()
    this.qtdRequeste = 0 

    for (var cont = 0; cont < this.itens.length; ++cont) {
      this.analist[cont] = this.itens[cont].analista;
      this.serieschart[cont] = this.getSeriesChart(null,true)
    }

    this.categchart0 = [ 'Privado e A.M.S', 'Público']
    this.serieschart0 = this.getSeriesChart0(true)

    this.categchart00 = [ 'Teste de Unidade', 'Teste Integrado']
    this.serieschart00 = this.getSeriesChart00(true)
    if(this.qtdRequeste == 15){
      document.getElementById("chart1").click();
    }

  }
  //
  // Retorna objeto com os dados dos analistas
  //
  getUsers(){
     return [
      { analista: 'Diogo Saravando', user: 'diogo.vieira',       avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Eduardo Martinez',      user: 'eduardo.martinez',   avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Evandro Pattaro',     user: 'evandro.pattaro',    avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'João Balbino',      user: 'joao.balbino',       avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Julio Santos',   user: 'julio.silva',        avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Leonardo Barbosa',       user: 'leonardo.magalhaes', avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 }, 
      { analista: 'Tiago Bertolo',                    user: 'tiago.bertolo',      avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Vitor Pires',                      user: 'vitor.pires',        avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },      
      { analista: 'Wesley Lossani',                   user: 'wesley.lossani',     avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 },
      { analista: 'Yuri Porto',                 user: 'yuri.porto',         avencer: 0, pacemergenciais: 0, vencidos: 0, totalbacklog: 0, abertasmais30dias: 0 }, 
      
    ];
  }
  //
  // Atualiza os componentes gráficos.
  //
  refresChart(tipo){
    
    this.serieschart0 = this.getSeriesChart0(false);
    this.serieschart00 = this.getSeriesChart00(false);
    for (var cont = 0; cont < this.itens.length; ++cont) {
       this.serieschart[cont] = this.getSeriesChart(this.itens[cont],false);
    }
    this.loading = false;
    this.textButton = "Gerar indicadores"
  }
  //
  // Atualiza SeriesChart dos componentes. 
  //
  getSeriesChart(item,limpa){
    if (limpa) { 
      return [
              { name: 'À Vencer', data: [0]},
              { name: 'Pacotes Emergenciais', data: [0] },
              { name: 'Vencidos', data: [0] },  
              { name: 'Total ', data: [0] },  
              { name: 'Abertas > 30 Dias ', data: [0] }  
             ];
    } else {
      return[
              { name: 'À Vencer', data: [item.avencer]},
              { name: 'Pacotes Emergenciais', data: [item.pacemergenciais] },
              { name: 'Vencidos', data: [item.vencidos] },  
              { name: 'Total ', data: [item.totalbacklog] },  
              { name: 'Abertas > 30 Dias ', data: [item.abertasmais30dias] }  
            ]; 
    }
  }

  getSeriesChart00(limpa){
    if (limpa) { 
      return [ {data: [{category: 'Teste de Unidade', value: 0},
      {category: 'Teste integrado', value: 0}] }]; 
    } else {
      return [ {data: [{category: 'Teste de Unidade', value: this.issuesEmAprovacao.testedeunidade},
      {category: 'Teste integrado', value: this.issuesEmAprovacao.testedeintegrado}] }];
    }
  }

  getSeriesChart0(limpa){
    if (limpa) { 
      return [
              { name: 'À Vencer', data: [0,0]},
              { name: 'Pacotes Emergenciais', data: [0,0] },
              { name: 'Vencidos', data: [0,0] } 
            ]
    } else {
      return[
              { name: 'À Vencer', data: [this.issuesPendentes.privado.backlogAvencer,this.issuesPendentes.publico.backlogAvencer]},
              { name: 'Pacotes Emergenciais', data: [this.issuesPendentes.privado.backlogPacemergenciais,this.issuesPendentes.publico.backlogPacemergenciais] },
              { name: 'Vencidos', data: [this.issuesPendentes.privado.backlogVencidos,this.issuesPendentes.publico.backlogVencidos] } 
            ]
    }
  }
  changeEvent(component){
    console.log(component);
  }

}