export interface NewEntity {
  entity: string;
  cmStats?: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  pubStats?: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  joveoStats?: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
    cta?: number;
    latentClicks?: number;
    duplicateClicks?: number;
  };
  pubPortalStats?: {
    clicks: number;
    applies: number;
    spend: number;
    botClicks: number;
  };
  spendStats?: {
    mojo: number;
    cd: number;
    vp: number;
  };
}

export interface NewEntityTwo {
  stats: {
    clicks: number;
    applies: number;
    botClicks: number;
    spend: number;
    latentClicks: number,
    duplicateClicks: number,
    cpc: number,
    cpa: number,
    cta: number,
  };
  pivots: {
    pivot1: string;
    pivot2: string;
    pivot3: string;
    pivot4: string;
  };
  job: string;
}
