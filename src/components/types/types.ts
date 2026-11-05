export interface IStudio {
  _id: string;
  providerName?: string;
  accountEmail?: string;
  ownerEmail?: string;
  stageTitle: string;
  deliveryCategory: string;
  capacity: string | number;
  hourlyRate: string | number;
  securityDeposit: string | number;
  geoAddress: string;
  mediaLibraryUrl: string;
  presetChips: string[];
  hardware: string[];
  notes: string;
  amenities?: string[];
  galleryImages?: string[];
  mediaLibraryUrls?: string[];
  gallery?: string[];
  reviews?: IReview[];
}

export interface IReview {
  author: string;
  rating: number;
  comment: string;
  createdAt?: string;
}
