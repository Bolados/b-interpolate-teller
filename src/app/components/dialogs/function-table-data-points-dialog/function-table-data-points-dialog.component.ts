import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FuncParam, Point, TellerFormParam } from 'src/app/domains';
import { ChartService, IDataSet } from 'src/app/services/chart/chart.service';
import { StorageService } from 'src/app/services';



@Component({
  selector: 'app-function-table-data-points-dialog',
  templateUrl: './function-table-data-points-dialog.component.html',
  styleUrls: ['./function-table-data-points-dialog.component.scss']
})
export class FunctionTableDataPointsDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator',{static: false}) paginator: MatPaginator;
  @ViewChild('matSort', {static: false}) matSort: MatSort;

  public param: FuncParam;
  public mathjaxFunc;
  dataSource: MatTableDataSource<IDataSet>;
  columns = [
    { columnDef: 'x',     header: 'x',   cell: (element: any) => `${element.x}`     },
    { columnDef: 'y',   header: 'y', cell: (element: any) => `${element.y}`   }
  ];

  displayedColumns = ['id'].concat(this.columns.map(c => c.columnDef)).concat('actions');


  addPoint(element) {
    const point = new Point(+element.x, +element.y);
    const tellerFormParam: TellerFormParam  = new TellerFormParam(
      point,
      0,
      this.storageService.betaMax,
      this.storageService.betaInit,
      this.storageService.deltaX,
      this.storageService.step,
    );
    this.chartService.forceReload = true;
    this.storageService.addTellerPoint(tellerFormParam.toParam(), this.param.func);
    this.chartService.forceReload = false;

  }

  private buildDataSource(param: FuncParam): IDataSet[] {
    return this.chartService.evaluateFuncData(param).data;
  }


  constructor(
    private chartService: ChartService,
    private storageService: StorageService,
    private dialogRef: MatDialogRef<FunctionTableDataPointsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  )
  {
    if(data) {
      this.param = data.param;
      this.dataSource = new MatTableDataSource(this.buildDataSource(this.param));
      this.mathjaxFunc = '$$ F(x) = ' + this.param.func + '$$';
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

}
