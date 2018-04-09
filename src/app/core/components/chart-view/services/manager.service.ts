import { Injectable } from '@angular/core';
import { colors, defaultOptions } from '../amcharts/default-options';
import { Metric, CLICKS_METRICS } from '../../../../model/chart-metrics';
import * as moment from 'moment';

@Injectable()
export class ManagerService {
  chartOptions;

  constructor() {}

  public getChartOptions() {
    this.chartOptions = JSON.parse(JSON.stringify(defaultOptions));

    return this.chartOptions;
  }

  getValueAxes() {
    const valueAxes = [{
      id: 'v1',
      gridAlpha: 0.1,
      position: 'left',
      tickLength: 0,
      autoGridCount: true
    }];
    return valueAxes;
  }

  getGraphs(metrics: string[]) {
    const graphs = [];
    metrics.forEach((metric, index) => {
      const graph = {
        id: 'g' + index,
        valueAxis: 'v1',
        type: 'line',
        title: this.getMetricDisplay(metric),
        valueField: metric,
        balloonFunction: (item) => {
          return this.getMetricDisplay(metric) + ': <b>' + this.numberFormatter(item.values.value) + '</b>';
        },
        bullet: 'round',
        bulletBorderAlpha: 1,
        bulletBorderColor: colors['themeDark' + (index + 1)],
        bulletColor: colors['themeLight' + (index + 1)],
        bulletSize: 8,
        hideBulletsCount: 50,
        lineThickness: 2,
        lineColor: colors['themeLight' + (index + 1)],
        animationPlayed: true,
        useLineColorForBulletBorder: false,
      };
      graphs.push(graph);
    });
    return graphs;
  }

  public updateDataPoint(data: any, metrics: string[], chartType: string) {
    const tempData = [];
    if (data) {
      data.map(item => {
        const obj = {};
        obj['date'] = item['entity'];
        metrics.forEach(metricId => {
          obj[metricId] = Number.parseFloat(item[metricId][chartType]).toFixed(2);
        });
        tempData.push(obj);
      });
    }
    return tempData;
  }

  private numberFormatter(val) {
    return Number.parseFloat(val).toLocaleString();
  }
  public getMetricDisplay(metricId): string {
    const filteredMetrics: Metric[] = CLICKS_METRICS.filter(
      metric => metricId === metric.id
    );
    return filteredMetrics.length ? filteredMetrics[0].display : null;
  }

}
