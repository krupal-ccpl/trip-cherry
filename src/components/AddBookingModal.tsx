import { useState } from "react";
import * as MT from "@material-tailwind/react";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";

interface Booking {
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
  processingFees: number;
  actualFare: number;
  grossProfit: number;
  netProfit: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (booking: Booking) => void;
}

export default function AddBookingModal({ isOpen, onClose, onAdd }: AddBookingModalProps) {
  // Sample guest names for autocomplete with avatars
  const guestNames = [
    { name: "Rajesh Kumar", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Priya Sharma", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Amit Patel", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Neha Gupta", avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "Rahul Singh", avatar: "https://i.pravatar.cc/150?img=14" },
    { name: "Anjali Desai", avatar: "https://i.pravatar.cc/150?img=10" },
    { name: "Vikram Reddy", avatar: "https://i.pravatar.cc/150?img=15" },
    { name: "Sneha Iyer", avatar: "https://i.pravatar.cc/150?img=16" },
    { name: "Karan Malhotra", avatar: "https://i.pravatar.cc/150?img=17" },
    { name: "Pooja Nair", avatar: "https://i.pravatar.cc/150?img=20" },
  ];

  const portals = [
    "TBO",
    "MMT",
    "AirIQ", 
    "GoFlySmart",
    "TripJack",
    "Riya",
    "Cleartrip",
    "Yatra",
    "EaseMyTrip",
    "IRCTC"
  ];

  const airlines = [
    "Air India",
    "IndiGo",
    "SpiceJet",
    "Vistara",
    "Air Asia",
    "GoAir",
    "Akasa",
    "Star Air",
    "Thai Airways",
    "Malaysia Airlines",
    "Singapore Airlines",
    "Emirates",
    "Qatar Airways",
    "Etihad Airways",
    "Turkish Airlines"
  ];

  const ticketTypes = [
    "One Way",
    "Round Trip", 
    "Multi City"
  ];

  const trainClasses = [
    "1A - First AC",
    "2A - Second AC",
    "3A - Third AC",
    "SL - Sleeper",
    "2S - Second Sitting",
    "CC - Chair Car",
    "3E - Third AC Economy"
  ];

  const [newBooking, setNewBooking] = useState({
    bookingType: 'flight' as 'flight' | 'train',
    bookingDate: new Date().toISOString().split('T')[0],
    portal: '',
    guestName: '',
    numberOfTravellers: '1',
    
    // Flight fields
    airline: '',
    ticketType: 'One Way',
    sector: '',
    flightFrom: '',
    flightTo: '',
    departureDate: '',
    arrivalDate: '',
    pnr: '',
    seatCharges: '0',
    luggageCharges: '0',
    mealCharges: '0',
    otherCharges: '0',
    otherChargesRemarks: '',
    
    // Train fields
    trainName: '',
    trainNumber: '',
    trainTicketType: 'One Way',
    class: '3A - Third AC',
    trainFrom: '',
    trainTo: '',
    journeyDate: '',
    
    // Financial fields
    collectedTillDate: '0',
    processingFees: '0',
    actualFare: '0',
    grossProfit: '0',
    netProfit: '0',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Transform guest names to autocomplete options
  const guestOptions: AutocompleteOption[] = guestNames.map(guest => ({
    label: guest.name,
    value: guest.name,
    avatar: guest.avatar
  }));

  const today = new Date().toISOString().split('T')[0];

  const handleGuestSelect = (value: string) => {
    setNewBooking({ ...newBooking, guestName: value });
  };

  const formatDateToDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Common validations
    if (!newBooking.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!newBooking.portal.trim()) {
      newErrors.portal = 'Portal is required';
    }

    // Booking type specific validations
    if (newBooking.bookingType === 'flight') {
      if (!newBooking.airline.trim()) {
        newErrors.airline = 'Airline is required';
      }
      if (!newBooking.flightFrom.trim()) {
        newErrors.flightFrom = 'From city/airport is required';
      }
      if (!newBooking.flightTo.trim()) {
        newErrors.flightTo = 'To city/airport is required';
      }
      if (!newBooking.departureDate) {
        newErrors.departureDate = 'Departure date is required';
      }
      if (!newBooking.pnr.trim()) {
        newErrors.pnr = 'PNR is required';
      }
      if (newBooking.departureDate && newBooking.arrivalDate && 
          new Date(newBooking.arrivalDate) < new Date(newBooking.departureDate)) {
        newErrors.arrivalDate = 'Arrival date cannot be before departure date';
      }
    } else if (newBooking.bookingType === 'train') {
      if (!newBooking.trainName.trim()) {
        newErrors.trainName = 'Train name is required';
      }
      if (!newBooking.trainNumber.trim()) {
        newErrors.trainNumber = 'Train number is required';
      }
      if (!newBooking.trainFrom.trim()) {
        newErrors.trainFrom = 'From station is required';
      }
      if (!newBooking.trainTo.trim()) {
        newErrors.trainTo = 'To station is required';
      }
      if (!newBooking.journeyDate) {
        newErrors.journeyDate = 'Journey date is required';
      }
    }

    // Validate numeric fields
    const numericFields = ['processingFees', 'actualFare', 'seatCharges', 'luggageCharges', 'mealCharges', 'otherCharges'];
    numericFields.forEach(field => {
      const value = parseFloat(newBooking[field as keyof typeof newBooking] as string);
      if (newBooking[field as keyof typeof newBooking] && (isNaN(value) || value < 0)) {
        newErrors[field] = 'Must be a valid non-negative number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const booking: Booking = {
      srNo: Date.now(),
      bookingType: newBooking.bookingType,
      bookingDate: formatDateToDisplay(newBooking.bookingDate),
      portal: newBooking.portal.trim(),
      guestName: newBooking.guestName.trim(),
      numberOfTravellers: parseInt(newBooking.numberOfTravellers) || 1,
      collectedTillDate: parseFloat(newBooking.collectedTillDate) || 0,
      processingFees: parseFloat(newBooking.processingFees) || 0,
      actualFare: parseFloat(newBooking.actualFare) || 0,
      grossProfit: parseFloat(newBooking.grossProfit) || 0,
      netProfit: parseFloat(newBooking.netProfit) || 0,
      status: newBooking.status,
    };

    if (newBooking.bookingType === 'flight') {
      booking.airline = newBooking.airline.trim();
      booking.ticketType = newBooking.ticketType;
      booking.from = newBooking.flightFrom.trim();
      booking.to = newBooking.flightTo.trim();
      booking.sector = `${newBooking.flightFrom.trim()} ${newBooking.flightTo.trim()}`;
      booking.departureDate = formatDateToDisplay(newBooking.departureDate);
      booking.arrivalDate = newBooking.arrivalDate ? formatDateToDisplay(newBooking.arrivalDate) : '';
      booking.pnr = newBooking.pnr.trim().toUpperCase();
      booking.seatCharges = parseFloat(newBooking.seatCharges) || 0;
      booking.luggageCharges = parseFloat(newBooking.luggageCharges) || 0;
      booking.mealCharges = parseFloat(newBooking.mealCharges) || 0;
      booking.otherCharges = parseFloat(newBooking.otherCharges) || 0;
      booking.otherChargesRemarks = newBooking.otherChargesRemarks.trim();
      // Calculate total ancillary for backward compatibility
      booking.ancillary = (parseFloat(newBooking.seatCharges) || 0) + 
                          (parseFloat(newBooking.luggageCharges) || 0) + 
                          (parseFloat(newBooking.mealCharges) || 0) + 
                          (parseFloat(newBooking.otherCharges) || 0);
    } else if (newBooking.bookingType === 'train') {
      booking.trainName = newBooking.trainName.trim();
      booking.trainNumber = newBooking.trainNumber.trim().toUpperCase();
      booking.trainTicketType = newBooking.trainTicketType;
      booking.class = newBooking.class;
      booking.trainFrom = newBooking.trainFrom.trim();
      booking.trainTo = newBooking.trainTo.trim();
      booking.journeyDate = formatDateToDisplay(newBooking.journeyDate);
    }
    
    onAdd(booking);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setNewBooking({
      bookingType: 'flight',
      bookingDate: new Date().toISOString().split('T')[0],
      portal: '',
      guestName: '',
      numberOfTravellers: '1',
      airline: '',
      ticketType: 'One Way',
      sector: '',
      flightFrom: '',
      flightTo: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      seatCharges: '0',
      luggageCharges: '0',
      mealCharges: '0',
      otherCharges: '0',
      otherChargesRemarks: '',
      trainName: '',
      trainNumber: '',
      trainTicketType: 'One Way',
      class: '3A - Third AC',
      trainFrom: '',
      trainTo: '',
      journeyDate: '',
      collectedTillDate: '0',
      processingFees: '0',
      actualFare: '0',
      grossProfit: '0',
      netProfit: '0',
      status: 'confirmed',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Booking</h2>
          <MT.Button
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-sm py-2 px-4"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Upload Tickets
          </MT.Button>
        </div>
        
        {/* Booking Type Selection */}
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Booking Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setNewBooking({ ...newBooking, bookingType: 'flight' })}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                newBooking.bookingType === 'flight'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500'
              }`}
            >
              Flight Booking
            </button>
            <button
              type="button"
              onClick={() => setNewBooking({ ...newBooking, bookingType: 'train' })}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                newBooking.bookingType === 'train'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-purple-500'
              }`}
            >
              Train Booking
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Basic Information</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booking Date</label>
              <MT.Input
                type="date"
                value={newBooking.bookingDate}
                onChange={(e) => setNewBooking({ ...newBooking, bookingDate: e.target.value })}
                max={today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portal *</label>
              <select
                value={newBooking.portal}
                onChange={(e) => setNewBooking({ ...newBooking, portal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Portal</option>
                {portals.map((portal) => (
                  <option key={portal} value={portal}>{portal}</option>
                ))}
              </select>
              {errors.portal && <p className="text-red-500 text-sm mt-1">{errors.portal}</p>}
            </div>
            <div>
              <Autocomplete
                label="Guest Name *"
                value={newBooking.guestName}
                onChange={handleGuestSelect}
                options={guestOptions}
                placeholder="Type guest name..."
                error={errors.guestName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Travellers</label>
              <MT.Input
                type="number"
                value={newBooking.numberOfTravellers}
                onChange={(e) => setNewBooking({ ...newBooking, numberOfTravellers: e.target.value })}
                onKeyDown={handleNumberInput}
                min="1"
                placeholder="1"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
          </div>
        </div>

        {/* Conditional Fields based on Booking Type */}
        {newBooking.bookingType === 'flight' ? (
          <>
            {/* Flight Specific Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Flight Details</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Airline *</label>
                  <select
                    value={newBooking.airline}
                    onChange={(e) => setNewBooking({ ...newBooking, airline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Airline</option>
                    {airlines.map((airline) => (
                      <option key={airline} value={airline}>{airline}</option>
                    ))}
                  </select>
                  {errors.airline && <p className="text-red-500 text-sm mt-1">{errors.airline}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Type</label>
                  <select
                    value={newBooking.ticketType}
                    onChange={(e) => setNewBooking({ ...newBooking, ticketType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {ticketTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PNR *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.pnr}
                    onChange={(e) => setNewBooking({ ...newBooking, pnr: e.target.value.toUpperCase() })}
                    placeholder="Enter PNR"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.pnr && <p className="text-red-500 text-sm mt-1">{errors.pnr}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From (City/Airport) *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.flightFrom}
                    onChange={(e) => setNewBooking({ ...newBooking, flightFrom: e.target.value.toUpperCase() })}
                    placeholder="e.g., BOM, MUMBAI"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.flightFrom && <p className="text-red-500 text-sm mt-1">{errors.flightFrom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To (City/Airport) *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.flightTo}
                    onChange={(e) => setNewBooking({ ...newBooking, flightTo: e.target.value.toUpperCase() })}
                    placeholder="e.g., DEL, DELHI"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.flightTo && <p className="text-red-500 text-sm mt-1">{errors.flightTo}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date *</label>
                  <MT.Input
                    type="date"
                    value={newBooking.departureDate}
                    onChange={(e) => setNewBooking({ ...newBooking, departureDate: e.target.value })}
                    min={today}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.departureDate && <p className="text-red-500 text-sm mt-1">{errors.departureDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Date</label>
                  <MT.Input
                    type="date"
                    value={newBooking.arrivalDate}
                    onChange={(e) => setNewBooking({ ...newBooking, arrivalDate: e.target.value })}
                    min={newBooking.departureDate || today}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.arrivalDate && <p className="text-red-500 text-sm mt-1">{errors.arrivalDate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fare</label>
                  <MT.Input
                    type="number"
                    value={newBooking.actualFare}
                    onChange={(e) => setNewBooking({ ...newBooking, actualFare: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.actualFare && <p className="text-red-500 text-sm mt-1">{errors.actualFare}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Processing Fees</label>
                  <MT.Input
                    type="number"
                    value={newBooking.processingFees}
                    onChange={(e) => setNewBooking({ ...newBooking, processingFees: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.processingFees && <p className="text-red-500 text-sm mt-1">{errors.processingFees}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={newBooking.status}
                    onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as 'confirmed' | 'pending' | 'cancelled' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Flight Additional Charges */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Charges</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seat Charges</label>
                  <MT.Input
                    type="number"
                    value={newBooking.seatCharges}
                    onChange={(e) => setNewBooking({ ...newBooking, seatCharges: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.seatCharges && <p className="text-red-500 text-sm mt-1">{errors.seatCharges}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Luggage Charges</label>
                  <MT.Input
                    type="number"
                    value={newBooking.luggageCharges}
                    onChange={(e) => setNewBooking({ ...newBooking, luggageCharges: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.luggageCharges && <p className="text-red-500 text-sm mt-1">{errors.luggageCharges}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal Charges</label>
                  <MT.Input
                    type="number"
                    value={newBooking.mealCharges}
                    onChange={(e) => setNewBooking({ ...newBooking, mealCharges: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.mealCharges && <p className="text-red-500 text-sm mt-1">{errors.mealCharges}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Charges</label>
                  <MT.Input
                    type="number"
                    value={newBooking.otherCharges}
                    onChange={(e) => setNewBooking({ ...newBooking, otherCharges: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.otherCharges && <p className="text-red-500 text-sm mt-1">{errors.otherCharges}</p>}
                </div>
              </div>
              {(parseFloat(newBooking.otherCharges) > 0 || newBooking.otherChargesRemarks) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Other Charges Remarks</label>
                  <MT.Input
                    type="text"
                    value={newBooking.otherChargesRemarks}
                    onChange={(e) => setNewBooking({ ...newBooking, otherChargesRemarks: e.target.value })}
                    placeholder="Specify other charges..."
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Train Specific Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Train Details</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Train Name *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.trainName}
                    onChange={(e) => setNewBooking({ ...newBooking, trainName: e.target.value })}
                    placeholder="e.g., Rajdhani Express"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.trainName && <p className="text-red-500 text-sm mt-1">{errors.trainName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Train Number *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.trainNumber}
                    onChange={(e) => setNewBooking({ ...newBooking, trainNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g., 12951"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.trainNumber && <p className="text-red-500 text-sm mt-1">{errors.trainNumber}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Type</label>
                  <select
                    value={newBooking.trainTicketType}
                    onChange={(e) => setNewBooking({ ...newBooking, trainTicketType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="One Way">One Way</option>
                    <option value="Round Trip">Round Trip</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Class</label>
                  <select
                    value={newBooking.class}
                    onChange={(e) => setNewBooking({ ...newBooking, class: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {trainClasses.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Station *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.trainFrom}
                    onChange={(e) => setNewBooking({ ...newBooking, trainFrom: e.target.value.toUpperCase() })}
                    placeholder="e.g., MUMBAI CENTRAL"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.trainFrom && <p className="text-red-500 text-sm mt-1">{errors.trainFrom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Station *</label>
                  <MT.Input
                    type="text"
                    value={newBooking.trainTo}
                    onChange={(e) => setNewBooking({ ...newBooking, trainTo: e.target.value.toUpperCase() })}
                    placeholder="e.g., NEW DELHI"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.trainTo && <p className="text-red-500 text-sm mt-1">{errors.trainTo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Journey Date *</label>
                  <MT.Input
                    type="date"
                    value={newBooking.journeyDate}
                    onChange={(e) => setNewBooking({ ...newBooking, journeyDate: e.target.value })}
                    min={today}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.journeyDate && <p className="text-red-500 text-sm mt-1">{errors.journeyDate}</p>}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fare</label>
                  <MT.Input
                    type="number"
                    value={newBooking.actualFare}
                    onChange={(e) => setNewBooking({ ...newBooking, actualFare: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.actualFare && <p className="text-red-500 text-sm mt-1">{errors.actualFare}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Processing Fees</label>
                  <MT.Input
                    type="number"
                    value={newBooking.processingFees}
                    onChange={(e) => setNewBooking({ ...newBooking, processingFees: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder="0"
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.processingFees && <p className="text-red-500 text-sm mt-1">{errors.processingFees}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select
                    value={newBooking.status}
                    onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value as 'confirmed' | 'pending' | 'cancelled' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => { onClose(); resetForm(); }} 
            className="px-6 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className={`px-6 py-2 text-white rounded-lg font-medium transition-colors ${
              newBooking.bookingType === 'flight'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            Add Booking
          </button>
        </div>
      </div>
    </div>
  );
}
