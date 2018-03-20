export interface Item {
  name: string;
  value: string;
}

export const BID_TYPES: Item[] = [
  { name: 'CPC', value: 'CPC' },
  { name: 'CPA', value: 'CPA' },
  { name: 'Organic', value: 'Organic' },
  { name: 'PPP', value: 'PPP' }
];

export const PLACEMENT_TYPES: Item[] = [
  { name: 'Job Board', value: 'JobBoard' },
  { name: 'Direct Employer', value: 'DirectEmployer' },
  { name: 'All', value: 'All' }
];

export const FTP_CONFIG: Item = { name: 'FTP Config', value: 'ftpConfig' };
export const PUB_PORTAL_DETAILS: Item = { name: 'Pub Portal Details', value: 'publisherPortalDetails' };
export const PUB_CONTACT_DETAILS: Item = { name: 'Pub Contact Details', value: 'publisherContactDetails' };
export const PUB_RECONCILIATION_DETAILS: Item = { name: 'Pub Reconciliation Details', value: 'publisherReconciliationDetails' };

export const EDIT_OPTIONS: Item[] = [
  FTP_CONFIG,
  PUB_PORTAL_DETAILS,
  PUB_CONTACT_DETAILS,
  PUB_RECONCILIATION_DETAILS
];

