export interface EntityState {
  fields: string;
  sortOrder: string;
  page: number;
  limit: number;
  query: string;
  status: string;
  days: string;
  startDate?: string;
  endDate?: string;
  agencyId?: string;
  clientId?: string;
  campaignId?: string;
  jobGroupId?: string;
}

export const INITIAL_ENTITY_STATE = {
  fields: '',
  sortOrder: '',
  page: 1,
  limit: 10,
  query: '',
  status: '',
  days: 'This month',
};
