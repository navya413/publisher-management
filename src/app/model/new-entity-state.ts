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
  spendPubPortal: number;
  spendPubPortalMojo: number;
  spendPubPortalCD: number;
  spendPubPortalSelfServe: number;
}
