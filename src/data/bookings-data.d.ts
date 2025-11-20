export interface Booking {
  srNo: number;
  bookingType: 'flight' | 'train';
  bookingDate: string;
  portal: string;
  guestName: string;
  numberOfTravellers: number;
  
  // Flight specific fields
  airline?: string;
  ticketType?: string;
  sector?: string;
  from?: string;
  to?: string;
  departureDate?: string;
  arrivalDate?: string;
  pnr?: string;
  seatCharges?: number;
  luggageCharges?: number;
  mealCharges?: number;
  otherCharges?: number;
  otherChargesRemarks?: string;
  // For backward compatibility
  seat?: number;
  ancillary?: number;
  
  // Train specific fields
  trainName?: string;
  trainNumber?: string;
  trainTicketType?: string;
  class?: string;
  trainFrom?: string;
  trainTo?: string;
  journeyDate?: string;
  
  // Common financial fields
  collectedTillDate: number;
  quotedFare: number;
  actualFare: number;
  grossProfit: number;
  netProfit: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export const bookingsData: Booking[];
export default bookingsData;
