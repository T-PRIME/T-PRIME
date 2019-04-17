var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, Input, IterableDiffers, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GridComponent } from '@progress/kendo-angular-grid';
import { process, orderBy } from '@progress/kendo-data-query';
import { ThfGridBaseComponent } from './thf-grid-base.component';
/**
 * \@docsExtends ThfGridBaseComponent
 *
 * \@description
 *
 * Para o correto funcionamento do THF Grid deve ser importado o módulo ```BrowserAnimationsModule``` no módulo principal da sua aplicação.
 *
 * ```
 * import { BrowserAnimationsModule } from '\@angular/platform-browser/animations';
 *
 * ...
 *
 * \@NgModule({
 *   imports: [
 *     BrowserModule,
 *     BrowserAnimationsModule,
 *     ...
 *     ThfModule,
 *     ...
 *   ],
 *   declarations: [
 *     AppComponent
 *   ],
 *   providers: [],
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * ```
 *
 * No arquivo```angular-cli.json``` da sua aplicação deve ser importado o arquivo ```all.css```, que pertence ao
 * pacote ```\@progress/kendo-theme-default```.
 *
 *
 * > Arquivo .angular-cli.json:
 *
 *
 * ```
 * ...
 * "styles": [
 *   "../node_modules/\@progress/kendo-theme-default/dist/all.css"
 * ]
 * ...
 * ```
 * \@example
 * <example name="thf-grid" title="Totvs Grid Labs">
 *  <file name='sample-thf-grid.component.html'> </file>
 *  <file name='sample-thf-grid.component.ts'> </file>
 * </example>
 */
var ThfGridComponent = /** @class */ (function (_super) {
    __extends(ThfGridComponent, _super);
    function ThfGridComponent(viewRef, renderer, differs) {
        var _this = _super.call(this) || this;
        _this.renderer = renderer;
        _this.editedRowIndex = -1;
        _this.groups = [];
        _this.sort = [];
        _this.state = { skip: 0 };
        /**
         * Habilita a opção para exportação dos dados.
         */
        _this.exportButtons = false;
        _this.addButtonCalled = false;
        _this.parentRef = viewRef['_view']['component'];
        _this.allData = _this.allData.bind(_this);
        _this.differ = differs.find([]).create(null);
        return _this;
    }
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.renderer.listen('document', 'click', function (_a) {
            var target = _a.target;
            _this.validateSaveEventInDocument(target);
        });
        this.initializeColumns();
        this.initializeSorter();
        this.initializeData();
        if (!this.editable) {
            this.grid = null;
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.ngDoCheck = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ change = this.differ.diff(this.data);
        if (change) {
            this.initializeData();
        }
    };
    /**
     * @param {?} sort
     * @return {?}
     */
    ThfGridComponent.prototype.sortChange = /**
     * @param {?} sort
     * @return {?}
     */
    function (sort) {
        this.sort = sort;
        if (this.sort && this.sort[0].dir && !this.isGroupingBy(this.sort[0].field)) {
            this.loadData();
        }
    };
    /**
     * @param {?} field
     * @return {?}
     */
    ThfGridComponent.prototype.isGroupingBy = /**
     * @param {?} field
     * @return {?}
     */
    function (field) {
        return this.groups.some(function (obj) { return obj.field === field; });
    };
    /**
     * @param {?} state
     * @return {?}
     */
    ThfGridComponent.prototype.dataStateChange = /**
     * @param {?} state
     * @return {?}
     */
    function (state) {
        // Esta condição foi realizada para não deixar adicionar mais de 2 grupos devido
        // a um problema no kendo grid. Ja tem um chamado aberto para este problema.
        if (state.group.length > 2) {
            state.group.splice(0, 1);
        }
        this.state = state;
        this.gridView = process(this.data, this.state);
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.addHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var sender = _a.sender;
        if (this.editedRowIndex >= 0) {
            this.closeEditor(sender, this.editedRowIndex);
        }
        this.addButtonCalled = true;
        this.createFormGroup();
        if (this.addAction) {
            if (this.executeFunctionValidation(this.addAction, this.formGroup.value)) {
                this.formGroup.setValue(this.formGroup.value);
            }
            else {
                return;
            }
        }
        sender.addRow(this.formGroup);
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.saveLine = /**
     * @return {?}
     */
    function () {
        if (this.editable && this.formGroup) {
            var /** @type {?} */ newRowValue = void 0;
            if (this.editedRowIndex >= 0) {
                newRowValue = Object.assign(this.data[this.editedRowIndex], this.formGroup.value);
                this.data[this.editedRowIndex] = newRowValue;
            }
            else if (this.addButtonCalled) {
                newRowValue = this.formGroup.value;
                this.data.push(newRowValue);
                this.addButtonCalled = false;
            }
            this.saveValue.emit({ data: newRowValue });
        }
        this.initializeSorter();
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.editClickHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var rowIndex = _a.rowIndex, dataItem = _a.dataItem;
        if (this.executeFunctionValidation(this.saveAction, { data: this.data[this.editedRowIndex] })) {
            if (!this.isValidForm() && this.formGroup) {
                return;
            }
            this.saveLine();
        }
        // Verifica se está utilizando agrupamento e busca o indice atualizado
        // do objeto que está sendo editado no momento.
        if (this.isGroup()) {
            rowIndex = this.getRowIndex(this.data, dataItem);
        }
        this.editHandler({
            sender: this.grid,
            rowIndex: rowIndex,
            dataItem: dataItem
        });
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.editHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var sender = _a.sender, rowIndex = _a.rowIndex, dataItem = _a.dataItem;
        if (!this.editable) {
            return;
        }
        this.sortableObject = null;
        this.closeEditor(sender);
        this.editedProducted = Object.assign({}, dataItem);
        this.formGroup = new FormGroup({});
        var /** @type {?} */ keys = Object.keys(dataItem);
        for (var /** @type {?} */ count = 0; count <= keys.length; count++) {
            var /** @type {?} */ key = keys[count];
            var /** @type {?} */ columnTemp = this.getColumn(key);
            if (columnTemp && columnTemp.editable) {
                var /** @type {?} */ control = columnTemp.required ? new FormControl(dataItem[key], Validators.required) : new FormControl(dataItem[key]);
                this.formGroup.addControl(key, control);
            }
        }
        this.editedRowIndex = rowIndex;
        sender.editRow(rowIndex, this.formGroup);
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.saveClick = /**
     * @return {?}
     */
    function () {
        if (!this.validateSaveClick()) {
            return;
        }
        this.saveLine();
        this.closeEditor(this.grid);
        this.loadData();
    };
    /**
     * @param {?} grid
     * @param {?=} rowIndex
     * @return {?}
     */
    ThfGridComponent.prototype.closeEditor = /**
     * @param {?} grid
     * @param {?=} rowIndex
     * @return {?}
     */
    function (grid, rowIndex) {
        if (rowIndex === void 0) { rowIndex = this.editedRowIndex; }
        if (grid) {
            grid.closeRow(rowIndex);
        }
        this.editedRowIndex = undefined;
        this.formGroup = undefined;
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.saveHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var sender = _a.sender, rowIndex = _a.rowIndex, formGroup = _a.formGroup, isNew = _a.isNew;
        var /** @type {?} */ item = formGroup.value;
        if (isNew && !this.editable) {
            this.data.push(item);
        }
        else {
            this.data[rowIndex] = Object.assign(this.data[rowIndex], item);
        }
        this.loadData();
        sender.closeRow(rowIndex);
    };
    // Cancela a propagação de eventos no botão "Cancelar" da edição por linhas.
    /**
     * @param {?} event
     * @return {?}
     */
    ThfGridComponent.prototype.cancelPropagation = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.cancelHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var sender = _a.sender, rowIndex = _a.rowIndex;
        if (this.editedProducted != null) {
            this.data[rowIndex] = this.editedProducted;
            this.editedProducted = null;
        }
        this.loadData();
        this.closeEditor(sender);
    };
    /**
     * @param {?} __0
     * @return {?}
     */
    ThfGridComponent.prototype.removeHandler = /**
     * @param {?} __0
     * @return {?}
     */
    function (_a) {
        var rowIndex = _a.rowIndex;
        if (this.removeAction) {
            if (!this.executeFunctionValidation(this.removeAction, { data: this.data[rowIndex] })) {
                return;
            }
        }
        this.data.splice(rowIndex, 1);
        this.loadData();
    };
    // Verifica se o formulário está válido
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.isValidForm = /**
     * @return {?}
     */
    function () {
        return (this.formGroup && this.formGroup.valid);
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.allData = /**
     * @return {?}
     */
    function () {
        return {
            data: process(this.data, {}).data
        };
    };
    /**
     * @param {?} event
     * @param {?} index
     * @param {?} data
     * @param {?} column
     * @return {?}
     */
    ThfGridComponent.prototype.changeValueCheckbox = /**
     * @param {?} event
     * @param {?} index
     * @param {?} data
     * @param {?} column
     * @return {?}
     */
    function (event, index, data, column) {
        if (!this.editable) {
            event.target.checked = !event.target.checked;
            return;
        }
        data[column] = event.target.checked;
        this.data[index] = Object.assign(data);
        this.saveValue.emit({ data: this.data[index] });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    ThfGridComponent.prototype.onSelectionChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var /** @type {?} */ itemSelected = event && event.selectedRows && event.selectedRows[0].dataItem;
        this.selectionChange.emit({ data: itemSelected });
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.onShowMore = /**
     * @return {?}
     */
    function () {
        this.showMore.emit(null);
        this.loadData();
    };
    /**
     * @param {?} groups
     * @return {?}
     */
    ThfGridComponent.prototype.groupChange = /**
     * @param {?} groups
     * @return {?}
     */
    function (groups) {
        this.groups = groups;
        this.loadData();
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.cleanGroups = /**
     * @return {?}
     */
    function () {
        this.groups.splice(0, this.groups.length);
        this.loadDataDefault();
    };
    // Define se a coluna de ações será visível.
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.isCommandColumnVisible = /**
     * @return {?}
     */
    function () {
        return this.showRemoveButton || this.editable || this.addButton;
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.loadData = /**
     * @return {?}
     */
    function () {
        if (this.isGroup()) {
            this.loadDataGroupable();
        }
        else {
            this.loadDataDefault();
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.createFormGroup = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ group = {};
        this.columns.forEach(function (columnTemp) {
            if (!columnTemp.checkbox) {
                group[columnTemp.column] = columnTemp.required ? new FormControl('', Validators.required) : new FormControl('');
            }
        });
        this.formGroup = new FormGroup(group);
    };
    /**
     * @param {?} func
     * @param {?} param
     * @return {?}
     */
    ThfGridComponent.prototype.executeFunctionValidation = /**
     * @param {?} func
     * @param {?} param
     * @return {?}
     */
    function (func, param) {
        return (func && this.parentRef[func](param));
    };
    /**
     * @param {?} arr
     * @param {?} searchFor
     * @return {?}
     */
    ThfGridComponent.prototype.getRowIndex = /**
     * @param {?} arr
     * @param {?} searchFor
     * @return {?}
     */
    function (arr, searchFor) {
        var _loop_1 = function (i) {
            var /** @type {?} */ isEqual = Object.keys(searchFor).every(function (key) { return (arr[i][key] === searchFor[key]); });
            if (isEqual) {
                return { value: i };
            }
        };
        for (var /** @type {?} */ i = 0; i < arr.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        return -1;
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.validateSaveClick = /**
     * @return {?}
     */
    function () {
        if (this.addButtonCalled && this.saveAction && this.formGroup) {
            if (!this.executeFunctionValidation(this.saveAction, { data: this.formGroup.value })) {
                return false;
            }
        }
        else if (this.editedRowIndex >= 0 && this.saveAction) {
            if (!this.executeFunctionValidation(this.saveAction, { data: this.data[this.editedRowIndex] })) {
                this.closeEditor(this.grid, this.editedRowIndex);
                return false;
            }
        }
        if (!this.isValidForm()) {
            return false;
        }
        return true;
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.isGroup = /**
     * @return {?}
     */
    function () {
        return (this.groups && this.groups.length > 0);
    };
    /**
     * @param {?} key
     * @return {?}
     */
    ThfGridComponent.prototype.getColumn = /**
     * @param {?} key
     * @return {?}
     */
    function (key) {
        return this.columns.find(function (element) { return element.column === key; });
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.loadDataDefault = /**
     * @return {?}
     */
    function () {
        // A variavel "this.data" é a fonte de dados principal,
        // na linha abaixo eu estou atualizando a fonte de dados
        // principal com a fonte de dados ordenada para os indices
        // não se perderem na hora de salvar uma edição.
        this.updateIndex(orderBy(this.data, this.sort));
        this.gridView = {
            data: this.data,
            total: this.data.length
        };
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.loadDataGroupable = /**
     * @return {?}
     */
    function () {
        this.gridView = process(orderBy(this.data, this.sort), { group: this.groups });
        this.dataArrayOrdered = [];
        this.getObjects(this.gridView.data);
        this.updateIndex(this.dataArrayOrdered);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    ThfGridComponent.prototype.getObjects = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        var _this = this;
        data.forEach(function (value) {
            if (value.items instanceof Array) {
                _this.getObjects(value.items);
            }
            else {
                _this.dataArrayOrdered.push(value);
            }
        });
    };
    /**
     * @param {?} dataUpdated
     * @return {?}
     */
    ThfGridComponent.prototype.updateIndex = /**
     * @param {?} dataUpdated
     * @return {?}
     */
    function (dataUpdated) {
        // A variavel "this.data" é a fonte de dados principal,
        // na linha abaixo eu estou atualizando a fonte de dados
        // principal com a fonte de dados ordenada para os indices
        // não se perderem na hora de salvar uma edição.
        for (var /** @type {?} */ i = 0, /** @type {?} */ dataLength = dataUpdated.length; i < dataLength; i++) {
            this.data[i] = dataUpdated[i];
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.initializeColumns = /**
     * @return {?}
     */
    function () {
        if (!this.columns) {
            this.columns = [];
        }
        else {
            this.defineColumnType();
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.initializeData = /**
     * @return {?}
     */
    function () {
        if (!this.data) {
            this.data = [];
        }
        if (this.groupable) {
            this.initializeGroups();
            this.loadDataGroupable();
        }
        else {
            this.loadDataDefault();
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.initializeSorter = /**
     * @return {?}
     */
    function () {
        if (this.sortable) {
            this.sortableObject = {
                allowUnsort: this.sortable,
                mode: 'single'
            };
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.initializeGroups = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ arraySize = this.columns.length;
        for (var /** @type {?} */ count = 0; count < arraySize; count++) {
            var /** @type {?} */ columnTemp = this.columns[count];
            if (this.groups.length < 2 && columnTemp.groupHeader) {
                this.groups.push({ field: columnTemp.column });
            }
        }
    };
    /**
     * @return {?}
     */
    ThfGridComponent.prototype.defineColumnType = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ lookupTableType = {
            number: function (column) {
                column.type = 'numeric';
                column.format = undefined;
            },
            currency: function (column) {
                column.type = 'numeric';
                column.format = '{0:c}';
            },
            date: function (column) {
                column.type = 'date';
                column.format = column.format && column.format.trim().length > 0 ? "{0:" + column.format + "}" : '{0:dd/MM/yyyy}';
            },
            string: function (column) {
                column.type = 'text';
                column.format = undefined;
            }
        };
        this.columns.forEach(function (column) {
            if (column.type && lookupTableType.hasOwnProperty(column.type.trim().toLowerCase())) {
                lookupTableType[column.type.trim().toLowerCase()](column);
            }
            else {
                column.type = 'text';
            }
        });
    };
    /**
     * @param {?} el
     * @param {?} className
     * @return {?}
     */
    ThfGridComponent.prototype.isChildOf = /**
     * @param {?} el
     * @param {?} className
     * @return {?}
     */
    function (el, className) {
        while (el && el.parentElement) {
            if (this.hasClass(el.parentElement, className)) {
                return true;
            }
            el = el.parentElement;
        }
        return false;
    };
    /**
     * @param {?} el
     * @param {?} className
     * @return {?}
     */
    ThfGridComponent.prototype.hasClass = /**
     * @param {?} el
     * @param {?} className
     * @return {?}
     */
    function (el, className) {
        return new RegExp(className).test(el.className);
    };
    /**
     * @param {?} target
     * @return {?}
     */
    ThfGridComponent.prototype.validateSaveEventInDocument = /**
     * @param {?} target
     * @return {?}
     */
    function (target) {
        if (!this.isChildOf(target, 'k-grid-content') && !this.isChildOf(target, 'k-grid-toolbar')) {
            this.saveClick();
        }
    };
    ThfGridComponent.decorators = [
        { type: Component, args: [{
                    selector: 'thf-grid', template: "<kendo-grid [data]=\"gridView\" [sortable]=\"sortableObject\" [sort]=\"sort\" [groupable]=\"groupable\" [group]=\"groups\" [selectable]=\"selectable\" (dataStateChange)=\"dataStateChange($event)\" (groupChange)=\"groupChange($event)\" (selectionChange)=\"onSelectionChange($event)\" (sortChange)=\"sortChange($event)\" (add)=\"addHandler($event)\" (cancel)=\"cancelHandler($event)\" (cellClick)=\"editClickHandler($event)\" (edit)=\"editHandler($event)\" (remove)=\"removeHandler($event)\" (save)=\"saveHandler($event)\" style=\"height: 100%\"> <kendo-grid-messages i18n-noRecords=\"\" noRecords=\"Não há registros\" i18n-groupPanelEmpty=\"\" groupPanelEmpty=\"Arraste a coluna até o cabeçalho e solte para agrupar por esta coluna\"> </kendo-grid-messages> <ng-template kendoGridToolbarTemplate *ngIf=\"addButton || exportButtons\" > <button kendoGridAddCommand *ngIf=\"addButton\" class=\"k-primary\">Adicionar</button> <button type=\"button\" kendoGridExcelCommand *ngIf=\"exportButtons\" ><span class=\"k-icon k-i-file-excel\"></span></button> <button kendoGridPDFCommand *ngIf=\"exportButtons\"><span class='k-icon k-i-file-pdf'></span></button> </ng-template> <kendo-grid-column *ngFor=\"let col of columns; let i = index\" [field]=\"col.column\" [title]=\"col.label\" [width]=\"col.width\" [filter]=\"col.filter\" [format]=\"col.format\" [editor]=\"col.type\"> <ng-template kendoGridCellTemplate let-data *ngIf=\"col.checkbox\" let-columnIndex=\"columnIndex\" let-rowIndex=\"rowIndex\"> <input class=\"thf-grid thf-grid-checkbox\" id=\"chkbox-{{ rowIndex }}-{{ columnIndex }}\" name=\"chkbox-{{ col.column }}-{{ rowIndex }}-{{ columnIndex }}\" type=\"checkbox\" [checked]=\"data[col.column]\" (change)=\"changeValueCheckbox($event, rowIndex, data, col.column)\"/> <label for=\"chkbox-{{ rowIndex }}-{{ columnIndex }}\"></label> </ng-template> <ng-template kendoGridGroupHeaderTemplate let-value=\"value\" *ngIf=\"col.groupHeader\"> {{value}} </ng-template> </kendo-grid-column> <kendo-grid-command-column title=\"\" width=\"80\" locked=\"true\" *ngIf=\"isCommandColumnVisible()\"> <ng-template kendoGridCellTemplate let-isNew=\"isNew\"> <button kendoGridRemoveCommand class=\"k-primary\" *ngIf=\"showRemoveButton\" >Remover</button> <button kendoGridCancelCommand class=\"k-primary\" (click)=\"cancelPropagation($event)\">{{ isNew ? 'Descartar' : 'Cancelar' }} </button> </ng-template> </kendo-grid-command-column> <kendo-grid-excel fileName=\"spreadsheet.xlsx\" [fetchData]=\"allData\"></kendo-grid-excel> <kendo-grid-pdf fileName=\"grid.pdf\" [allPages]=\"true\"> <kendo-grid-pdf-margin top=\"1cm\" left=\"1cm\" right=\"1cm\" bottom=\"1cm\"></kendo-grid-pdf-margin> </kendo-grid-pdf> </kendo-grid> <div class=\"thf-grid-show-more\" *ngIf=\"showMore.observers.length > 0\"> <div style=\"text-align: center;\"> <thf-button t-label=\"Carregar mais resultados\" (t-click)=\"onShowMore()\" [t-disabled]=\"showMoreDisabled\"></thf-button> </div> </div> "
                },] },
    ];
    /** @nocollapse */
    ThfGridComponent.ctorParameters = function () { return [
        { type: ViewContainerRef, },
        { type: Renderer2, },
        { type: IterableDiffers, },
    ]; };
    ThfGridComponent.propDecorators = {
        "exportButtons": [{ type: Input, args: ['t-show-export-buttons',] },],
        "grid": [{ type: ViewChild, args: [GridComponent,] },],
    };
    return ThfGridComponent;
}(ThfGridBaseComponent));
export { ThfGridComponent };
function ThfGridComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ThfGridComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ThfGridComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    ThfGridComponent.propDecorators;
    /** @type {?} */
    ThfGridComponent.prototype.editedRowIndex;
    /** @type {?} */
    ThfGridComponent.prototype.editedProducted;
    /** @type {?} */
    ThfGridComponent.prototype.formGroup;
    /** @type {?} */
    ThfGridComponent.prototype.groups;
    /** @type {?} */
    ThfGridComponent.prototype.gridView;
    /** @type {?} */
    ThfGridComponent.prototype.sortableObject;
    /** @type {?} */
    ThfGridComponent.prototype.sort;
    /** @type {?} */
    ThfGridComponent.prototype.state;
    /**
     * Habilita a opção para exportação dos dados.
     * @type {?}
     */
    ThfGridComponent.prototype.exportButtons;
    /** @type {?} */
    ThfGridComponent.prototype.addButtonCalled;
    /** @type {?} */
    ThfGridComponent.prototype.dataArrayOrdered;
    /** @type {?} */
    ThfGridComponent.prototype.differ;
    /** @type {?} */
    ThfGridComponent.prototype.grid;
    /** @type {?} */
    ThfGridComponent.prototype.renderer;
}
