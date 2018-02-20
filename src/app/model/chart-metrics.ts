export interface Metric {
  id: string;
  display: string;
  prefix?: string;
}

export const SPENT: Metric = { id: 'spent', display: 'Spend', prefix: '$' };
export const CLICKS: Metric = { id: 'clicks', display: 'Clicks' };
export const APPLIES: Metric = { id: 'applies', display: 'Applies' };
export const CTA: Metric = { id: 'cta', display: 'CTA' };
export const CPC: Metric = { id: 'cpc', display: 'CPC', prefix: '$' };
export const CPA: Metric = { id: 'cpa', display: 'CPA', prefix: '$' };

export const METRICS: Metric[] = [CLICKS, CPC, APPLIES, CPA, SPENT, CTA];
