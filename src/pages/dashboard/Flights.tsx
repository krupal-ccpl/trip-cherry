import { useState } from "react";
import * as MT from "@material-tailwind/react";
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
// @ts-expect-error: JS module has no types
import flightsData from "@/data/flights-data.js";
import AddFlightModal from "@/components/AddFlightModal";
import { useInlineAutocomplete } from "@/hooks/useInlineAutocomplete";

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

  // Search, Sort, Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [filters, setFilters] = useState({
    portal: '',
    airline: '',
    ticketType: ''
  });

  // Inline editing state
  const [editingFlight, setEditingFlight] = useState<{ index: number; field: string } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  
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

  // Use the reusable inline autocomplete hook for guest names
  const guestAutocomplete = useInlineAutocomplete({
    items: guestNames,
    filterFunction: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
    onSelect: (guest) => {
      setEditValues({ ...editValues, guestName: guest.name });
    },
  });

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
    guestAutocomplete.reset();
  };

  const cancelFlightEdit = () => {
    setEditingFlight(null);
    setEditValues({});
    guestAutocomplete.reset();
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
    guestAutocomplete.reset();
    
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
    guestAutocomplete.reset();
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

  // Search, Sort, Filter functions
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const getFilteredAndSortedFlights = () => {
    let filtered = flights.filter((flight: Flight) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        flight.guestName.toLowerCase().includes(searchLower) ||
        flight.airline.toLowerCase().includes(searchLower) ||
        flight.portal.toLowerCase().includes(searchLower) ||
        flight.sector.toLowerCase().includes(searchLower) ||
        flight.pnr.toLowerCase().includes(searchLower) ||
        flight.bookingDate.includes(searchTerm) ||
        flight.ticketType.toLowerCase().includes(searchLower);

      // Portal filter
      const matchesPortal = !filters.portal || flight.portal === filters.portal;

      // Airline filter
      const matchesAirline = !filters.airline || flight.airline === filters.airline;

      // Ticket type filter
      const matchesTicketType = !filters.ticketType || flight.ticketType === filters.ticketType;

      return matchesSearch && matchesPortal && matchesAirline && matchesTicketType;
    });

    // Sort
    if (sortConfig) {
      filtered.sort((a: Flight, b: Flight) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        // Handle numeric fields
        if (['collectedTillDate', 'quotedFareInclSeatAncillary', 'quotedFareExclSeatAncillary', 
             'seat', 'ancillary', 'grossFare', 'grossProfit', 'gpat', 'netFare', 'netProfit', 'npat', 'cumuProfit'].includes(sortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        // Handle date fields
        if (['bookingDate', 'departureDate', 'arrivalDate'].includes(sortConfig.key)) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredAndSortedFlights = getFilteredAndSortedFlights();

  // Calculate totals from filtered data
  const totalCollected = filteredAndSortedFlights.reduce((sum: number, item: Flight) => sum + item.collectedTillDate, 0);
  const totalGrossFare = filteredAndSortedFlights.reduce((sum: number, item: Flight) => sum + item.grossFare, 0);
  const totalGrossProfit = filteredAndSortedFlights.reduce((sum: number, item: Flight) => sum + item.grossProfit, 0);
  const totalNettProfit = filteredAndSortedFlights.reduce((sum: number, item: Flight) => sum + item.netProfit, 0);

  return (
    <div className="mt-8">
      {/* Header with Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <MT.Typography variant="h4" color="blue-gray" className="dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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

      {/* Search, Sort, Filter Controls */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.portal}
              onChange={(e) => handleFilter('portal', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Portals</option>
              {portals.map((portal) => (
                <option key={portal} value={portal}>{portal}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.airline}
              onChange={(e) => handleFilter('airline', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Airlines</option>
              {airlines.map((airline) => (
                <option key={airline} value={airline}>{airline}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.ticketType}
              onChange={(e) => handleFilter('ticketType', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Ticket Types</option>
              {ticketTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Flights Table */}
        <MT.Card className="shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
            <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Flight Bookings
            </MT.Typography>
          </div>
          <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="w-full min-w-[2400px] table-auto">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/50">
                  {[
                    { key: "srNo", label: "Sr No" },
                    { key: "bookingDate", label: "Booking Date" },
                    { key: "portal", label: "Portal" },
                    { key: "guestName", label: "Guest Name" },
                    { key: "airline", label: "Airline" },
                    { key: "ticketType", label: "Ticket Type" },
                    { key: "sector", label: "Sector" },
                    { key: "departureDate", label: "Departure Date" },
                    { key: "arrivalDate", label: "Arrival Date" },
                    { key: "pnr", label: "PNR" },
                    { key: "collectedTillDate", label: "Collected till date" },
                    { key: "quotedFareInclSeatAncillary", label: "Quoted Fare (Incl seat and ancillary)" },
                    { key: "quotedFareExclSeatAncillary", label: "Quoted Fare (excl seat and ancillary)" },
                    { key: "seat", label: "Seat" },
                    { key: "ancillary", label: "Ancillary (Luggage/Meal)" },
                    { key: "grossFare", label: "Gross Fare" },
                    { key: "grossProfit", label: "Gross Profit" },
                    { key: "gpat", label: "GPAT" },
                    { key: "netFare", label: "Net Fare" },
                    { key: "netProfit", label: "Net Profit" },
                    { key: "npat", label: "NPAT" },
                    { key: "cumuProfit", label: "Cumu Profit" },
                    { key: "actions", label: "Actions" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      className={`border-b-2 border-blue-200 py-3 px-3 text-left ${header.key !== 'actions' ? 'cursor-pointer hover:bg-blue-100 transition-colors' : ''}`}
                      onClick={() => header.key !== 'actions' && handleSort(header.key)}
                    >
                      <div className="flex items-center justify-between">
                        <MT.Typography
                          variant="small"
                          className="text-xs font-bold text-blue-gray-700 uppercase dark:text-blue-200"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          {header.label}
                        </MT.Typography>
                        {header.key !== 'actions' && (
                          <div className="flex flex-col ml-1">
                            <ArrowUpIcon className={`h-3 w-3 ${sortConfig?.key === header.key && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                            <ArrowDownIcon className={`h-3 w-3 -mt-1 ${sortConfig?.key === header.key && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedFlights.map(
                (item: Flight, index: number) => {
                  const isLastRow = index === flights.length - 1;
                    const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                    return (
                      <tr key={index} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                        <td className={`py-3 px-3 ${rowClass}`}>
                          <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                ref={guestAutocomplete.inputRef}
                                type="text"
                                value={editValues.guestName !== undefined ? editValues.guestName : item.guestName}
                                onChange={(e) => {
                                  setEditValues({ ...editValues, guestName: e.target.value });
                                  guestAutocomplete.handleChange(e.target.value);
                                }}
                                onKeyDown={guestAutocomplete.handleKeyDown}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type guest name..."
                                onClick={(e) => e.stopPropagation()}
                              />
                              {guestAutocomplete.showSuggestions && guestAutocomplete.filteredItems.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                  {guestAutocomplete.filteredItems.map((guest, idx) => (
                                    <div
                                      key={idx}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        guestAutocomplete.selectSuggestion(guest);
                                      }}
                                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                                        idx === guestAutocomplete.selectedIndex
                                          ? "bg-blue-100 text-blue-900"
                                          : "hover:bg-gray-100"
                                      }`}
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
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                                className="w-full px-2 py-1 text-sm font-bold border border-blue-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveFlightEdit(); }} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelFlightEdit(); }} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-blue-600 dark:text-blue-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                  <tr className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-b border-dashed border-gray-300 dark:border-gray-600">
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={newRowData.portal}
                            onChange={(e) => handleNewRowChange('portal', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Portal</option>
                            {portals.map((portal) => (
                              <option key={portal} value={portal}>{portal}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3 relative">
                          <input
                            ref={guestAutocomplete.inputRef}
                            type="text"
                            value={newRowData.guestName}
                            onChange={(e) => {
                              handleNewRowChange('guestName', e.target.value);
                              guestAutocomplete.handleChange(e.target.value);
                            }}
                            onKeyDown={guestAutocomplete.handleKeyDown}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Type guest name..."
                          />
                          {guestAutocomplete.showSuggestions && guestAutocomplete.filteredItems.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {guestAutocomplete.filteredItems.map((guest, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleNewRowChange('guestName', guest.name);
                                    guestAutocomplete.reset();
                                  }}
                                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                    idx === guestAutocomplete.selectedIndex
                                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200"
                                      : "hover:bg-gray-100 dark:hover:bg-gray-600"
                                  }`}
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Sector"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newRowData.departureDate}
                            onChange={(e) => handleNewRowChange('departureDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newRowData.arrivalDate}
                            onChange={(e) => handleNewRowChange('arrivalDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            value={newRowData.pnr}
                            onChange={(e) => handleNewRowChange('pnr', e.target.value.toUpperCase())}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="PNR"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.collectedTillDate}
                            onChange={(e) => handleNewRowChange('collectedTillDate', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Collected"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.quotedFareInclSeatAncillary}
                            onChange={(e) => handleNewRowChange('quotedFareInclSeatAncillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Quoted (Incl)"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.quotedFareExclSeatAncillary}
                            onChange={(e) => handleNewRowChange('quotedFareExclSeatAncillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Quoted (Excl)"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.seat}
                            onChange={(e) => handleNewRowChange('seat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Seat"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.ancillary}
                            onChange={(e) => handleNewRowChange('ancillary', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Ancillary"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.grossFare}
                            onChange={(e) => handleNewRowChange('grossFare', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Gross Fare"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.grossProfit}
                            onChange={(e) => handleNewRowChange('grossProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Gross Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.gpat}
                            onChange={(e) => handleNewRowChange('gpat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="GPAT"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.netFare}
                            onChange={(e) => handleNewRowChange('netFare', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-medium border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Net Fare"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.netProfit}
                            onChange={(e) => handleNewRowChange('netProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Net Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.npat}
                            onChange={(e) => handleNewRowChange('npat', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="NPAT"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newRowData.cumuProfit}
                            onChange={(e) => handleNewRowChange('cumuProfit', parseFloat(e.target.value) || 0)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm font-bold border border-blue-300 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                <tr className="bg-blue-50 dark:bg-blue-900/50 font-bold border-t-2 border-blue-200">
                  <td colSpan={10} className="py-3 px-3 text-right">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Total
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalCollected.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td colSpan={4} className="py-3 px-3"></td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalGrossFare.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalGrossProfit.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td colSpan={2} className="py-3 px-3"></td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
