export interface NewEntityState {
  since: string;
  till: string;
  days: number;
}

export const INITIAL_NEW_ENTITY_STATE = {
  since: '',
  till: '',
  days: 'This month',
};
