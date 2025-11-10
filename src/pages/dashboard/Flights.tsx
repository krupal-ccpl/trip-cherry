import { useState, useRef, useEffect } from "react";
import * as MT from "@material-tailwind/react";
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
// @ts-expect-error: JS module has no types
import flightsData from "@/data/flights-data.js";
import AddFlightModal from "@/components/AddFlightModal";

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

export default function Flights() {
  const [flights, setFlights] = useState(flightsData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Inline editing state
  const [editingFlight, setEditingFlight] = useState<{ index: number; field: string } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [showGuestSuggestions, setShowGuestSuggestions] = useState(false);
  const [filteredGuests, setFilteredGuests] = useState<typeof guestNames>([]);
  const guestInputRef = useRef<HTMLInputElement>(null);
  
  // Inline ADD functionality state
  const [isEditingNewRow, setIsEditingNewRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    srNo: -1,
    bookingDate: new Date().toISOString().split('T')[0],
    portal: '',
    guestName: '',
    airline: '',
    ticketType: 'One Way',
    sector: '',
    departureDate: '',
    arrivalDate: '',
    pnr: '',
    collectedTillDate: 0,
    quotedFareInclSeatAncillary: 0,
    quotedFareExclSeatAncillary: 0,
    seat: 0,
    ancillary: 0,
    grossFare: 0,
    grossProfit: 0,
    gpat: 0,
    netFare: 0,
    netProfit: 0,
    npat: 0,
    cumuProfit: 0,
  });

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

  // Calculate totals
  const totalCollected = flights.reduce((sum: number, item: Flight) => sum + item.collectedTillDate, 0);
  const totalGrossFare = flights.reduce((sum: number, item: Flight) => sum + item.grossFare, 0);
  const totalGrossProfit = flights.reduce((sum: number, item: Flight) => sum + item.grossProfit, 0);
  const totalNettProfit = flights.reduce((sum: number, item: Flight) => sum + item.netProfit, 0);

  // Inline editing functions
  const startEditingFlight = (index: number, field: string, currentValue: any) => {
    setEditingFlight({ index, field });
    setEditValues({ [field]: currentValue });
  };

  const saveFlightEdit = () => {
    if (!editingFlight) return;

    const { index, field } = editingFlight;
    const newValue = editValues[field];

    const updatedFlights = [...flights];
    updatedFlights[index] = { ...updatedFlights[index], [field]: newValue };

    // Handle date fields with proper formatting
    if (field === 'departureDate') {
      updatedFlights[index].departureDate = formatDateToDisplay(newValue);
    }
    if (field === 'arrivalDate') {
      updatedFlights[index].arrivalDate = newValue ? formatDateToDisplay(newValue) : '';
    }
    if (field === 'bookingDate') {
      updatedFlights[index].bookingDate = formatDateToDisplay(newValue);
    }

    // Ensure numeric fields are properly converted
    const numericFields = ['collectedTillDate', 'quotedFareInclSeatAncillary', 'quotedFareExclSeatAncillary', 
                          'seat', 'ancillary', 'grossFare', 'grossProfit', 'gpat', 'netFare', 'netProfit', 'npat', 'cumuProfit'];
    
    if (numericFields.includes(field)) {
      updatedFlights[index][field as keyof Flight] = parseFloat(newValue) || 0;
    }

    setFlights(updatedFlights);
    setEditingFlight(null);
    setEditValues({});
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
  };

  const cancelFlightEdit = () => {
    setEditingFlight(null);
    setEditValues({});
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
  };

  const handleGuestChange = (value: string) => {
    setEditValues({ ...editValues, guestName: value });
    
    if (value.length >= 2) {
      const filtered = guestNames.filter(guest =>
        guest.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGuests(filtered);
      setShowGuestSuggestions(true);
    } else {
      setShowGuestSuggestions(false);
      setFilteredGuests([]);
    }
  };

  const selectGuestSuggestion = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditValues({ ...editValues, guestName: name });
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
    
    // Focus back to input if it exists
    setTimeout(() => {
      if (guestInputRef.current) {
        guestInputRef.current.focus();
      }
    }, 0);
  };

  const formatDateToDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateToISO = (displayDate: string) => {
    if (!displayDate) return '';
    const parts = displayDate.split('-');
    if (parts.length !== 3) return '';
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const monthMap: {[key: string]: string} = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
      'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    const monthNum = monthMap[month] || '01';
    return `${year}-${monthNum}-${day.padStart(2, '0')}`;
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault();
    }
  };

  // New row management functions
  const startEditingNewRow = () => {
    setIsEditingNewRow(true);
    setNewRowData({
      srNo: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      portal: '',
      guestName: '',
      airline: '',
      ticketType: 'One Way',
      sector: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      collectedTillDate: 0,
      quotedFareInclSeatAncillary: 0,
      quotedFareExclSeatAncillary: 0,
      seat: 0,
      ancillary: 0,
      grossFare: 0,
      grossProfit: 0,
      gpat: 0,
      netFare: 0,
      netProfit: 0,
      npat: 0,
      cumuProfit: 0,
    });
  };

  const handleNewRowChange = (field: string, value: any) => {
    const updatedData = { ...newRowData };
    
    // Store numeric fields as numbers, not strings
    const numericFields = ['collectedTillDate', 'quotedFareInclSeatAncillary', 'quotedFareExclSeatAncillary', 
                          'seat', 'ancillary', 'grossFare', 'grossProfit', 'gpat', 'netFare', 'netProfit', 'npat', 'cumuProfit'];
    
    if (numericFields.includes(field)) {
      (updatedData as any)[field] = parseFloat(value) || 0;
    } else {
      (updatedData as any)[field] = value;
    }
    
    // Handle guest name change for autocomplete
    if (field === 'guestName') {
      if (value.length >= 2) {
        const filtered = guestNames.filter(guest =>
          guest.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredGuests(filtered);
        setShowGuestSuggestions(true);
      } else {
        setShowGuestSuggestions(false);
        setFilteredGuests([]);
      }
    }
    
    setNewRowData(updatedData);
  };

  const saveNewFlight = () => {
    if (!newRowData.guestName.trim()) {
      alert('Guest name is required');
      return;
    }
    
    const maxSrNo = flights.reduce((max: number, flight: Flight) => Math.max(max, flight.srNo), 0);
    
    const newFlight = {
      ...newRowData,
      srNo: maxSrNo + 1,
      bookingDate: formatDateToDisplay(newRowData.bookingDate),
      departureDate: newRowData.departureDate ? formatDateToDisplay(newRowData.departureDate) : '',
      arrivalDate: newRowData.arrivalDate ? formatDateToDisplay(newRowData.arrivalDate) : '',
    };
    
    setFlights([...flights, newFlight]);
    setIsEditingNewRow(false);
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
    
    // Reset for next entry
    setNewRowData({
      srNo: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      portal: '',
      guestName: '',
      airline: '',
      ticketType: 'One Way',
      sector: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      collectedTillDate: 0,
      quotedFareInclSeatAncillary: 0,
      quotedFareExclSeatAncillary: 0,
      seat: 0,
      ancillary: 0,
      grossFare: 0,
      grossProfit: 0,
      gpat: 0,
      netFare: 0,
      netProfit: 0,
      npat: 0,
      cumuProfit: 0,
    });
  };

  const cancelNewFlight = () => {
    setIsEditingNewRow(false);
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
    setNewRowData({
      srNo: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      portal: '',
      guestName: '',
      airline: '',
      ticketType: 'One Way',
      sector: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      collectedTillDate: 0,
      quotedFareInclSeatAncillary: 0,
      quotedFareExclSeatAncillary: 0,
      seat: 0,
      ancillary: 0,
      grossFare: 0,
      grossProfit: 0,
      gpat: 0,
      netFare: 0,
      netProfit: 0,
      npat: 0,
      cumuProfit: 0,
    });
  };

  const selectNewRowGuest = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleNewRowChange('guestName', name);
    setShowGuestSuggestions(false);
    setFilteredGuests([]);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (guestInputRef.current && !guestInputRef.current.contains(event.target as Node)) {
        setShowGuestSuggestions(false);
        setFilteredGuests([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="mt-8">
      {/* Header with Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <MT.Typography variant="h4" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Flights Management
        </MT.Typography>
        <MT.Button 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsFormOpen(true)}
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Flight
        </MT.Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Flights Table */}
        <MT.Card className="shadow-lg border border-gray-100" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
            <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Flight Bookings
            </MT.Typography>
          </div>
          <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="w-full min-w-[2400px] table-auto">
              <thead>
                <tr className="bg-blue-50">
                  {[
                    "Sr No",
                    "Booking Date",
                    "Portal",
                    "Guest Name",
                    "Airline",
                    "Ticket Type",
                    "Sector",
                    "Departure Date",
                    "Arrival Date",
                    "PNR",
                    "Collected till date",
                    "Quoted Fare (Incl seat and ancillary)",
                    "Quoted Fare (excl seat and ancillary)",
                    "Seat",
                    "Ancillary (Luggage/Meal)",
                    "Gross Fare",
                    "Gross Profit",
                    "GPAT",
                    "Net Fare",
                    "Net Profit",
                    "NPAT",
                    "Cumu Profit",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="border-b-2 border-blue-200 py-3 px-3 text-left"
                    >
                      <MT.Typography
                        variant="small"
                        className="text-xs font-bold text-blue-gray-700 uppercase"
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {header}
                      </MT.Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flights.map(
                (item: Flight, index: number) => {
                  const isLastRow = index === flights.length - 1;
                    const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                    return (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className={`py-3 px-3 ${rowClass}`}>
                          <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {item.srNo}
                          </MT.Typography>
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'bookingDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={editValues.bookingDate !== undefined ? editValues.bookingDate : formatDateToISO(item.bookingDate)}
                                onChange={(e) => setEditValues({ ...editValues, bookingDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.bookingDate}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'bookingDate', formatDateToISO(item.bookingDate)); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'portal' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.portal !== undefined ? editValues.portal : item.portal}
                                onChange={(e) => setEditValues({ ...editValues, portal: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="">Select Portal</option>
                                {portals.map((portal) => (
                                  <option key={portal} value={portal}>{portal}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.portal}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'portal', item.portal); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'guestName' ? (
                            <div className="relative flex items-center gap-2">
                              <input
                                ref={guestInputRef}
                                type="text"
                                value={editValues.guestName !== undefined ? editValues.guestName : item.guestName}
                                onChange={(e) => handleGuestChange(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type guest name..."
                                onClick={(e) => e.stopPropagation()}
                              />
                              {showGuestSuggestions && filteredGuests.length > 0 && (
                                <div className="absolute z-50 w-full mt-20 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                  {filteredGuests.map((guest, idx) => (
                                    <div
                                      key={idx}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectGuestSuggestion(guest.name);
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                      <img src={guest.avatar} alt={guest.name} className="w-6 h-6 rounded-full" />
                                      <span className="text-sm">{guest.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.guestName}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'guestName', item.guestName); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'airline' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.airline !== undefined ? editValues.airline : item.airline}
                                onChange={(e) => setEditValues({ ...editValues, airline: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <option value="">Select Airline</option>
                                {airlines.map((airline) => (
                                  <option key={airline} value={airline}>{airline}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.airline}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'airline', item.airline); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'ticketType' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.ticketType !== undefined ? editValues.ticketType : item.ticketType}
                                onChange={(e) => setEditValues({ ...editValues, ticketType: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {ticketTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.ticketType}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'ticketType', item.ticketType); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'sector' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValues.sector !== undefined ? editValues.sector : item.sector}
                                onChange={(e) => setEditValues({ ...editValues, sector: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.sector}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'sector', item.sector); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'departureDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={editValues.departureDate !== undefined ? editValues.departureDate : formatDateToISO(item.departureDate)}
                                onChange={(e) => setEditValues({ ...editValues, departureDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.departureDate}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'departureDate', formatDateToISO(item.departureDate)); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'arrivalDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={editValues.arrivalDate !== undefined ? editValues.arrivalDate : formatDateToISO(item.arrivalDate)}
                                onChange={(e) => setEditValues({ ...editValues, arrivalDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.arrivalDate}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'arrivalDate', formatDateToISO(item.arrivalDate)); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'pnr' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editValues.pnr !== undefined ? editValues.pnr : item.pnr}
                                onChange={(e) => setEditValues({ ...editValues, pnr: e.target.value.toUpperCase() })}
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.pnr}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'pnr', item.pnr); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'collectedTillDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.collectedTillDate !== undefined ? editValues.collectedTillDate : item.collectedTillDate}
                                onChange={(e) => setEditValues({ ...editValues, collectedTillDate: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.collectedTillDate.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'collectedTillDate', item.collectedTillDate); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'quotedFareInclSeatAncillary' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.quotedFareInclSeatAncillary !== undefined ? editValues.quotedFareInclSeatAncillary : item.quotedFareInclSeatAncillary}
                                onChange={(e) => setEditValues({ ...editValues, quotedFareInclSeatAncillary: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.quotedFareInclSeatAncillary.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'quotedFareInclSeatAncillary', item.quotedFareInclSeatAncillary); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'quotedFareExclSeatAncillary' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.quotedFareExclSeatAncillary !== undefined ? editValues.quotedFareExclSeatAncillary : item.quotedFareExclSeatAncillary}
                                onChange={(e) => setEditValues({ ...editValues, quotedFareExclSeatAncillary: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.quotedFareExclSeatAncillary.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'quotedFareExclSeatAncillary', item.quotedFareExclSeatAncillary); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'seat' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.seat !== undefined ? editValues.seat : item.seat}
                                onChange={(e) => setEditValues({ ...editValues, seat: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.seat.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'seat', item.seat); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'ancillary' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.ancillary !== undefined ? editValues.ancillary : item.ancillary}
                                onChange={(e) => setEditValues({ ...editValues, ancillary: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.ancillary.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'ancillary', item.ancillary); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'grossFare' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.grossFare !== undefined ? editValues.grossFare : item.grossFare}
                                onChange={(e) => setEditValues({ ...editValues, grossFare: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.grossFare.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'grossFare', item.grossFare); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'grossProfit' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.grossProfit !== undefined ? editValues.grossProfit : item.grossProfit}
                                onChange={(e) => setEditValues({ ...editValues, grossProfit: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.grossProfit.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'grossProfit', item.grossProfit); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'gpat' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.gpat !== undefined ? editValues.gpat : item.gpat}
                                onChange={(e) => setEditValues({ ...editValues, gpat: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.gpat.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'gpat', item.gpat); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'netFare' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.netFare !== undefined ? editValues.netFare : item.netFare}
                                onChange={(e) => setEditValues({ ...editValues, netFare: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.netFare.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'netFare', item.netFare); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'netProfit' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.netProfit !== undefined ? editValues.netProfit : item.netProfit}
                                onChange={(e) => setEditValues({ ...editValues, netProfit: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.netProfit.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'netProfit', item.netProfit); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'npat' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.npat !== undefined ? editValues.npat : item.npat}
                                onChange={(e) => setEditValues({ ...editValues, npat: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.npat.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'npat', item.npat); }} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingFlight?.index === index && editingFlight?.field === 'cumuProfit' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.cumuProfit !== undefined ? editValues.cumuProfit : item.cumuProfit}
                                onChange={(e) => setEditValues({ ...editValues, cumuProfit: parseFloat(e.target.value) || 0 })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm font-bold border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-blue-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.cumuProfit.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingFlight(index, 'cumuProfit', item.cumuProfit); }} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}

                {/* Empty Row for Inline ADD functionality - ENTIRE ROW APPROACH */}
                {true && (
                  <tr className="hover:bg-green-50 transition-colors border-b border-dashed border-gray-300">
                    {isEditingNewRow ? (
                      // EDITING MODE: All fields become inputs, single Save/Cancel for entire row
                      <>
                        <td className="py-3 px-3">
                          <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Auto
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newRowData.bookingDate}
                            onChange={(e) => handleNewRowChange('bookingDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={newRowData.portal}
                            onChange={(e) => handleNewRowChange('portal', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Portal</option>
                            {portals.map((portal) => (
                              <option key={portal} value={portal}>{portal}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3 relative">
                          <input
                            ref={guestInputRef}
                            type="text"
                            value={newRowData.guestName}
                            onChange={(e) => handleNewRowChange('guestName', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Type guest name..."
                          />
                          {showGuestSuggestions && filteredGuests.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {filteredGuests.map((guest, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => selectNewRowGuest(guest.name, e)}
                                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                  <img src={guest.avatar} alt={guest.name} className="w-6 h-6 rounded-full" />
                                  <span className="text-sm">{guest.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={newRowData.airline}
                            onChange={(e) => handleNewRowChange('airline', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Airline</option>
                            {airlines.map((airline) => (
                              <option key={airline} value={airline}>{airline}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={newRowData.ticketType}
                            onChange={(e) => handleNewRowChange('ticketType', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            {ticketTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={newRowData.sector}
                            onChange={(e) => handleNewRowChange('sector', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Sector"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newRowData.departureDate}
                            onChange={(e) => handleNewRowChange('departureDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newRowData.arrivalDate}
                            onChange={(e) => handleNewRowChange('arrivalDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={newRowData.pnr}
                            onChange={(e) => handleNewRowChange('pnr', e.target.value.toUpperCase())}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="PNR"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.collectedTillDate}
                            onChange={(e) => handleNewRowChange('collectedTillDate', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Collected"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.quotedFareInclSeatAncillary}
                            onChange={(e) => handleNewRowChange('quotedFareInclSeatAncillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Quoted (Incl)"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.quotedFareExclSeatAncillary}
                            onChange={(e) => handleNewRowChange('quotedFareExclSeatAncillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Quoted (Excl)"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.seat}
                            onChange={(e) => handleNewRowChange('seat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Seat"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.ancillary}
                            onChange={(e) => handleNewRowChange('ancillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Ancillary"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.grossFare}
                            onChange={(e) => handleNewRowChange('grossFare', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Gross Fare"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.grossProfit}
                            onChange={(e) => handleNewRowChange('grossProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Gross Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.gpat}
                            onChange={(e) => handleNewRowChange('gpat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="GPAT"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.netFare}
                            onChange={(e) => handleNewRowChange('netFare', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Net Fare"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.netProfit}
                            onChange={(e) => handleNewRowChange('netProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Net Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.npat}
                            onChange={(e) => handleNewRowChange('npat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="NPAT"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.cumuProfit}
                            onChange={(e) => handleNewRowChange('cumuProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Cumu Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <CheckIcon 
                              className="h-5 w-5 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1" 
                              onClick={saveNewFlight}
                              title="Save entire row"
                            />
                            <XMarkIcon 
                              className="h-5 w-5 text-red-600 cursor-pointer hover:bg-red-100 rounded p-1" 
                              onClick={cancelNewFlight}
                              title="Cancel entire row"
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      // DISPLAY MODE: Show placeholder with single click to start editing entire row
                      <>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Auto
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Click to add new flight
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Portal
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Guest Name
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Airline
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Type
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Sector
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Departure
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Arrival
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            PNR
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Collected
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Q. Incl
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Q. Excl
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Seat
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Ancillary
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Gross Fare
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Gross Profit
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            GPAT
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Net Fare
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Net Profit
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            NPAT
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Cumu Profit
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <PlusIcon 
                            className="h-5 w-5 text-green-500 cursor-pointer hover:bg-green-100 rounded p-1 mx-auto" 
                            onClick={startEditingNewRow}
                            title="Start adding new flight"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                )}

                {/* Total Row */}
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                  <td colSpan={10} className="py-3 px-3 text-right">
                    <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Total
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalCollected.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td colSpan={4} className="py-3 px-3"></td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalGrossFare.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalGrossProfit.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td colSpan={2} className="py-3 px-3"></td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalNettProfit.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td colSpan={3} className="py-3 px-3"></td>
                </tr>
              </tbody>
            </table>
          </MT.CardBody>
        </MT.Card>
      </div>

      <AddFlightModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAdd={(flight) => setFlights([...flights, flight])}
      />
    </div>
  );
}
