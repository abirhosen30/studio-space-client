export interface IBooking {
  _id: string;
  studioId?: string;
  stageTitle?: string;
  deliveryCategory?: string;
  geoAddress?: string;
  mediaLibraryUrl?: string;
  hourlyRate?: string | number;
  status?: string;
  departureDate?: string | Date;
  bookingDate?: string | Date;
  hours?: string | number;
  message?: string;
}
