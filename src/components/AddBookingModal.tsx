import { useState } from "react";
import * as MT from "@material-tailwind/react";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";

interface Flight {
  srNo: number;
  bookingDate: string;
  portal: string;
  guestName: string;
  airline: string;
  ticketType: string;
  sector: string;
  departureDate: string;
  arrivalDate: string;
  pnr: string;
  collectedTillDate: number;
  quotedFareInclSeatAncillary: number;
  quotedFareExclSeatAncillary: number;
  seat: number;
  ancillary: number;
  grossFare: number;
  grossProfit: number;
  gpat: number;
  netFare: number;
  netProfit: number;
  npat: number;
  cumuProfit: number;
}

interface AddFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (flight: Flight) => void;
}

export default function AddFlightModal({ isOpen, onClose, onAdd }: AddFlightModalProps) {
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
    { name: "Sanjay Mehta", avatar: "https://i.pravatar.cc/150?img=33" },
    { name: "Divya Krishnan", avatar: "https://i.pravatar.cc/150?img=23" },
    { name: "Arjun Rao", avatar: "https://i.pravatar.cc/150?img=60" },
    { name: "Kavita Joshi", avatar: "https://i.pravatar.cc/150?img=26" },
    { name: "Rohan Verma", avatar: "https://i.pravatar.cc/150?img=51" },
    { name: "Meera Kapoor", avatar: "https://i.pravatar.cc/150?img=29" },
    { name: "Aditya Chatterjee", avatar: "https://i.pravatar.cc/150?img=68" },
    { name: "Riya Bose", avatar: "https://i.pravatar.cc/150?img=32" },
    { name: "Manish Agarwal", avatar: "https://i.pravatar.cc/150?img=56" },
    { name: "Swati Pandey", avatar: "https://i.pravatar.cc/150?img=36" }
  ];

  const portals = [
    "TBO",
    "MMT",
    "AirIQ", 
    "GoFlySmart",
    "TripJack",
    "Riya",
    "Aadesh",
    "Cleartrip",
    "Yatra",
    "EaseMyTrip"
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
    "Two Way", 
    "Multi City"
  ];

  const [newFlight, setNewFlight] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    portal: '',
    guestName: '',
    airline: '',
    ticketType: 'One Way',
    sector: '',
    departureDate: '',
    arrivalDate: '',
    pnr: '',
    collectedTillDate: '0',
    quotedFareInclSeatAncillary: '0',
    quotedFareExclSeatAncillary: '0',
    seat: '0',
    ancillary: '0',
    grossFare: '0',
    grossProfit: '0',
    gpat: '0',
    netFare: '0',
    netProfit: '0',
    npat: '0',
    cumuProfit: '0',
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
    setNewFlight({ ...newFlight, guestName: value });
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

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!newFlight.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!newFlight.portal.trim()) {
      newErrors.portal = 'Portal is required';
    }
    if (!newFlight.airline.trim()) {
      newErrors.airline = 'Airline is required';
    }
    if (!newFlight.sector.trim()) {
      newErrors.sector = 'Sector is required';
    }
    if (!newFlight.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }
    if (!newFlight.pnr.trim()) {
      newErrors.pnr = 'PNR is required';
    }

    // Validate dates not in past
    if (newFlight.departureDate && new Date(newFlight.departureDate) < new Date(today)) {
      newErrors.departureDate = 'Departure date cannot be in the past';
    }
    if (newFlight.arrivalDate && new Date(newFlight.arrivalDate) < new Date(today)) {
      newErrors.arrivalDate = 'Arrival date cannot be in the past';
    }
    if (newFlight.departureDate && newFlight.arrivalDate && new Date(newFlight.arrivalDate) < new Date(newFlight.departureDate)) {
      newErrors.arrivalDate = 'Arrival date cannot be before departure date';
    }

    // Validate strings if entered
    if (newFlight.guestName && newFlight.guestName.trim() === '') {
      newErrors.guestName = 'Guest name cannot be empty if entered';
    }
    if (newFlight.sector && newFlight.sector.trim() === '') {
      newErrors.sector = 'Sector cannot be empty if entered';
    }

    // Validate numbers
    const numericFields = [
      'collectedTillDate', 'quotedFareInclSeatAncillary', 'quotedFareExclSeatAncillary', 
      'seat', 'ancillary', 'grossFare', 'grossProfit', 'gpat', 'netFare', 'netProfit', 'npat', 'cumuProfit'
    ];
    
    numericFields.forEach(field => {
      const value = parseFloat(newFlight[field as keyof typeof newFlight] as string);
      if (newFlight[field as keyof typeof newFlight] && (isNaN(value) || value < 0)) {
        newErrors[field] = 'Must be a valid non-negative number';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const flight: Flight = {
      srNo: Date.now(), // Will be properly set when added to the list
      bookingDate: formatDateToDisplay(newFlight.bookingDate),
      portal: newFlight.portal.trim(),
      guestName: newFlight.guestName.trim(),
      airline: newFlight.airline.trim(),
      ticketType: newFlight.ticketType,
      sector: newFlight.sector.trim(),
      departureDate: formatDateToDisplay(newFlight.departureDate),
      arrivalDate: newFlight.arrivalDate ? formatDateToDisplay(newFlight.arrivalDate) : '',
      pnr: newFlight.pnr.trim(),
      collectedTillDate: parseFloat(newFlight.collectedTillDate) || 0,
      quotedFareInclSeatAncillary: parseFloat(newFlight.quotedFareInclSeatAncillary) || 0,
      quotedFareExclSeatAncillary: parseFloat(newFlight.quotedFareExclSeatAncillary) || 0,
      seat: parseFloat(newFlight.seat) || 0,
      ancillary: parseFloat(newFlight.ancillary) || 0,
      grossFare: parseFloat(newFlight.grossFare) || 0,
      grossProfit: parseFloat(newFlight.grossProfit) || 0,
      gpat: parseFloat(newFlight.gpat) || 0,
      netFare: parseFloat(newFlight.netFare) || 0,
      netProfit: parseFloat(newFlight.netProfit) || 0,
      npat: parseFloat(newFlight.npat) || 0,
      cumuProfit: parseFloat(newFlight.cumuProfit) || 0,
    };
    
    onAdd(flight);
    onClose();
    setNewFlight({
      bookingDate: new Date().toISOString().split('T')[0],
      portal: '',
      guestName: '',
      airline: '',
      ticketType: 'One Way',
      sector: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      collectedTillDate: '0',
      quotedFareInclSeatAncillary: '0',
      quotedFareExclSeatAncillary: '0',
      seat: '0',
      ancillary: '0',
      grossFare: '0',
      grossProfit: '0',
      gpat: '0',
      netFare: '0',
      netProfit: '0',
      npat: '0',
      cumuProfit: '0',
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Flight</h2>
          
          {/* Basic Information */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Booking Date</label>
              <MT.Input
                type="date"
                value={newFlight.bookingDate}
                onChange={(e) => setNewFlight({ ...newFlight, bookingDate: e.target.value })}
                max={today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portal</label>
              <select
                value={newFlight.portal}
                onChange={(e) => setNewFlight({ ...newFlight, portal: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Portal</option>
                {portals.map((portal) => (
                  <option key={portal} value={portal}>{portal}</option>
                ))}
              </select>
              {errors.portal && <p className="text-red-500 text-sm">{errors.portal}</p>}
            </div>
            <div>
              <Autocomplete
                label="Guest Name"
                value={newFlight.guestName}
                onChange={handleGuestSelect}
                options={guestOptions}
                placeholder="Type guest name..."
                error={errors.guestName}
              />
            </div>
          </div>

          {/* Flight Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Airline</label>
              <select
                value={newFlight.airline}
                onChange={(e) => setNewFlight({ ...newFlight, airline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Airline</option>
                {airlines.map((airline) => (
                  <option key={airline} value={airline}>{airline}</option>
                ))}
              </select>
              {errors.airline && <p className="text-red-500 text-sm">{errors.airline}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Type</label>
              <select
                value={newFlight.ticketType}
                onChange={(e) => setNewFlight({ ...newFlight, ticketType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {ticketTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sector</label>
              <MT.Input
                type="text"
                value={newFlight.sector}
                onChange={(e) => setNewFlight({ ...newFlight, sector: e.target.value })}
                placeholder="e.g., BOM DEL or AMD BHJ AMD"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.sector && <p className="text-red-500 text-sm">{errors.sector}</p>}
            </div>
          </div>

          {/* Dates and PNR */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
              <MT.Input
                type="date"
                value={newFlight.departureDate}
                onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })}
                min={today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.departureDate && <p className="text-red-500 text-sm">{errors.departureDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Date</label>
              <MT.Input
                type="date"
                value={newFlight.arrivalDate}
                onChange={(e) => setNewFlight({ ...newFlight, arrivalDate: e.target.value })}
                min={newFlight.departureDate || today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.arrivalDate && <p className="text-red-500 text-sm">{errors.arrivalDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PNR</label>
              <MT.Input
                type="text"
                value={newFlight.pnr}
                onChange={(e) => setNewFlight({ ...newFlight, pnr: e.target.value.toUpperCase() })}
                placeholder="Enter PNR"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.pnr && <p className="text-red-500 text-sm">{errors.pnr}</p>}
            </div>
          </div>

          {/* Financial Details - Row 1 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collected Till Date</label>
              <MT.Input
                type="number"
                value={newFlight.collectedTillDate}
                onChange={(e) => setNewFlight({ ...newFlight, collectedTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.collectedTillDate && <p className="text-red-500 text-sm">{errors.collectedTillDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quoted Fare (Incl Seat & Ancillary)</label>
              <MT.Input
                type="number"
                value={newFlight.quotedFareInclSeatAncillary}
                onChange={(e) => setNewFlight({ ...newFlight, quotedFareInclSeatAncillary: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.quotedFareInclSeatAncillary && <p className="text-red-500 text-sm">{errors.quotedFareInclSeatAncillary}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quoted Fare (Excl Seat & Ancillary)</label>
              <MT.Input
                type="number"
                value={newFlight.quotedFareExclSeatAncillary}
                onChange={(e) => setNewFlight({ ...newFlight, quotedFareExclSeatAncillary: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.quotedFareExclSeatAncillary && <p className="text-red-500 text-sm">{errors.quotedFareExclSeatAncillary}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Seat</label>
              <MT.Input
                type="number"
                value={newFlight.seat}
                onChange={(e) => setNewFlight({ ...newFlight, seat: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.seat && <p className="text-red-500 text-sm">{errors.seat}</p>}
            </div>
          </div>

          {/* Financial Details - Row 2 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ancillary (Luggage/Meal)</label>
              <MT.Input
                type="number"
                value={newFlight.ancillary}
                onChange={(e) => setNewFlight({ ...newFlight, ancillary: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.ancillary && <p className="text-red-500 text-sm">{errors.ancillary}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gross Fare</label>
              <MT.Input
                type="number"
                value={newFlight.grossFare}
                onChange={(e) => setNewFlight({ ...newFlight, grossFare: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.grossFare && <p className="text-red-500 text-sm">{errors.grossFare}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gross Profit</label>
              <MT.Input
                type="number"
                value={newFlight.grossProfit}
                onChange={(e) => setNewFlight({ ...newFlight, grossProfit: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.grossProfit && <p className="text-red-500 text-sm">{errors.grossProfit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GPAT</label>
              <MT.Input
                type="number"
                value={newFlight.gpat}
                onChange={(e) => setNewFlight({ ...newFlight, gpat: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.gpat && <p className="text-red-500 text-sm">{errors.gpat}</p>}
            </div>
          </div>

          {/* Financial Details - Row 3 */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Net Fare</label>
              <MT.Input
                type="number"
                value={newFlight.netFare}
                onChange={(e) => setNewFlight({ ...newFlight, netFare: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.netFare && <p className="text-red-500 text-sm">{errors.netFare}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Net Profit</label>
              <MT.Input
                type="number"
                value={newFlight.netProfit}
                onChange={(e) => setNewFlight({ ...newFlight, netProfit: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.netProfit && <p className="text-red-500 text-sm">{errors.netProfit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NPAT</label>
              <MT.Input
                type="number"
                value={newFlight.npat}
                onChange={(e) => setNewFlight({ ...newFlight, npat: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.npat && <p className="text-red-500 text-sm">{errors.npat}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cumulative Profit</label>
              <MT.Input
                type="number"
                value={newFlight.cumuProfit}
                onChange={(e) => setNewFlight({ ...newFlight, cumuProfit: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.cumuProfit && <p className="text-red-500 text-sm">{errors.cumuProfit}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Flight</button>
          </div>
        </div>
      </div>
    )
  );
}