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
]
