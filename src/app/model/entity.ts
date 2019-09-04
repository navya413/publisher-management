export interface Item {
  name: string;
  value: string;
}

export const BID_TYPES: Item[] = [
  { name: 'Pay Per Click', value: 'CPC' },
  { name: 'Pay Per Apply', value: 'CPA' },
  { name: 'Organic', value: 'Organic' },
  { name: 'Pay Per Posting', value: 'PPP' },
  { name: 'Flat Pay Per Click', value: 'FLAT_CPC' },
];

export const PLACEMENT_TYPES: Item[] = [
  { name: 'Job Board', value: 'JobBoard' },
  { name: 'Direct Employer', value: 'DirectEmployer' },
  { name: 'All', value: 'All' }
];

export const FTP_CONFIG: Item = { name: 'FTP Config', value: 'ftpConfig' };
export const PUB_PORTAL_DETAILS: Item = {
  name: 'Pub Portal Details',
  value: 'publisherPortalDetails'
};
export const PUB_CONTACT_DETAILS: Item = {
  name: 'Pub Contact Details',
  value: 'publisherContactDetails'
};
export const PUB_RECONCILIATION_DETAILS: Item = {
  name: 'Pub Reconciliation Details',
  value: 'publisherReconciliationDetails'
};
export const AGENCIES: Item = { name: 'Agencies', value: 'agencies' };
export const EDIT_DETAILS: Item = {
  name: 'Edit Publisher',
  value: 'editPublisher'
}
export const FEED_MAPPING: Item = {
  name: 'Feed Mapping',
  value: 'feedMapping'
}
export const PAUSE_DETAILS: Item = { name: 'Pause', value: 'Pause' };
export const ENABLE_DETAILS: Item = { name: 'Enable', value: 'Enable' };

export const EDIT_OPTIONS: Item[] = [
  AGENCIES,
  FTP_CONFIG,
  PUB_PORTAL_DETAILS,
  PUB_CONTACT_DETAILS,
  PUB_RECONCILIATION_DETAILS
];
export const PUB_EDIT_OPTIONS: Item[] = [
  EDIT_DETAILS,
  FEED_MAPPING
]
export const AGENCY_ENABLE_EDIT_OPTIONS: Item[] = [
  PAUSE_DETAILS,
  EDIT_DETAILS,
  FEED_MAPPING
];
export const AGENCY_PAUSE_EDIT_OPTIONS: Item[] = [
  ENABLE_DETAILS,
  EDIT_DETAILS,
  FEED_MAPPING
]