import { Injectable } from '@angular/core';
import { colors, defaultOptions } from '../amcharts/default-options';
import { Metric, METRICS } from '../../../model/chart-metrics';

@Injectable()
export class ManagerService {
  chartOptions;

  constructor() {}

  public getChartOptions() {
    this.chartOptions = JSON.parse(JSON.stringify(defaultOptions));

    return this.chartOptions;
  }

  getValueAxes(metrics: string[]) {
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
          return metric + ': <b>' + item.values.value + '</b>';
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

  public updateDataPoint(data: any, metrics: string[]) {
    const tempData = [];
    if (data) {
      Object.keys(data).map(label => {
        const obj = {};
        obj['date'] = label;
        metrics.forEach(metricId => {
          const metric = this.getMetric(metricId)
          obj[metricId] = data[label][metric.group][metric.type];
        });
        tempData.push(obj);
      });
    }
    return tempData;
  }

  public getMetric(metricId): Metric {
    const filteredMetrics: Metric[] = METRICS.filter(
      metric => metricId === metric.id
    );
    return filteredMetrics.length ? filteredMetrics[0] : null;
  }
  public getMetricDisplay(metricId): string {
    const filteredMetrics: Metric[] = METRICS.filter(
      metric => metricId === metric.id
    );
    return filteredMetrics.length ? filteredMetrics[0].display : null;
  }
  public getMetricPrefix(metricId): string {
    const filteredMetrics: Metric[] = METRICS.filter(
      metric => metricId === metric.id,
    );
    return filteredMetrics.length && filteredMetrics[0].prefix
      ? filteredMetrics[0].prefix
      : null;
  }
}
