import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThfModalAction } from '@totvs/thf-ui/components/thf-modal';
import { ThfModalComponent } from '@totvs/thf-ui/components/thf-modal/thf-modal.component';
import { ThfTableColumn } from '@totvs/thf-ui/components/thf-table';
import { ThfBulletChartSeries, ThfCandlestickChartSeries, ThfColumnChartSeries, ThfPieChartSeries } from '@totvs/thf-ui/components/thf-chart';
import { ThfGridColumn } from '@totvs/thf-ui/components/thf-grid';

@Component({
  selector: 'app-indcliente',
  templateUrl: './indcliente.component.html',
  styleUrls: ['./indcliente.component.css']
})
export class IndclienteComponent implements OnInit {

  //Table1
  columns: Array<ThfTableColumn>;
  items: Array<any>;
  //Chart 5 Column
  categchart5: Array<string>;
  serieschart5: Array<ThfColumnChartSeries>;  
  //Chart 3 Pie
  categchart3: Array<string>;
  serieschart3: Array<ThfPieChartSeries>;
  //Chart 4 Pie
  categchart4: Array<string>;
  serieschart4: Array<ThfPieChartSeries>;
  //Grid 1
  dataItems: Array<Object> = this.getDataItems();
  columnsgrid: Array<ThfGridColumn> = this.getColumnsGrid();

  ngOnInit() {
    alert("Página em construção")
    this.columns = [
      { column: 'ticket', label: 'Ticket', type: 'number'},
      { column: 'status', label: 'Status'},
      { column: 'pendencia', label: 'Pendência'},
      { column: 'dtabertura', label: 'Data Abertura', type: 'date' },
      { column: 'prazo', label: 'Prazo', type: 'date' },
      { column: 'Issue', label: 'issue', type: 'string', },
      { column: 'assunto', label: 'Assunto', type:'string'},
      { column: 'obs', label: 'Observações'},
      { column: 'prioridade', label: 'Prioridade', type:'label', labels:[
        { value: 'baixo', color: 'success', label: 'Baixo' },
        { value: 'medio', color: 'success', label: 'Médio' },
        { value: 'alto', color: 'warning', label: 'Alto' },
        { value: 'critico', color: 'danger', label: 'Crítico' }
      ]},
      { column: 'modulo', label: 'Módulo'}

      ];
  
    this.items = [
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  }      
      
    ];

    //Chart5
    this.serieschart5 = this.getSeriesChart5();
    this.categchart5 = this.getCategChart5();
    //Chart3
    this.categchart3 = this.getCategchart3();
    this.serieschart3 = this.getSeriesChart3();    
    //Chart4
    this.categchart4 = this.getCategchart4();
    this.serieschart4 = this.getSeriesChart4();   
    //Grid 1
    this.columnsgrid = this.getColumnsGrid();
    this.dataItems = this.getDataItems();

  }
  private getCategChart5(): Array<string> {
    return [ 'Totvs', 'Cliente'];
  }
  private getSeriesChart5(): Array<ThfColumnChartSeries> {
    return [
      { name: 'Atendimento', data: [8,1] },
      { name: 'Manutenção', data: [0,3] },  
      { name: 'Legislação', data: [15,4] },
      { name: 'Customização (BSO)', data: [9,15] },
      { name: 'Melhoria', data: [9,0] },
      { name: 'Performance', data: [12,1] },      
    ];
  }
  private getCategchart3(): Array<string> {
    return [ 'Totvs', 'Cliente'];
  } 
  private getSeriesChart3(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'Totvs', value: 150},
              {category: 'Cliente', value: 300}]
  }];
  }
  private getCategchart4(): Array<string> {
    return [ 'No Prazo', 'Fora do Prazo'];
  } 
  private getSeriesChart4(): Array<ThfPieChartSeries > {
    return [{
      data: [{category: 'No Prazo', value: 95},
              {category: 'Fora do Prazo', value: 5}]
  }];
  }
  
  private getColumnsGrid(): Array<ThfGridColumn> {
    return [
      { column: 'ticket', label: 'Ticket', type: 'number'},
      { column: 'status', label: 'Status', editable: true},
      { column: 'pendencia', label: 'Pendência',editable: true},
      { column: 'dtabertura', label: 'Data Abertura', type: 'date' },
      { column: 'prazo', label: 'Prazo', type: 'date',editable: true },
      { column: 'Issue', label: 'issue', type: 'string' },
      { column: 'assunto', label: 'Assunto', type:'string'},
      { column: 'obs', label: 'Observações',editable: true},
      { column: 'prioridade', label: 'Prioridade'},      
      { column: 'modulo', label: 'Módulo'}
    ];
  }
  private getDataItems(): Array<Object> {
    return [
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'alto', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'medio', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'baixo', modulo:'Gestão de Pessoal'  },      
      { ticket: '2569855', status: 'Aberto', pendencia: 'Totvs', dtabertura: new Date(), prazo: new Date(), Issue: 'MPRIMESP-15958',assunto: 'Cálculo da Folha', obs: 'cliente parado',prioridade: 'critico', modulo:'Gestão de Pessoal'  }];
  }


  onbotao1() {
    
  }

}
