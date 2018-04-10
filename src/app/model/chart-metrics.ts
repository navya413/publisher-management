export interface Metric {
  id: string;
  display: string;
  prefix?: string;
}

const CM_STATS: Metric = { id: 'cmStats', display: 'CM Stats'};
const PUB_STATS: Metric = { id: 'pubStats', display: 'Pub Stats'};
const JOVEO_STATS: Metric = { id: 'joveoStats', display: 'Joveo Stats'};

export const CLICKS_METRICS: Metric[] = [CM_STATS, PUB_STATS, JOVEO_STATS];
