export interface NewEntity {
  entity: string;
  cmStats: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  pubStats: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  joveoStats: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  spendMojo: number;
  spendCD: number;
  spendSelfServe: number;
  spendPubPortal: number;
}

export interface NewEntityTwo {
  stats: {
    clicks: number;
    applies: number;
    botClicks: number;
    spend: number;
    spendMojo: number;
    spendCD: number;
    spendSelfServe: number;
    spendPubPortal: number;
  };
  pivots: {
    pivot1: string;
    pivot2: string;
    pivot3: string;
    pivot4: string;
  };
}
