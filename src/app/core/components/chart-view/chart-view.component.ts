import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AmChart, AmChartsService } from '@amcharts/amcharts3-angular';
import { ManagerService } from './services/manager.service';
import { CLICKS_METRICS, Metric } from '../../../model/chart-metrics';

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.scss'],
  providers: [ManagerService],
})
export class ChartViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() loading: boolean;
  @Input() data: any;
  @Input() type: string;
  @Input() selectedMetrics: string[] = [];

  private chart: AmChart;
  chartType = 'clicks';

  @ViewChild('chartDiv') chartDiv: ElementRef;

  public allMetrics: Metric[] = CLICKS_METRICS;
  constructor(
    private AmCharts: AmChartsService,
    private manager: ManagerService,
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    this.createChart();
  }

  onChartTypeChange(type) {
    this.chartType = type;
    this.updateChart();
  }

  updateChart() {
    this.destroyChart();
    this.createChart();
  }

  createChart() {
    this.selectedMetrics = [];
    this.allMetrics.forEach((metric: Metric) => {
      this.selectedMetrics.push(metric.id);
    });
    const options = this.manager.getChartOptions();
    options.valueAxes = this.manager.getValueAxes();
    options.graphs = this.manager.getGraphs(this.selectedMetrics);
    options.dataProvider = this.manager.updateDataPoint(
      this.data,
      this.selectedMetrics,
      this.chartType
    );
    setTimeout(() => {
      if (options.dataProvider.length && this.chartDiv) {
        this.chart = this.AmCharts.makeChart(
          this.chartDiv.nativeElement,
          options,
        );
      }
    }, 0);
  }

  destroyChart() {
    if (this.chart) {
      this.AmCharts.destroyChart(this.chart);
    }
  }

  dateRangeChange(dateRange) {
    this.updateChart();
    console.log(dateRange);
  }

  ngOnDestroy() {
    this.destroyChart();
  }
}
