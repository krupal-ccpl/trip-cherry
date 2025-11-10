import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as MT from "@material-tailwind/react";
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
// @ts-expect-error: JS module has no types
import bookingsListData from "@/data/bookings-list-data.js";
import AddBookingModal from "@/components/AddBookingModal";

export default function BookingList() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(bookingsListData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Inline editing state
  const [editingBooking, setEditingBooking] = useState<{ index: number; field: string } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<typeof customerNames>([]);
  const customerInputRef = useRef<HTMLInputElement>(null);
  
  // Inline ADD functionality state
  const [isEditingNewRow, setIsEditingNewRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: -1,
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: '',
    type: 'Domestic',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    tourStartMonth: '',
    tourEndMonth: '',
    toBeCollectedTCS: 0,
    toBeCollectedGST: 0,
    collectedTillDate: 0,
    profit: 0,
    profitBookedTillDate: 0,
    collectionRemaining: 0,
  });

  // Sample customer names for autocomplete with avatars
  const customerNames = [
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

  const domesticDestinations = [
    "Taj Mahal, Agra",
    "Golden Temple, Amritsar",
    "Jaipur (Pink City)",
    "Goa Beaches",
    "Kerala Backwaters",
    "Mumbai",
    "Delhi",
    "Rishikesh",
    "Ladakh",
    "Udaipur",
    "Varanasi",
    "Mysore Palace",
    "Darjeeling",
    "Shimla",
    "Andaman Islands"
  ];

  const internationalDestinations = [
    "Paris, France",
    "London, UK",
    "New York, USA",
    "Tokyo, Japan",
    "Dubai, UAE",
    "Rome, Italy",
    "Barcelona, Spain",
    "Amsterdam, Netherlands",
    "Sydney, Australia",
    "Singapore",
    "Bangkok, Thailand",
    "Istanbul, Turkey",
    "Berlin, Germany",
    "Vienna, Austria",
    "Prague, Czech Republic"
  ];

  const handleRowClick = (bookingId: number) => {
    navigate(`/dashboard/bookings/${bookingId}`);
  };

  // Inline editing functions
  const startEditingBooking = (index: number, field: string, currentValue: any) => {
    setEditingBooking({ index, field });
    setEditValues({ [field]: currentValue });
  };

  const saveBookingEdit = () => {
    if (!editingBooking) return;

    const { index, field } = editingBooking;
    const newValue = editValues[field];

    const updatedBookings = [...bookings];
    updatedBookings[index] = { ...updatedBookings[index], [field]: newValue };

    // Handle date fields with proper formatting
    if (field === 'arrivalDate') {
      updatedBookings[index].arrivalDate = formatDateToDisplay(newValue);
      updatedBookings[index].tourStartMonth = newValue ? new Date(newValue).toLocaleDateString('en-US', { month: 'long' }) : '';
    }
    if (field === 'departureDate') {
      updatedBookings[index].departureDate = formatDateToDisplay(newValue);
      updatedBookings[index].tourEndMonth = newValue ? new Date(newValue).toLocaleDateString('en-US', { month: 'long' }) : '';
    }
    if (field === 'bookingDate') {
      updatedBookings[index].bookingDate = formatDateToDisplay(newValue);
    }

    // Ensure numeric fields are properly converted
    if (field === 'toBeCollectedTCS') {
      updatedBookings[index].toBeCollectedTCS = parseFloat(newValue) || 0;
    }
    if (field === 'toBeCollectedGST') {
      updatedBookings[index].toBeCollectedGST = parseFloat(newValue) || 0;
    }
    if (field === 'collectedTillDate') {
      updatedBookings[index].collectedTillDate = parseFloat(newValue) || 0;
    }
    if (field === 'profit') {
      updatedBookings[index].profit = parseFloat(newValue) || 0;
    }
    if (field === 'profitBookedTillDate') {
      updatedBookings[index].profitBookedTillDate = parseFloat(newValue) || 0;
    }

    // Recalculate derived fields
    if (field === 'toBeCollectedTCS' || field === 'toBeCollectedGST' || field === 'collectedTillDate') {
      const tcs = parseFloat(updatedBookings[index].toBeCollectedTCS) || 0;
      const gst = parseFloat(updatedBookings[index].toBeCollectedGST) || 0;
      const collected = parseFloat(updatedBookings[index].collectedTillDate) || 0;
      updatedBookings[index].collectionRemaining = tcs + gst - collected;
    }

    setBookings(updatedBookings);
    setEditingBooking(null);
    setEditValues({});
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
  };

  const cancelBookingEdit = () => {
    setEditingBooking(null);
    setEditValues({});
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
  };

  const handleCustomerChange = (value: string) => {
    setEditValues({ ...editValues, customerName: value });
    
    if (value.length >= 2) {
      const filtered = customerNames.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowCustomerSuggestions(true);
    } else {
      setShowCustomerSuggestions(false);
      setFilteredCustomers([]);
    }
  };

  const selectCustomerSuggestion = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditValues({ ...editValues, customerName: name });
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
    
    // Focus back to input if it exists
    setTimeout(() => {
      if (customerInputRef.current) {
        customerInputRef.current.focus();
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
      id: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      toBeCollectedTCS: 0,
      toBeCollectedGST: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
    });
  };

  const handleNewRowChange = (field: string, value: any) => {
    const updatedData = { ...newRowData };
    
    // Store numeric fields as numbers, not strings
    if (['toBeCollectedTCS', 'toBeCollectedGST', 'collectedTillDate', 'profit', 'profitBookedTillDate'].includes(field)) {
      (updatedData as any)[field] = parseFloat(value) || 0;
    } else {
      (updatedData as any)[field] = value;
    }
    
    // Handle customer name change for autocomplete
    if (field === 'customerName') {
      if (value.length >= 2) {
        const filtered = customerNames.filter(customer =>
          customer.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCustomers(filtered);
        setShowCustomerSuggestions(true);
      } else {
        setShowCustomerSuggestions(false);
        setFilteredCustomers([]);
      }
    }
    
    // Auto-calculate derived fields
    if (field === 'arrivalDate' && value) {
      updatedData.tourStartMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    if (field === 'departureDate' && value) {
      updatedData.tourEndMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    
    // Calculate collection remaining - ensure all values are numbers
    const tcs = typeof updatedData.toBeCollectedTCS === 'string' ? parseFloat(updatedData.toBeCollectedTCS) || 0 : updatedData.toBeCollectedTCS || 0;
    const gst = typeof updatedData.toBeCollectedGST === 'string' ? parseFloat(updatedData.toBeCollectedGST) || 0 : updatedData.toBeCollectedGST || 0;
    const collected = typeof updatedData.collectedTillDate === 'string' ? parseFloat(updatedData.collectedTillDate) || 0 : updatedData.collectedTillDate || 0;
    updatedData.collectionRemaining = tcs + gst - collected;
    
    setNewRowData(updatedData);
  };

  const saveNewBooking = () => {
    if (!newRowData.customerName.trim()) {
      alert('Customer name is required');
      return;
    }
    
    const newBooking = {
      ...newRowData,
      id: Date.now(),
      bookingDate: formatDateToDisplay(newRowData.bookingDate),
      arrivalDate: newRowData.arrivalDate ? formatDateToDisplay(newRowData.arrivalDate) : '',
      departureDate: newRowData.departureDate ? formatDateToDisplay(newRowData.departureDate) : '',
    };
    
    setBookings([...bookings, newBooking]);
    setIsEditingNewRow(false);
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
    
    // Reset for next entry
    setNewRowData({
      id: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      toBeCollectedTCS: 0,
      toBeCollectedGST: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
    });
  };

  const cancelNewBooking = () => {
    setIsEditingNewRow(false);
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
    setNewRowData({
      id: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      toBeCollectedTCS: 0,
      toBeCollectedGST: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
    });
  };

  const selectNewRowCustomer = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleNewRowChange('customerName', name);
    setShowCustomerSuggestions(false);
    setFilteredCustomers([]);
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customerInputRef.current && !customerInputRef.current.contains(event.target as Node)) {
        setShowCustomerSuggestions(false);
        setFilteredCustomers([]);
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
          Bookings Management
        </MT.Typography>
        <MT.Button 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsFormOpen(true)}
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Booking
        </MT.Button>
      </div>

      {/* Bookings List Table */}
      <MT.Card className="shadow-lg border border-gray-100" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            All Bookings
          </MT.Typography>
        </div>
        <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <table className="w-full min-w-[1800px] table-auto">
            <thead>
              <tr className="bg-blue-50">
                {[
                  "BOOKING DATE",
                  "CUSTOMER NAME",
                  "DOMESTIC / INTERNATIONAL",
                  "DESTINATION",
                  "ARRIVAL DATE",
                  "DEPARTURE DATE",
                  "TOUR START MONTH",
                  "TOUR END MONTH",
                  "TO BE COLLECTED (TCS)",
                  "TO BE COLLECTED (GST)",
                  "COLLECTED TILL DATE",
                  "COLLECTION REMAINING",
                  "PROFIT",
                  "PROFIT BOOKED TILL DATE"
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
              {bookings.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (booking: any, index: number) => {
                  const isLastRow = index === bookings.length - 1;
                  const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                  return (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(booking.id)}
                    >
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'bookingDate' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={editValues.bookingDate !== undefined ? editValues.bookingDate : formatDateToISO(booking.bookingDate)}
                              onChange={(e) => setEditValues({ ...editValues, bookingDate: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.bookingDate}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'bookingDate', formatDateToISO(booking.bookingDate)); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'customerName' ? (
                          <div className="relative flex items-center gap-2">
                            <input
                              ref={customerInputRef}
                              type="text"
                              value={editValues.customerName !== undefined ? editValues.customerName : booking.customerName}
                              onChange={(e) => handleCustomerChange(e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Type customer name..."
                              onClick={(e) => e.stopPropagation()}
                            />
                            {showCustomerSuggestions && filteredCustomers.length > 0 && (
                              <div className="absolute z-50 w-full mt-20 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {filteredCustomers.map((customer, idx) => (
                                  <div
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectCustomerSuggestion(customer.name);
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                  >
                                    <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm">{customer.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.customerName}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'customerName', booking.customerName); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'type' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editValues.type !== undefined ? editValues.type : booking.type}
                              onChange={(e) => setEditValues({ ...editValues, type: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="Domestic">Domestic</option>
                              <option value="International">International</option>
                            </select>
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Chip
                              size="sm"
                              value={booking.type}
                              color={booking.type === "International" ? "blue" : "green"}
                              className="inline-block"
                            />
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'type', booking.type); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'destination' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editValues.destination !== undefined ? editValues.destination : booking.destination}
                              onChange={(e) => setEditValues({ ...editValues, destination: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="">Select Destination</option>
                              {((editValues.type || booking.type) === 'International' ? internationalDestinations : domesticDestinations).map((dest) => (
                                <option key={dest} value={dest}>{dest}</option>
                              ))}
                            </select>
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.destination}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'destination', booking.destination); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'arrivalDate' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={editValues.arrivalDate !== undefined ? editValues.arrivalDate : formatDateToISO(booking.arrivalDate)}
                              onChange={(e) => setEditValues({ ...editValues, arrivalDate: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.arrivalDate}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'arrivalDate', formatDateToISO(booking.arrivalDate)); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'departureDate' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={editValues.departureDate !== undefined ? editValues.departureDate : formatDateToISO(booking.departureDate)}
                              onChange={(e) => setEditValues({ ...editValues, departureDate: e.target.value })}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.departureDate}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'departureDate', formatDateToISO(booking.departureDate)); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {booking.tourStartMonth}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {booking.tourEndMonth}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'toBeCollectedTCS' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.toBeCollectedTCS !== undefined ? editValues.toBeCollectedTCS : booking.toBeCollectedTCS}
                              onChange={(e) => setEditValues({ ...editValues, toBeCollectedTCS: e.target.value })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.toBeCollectedTCS.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'toBeCollectedTCS', booking.toBeCollectedTCS); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'toBeCollectedGST' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.toBeCollectedGST !== undefined ? editValues.toBeCollectedGST : booking.toBeCollectedGST}
                              onChange={(e) => setEditValues({ ...editValues, toBeCollectedGST: e.target.value })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.toBeCollectedGST.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'toBeCollectedGST', booking.toBeCollectedGST); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'collectedTillDate' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.collectedTillDate !== undefined ? editValues.collectedTillDate : booking.collectedTillDate}
                              onChange={(e) => setEditValues({ ...editValues, collectedTillDate: e.target.value })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.collectedTillDate.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'collectedTillDate', booking.collectedTillDate); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography 
                          className={`text-sm font-medium ${booking.collectionRemaining < 0 ? 'text-green-600' : booking.collectionRemaining > 0 ? 'text-orange-600' : 'text-gray-900'}`}
                          placeholder={undefined} 
                          onPointerEnterCapture={undefined} 
                          onPointerLeaveCapture={undefined}
                        >
                          ₹{booking.collectionRemaining.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'profit' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.profit !== undefined ? editValues.profit : booking.profit}
                              onChange={(e) => setEditValues({ ...editValues, profit: e.target.value })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.profit.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'profit', booking.profit); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'profitBookedTillDate' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.profitBookedTillDate !== undefined ? editValues.profitBookedTillDate : booking.profitBookedTillDate}
                              onChange={(e) => setEditValues({ ...editValues, profitBookedTillDate: e.target.value })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="0"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-bold text-gray-900" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.profitBookedTillDate.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'profitBookedTillDate', booking.profitBookedTillDate); }} />
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
                        <input
                          type="date"
                          value={newRowData.bookingDate}
                          onChange={(e) => handleNewRowChange('bookingDate', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3 relative">
                        <input
                          ref={customerInputRef}
                          type="text"
                          value={newRowData.customerName}
                          onChange={(e) => handleNewRowChange('customerName', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Type customer name..."
                        />
                        {showCustomerSuggestions && filteredCustomers.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {filteredCustomers.map((customer, idx) => (
                              <div
                                key={idx}
                                onMouseDown={(e) => selectNewRowCustomer(customer.name, e)}
                                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                              >
                                <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full" />
                                <span className="text-sm">{customer.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={newRowData.type}
                          onChange={(e) => handleNewRowChange('type', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Domestic">Domestic</option>
                          <option value="International">International</option>
                        </select>
                      </td>
                      <td className="py-3 px-3">
                        <select
                          value={newRowData.destination}
                          onChange={(e) => handleNewRowChange('destination', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Select Destination</option>
                          {(newRowData.type === 'International' ? internationalDestinations : domesticDestinations).map((dest) => (
                            <option key={dest} value={dest}>{dest}</option>
                          ))}
                        </select>
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
                          type="date"
                          value={newRowData.departureDate}
                          onChange={(e) => handleNewRowChange('departureDate', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {newRowData.tourStartMonth || 'Auto'}
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3">
                        <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {newRowData.tourEndMonth || 'Auto'}
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.toBeCollectedTCS}
                          onChange={(e) => handleNewRowChange('toBeCollectedTCS', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="TCS Amount"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.toBeCollectedGST}
                          onChange={(e) => handleNewRowChange('toBeCollectedGST', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="GST Amount"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.collectedTillDate}
                          onChange={(e) => handleNewRowChange('collectedTillDate', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="Collected Amount"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{newRowData.collectionRemaining.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.profit}
                          onChange={(e) => handleNewRowChange('profit', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="Profit Amount"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.profitBookedTillDate}
                          onChange={(e) => handleNewRowChange('profitBookedTillDate', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="Profit Booked"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <CheckIcon 
                            className="h-5 w-5 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1" 
                            onClick={saveNewBooking}
                            title="Save entire row"
                          />
                          <XMarkIcon 
                            className="h-5 w-5 text-red-600 cursor-pointer hover:bg-red-100 rounded p-1" 
                            onClick={cancelNewBooking}
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
                          {formatDateToDisplay(newRowData.bookingDate)}
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Click to add new booking
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3">
                        <MT.Chip
                          size="sm"
                          value={newRowData.type}
                          color="green"
                          className="opacity-50"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Select destination...
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Arrival
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Departure
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Auto
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Auto
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          TCS
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          GST
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Collected
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Auto
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Profit
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Booked
                        </MT.Typography>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <PlusIcon 
                          className="h-5 w-5 text-green-500 cursor-pointer hover:bg-green-100 rounded p-1 mx-auto" 
                          onClick={startEditingNewRow}
                          title="Start adding new booking"
                        />
                      </td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        </MT.CardBody>
      </MT.Card>

      <AddBookingModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAdd={(booking) => setBookings([...bookings, booking])}
      />

    </div>
  );
}
