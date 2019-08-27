export const VIEW_OPTIONS: string[] = ["Settings","Stats","Billing","Clicks"]
export const FOREIGN_CLICKS_OPTIONS: any[] = [
    {
      value: 'COUNTRY',
      display: 'Country'
    },
    {
      value: 'STATE',
      display: 'State'
    },
    {
      value: 'CITY',
      display: 'City'
    },
    {
      value: 'REGION',
      display: 'Region'
    }
  ];
export const DEF_PRESETS: any[] = [
  {
    name: 'Default',
    def: '(-,48hrs,-,bot)',
    duplicate: false,
    latent: 172800000,
    foreign: null,
    bot: true
  },
  {
    name: 'Preset 1',
    def: '(1min,-,Country,-)',
    duplicate: 60000,
    latent: null,
    foreign: 'COUNTRY',
    bot: false
  },
  {
    name: 'Preset 2',
    def: '(1min,24hrs,-,-)',
    duplicate: 60000,
    latent: 86400000,
    foreign: null,
    bot: false
  },
  {
    name: 'Preset 3',
    def: '(1hr,48hrs,-,-)',
    duplicate: 3600000,
    latent: 172800000,
    foreign: null,
    bot: false
  },
  {
    name: 'Preset 4',
    def: '(10min,48hrs,Country,-)',
    duplicate: 600000,
    latent: 172800000,
    foreign: 'COUNTRY',
    bot: false
  },
  {
    name: 'Preset 5',
    def: '(1min,24hrs,Country,-)',
    duplicate: 60000,
    latent: 86400000,
    foreign: 'COUNTRY',
    bot: true
  }
];
export const FEED_TYPES:any[] = [
    {name: 'Comprehensive', value: false},
    {name: 'Client', value: true}
  ]
