export interface AdsList {
  content: Ads[];
  hasNext: boolean;
}

export type Ads = {
  adsId: number;
  createdDate: string;
  name: string;
  proposerEmail: string;
  memberId: number;
  checked: boolean;
};

export type GetAdsListRequest = {
  adsId?: number;
}

export type UpdateAdsDateRequest = {
  proposerEmail: string;
  price: long
};

