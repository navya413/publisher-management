import {AfterViewChecked, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AmChart, AmChartsService} from "@amcharts/amcharts3-angular";
import {ManagerService} from "./services/manager.service";

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
  providers: [ManagerService]
})
export class ChartViewComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data: any;
  @Input() type: string;
  @Input() selectedMetrics: string[] = [];

  private chart: AmChart;

  @ViewChild('chartDiv') chartDiv: ElementRef;
  constructor(
    private AmCharts: AmChartsService,
    private manager: ManagerService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.createChart();
  }

  createChart() {
    const options = this.manager.getChartOptions();
    options.valueAxes = this.manager.getValueAxes(this.selectedMetrics);
    options.graphs = this.manager.getGraphs(this.selectedMetrics);
    options.dataProvider = this.manager.updateDataPoint(
      this.data,
      this.selectedMetrics
    );
    setTimeout(() => {
      if (options.dataProvider.length) {
        this.chart = this.AmCharts.makeChart(
          this.chartDiv.nativeElement,
          options
        );
      }
    }, 0);
  }

  destroyChart() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

}
