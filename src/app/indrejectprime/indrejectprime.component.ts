import { Component, OnInit } from '@angular/core';
import { RestJiraService } from '../rest-jira.service';
import { ThfGridColumn  } from '@totvs/thf-ui/components/thf-grid';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { Router } from '@angular/router';

// tslint:disable:member-ordering
// tslint:disable:max-line-length
// tslint:disable:no-eval

@Component({
  selector: 'app-indretrabprime',
  templateUrl: './indrejectprime.component.html',
  styleUrls: ['./indrejectprime.component.css']
})
export class IndrejectprimeComponent implements OnInit {

  loadButton = false;
  isHideLoading = true;
  labelButton = 'Gerar Indicadores';
  columnsGrid: Array<ThfGridColumn>; // Colunas do grid
  itemsGrid: Array<any> = []; // Itens do grid
  serieschart1: Array<any> = []; // Series grafico Rejeições por Analista
  serieschart2: Array<any> = []; // Series grafico Rejeições por Módulo
  startDate: Date;
  endDate: Date;
  diasUteis: number;
  timeini = ' 00:00';
  timeFim = ' 23:59';
  now: Date;
  totalIssues = 0;

  constructor(
    public restJiraService: RestJiraService,
    private router: Router,
    private thfAlert: ThfDialogService ) { }

  ngOnInit() {

    // Inicializa variaveis
    this.columnsGrid = this.getColumns();
    this.now = new Date();
    const diaIni = 1;
    const diaFim = ((new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0 )).getDate());
    const mes = this.now.getMonth();
    const ano = this.now.getFullYear();

    this.startDate = new Date(ano, mes, diaIni);
    this.endDate = new Date(ano, mes, diaFim);
  }

  //
  // Retorna colunas do grid
  //
  getColumns(): Array<ThfGridColumn> {
    return [
      { column: 'issue', label: 'Issue', type: 'string', width: 10},
      { column: 'nomeFant', label: 'Cliente', type: 'string', width: 16},
      { column: 'reporter', label: 'Reporter', type: 'string', width: 11 },
      { column: 'analista', label: 'Analista', type: 'string', width: 11 },
      { column: 'dtReject', label: 'Dt. Rejeição', type: 'date', width: 7},
      { column: 'motReject', label: 'Motivo Rejeição', type: 'string', width: 11},
      { column: 'descrReject', label: 'Descrição Rejeição' , type: 'string', width: 34}
    ];
  }

  //
  // Verifica se sessão do usuario está ativa
  //
  validaSessao() {

    this.loadButton = true;

    this.restJiraService.autenticar().subscribe(data => {
      this.geraIndicadores();
    }, error => {
      this.thfAlert.alert({title: 'Sessão encerrada!', message: 'Por favor, refaça o login.', ok: () => this.router.navigate(['/login']) });
    });

  }

  //
  // Inicia a geração dos dados da tela
  //
  geraIndicadores() {

    // Valida o preenchimento dos campos de data
    if ( (this.startDate === undefined || this.endDate === undefined) || (this.startDate.toString() === '' || this.endDate.toString() === '') ) {
      this.thfAlert.alert({title: 'Campos obrigatorios!', message: 'Preencha os campos de período.'});
      return;
    }

    // Altera status das variaves de loading
    this.isHideLoading = false;
    this.labelButton = 'Gerando indicadores...';

    // Limpa os gráficos
    this.itemsGrid = [];
    this.serieschart1 = [];
    this.serieschart2 = [];
    this.totalIssues = 0;

    // Busca a quantidade de dias úteis no mês
    const dataDe = new Date(this.startDate);
    const dataAte = new Date(this.endDate);
    this.diasUteis = this.restJiraService.calcDias(dataDe, dataAte);

    //
    // Requisição da API que retornará o filtro referente á issues rejeitadas
    //
    this.restJiraService.getFilter('59154').subscribe(response => this.getRejeicao(response.jql));

  }

  getRejeicao(filtro) {

      // Adiciona as datas informadas ao filtro jql
      let filtroEdit = filtro;
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, 'startOfMonth()', '\'' + this.startDate.toString().substring(0, 10) + this.timeini + '\'', true);
      filtroEdit = this.restJiraService.ReplaceAll(filtroEdit, 'endOfMonth()', '\'' + this.endDate.toString().substring(0, 10) + this.timeFim + '\'', true);

      //
      // Requisição da API que retornará as issues rejeitadas
      //
      this.restJiraService.getIssues(filtroEdit).subscribe( response => {
        this.atualizaGrafico(response); } );
  }

  atualizaGrafico(response) {

    let criouSerie = false;
    for (let _i = 0; response.total > _i; _i++) {

      this.totalIssues++;
      // Atualiza Grid
      this.getMsgRejeicao(response.issues[_i]);
      criouSerie = false;
      // Atualiza Rejeições por Analista
      if (this.serieschart1.length === 0) {
        this.serieschart1.push({name: response.issues[_i].fields.reporter.name, data: [1]});
        criouSerie = true;
      } else {
        for (let _y = 0; this.serieschart1.length > _y; _y++) {
          if (this.serieschart1[_y].name ===  response.issues[_i].fields.reporter.name) {
            this.serieschart1[_y].data[0]++;
            criouSerie = true;
            break;
          }
        }
        if (!criouSerie) {
          this.serieschart1.push({name: response.issues[_i].fields.reporter.name, data: [1]});
        }
      }

      criouSerie = false;

      // Atualiza Rejeições por Módulo
      if (this.serieschart2.length === 0) {
        this.serieschart2.push({name: response.issues[_i].fields.customfield_11069.value, data: [1]}); // customfield_11069 - Módulo
        criouSerie = true;
      } else {
        for (let _y = 0; this.serieschart2.length > _y; _y++) {
          if (this.serieschart2[_y].name ===  response.issues[_i].fields.customfield_11069.value) {
            this.serieschart2[_y].data[0]++;
            criouSerie = true;
            break;
          }
        }
        if (!criouSerie) {
          this.serieschart2.push({name: response.issues[_i].fields.customfield_11069.value, data: [1]});
        }
      }
    }

    // Ordena Array's
    this.serieschart1.sort(function(a, b) {
      return (a.data[0] < b.data[0] ? 1 : a.data[0] > b.data[0] ? -1 : 0);
    });
    this.serieschart2.sort(function(a, b) {
      return (a.data[0] < b.data[0] ? 1 : a.data[0] > b.data[0] ? -1 : 0);
    });

    // Altera status das variaves de loading
    this.loadButton = false;
    this.isHideLoading = true;
    this.labelButton = 'Gerar Indicadores';
  }

  getMsgRejeicao(issue) {

    //
    // Requisição da API que retornará os comentarios da issue
    //
    this.restJiraService.getComments(issue.key).subscribe(response => {
      let motRejeicao = '';
      let msgRejeicao = '';
      // Busca o comentario referente a rejeição
      for (let _x = 0; response.total > _x; _x++) {
        if (response.comments[_x].created.toString().substring(0, 10) === issue.fields.resolutiondate.toString().substring(0, 10) && response.comments[_x].body.split('\n')[0].substring(0, 18) === 'Motivo da Rejeição' ) {
          motRejeicao = response.comments[_x].body.split('\n')[0].substring(20);
          msgRejeicao = response.comments[_x].body.split(response.comments[_x].body.split('\n')[0])[1];
        }
      }
      // Altera o array do grid
      this.itemsGrid.push({
        issue: issue.key,
        nomeFant: issue.fields.customfield_11071.value, // customfield_11071 - Nome fantasia cliente
        reporter: issue.fields.reporter.displayName,
        analista: issue.fields.customfield_10048.name, // customfield_10048 - Analista
        dtReject: this.restJiraService.formatDate(issue.fields.resolutiondate),
        motReject: motRejeicao,
        descrReject: msgRejeicao
      });

    });
  }

}
