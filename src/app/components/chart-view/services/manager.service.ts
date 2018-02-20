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
    const valueAxes = [];
    metrics.forEach((metric, index) => {
      const vx = {
        id: index === 0 ? 'v1' : 'v2',
        gridAlpha: index === 0 ? 0.1 : 0,
        position: index === 0 ? 'left' : 'right',
        axisColor: index === 0 ? colors.valueAxis1 : colors.valueAxis2,
        tickLength: 0,
        autoGridCount: true,
        labelFunction: value => {
          return this.getMetricPrefix(metric) + value;
        },
      };
      valueAxes.push(vx);
    });
    return valueAxes;
  }

  getGraphs(metrics: string[]) {
    const graphs = [];
    metrics.forEach((metric, index) => {
      const graph = {
        id: 'g' + index,
        valueAxis: index === 0 ? 'v1' : 'v2',
        type: index === 0 ? 'column' : 'line',
        title: this.getMetricDisplay(metric),
        valueField: metric,
      };
      const columnSettings = {
        lineColor: colors.graphThemeOneDark,
        fillColors: colors.graphThemeOneLight,
        fillAlphas: 1,
        clustered: false,
        columnWidth: 0.5,
      };
      const lineSettings = {
        bullet: 'round',
        bulletBorderAlpha: 1,
        bulletBorderColor: colors.graphThemeOneDark,
        bulletColor: colors.graphThemeOneLight,
        bulletSize: 8,
        hideBulletsCount: 50,
        lineThickness: 2,
        lineColor: colors.valueAxis2,
        animationPlayed: true,
        useLineColorForBulletBorder: false,
      };
      switch (graph.type) {
        case 'column':
          Object.assign(graph, columnSettings);
          break;
        case 'line':
          Object.assign(graph, lineSettings);
          break;
      }
      graphs.push(graph);
    });
    return graphs;
  }

  public updateDataPoint(data: any, metrics: string[]) {
    const tempData = [];
    if (data) {
      for (let i = 0; i < data.labels.length; i++) {
        const obj = {};
        obj['date'] = data.labels[i];
        if (metrics && metrics[0]) {
          obj[metrics[0]] = data[metrics[0]][i];
        }
        if (metrics && metrics[1]) {
          obj[metrics[1]] = data[metrics[1]][i];
        }
        tempData.push(obj);
      }
    }
    return tempData;
  }

  public getMetricDisplay(metricId): string {
    const filteredMetrics: Metric[] = METRICS.filter(
      metric => metricId === metric.id,
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
