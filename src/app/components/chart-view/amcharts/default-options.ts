export enum colors {
  scrollbar = '#AAAAAA',
  scrollbarSelectedBackground = '#888888',

  valueAxis1 = '#666',
  valueAxis2 = '#d86766',

  graphThemeOneLight = '#B1D6FF',
  graphThemeOneDark = '#0096FF'
}

export const defaultOptions = {
  type: 'serial',
  dataDateFormat: 'YYYY-MM-DD',
  precision: 2,
  autoResize: false,
  startEffect: 'easeInSine',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif',
  startDuration: 0.5,
  valueAxes: [],
  graphs: [],
  chartScrollbar: {
    oppositeAxis: false,
    offset: 30,
    scrollbarHeight: 30,
    backgroundAlpha: 0.1,
    selectedBackgroundAlpha: 0.2,
    selectedBackgroundColor: colors.scrollbar,
    graphFillAlpha: 0,
    graphLineAlpha: 0.5,
    selectedGraphFillAlpha: 0,
    selectedGraphLineAlpha: 1,
    autoGridCount: true,
    color: colors.scrollbarSelectedBackground
  },
  chartCursor: {
    categoryBalloonEnabled: false,
    pan: true,
    cursorAlpha: 0,
    valueLineAlpha: 0.2
  },
  categoryField: 'date',
  categoryAxis: {
    parseDates: false,
    dashLength: 1,
    tickLength: 0,
    minorGridEnabled: true
  },
  legend: {
    useGraphSettings: true,
    position: 'top',
    align: 'left',
    markerSize: 8
  },
  balloon: {
    borderThickness: 1,
    shadowAlpha: 0
  },
  export: {
    enabled: false
  },
  dataProvider: []
};
