import { Component, OnInit } from '@angular/core';
import { ThfDialogService } from '@totvs/thf-ui/services/thf-dialog/thf-dialog.service';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { ThfGridColumn } from '@totvs/thf-ui/components/thf-grid';
import { RestZenService } from '../rest-zen.service';
import { RestJiraService } from '../rest-jira.service';
import { RestTrelloService } from '../rest-trello.service';
import { ThfInfoOrientation } from '@totvs/thf-ui/components/thf-info';

//var readfiles = require('readfiles');

@Component({
  selector: 'app-indcliente',
  templateUrl: './indcliente.component.html',
  styleUrls: ['./indcliente.component.css']
})
export class IndclienteComponent implements OnInit {

  codOrg = "";
  zToken = "";
  idCliente = "";
  openTickets = true;
  pendenciasCliente = {
    totvs: { question: 0, task: 0, problem: 0, incident: 0 },
    cliente: { question: 0, task: 0, problem: 0, incident: 0 }
  };
  manutCliente = { Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0 };
  mostraEncerrados = false;
  clientesTrello: Array<any> = [];
  infoDetalCli = [];
  infoModulosCli = [];
  tempoAtend = [];
  serviceContr = [];
  mostraDetalhes = false;
  mostraChartMensal = false;
  orientation: ThfInfoOrientation = ThfInfoOrientation.Horizontal;
  isHideLoading = true;
  loadButton = false;
  labelButton = "Gerar Indicadores";
  disableSwitch = false;
  mobile = !this.restJiraService.detectarMobile();
  //Chart 5 Column
  categchart1: Array<string>;
  serieschart1: Array<ThfColumnChartSeries>;
  serieschart2: Array<ThfColumnChartSeries>;
  //Chart 3 Pie
  categchart3: Array<string>;
  serieschart3: Array<any>;
  //Chart 4 Pie
  categchart4: Array<string>;
  serieschart4: Array<ThfPieChartSeries>;
  //Chart 5 Pie
  categchart5: Array<string>;
  serieschart5: Array<ThfPieChartSeries>;
  //Grid 1
  dataItems: Array<any> = [];
  columnsgrid: Array<ThfGridColumn> = this.getColumnsGrid();
  startDate: Date;
  endDate: Date;
  now: Date;
  //private fileReader = new FileReader();


  constructor(private restZenService: RestZenService, private restJiraService: RestJiraService, private restTrelloService: RestTrelloService, private thfAlert: ThfDialogService) { }

  ngOnInit() {

    this.restZenService.getToken();
    this.getClientes();

    this.now = new Date();
    var diaIni = 1
    var diaFim = ((new Date(this.now.getFullYear(), this.now.getMonth() + 1, 0)).getDate());
    var mes = this.now.getMonth();
    var ano = this.now.getFullYear();

    this.startDate = new Date(ano, mes, diaIni);
    this.endDate = new Date(ano, mes, diaFim);

    //Chart1
    this.serieschart1 = this.getSeriesChart1();
    this.categchart1 = this.getCategChart1();
    //Chart2
    this.serieschart2 = this.getSeriesChart2();
    //Chart4
    this.categchart4 = this.getCategchart4();
    this.serieschart4 = this.getSeriesChart4(0, 0);
    //Chart5
    this.categchart5 = this.getCategchart5();
    this.serieschart5 = this.getSeriesChart5(0, 0);
    //Grid 1
    this.columnsgrid = this.getColumnsGrid();

  }
  private getCategChart1(): Array<string> {
    return ['Pendência Totvs', 'Pendência Cliente'];
  }
  private getSeriesChart1(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Pergunta', data: [this.pendenciasCliente.totvs.question, this.pendenciasCliente.cliente.question] },
      { name: 'Problema', data: [this.pendenciasCliente.totvs.problem, this.pendenciasCliente.cliente.problem] },
      { name: 'Incidente', data: [this.pendenciasCliente.totvs.incident, this.pendenciasCliente.cliente.incident] },
      { name: 'Tarefa', data: [this.pendenciasCliente.totvs.task, this.pendenciasCliente.cliente.task] }
    ];
  }
  private getSeriesChart2(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Manutenção', data: [this.manutCliente.Manut] },
      { name: 'Legislação', data: [this.manutCliente.Legis] },
      { name: 'Customização (BSO)', data: [this.manutCliente.Custo] },
      { name: 'Melhoria', data: [this.manutCliente.Melho] },
      { name: 'Performance', data: [this.manutCliente.Perfo] }
    ];
  }
  private getSeriesChart3(valTickets, valIssues): Array<ThfColumnChartSeries> {
    return [{ name: 'Tickets', data: valTickets },
    { name: 'Issues', data: valIssues }];
  }
  private getCategchart4(): Array<string> {
    return ['No Prazo', 'Fora do Prazo'];
  }
  private getSeriesChart4(slaNVenc, slaVenc): Array<ThfPieChartSeries> {
    return [{
      data: [{ category: 'No Prazo', value: slaNVenc },
      { category: 'Fora do Prazo', value: slaVenc }]
    }];
  }
  private getCategchart5(): Array<string> {
    return ['Possuem Issue', 'Não Possuem Issue'];
  }
  private getSeriesChart5(percTicket, percIssue): Array<any> {
    return [{
      data: [{ category: 'Possuem Issue', value: percIssue },
      { category: 'Não Possuem Issue', value: percTicket }]
    }];
  }

  private getColumnsGrid(): Array<ThfGridColumn> {
    return [
      { column: 'ticket', label: 'Ticket', type: 'number', width: 24 },
      { column: 'status', label: 'Status', editable: true, width: 26 },
      { column: 'pendencia', label: 'Pendência', editable: true, width: 22 },
      { column: 'assunto', label: 'Assunto', type: 'string', width: 40 },      
      { column: 'dtabertura', label: 'Dt. Abertura', type: 'date', width: 30 },
      { column: 'sla', label: 'Dt. SLA', type: 'date', editable: true, width: 28 },
      { column: 'dtacordo', label: 'Dt. Acordo', type: 'date', editable: true, width: 28 },
      { column: 'prazo', label: 'Prazo', type: 'date', editable: true, width: 28 },
      { column: 'Issue', label: 'issue', type: 'string', width: 42 },         
      { column: 'obs', label: 'Observações', editable: true, width: 30 },
      { column: 'modulo', label: 'Módulo', width: 25 },
      { column: 'cumpSla', label: 'SLA', width: 25 },
    ];
  }

  limpaTabela() {

    this.infoDetalCli = [
      { campo: "Nome", valor: "" },
      { campo: "SPOC", valor: "" },
      { campo: "Código", valor: "" },
      { campo: "Degustação", valor: "" },
      { campo: "Segmento", valor: "" },
      { campo: "Tipo Atendimento", valor: "" }
    ];
    this.infoModulosCli = [
      { campo: "Backoffice", valor: "" },
      { campo: "Sped", valor: "" },
      { campo: "RH", valor: "" },
      { campo: "Varejo", valor: "" },
      { campo: "Jurídico", valor: "" },
      { campo: "Logística", valor: "" },
      { campo: "NG", valor: "" },
      { campo: "MIL", valor: "" },
      { campo: "Trade", valor: "" },
      { campo: "Saúde", valor: "" }
    ];
    this.tempoAtend = [
      { campo: "Faixa 1", valor: "" },
      { campo: "Faixa 2", valor: "" },
      { campo: "Faixa 3", valor: "" },
      { campo: "Faixa 3 BSO", valor: "" }
    ];
    this.serviceContr = [
      { campo: "BSO", valor: "" },
      { campo: "Cloud", valor: "" },
      { campo: "Stand by", valor: "" },
      { campo: "Franquia Tickets", valor: "" },
      { campo: "Analista Dedicado", valor: "" },
      { campo: "Módulo Dedicado", valor: "" },
      { campo: "Suporte Customizado", valor: "" }
    ];

    this.dataItems = [];
    this.pendenciasCliente = {
      totvs: { question: 0, task: 0, problem: 0, incident: 0 },
      cliente: { question: 0, task: 0, problem: 0, incident: 0 }
    };
    this.manutCliente = { Manut: 0, Legis: 0, Custo: 0, Melho: 0, Perfo: 0 };

    this.serieschart1 = this.getSeriesChart1();
    this.serieschart2 = this.getSeriesChart2();
    this.serieschart3 = this.getSeriesChart3([], []);
    this.serieschart4 = this.getSeriesChart4(0, 0);
    this.serieschart5 = this.getSeriesChart5(0, 0);

  }

  getClientes() {

    this.restTrelloService.buscaClientes().subscribe(response => {
      for (var _i = 0; response.length > _i; _i++) {
        this.clientesTrello.push({ label: response[_i].name, value: response[_i].id });
      }
    }, error => { });
  }

  setCliente(idCliente) {
    this.idCliente = idCliente;
  }

  incProc() {

    if ((this.startDate == undefined || this.endDate == undefined) || (this.startDate.toString() == "" || this.endDate.toString() == "")) {
      this.thfAlert.alert({ title: "Campos obrigatorios!", message: "Preencha os campos de período." });
      return;
    }

    if (this.idCliente == "") {
      this.thfAlert.alert({ title: "Campos obrigatorios!", message: "Informe o cliente." });
      return;
    }

    if (!this.openTickets) {
      this.mostraEncerrados = true;
    }

    this.limpaTabela();
    this.isHideLoading = false;
    this.loadButton = true;
    this.labelButton = "Gerando indicadores..."
    this.disableSwitch = true;
    this.mostraDetalhes = false;
    this.mostraChartMensal = false;
    this.zToken = this.restZenService.token;
    this.endDate = new Date(this.endDate.toString().substring(0, 10) + " 23:59:59");

    this.restTrelloService.getDadosCli(this.idCliente).subscribe(response => {

      var dadosCli = response.desc.split("#")[1].split("\n");
      var entLegais = response.desc.split("#")[3].split("\n");
      var tempoAtend = response.desc.split("#")[7].split("\n");
      var modulosCli = response.desc.split("#")[8].split("\n");
      var serviceContr = response.desc.split("#")[9].split("\n");

      for (var _i = 0; this.infoDetalCli.length > _i; _i++) {
        this.infoDetalCli[_i].valor = this.getInfo(dadosCli, "**" + this.infoDetalCli[_i].campo + ":**");
        this.infoDetalCli[_i].valor = this.restJiraService.ReplaceAll(this.infoDetalCli[_i].valor, "**", '', false);
      }
      for (var _i = 0; this.infoModulosCli.length > _i; _i++) {
        this.infoModulosCli[_i].valor = this.getInfo(modulosCli, "**" + this.infoModulosCli[_i].campo + ":**");
        this.infoModulosCli[_i].valor = this.restJiraService.ReplaceAll(this.infoModulosCli[_i].valor, "**", '', false);
      }
      for (var _i = 0; this.tempoAtend.length > _i; _i++) {
        this.tempoAtend[_i].valor = this.getInfo(tempoAtend, "**" + this.tempoAtend[_i].campo + ":**");
        this.tempoAtend[_i].valor = this.restJiraService.ReplaceAll(this.tempoAtend[_i].valor, "**", '', false);
      }
      for (var _i = 0; this.serviceContr.length > _i; _i++) {
        this.serviceContr[_i].valor = this.getInfo(serviceContr, "**" + this.serviceContr[_i].campo + ":**");
        this.serviceContr[_i].valor = this.restJiraService.ReplaceAll(this.serviceContr[_i].valor, "**", '', false);
      }

      this.mostraDetalhes = true;

      if (this.infoDetalCli[2].valor != "") {

        this.restZenService.getCodOrg(this.zToken, this.infoDetalCli[2].valor).subscribe(response => {

          var codOrg = response.results[0].id;

          this.restZenService.getTickets(this.zToken, codOrg, "1").subscribe(response => {

            var tickets = response.tickets;

            if (response.next_page != undefined) {
              this.getAllTickets(tickets, codOrg, Math.trunc(response.count / 100) + 1);
            } else if (response.tickets.length > 0) {
              this.getIssues(response.tickets);
            }
          }, error => {
            this.thfAlert.alert({ title: "Falha de conexão com zendesk!", message: "Não foi possível obter os dados do zendesk. Por favor reinicie a página!" });
          });
        });
      }
    },
      error => {

      });
  }

  getIssues(allTickets) {

    var codTickets = "";
    var tickets = [];
    var jql = "";

    for (var _i = 0; allTickets.length > _i; _i++) {
      if (allTickets[_i].created_at >= this.startDate
        && allTickets[_i].created_at <= this.endDate
        && allTickets[_i].ticket_form_id == "368847"
        && (allTickets[_i].group_id == "32772527") || allTickets[_i].group_id == "32799648") {

        if (this.openTickets) {
          if (allTickets[_i].status != "closed"
            && allTickets[_i].status != "solved") {
            tickets.push(allTickets[_i]);
            allTickets[_i].tags.some(function (a) {
              if (a == "issue_criada_jira") {
                codTickets = codTickets + "'" + allTickets[_i].id + "',";
              }
            })
          }
        } else {
          tickets.push(allTickets[_i]);
          allTickets[_i].tags.some(function (a) {
            if (a == "issue_criada_jira") {
              codTickets = codTickets + "'" + allTickets[_i].id + "',";
            }
          })
        }
      }
    }
    codTickets = codTickets + "''";
    jql = ' "Código da Organização"  = ' + this.infoDetalCli[2].valor + ' AND "Ticket" in (' + codTickets + ') AND "issuetype" not in ("Merge (Sub-tarefa)", "Retrabalho - Manutenção", Apoio, "Apoio - Cliente")'

    this.restZenService.getIssues(jql).subscribe(response => {

      var codIssues = "";
      var temAssociac = false;
      var issuesPrincip = response.issues;

      for (var _i = 0; response.issues.length > _i; _i++) {
        if (response.issues[_i].fields.status.name.substring(0, 9) == "Associado") {
          codIssues = codIssues + "'" + response.issues[_i].fields.parent.key + "',";
          temAssociac = true;
        }
      }
      if (!temAssociac) {
        this.atualizaTela(response.issues, tickets);
      } else {
        jql = "key in (" + codIssues.substr(0, (codIssues.length - 1)) + ")";
        this.restZenService.getIssues(jql).subscribe(response => { this.atualizaTela(issuesPrincip, tickets, response.issues) },
          error => {
            this.thfAlert.alert({ title: "Falha de conexão com JIRA!", message: "Não foi possível obter os dados do JIRA. Por favor reinicie a página!" });
          });
      }
    }, error => {
      this.thfAlert.alert({ title: "Falha de conexão com JIRA!", message: "Não foi possível obter os dados do JIRA. Por favor reinicie a página!" });
    });
  }

  atualizaTela(issues, tickets, issuesDeAssociac?) {

    var pendencia: string = "";
    var temIssue: boolean;
    var issuesCli: string = "";
    var issuePrincip;
    var status: string = "";
    var cumpriuSla: boolean = true;
    var totalIssues: number = 0;
    var totalTickets: number = 0;
    var percIssues: number = 0;
    var percTickets: number = 0;
    var slaVenc: number = 0;
    var slaNVenc: number = 0;
    var dtacordo;
    var sla;
    var prazo = "";
    var dataatual = new Date();
    var dataRef = new Date(this.startDate);
    var valoresPorMes: Array<any> = [[dataRef.getMonth()], [0], [0]];
    var month = new Array();

    month[0] = "Janeiro";
    month[1] = "Fevereiro";
    month[2] = "Março";
    month[3] = "Abril";
    month[4] = "Maio";
    month[5] = "Junho";
    month[6] = "Julho";
    month[7] = "Agosto";
    month[8] = "Setembro";
    month[9] = "Outubro";
    month[10] = "Novembro";
    month[11] = "Dezembro";

    while (dataRef.toString().substring(0, 15) != new Date(this.endDate).toString().substring(0, 15)) {
      if (dataRef.getMonth() != valoresPorMes[0][valoresPorMes[0].length - 1]) {
        valoresPorMes[0].push(dataRef.getMonth());
        valoresPorMes[1].push(0);
        valoresPorMes[2].push(0);
      }
      dataRef.setDate(dataRef.getDate() + 1);
    }

    for (var _i = 0; tickets.length > _i; _i++) {

      temIssue = false;
      issuesCli = "";

      console.log(tickets[_i]);

      for (var _x = 0; issues.length > _x; _x++) {
        if (tickets[_i].id == issues[_x].fields.customfield_16701
          && issues[_x].fields.status.name != "Recusada"
          && issues[_x].fields.status.name != "Cancelado") {
          issuesCli += issues[_x].key + "; ";
          if (issues[_x].fields.status.name.substring(0, 9) == "Associado") {
            if (!this.validIssueType(issues[_x].fields.parent.fields.issuetype.name)) {
              this.manutCliente.Manut++;
              totalIssues++;
            } else {
              eval("this.manutCliente." + issues[_x].fields.parent.fields.issuetype.name.substring(0, 5) + "++");
              totalIssues++;
            }
          } else {
            if (!this.validIssueType(issues[_x].fields.issuetype.name)) {
              this.manutCliente.Manut++;
              totalIssues++;
            } else {
              eval("this.manutCliente." + issues[_x].fields.issuetype.name.substring(0, 5) + "++");
              totalIssues++;
            }
          }
          if (issues[_x].fields.status.name.substring(0, 9) == "Associado"
            && this.validIssueStatus(issues[_x].fields.parent.fields.status.name)) {

            issuesDeAssociac.some(function (a) {
              if (a.key == issues[_x].fields.parent.key) {
                issuePrincip = a;
              }
              return;
            })

            if (issuePrincip != undefined) {
              if (issuePrincip.fields.customfield_11039 != null) {
                if (!(dtacordo != undefined && dtacordo > issuePrincip.fields.customfield_11039)) {
                  dtacordo = new Date(issuePrincip.fields.customfield_11039.split('-').join('/'));
                }
              } else if (!(dtacordo != undefined && dtacordo > issuePrincip.fields.customfield_11080)) {
                dtacordo = issuePrincip.fields.customfield_11080;
              }
            }

            temIssue = true;

          } else if (this.validIssueStatus(issues[_x].fields.status.name)) {
            if (issues[_x].fields.customfield_11039 != null) {
              if (!(dtacordo != undefined && dtacordo > issues[_x].fields.customfield_11039)) {
                dtacordo = new Date(issues[_x].fields.customfield_11039.split('-').join('/'));
              }
            } else if (!(dtacordo != undefined && dtacordo > issues[_x].fields.customfield_11080)) {
              dtacordo = issues[_x].fields.customfield_11080;
            }

            temIssue = true;
          }
          valoresPorMes[0].some(function (a) {
            if (a == new Date(issues[_x].fields.created).getMonth()) {
              valoresPorMes[1][valoresPorMes[0].indexOf(new Date(issues[_x].fields.created).getMonth())]++;
            }
          });
        }
      }

      sla = (tickets[_i].fields[378].value != null && tickets[_i].fields[378].value != "" ? tickets[_i].fields[378].value : "");

      if (dtacordo == undefined
        && tickets[_i].custom_fields[166].value != null
        && tickets[_i].custom_fields[166].value != "") {
        dtacordo = new Date(tickets[_i].custom_fields[166].value.split('-').join('/'));
      }

      if (dtacordo >= dataatual) {
        prazo = this.restJiraService.formatDate(dtacordo.toString());
      } else if (tickets[_i].fields[378].value != null && tickets[_i].fields[378].value != "") {
        if (new Date(tickets[_i].fields[378].value.split('-').join('/')) >= dataatual || new Date(tickets[_i].fields[378].value.split('-').join('/')).toString().substring(0, 15) == dataatual.toString().substring(0, 15)) {
          prazo = this.restJiraService.formatDate(tickets[_i].fields[378].value);
        }
      }

      if (tickets[_i].status == "pending" || tickets[_i].status == "closed" || tickets[_i].status == "solved") {
        pendencia = "Cliente";
        if (!temIssue) {
          eval("this.pendenciasCliente.cliente." + tickets[_i].type + "++");
        }
        totalTickets++;
      } else {
        pendencia = "Totvs";
        if (!temIssue) {
          eval("this.pendenciasCliente.totvs." + tickets[_i].type + "++");
        }
        totalTickets++;
      }

      if (prazo == "" && tickets[_i].status != "closed" && tickets[_i].status != "solved") {
        if (tickets[_i].status == "pending") {
          slaNVenc++;
        } else {
          slaVenc++;
          cumpriuSla = false;
        }

      } else if (prazo == "" && (tickets[_i].status == "closed" || tickets[_i].status == "solved")) {
        if (tickets[_i].fields[168].value != null) {
          if (new Date(tickets[_i].fields[168].value.split('-').join('/')) <= dtacordo
            || new Date(tickets[_i].fields[168].value.split('-').join('/')) <= new Date(sla.split('-').join('/'))) {
            slaNVenc++;
          } else if (tickets[_i].fields[466].value != null) {
            if (new Date(tickets[_i].fields[466].value.split('-').join('/')) <= dtacordo
              || new Date(tickets[_i].fields[466].value.split('-').join('/')) <= new Date(sla.split('-').join('/'))) {
              slaNVenc++;
            } else {
              slaVenc++;
              cumpriuSla = false;
            }
          } else {
            slaVenc++;
            cumpriuSla = false;
          }
        } else {
          slaVenc++;
          cumpriuSla = false;
        }
      } else if (prazo != "") {
        slaNVenc++;
      }

      valoresPorMes[0].some(function (a) {
        if (a == new Date(tickets[_i].created_at).getMonth()) {
          valoresPorMes[2][valoresPorMes[0].indexOf(new Date(tickets[_i].created_at).getMonth())]++;
        }
      });

      switch (tickets[_i].status) {
        case "hold":
          status = "EM ESPERA";
          break;
        case "pending":
          status = "PENDENTE";
          break;
        case "open":
          status = "ABERTO";
          break;
        case "new":
          status = "NOVO";
          break;
        case "solved":
          status = "RESOLVIDO";
          break;
        case "closed":
          status = "FECHADO";
          break;

        default:
          break;
      }


      this.dataItems.push({
        ticket: tickets[_i].id,
        status: status,
        pendencia: pendencia,
        dtabertura: this.restJiraService.formatDate(tickets[_i].created_at.toString().substring(0, 10)),
        sla: (sla != "" ? this.restJiraService.formatDate(sla.substring(0, 10)) : ""),
        dtacordo: (dtacordo != undefined ? this.restJiraService.formatDate(dtacordo.toString()) : ""),
        prazo: prazo,
        assunto: tickets[_i].subject,
        Issue: issuesCli,
        modulo: this.getTagInfo(this.getTagInfo(tickets[_i].fields[389].value, "__", 1, true), "_", 0, true),
        prioridade: this.getTagInfo(tickets[_i].fields[387].value, "_", 3, false),
        cumpSla: (cumpriuSla ? "No Prazo" : "Fora do Prazo")
      });

      prazo = "";
      dtacordo = undefined;
      issuePrincip = undefined;
      cumpriuSla = true;
    }

    for (var _i = 0; valoresPorMes[0].length > _i; _i++) {
      valoresPorMes[0][_i] = month[valoresPorMes[0][_i]];
    }

    if (valoresPorMes[0].length > 1) {
      this.mostraChartMensal = true;
    }

    percIssues = Math.round(totalIssues / totalTickets * 100);
    percTickets = ((100 - percIssues > 0) ? 100 - percIssues : 0);

    this.serieschart1 = this.getSeriesChart1();
    this.serieschart2 = this.getSeriesChart2();
    this.serieschart4 = this.getSeriesChart4(Math.round(slaNVenc / totalTickets * 100), Math.round(slaVenc / totalTickets * 100));
    this.serieschart5 = this.getSeriesChart5(percTickets, percIssues);
    this.categchart3 = valoresPorMes[0];
    this.serieschart3 = this.getSeriesChart3(valoresPorMes[2], valoresPorMes[1]);
    this.isHideLoading = true;
    this.loadButton = false;
    this.labelButton = "Gerar Indicadores";
    this.disableSwitch = false;
  }

  getAllTickets(tickets, codOrg, qtdPages) {

    var allTickets = tickets;
    var paginaAtu = 2;

    for (var _i = 2; _i <= qtdPages; _i++) {
      this.restZenService.getTickets(this.zToken, codOrg, _i).subscribe(response => {

        for (var _x = 0; response.tickets.length > _x; _x++) {
          allTickets.push(response.tickets[_x]);
        }
        if (paginaAtu == qtdPages) {
          this.getIssues(allTickets);
        } else {
          paginaAtu++;
        }
      }, error => {
        this.thfAlert.alert({ title: "Falha de conexão com zendesk!", message: "Não foi possível obter os dados do zendesk. Por favor reinicie a página!" });
      });
    }

  }

  getInfo(arrayInfo, campo) {
    var retorno = "";

    arrayInfo.some(function (a) {
      if (a.indexOf(campo) != -1) {
        retorno = a.substring(campo.length);
      }
    });
    return retorno;
  }

  validIssueType(issueType) {

    if (issueType == "Atendimento" || issueType == "Manutenção" || issueType == "Legislação" || issueType == "Customização (BSO)" || issueType == "Melhoria" || issueType == "Performance" || issueType == "Retrabalho - Manutenção") {
      return true;
    } else {
      return false;
    }
  }

  validIssueStatus(issueStatus) {

    if (issueStatus != "Expedido" && issueStatus != "Concluido" && issueStatus != "Concluído" && issueStatus != "Recusada" && issueStatus != "Resolved" && issueStatus != "Cancelado" && issueStatus != "Closed") {
      return true;
    } else {
      return false;
    }
  }

  getTagInfo(exp: string, separador: string, posRet: number, upper) {

    var retorno;
    if (exp != null && exp != undefined) {

      retorno = exp.split(separador);

      if (retorno.length > posRet) {
        if (upper) {
          return retorno[posRet].toString().toUpperCase();
        } else {
          return retorno[posRet];
        }
      } else {
        return "";
      }
    } else {
      return "";
    }
  }
}
