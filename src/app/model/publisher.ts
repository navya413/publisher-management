export interface Publisher {
  id: string;
  name: string;
  currency: string;
  url: string;
  value: string;
  minBid?: number;
  placementAlias?: string;
  placementType?: {
    name: string;
  };
  bidType: {
    name: string;
  };
  perClientPlacements?: boolean;
  country?: string;
  industry?: string[];
  category?: string;
  ftpConfig?: FTPConfig;
  publisherPortalDetails?: PublisherPortalDetails;
  publisherContactDetails?: PublisherContactDetails;
  publisherReconciliationDetails?: PublisherReconciliationDetails;
  feedUpdateInterval?: boolean;
  integrationType?: string;
}

export interface FTPConfig {
  credentials: {
    host: string;
    username: string;
    password: string;
  };
  alertRecipients?: string[];
}

export interface PublisherPortalDetails {
  url?: string;
  username?: string;
  password?: string;
}

export interface PublisherContactDetails {
  name?: string;
  phone?: string;
  email?: string;
  billingEmail?: string;
}

export interface PublisherReconciliationDetails {
  mode?: string;
  startDate?: string;
  frequency?: string;
  timezone?: string;
}
