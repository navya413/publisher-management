export enum colors {
  scrollbar = '#AAAAAA',
  scrollbarSelectedBackground = '#888888',

  themeLight1 = '#a0d468',
  themeDark1 = '#8cc152',
  themeLight2 = '#ffce54',
  themeDark2 = '#f6bb42',
  themeLight3 = '#ed5565',
  themeDark3 = '#da4453',
  themeLight4 = '#6576ed',
  themeDark4 = '#4b61ed',
}

export const defaultOptions = {
  type: 'serial',
  hideCredits: true,
  numberFormatter: {
    precision: -1,
    decimalSeparator: '.',
    thousandsSeparator: ','
  },
  dataDateFormat: 'YYYY-MM-DD',
  precision: 2,
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
    categoryBalloonEnabled: true,
    pan: true,
    cursorAlpha: 0,
    valueLineAlpha: 0.2
  },
  categoryField: 'date',
  categoryAxis: {
    parseDates: true,
    dashLength: 1,
    tickLength: 0,
    minorGridEnabled: true
  },
  legend: {
    useGraphSettings: true,
    position: 'top',
    align: 'left',
    markerSize: 10
  },
  balloon: {
    shadowAlpha: 0,
    cornerRadius: 2,
    adjustBorderColor: false,
    horizontalPadding: 10,
    verticalPadding: 10
  },
  export: {
    enabled: false
  },
  dataProvider: []
};
