import { Component, OnInit, ViewChild } from '@angular/core';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { RestJiraService } from '../rest-jira.service';
import { ThfGridColumn  } from '@totvs/thf-ui/components/thf-grid';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { Router } from '@angular/router';

// tslint:disable:max-line-length
// tslint:disable:no-switch-case-fall-through
// tslint:disable:member-ordering
// tslint:disable:no-eval

@Component({
  selector: 'app-backlogmanutprime',
  templateUrl: './backlogmanutprime.component.html',
  styleUrls: ['./backlogmanutprime.component.css'],
  providers: [RestJiraService]
})
export class BacklogmanutprimeComponent implements OnInit {

  @ViewChild(ThfModalComponent) thfModal: ThfModalComponent;

  itens: Array<any>; // Dados do backlog por analista
  issuesEmAprovacao = {testedeintegrado: {total: 0, issues: [ ]}, testedeunidade: {total: 0, issues: [ ]}}; // Guarda dados de issues em aprovação ( posição 0 = Teste de Unidade, posição 1 = Teste integrado )
  issuesPendentes = {privado: {backlogAvencer: {total: 0, issues: [ ]}, backlogPacemergenciais: {total: 0, issues: [ ]} , backlogVencidos: {total: 0, issues: [ ]}}, publico: {backlogAvencer: {total: 0, issues: [ ]}, backlogPacemergenciais: {total: 0, issues: [ ]} , backlogVencidos: {total: 0, issues: [ ]}}} ; // Guarda dados de issues em aprovação ( posição 0 = Teste de Unidade, posição 1 = Teste integrado )
  analist: Array<any> = ['', '', '', '', '', '', '', ''];
  usuarios: Array<any>; // Nome dos analistas dos itens
  tipo = 0; // (0 - Issues em aprovação ) (1 - Issues Pendentes) (2 - Issues por usuários)
  loading = false;
  qtdRequeste = 0;
  textButton = 'Gerar indicadores';
  isHideLoading = true;

  // Chart 1 Column
  categchart0: Array<string>;
  serieschart0: Array<ThfColumnChartSeries> ;

  // Chart 2 Pizza
  categchart00: Array<string>;
  serieschart00: Array<ThfPieChartSeries> ;

  // Gráficos por analista
  categchart1: Array<string>;
  serieschart: Array<any> = [[{}], [{}], [{}], [{}], [{}], [{}], [{}]];
  columns: Array<ThfTableColumn>;
  columnsGrid: Array<ThfGridColumn>;
  itemsGrid: Array<any>;


  constructor(
    public restJiraService: RestJiraService,
    private router: Router,
    private thfAlert: ThfDialogService ) {

    this.usuarios = this.getUsers();

   }

  ngOnInit() {

    this.limpaTabela();

  }
  //
  // Verifica se sessão do usuario está ativa
  //
  validaSessao() {

    this.loading = true;

    this.restJiraService.autenticar().subscribe(data => {
      this.gerarIndicadores();
    }, error => {
      this.thfAlert.alert({title: 'Sessão encerrada!', message: 'Por favor, refaça o login.', ok: () => this.router.navigate(['/login']) });
    });

  }
  //
  // Require principal pelos filtros
  //
  gerarIndicadores() {

    this.limpaTabela();
    this.textButton = 'Gerando indicadores...';
    this.isHideLoading = false;
    // Request dos totais de Indicadores Backlog público
    this.restJiraService.getFilter('59680').subscribe(response => this.getTest(response.jql, 'backlogAvencer', 0));
    this.restJiraService.getFilter('59665').subscribe(response => this.getTest(response.jql, 'backlogPacemergenciais', 0));
    this.restJiraService.getFilter('59666').subscribe(response => this.getTest(response.jql, 'backlogVencidos', 0));

    // Request dos totais de Indicadores Backlog privado
    this.restJiraService.getFilter('59679').subscribe(response => this.getTest(response.jql, 'backlogAvencer', 1));
    this.restJiraService.getFilter('59668').subscribe(response => this.getTest(response.jql, 'backlogPacemergenciais', 1));
    this.restJiraService.getFilter('59667').subscribe(response => this.getTest(response.jql, 'backlogVencidos', 1));

    // Request dos totais de Issues em aprovação
    this.restJiraService.getFilter('59375').subscribe(response => this.getTest(response.jql, 'testedeintegrado', 2));
    this.restJiraService.getFilter('59376').subscribe(response => this.getTest(response.jql, 'testedeunidade', 2));

    // Request de usuários
    this.restJiraService.getFilter('59121').subscribe(response => this.getTest(response.jql, 'avencer', 3));
    this.restJiraService.getFilter('59123').subscribe(response => this.getTest(response.jql, 'pacemergenciais', 3));
    this.restJiraService.getFilter('59124').subscribe(response => this.getTest(response.jql, 'vencidos', 3));
    this.restJiraService.getFilter('59129').subscribe(response => this.getTest(response.jql, 'abertasmais30dias', 3));
  }
  //
  // Require dos jql dos filtros.
  //
  getTest(filtro, campo, tipo) {
    switch (tipo) {
      case 0:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          const fim = this.restJiraService.atualizaBacklog(response, this.issuesPendentes, [], campo, tipo);
          if (fim === 15) {
              this.refresChart(tipo);
            }
           }
         );
      case 1:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          const fim = this.restJiraService.atualizaBacklog(response, this.issuesPendentes, [], campo, tipo);
          if (fim === 15) {
              this.refresChart(tipo);
            }
           }
         );
        break;
      case 2:
        this.restJiraService.getIssues(filtro).subscribe( response => {
          const fim = this.restJiraService.atualizaBacklog(response, this.issuesEmAprovacao, [], campo, tipo) ;
          if (fim === 15) {
              this.refresChart(tipo);
            }
           }
         );
        break;
      case 3:
         this.restJiraService.getIssues(filtro).subscribe( response => {
          const fim = this.restJiraService.atualizaBacklog(response, this.itens, this.usuarios, campo, tipo);
            if (fim === 15) {
              this.refresChart(tipo);
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
  limpaTabela() {
    this.itens = this.getUsers();
    this.qtdRequeste = 0;

    for (let cont = 0; cont < this.itens.length; ++cont) {
      this.analist[cont] = this.itens[cont].analista;
      this.serieschart[cont] = this.getSeriesChart(null, true);
    }

    this.categchart0 = [ 'Privado e A.M.S', 'Público'];
    this.serieschart0 = this.getSeriesChart0(true);

    this.categchart00 = [ 'Teste de Unidade', 'Teste Integrado'];
    this.serieschart00 = this.getSeriesChart00(true);
    if (this.qtdRequeste === 15) {
      document.getElementById('chart1').click();
    }

  }
  //
  // Retorna objeto com os dados dos analistas
  //
  getUsers() {
     return [
      { analista: 'Diogo Saravando', user: 'diogo.vieira',       avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Eduardo Martinez',      user: 'eduardo.martinez',   avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Evandro Pattaro',     user: 'evandro.pattaro',    avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'João Balbino',      user: 'joao.balbino',       avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Julio Santos',   user: 'julio.silva',        avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Vitor Pires',                      user: 'vitor.pires',        avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Wesley Lossani',                   user: 'wesley.lossani',     avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} },
      { analista: 'Eder Oliveira',                   user: 'oliveira.eder',     avencer: {total: 0, issues: [ ]}, pacemergenciais: {total: 0, issues: [ ]}, vencidos: {total: 0, issues: [ ]}, totalbacklog: {total: 0, issues: [ ]}, abertasmais30dias: {total: 0, issues: [ ]} }
    ];
  }
  //
  // Atualiza os componentes gráficos.
  //
  refresChart(tipo) {

    this.serieschart0 = this.getSeriesChart0(false);
    this.serieschart00 = this.getSeriesChart00(false);
    for (let cont = 0; cont < this.itens.length; ++cont) {
       this.serieschart[cont] = this.getSeriesChart(this.itens[cont], false);
    }
    this.loading = false;
    this.isHideLoading = true;
    this.textButton = 'Gerar indicadores';
  }
  //
  // Atualiza SeriesChart dos componentes.
  //
  getSeriesChart(item, limpa) {
    if (limpa) {
      return [
              { name: 'À Vencer', data: [0]},
              { name: 'Pacotes Emergenciais', data: [0] },
              { name: 'Vencidos', data: [0] },
              { name: 'Total', data: [0] },
              { name: 'Abertas > 30 Dias', data: [0] }
             ];
    } else {
      return[
              { name: 'À Vencer', data: [item.avencer.total]},
              { name: 'Pacotes Emergenciais', data: [item.pacemergenciais.total] },
              { name: 'Vencidos', data: [item.vencidos.total] },
              { name: 'Total', data: [item.totalbacklog.total] },
              { name: 'Abertas > 30 Dias', data: [item.abertasmais30dias.total] }
            ];
    }
  }

  getSeriesChart00(limpa) {
    if (limpa) {
      return [ {data: [{category: 'Teste de Unidade', value: 0},
      {category: 'Teste integrado', value: 0}] }];
    } else {
      return [ {data: [{category: 'Teste de Unidade', value: this.issuesEmAprovacao.testedeunidade.total},
      {category: 'Teste integrado', value: this.issuesEmAprovacao.testedeintegrado.total}] }];
    }
  }

  getSeriesChart0(limpa) {
    if (limpa) {
      return [
              { name: 'À Vencer', data: [0, 0]},
              { name: 'Pacotes Emergenciais', data: [0, 0] },
              { name: 'Vencidos', data: [0, 0] }
            ];
    } else {
      return[
              { name: 'À Vencer', data: [this.issuesPendentes.privado.backlogAvencer.total, this.issuesPendentes.publico.backlogAvencer.total]},
              { name: 'Pacotes Emergenciais', data: [this.issuesPendentes.privado.backlogPacemergenciais.total, this.issuesPendentes.publico.backlogPacemergenciais.total] },
              { name: 'Vencidos', data: [this.issuesPendentes.privado.backlogVencidos.total, this.issuesPendentes.publico.backlogVencidos.total] }
            ];
    }
  }

  getColumns(chart): Array<ThfGridColumn> {

    const colunas = [];
      colunas.push({ column: 'issue', label: 'Issue', type: 'string', width: 18});
      colunas.push({ column: 'nomeFant', label: 'Nome Fantasia', type: 'string', width: 27});
      colunas.push({ column: 'summary', label: 'Summary' , type: 'string', width: 31});
      if (chart === 'issuesPendentes') {
        colunas.push({ column: 'assignee', label: 'Assignee', type: 'string', width: 15 });
      } else if (chart === 'issuesEmAprovacao') {
        colunas.push({ column: 'modulo', label: 'Módulo', type: 'string', width: 15 });
      }
      colunas.push({ column: 'sla', label: 'SLA', type: 'date', width: 13});
      colunas.push({ column: 'dtAcordo', label: 'Dt. Acordo', type: 'date', width: 13});
      colunas.push({ column: 'dtPSLA', label: 'Pausa SLA', type: 'date', width: 13});
      colunas.push({ column: 'reporter', label: 'Reporter', type: 'string', width: 15 });

    return colunas;
  }


  primaryAction: ThfModalAction = {
    action: () => {
      this.thfModal.close();
    },
    label: 'Fechar'
  };

  openModal(formData, usuario, chart) {

    let serie = '';
    this.columnsGrid = this.getColumns(chart);
    this.itemsGrid = [];

    if (this.restJiraService.detectarMobile()) {
      return;
    }

    if (chart === 'issuesEmAprovacao') {
      if (formData.category === 'Teste de Unidade') {
        serie = 'testedeunidade';
      } else {
        serie = 'testedeintegrado';
      }
    } else if (chart === 'issuesPendentes') {
      if (formData.category === 'Privado e A.M.S') {
        switch (formData.series.name) {
          case 'À Vencer': {
            serie = 'privado.backlogAvencer';
            break;
          }
          case 'Pacotes Emergenciais': {
            serie = 'privado.backlogPacemergenciais';
            break;
          }
          case 'Vencidos': {
            serie = 'privado.backlogVencidos';
            break;
          }
          default:
            break;
        }
      } else if (formData.category === 'Público') {
        switch (formData.series.name) {
          case 'À Vencer': {
            serie = 'publico.backlogAvencer';
            break;
          }
          case 'Pacotes Emergenciais': {
            serie = 'publico.backlogPacemergenciais';
            break;
          }
          case 'Vencidos': {
            serie = 'publico.backlogVencidos';
            break;
          }
          default:
            break;
        }
      }
    } else if (chart === 'itens') {
      switch (formData.series.name) {
        case 'À Vencer': {
          serie = 'avencer';
          break;
        }
        case 'Pacotes Emergenciais': {
          serie = 'pacemergenciais';
          break;
        }
        case 'Vencidos': {
          serie = 'vencidos';
          break;
        }
        case 'Total': {
          serie = 'totalbacklog';
          break;
        }
        case 'Abertas > 30 Dias': {
          serie = 'abertasmais30dias';
          break;
        }
        default:
          break;
      }
    }
    if (chart === 'itens') {

      for (let _i = 0; this.usuarios.length > _i; _i++) {
        if (this.usuarios[_i].analista === usuario) {
          for (let _x = 0; eval('this.' + chart + '[_i].' + serie + '.issues.length') > _x; _x++) {
            this.itemsGrid.push({
              issue:    this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].key'),
              nomeFant: this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.customfield_11071.value'),
              summary: this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.summary'),
              sla:      this.restJiraService.formatDate(this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.customfield_11080')),
              dtAcordo: this.restJiraService.formatDate(this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.customfield_11039')),
              dtPSLA:   this.restJiraService.formatDate(this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.customfield_11040')),
              reporter: this.validaCampo('this.' + chart + '[' + _i + ']' + '.' + serie + '.issues[' + _x + '].fields.reporter.displayName')
            });
          }
        }
      }
    } else {

      let nameAssignee = '';

      for (let _x = 0; eval('this.' + chart + '.' + serie + '.issues.length') > _x; _x++) {
        if (chart === 'issuesPendentes') {
          if (this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.assignee') !== undefined) {
            nameAssignee = this.restJiraService.ReplaceAll(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.assignee.name'), '.', ' ', false);
          } else {
            nameAssignee = 'Unassigned';
          }

          this.itemsGrid.push({
          issue:    this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].key'),
          nomeFant: this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11071.value'),
          summary: this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.summary'),
          assignee: nameAssignee,
          sla:      this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11080')),
          dtAcordo: this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11039')),
          dtPSLA:   this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11040')),
          reporter: this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.reporter.displayName')
          });
        } else if (chart === 'issuesEmAprovacao') {
          this.itemsGrid.push({
          issue:    this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].key'),
          nomeFant: this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11071.value'),
          summary:  this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.summary'),
          modulo:   this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11069.value'),
          sla:      this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11080')),
          dtAcordo: this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11039')),
          dtPSLA:   this.restJiraService.formatDate(this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.customfield_11040')),
          reporter: this.validaCampo('this.' + chart + '.' + serie + '.issues[' + _x + '].fields.reporter.displayName')
          });
        }
      }

    }
    this.thfModal.open();

  }

  changeEvent(component) {
    console.log(component);
  }

  validaCampo(valor) {

    let retorno = '';

    try {
      retorno = eval(valor);
      return retorno;
    } catch (error) {
      console.log(error);
      return retorno;
    }

  }

}
