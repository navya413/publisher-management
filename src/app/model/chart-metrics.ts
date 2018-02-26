export interface Metric {
  id: string;
  display: string;
  type: string;
  group: string;
  prefix?: string;
}

export const CM_CLICKS: Metric = { id: 'cmClicks', display: 'CM Clicks', type: 'clicks', group: 'cmStats'};
export const PUB_PORTAL_CLICKS: Metric = { id: 'pubPortalClicks', display: 'PubPortal Clicks', type: 'clicks', group: 'pubPortalStats'};
export const PUB_DATA_CLICKS: Metric = { id: 'pubDataClicks', display: 'PubData Clicks', type: 'clicks', group: 'pubDataStats'};
export const MOJO_CLICKS: Metric = { id: 'mojoClicks', display: 'Mojo Clicks', type: 'clicks', group: 'mojoStats'};

export const METRICS: Metric[] = [CM_CLICKS, PUB_PORTAL_CLICKS, PUB_DATA_CLICKS, MOJO_CLICKS];
