import { useState, useRef, useEffect } from "react";
import * as MT from "@material-tailwind/react";

interface Booking {
  id: number;
  bookingDate: string;
  customerName: string;
  phone: string;
  type: string;
  destination: string;
  arrivalDate: string;
  departureDate: string;
  tourStartMonth: string;
  tourEndMonth: string;
  toBeCollectedTCS: number;
  toBeCollectedGST: number;
  collectedTillDate: number;
  profit: number;
  profitBookedTillDate: number;
  collectionRemaining: number;
}

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (booking: Booking) => void;
  booking?: Booking; // Optional booking for editing
}

export default function AddBookingModal({ isOpen, onClose, onAdd, booking }: AddBookingModalProps) {
  // Sample customer names for autocomplete with avatars
  const customerNames = [
    { name: "Rajesh Kumar", avatar: "https://i.pravatar.cc/150?img=12", phone: "9876543210" },
    { name: "Priya Sharma", avatar: "https://i.pravatar.cc/150?img=5", phone: "8765432109" },
    { name: "Amit Patel", avatar: "https://i.pravatar.cc/150?img=13", phone: "7654321098" },
    { name: "Neha Gupta", avatar: "https://i.pravatar.cc/150?img=9", phone: "6543210987" },
    { name: "Rahul Singh", avatar: "https://i.pravatar.cc/150?img=14", phone: "5432109876" },
    { name: "Anjali Desai", avatar: "https://i.pravatar.cc/150?img=10", phone: "4321098765" },
    { name: "Vikram Reddy", avatar: "https://i.pravatar.cc/150?img=15", phone: "3210987654" },
    { name: "Sneha Iyer", avatar: "https://i.pravatar.cc/150?img=16", phone: "2109876543" },
    { name: "Karan Malhotra", avatar: "https://i.pravatar.cc/150?img=17", phone: "1098765432" },
    { name: "Pooja Nair", avatar: "https://i.pravatar.cc/150?img=20", phone: "9988776655" },
    { name: "Sanjay Mehta", avatar: "https://i.pravatar.cc/150?img=33", phone: "8877665544" },
    { name: "Divya Krishnan", avatar: "https://i.pravatar.cc/150?img=23", phone: "7766554433" },
    { name: "Arjun Rao", avatar: "https://i.pravatar.cc/150?img=60", phone: "6655443322" },
    { name: "Kavita Joshi", avatar: "https://i.pravatar.cc/150?img=26", phone: "5544332211" },
    { name: "Rohan Verma", avatar: "https://i.pravatar.cc/150?img=51", phone: "4433221100" },
    { name: "Meera Kapoor", avatar: "https://i.pravatar.cc/150?img=29", phone: "3322110099" },
    { name: "Aditya Chatterjee", avatar: "https://i.pravatar.cc/150?img=68", phone: "2211009988" },
    { name: "Riya Bose", avatar: "https://i.pravatar.cc/150?img=32", phone: "1100998877" },
    { name: "Manish Agarwal", avatar: "https://i.pravatar.cc/150?img=56", phone: "9998887766" },
    { name: "Swati Pandey", avatar: "https://i.pravatar.cc/150?img=36", phone: "8887776655" }
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

  const [newBooking, setNewBooking] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: '',
    phone: '',
    type: 'Domestic',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    toBeCollectedTCS: '0',
    toBeCollectedGST: '0',
    collectedTillDate: '0',
    profit: '0',
    profitBookedTillDate: '0',
  });

  const destinations = newBooking.type === 'International' ? internationalDestinations : domesticDestinations;
  
  // Include the booking's destination in the options if it's not already there (for editing)
  const allDestinations = booking && booking.destination && !destinations.includes(booking.destination) 
    ? [booking.destination, ...destinations] 
    : destinations;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<typeof customerNames>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const customerInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().split('T')[0];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prefill form when editing a booking
  useEffect(() => {
    if (booking) {
      setNewBooking({
        bookingDate: parseDisplayDateToISO(booking.bookingDate),
        customerName: booking.customerName,
        phone: booking.phone || '',
        type: booking.type,
        destination: booking.destination,
        arrivalDate: parseDisplayDateToISO(booking.arrivalDate),
        departureDate: parseDisplayDateToISO(booking.departureDate),
        toBeCollectedTCS: booking.toBeCollectedTCS.toString(),
        toBeCollectedGST: booking.toBeCollectedGST.toString(),
        collectedTillDate: booking.collectedTillDate.toString(),
        profit: booking.profit.toString(),
        profitBookedTillDate: booking.profitBookedTillDate.toString(),
      });
    } else {
      // Reset form for new booking
      setNewBooking({
        bookingDate: new Date().toISOString().split('T')[0],
        customerName: '',
        phone: '',
        type: 'Domestic',
        destination: '',
        arrivalDate: '',
        departureDate: '',
        toBeCollectedTCS: '0',
        toBeCollectedGST: '0',
        collectedTillDate: '0',
        profit: '0',
        profitBookedTillDate: '0',
      });
    }
  }, [booking]);

  const handleCustomerNameChange = (value: string) => {
    setNewBooking({ ...newBooking, customerName: value });
    
    if (value.length >= 2) {
      const filtered = customerNames.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredCustomers([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    const selectedCustomer = customerNames.find(customer => customer.name === name);
    setNewBooking({ 
      ...newBooking, 
      customerName: name,
      phone: selectedCustomer ? selectedCustomer.phone : ''
    });
    setShowSuggestions(false);
    setFilteredCustomers([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredCustomers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < filteredCustomers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredCustomers[selectedSuggestionIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const formatDateToDisplay = (isoDate: string) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const parseDisplayDateToISO = (displayDate: string) => {
    if (!displayDate) return '';
    // Handle format like "15-Dec-2024"
    const parts = displayDate.split('-');
    if (parts.length !== 3) return '';
    
    const day = parseInt(parts[0]);
    const monthName = parts[1];
    const year = parseInt(parts[2]);
    
    // Convert month name to month number
    const months = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const month = months[monthName as keyof typeof months];
    if (month === undefined) return '';
    
    // Create date string directly to avoid timezone conversion issues
    const dayStr = day.toString().padStart(2, '0');
    const monthStr = (month + 1).toString().padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const newErrors: Record<string, string> = {};

    // Validate dates not in past (only for new bookings, allow past dates for editing)
    if (!booking) {
      if (newBooking.arrivalDate && new Date(newBooking.arrivalDate) < new Date(today)) {
        newErrors.arrivalDate = 'Arrival date cannot be in the past';
      }
      if (newBooking.departureDate && new Date(newBooking.departureDate) < new Date(today)) {
        newErrors.departureDate = 'Departure date cannot be in the past';
      }
    }
    if (newBooking.arrivalDate && newBooking.departureDate && new Date(newBooking.departureDate) < new Date(newBooking.arrivalDate)) {
      newErrors.departureDate = 'Departure date cannot be before arrival date';
    }

    // Validate strings if entered
    if (newBooking.customerName && newBooking.customerName.trim() === '') {
      newErrors.customerName = 'Customer name cannot be empty if entered';
    }
    if (newBooking.phone && (newBooking.phone.length !== 10 || !/^\d{10}$/.test(newBooking.phone))) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }
    if (newBooking.destination && newBooking.destination.trim() === '') {
      newErrors.destination = 'Destination cannot be empty if entered';
    }

    // Validate numbers
    const tcs = parseFloat(newBooking.toBeCollectedTCS);
    if (newBooking.toBeCollectedTCS && (isNaN(tcs) || tcs < 0)) {
      newErrors.toBeCollectedTCS = 'Must be a valid non-negative number';
    }
    const gst = parseFloat(newBooking.toBeCollectedGST);
    if (newBooking.toBeCollectedGST && (isNaN(gst) || gst < 0)) {
      newErrors.toBeCollectedGST = 'Must be a valid non-negative number';
    }
    const collected = parseFloat(newBooking.collectedTillDate);
    if (newBooking.collectedTillDate && (isNaN(collected) || collected < 0)) {
      newErrors.collectedTillDate = 'Must be a valid non-negative number';
    }
    const prof = parseFloat(newBooking.profit);
    if (newBooking.profit && (isNaN(prof) || prof < 0)) {
      newErrors.profit = 'Must be a valid non-negative number';
    }
    const profBooked = parseFloat(newBooking.profitBookedTillDate);
    if (newBooking.profitBookedTillDate && (isNaN(profBooked) || profBooked < 0)) {
      newErrors.profitBookedTillDate = 'Must be a valid non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const toBeCollectedTCS = parseFloat(newBooking.toBeCollectedTCS) || 0;
    const toBeCollectedGST = parseFloat(newBooking.toBeCollectedGST) || 0;
    const collectedTillDate = parseFloat(newBooking.collectedTillDate) || 0;
    const profit = parseFloat(newBooking.profit) || 0;
    const profitBookedTillDate = parseFloat(newBooking.profitBookedTillDate) || 0;
    const collectionRemaining = toBeCollectedTCS + toBeCollectedGST - collectedTillDate;
    
    if (booking) {
      // Edit existing booking
      const updatedBooking = {
        ...booking,
        bookingDate: formatDateToDisplay(newBooking.bookingDate),
        customerName: newBooking.customerName.trim(),
        phone: newBooking.phone,
        type: newBooking.type,
        destination: newBooking.destination.trim(),
        arrivalDate: formatDateToDisplay(newBooking.arrivalDate),
        departureDate: formatDateToDisplay(newBooking.departureDate),
        tourStartMonth: newBooking.arrivalDate ? new Date(newBooking.arrivalDate).toLocaleDateString('en-US', { month: 'long' }) : '',
        tourEndMonth: newBooking.departureDate ? new Date(newBooking.departureDate).toLocaleDateString('en-US', { month: 'long' }) : '',
        toBeCollectedTCS,
        toBeCollectedGST,
        collectedTillDate,
        profit,
        profitBookedTillDate,
        collectionRemaining,
      };
      onAdd(updatedBooking);
    } else {
      // Add new booking
      const booking = {
        ...newBooking,
        id: Date.now(),
        bookingDate: formatDateToDisplay(newBooking.bookingDate),
        customerName: newBooking.customerName.trim(),
        phone: newBooking.phone,
        destination: newBooking.destination.trim(),
        arrivalDate: formatDateToDisplay(newBooking.arrivalDate),
        departureDate: formatDateToDisplay(newBooking.departureDate),
        tourStartMonth: newBooking.arrivalDate ? new Date(newBooking.arrivalDate).toLocaleDateString('en-US', { month: 'long' }) : '',
        tourEndMonth: newBooking.departureDate ? new Date(newBooking.departureDate).toLocaleDateString('en-US', { month: 'long' }) : '',
        toBeCollectedTCS,
        toBeCollectedGST,
        collectedTillDate,
        profit,
        profitBookedTillDate,
        collectionRemaining,
      };
      onAdd(booking);
    }
    
    onClose();
    setNewBooking({
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      phone: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      toBeCollectedTCS: '0',
      toBeCollectedGST: '0',
      collectedTillDate: '0',
      profit: '0',
      profitBookedTillDate: '0',
    });
    setShowSuggestions(false);
    setFilteredCustomers([]);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{booking ? 'Edit Booking' : 'Add New Booking'}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Name</label>
              <div className="relative">
                <input
                  ref={customerInputRef}
                  type="text"
                  value={newBooking.customerName}
                  onChange={(e) => handleCustomerNameChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type customer name..."
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-blue-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {showSuggestions && filteredCustomers.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredCustomers.map((customer, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(customer.name)}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                          index === selectedSuggestionIndex
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <img 
                          src={customer.avatar} 
                          alt={customer.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{customer.name}</span>
                          <span className="text-sm text-gray-500">{customer.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={newBooking.phone}
                onChange={(e) => setNewBooking({ ...newBooking, phone: e.target.value })}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && 
                      e.key !== 'Backspace' && 
                      e.key !== 'Delete' && 
                      e.key !== 'Tab' && 
                      e.key !== 'Escape' && 
                      e.key !== 'Enter' && 
                      !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                placeholder="10-digit phone number"
                maxLength={10}
                className="w-full px-3 py-2 border border-blue-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={newBooking.type}
                onChange={(e) => setNewBooking({ ...newBooking, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <select
                value={newBooking.destination}
                onChange={(e) => setNewBooking({ ...newBooking, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Destination</option>
                {allDestinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Date</label>
              <MT.Input
                type="date"
                value={newBooking.arrivalDate}
                onChange={(e) => setNewBooking({ ...newBooking, arrivalDate: e.target.value })}
                min={today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.arrivalDate && <p className="text-red-500 text-sm">{errors.arrivalDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
              <MT.Input
                type="date"
                value={newBooking.departureDate}
                onChange={(e) => setNewBooking({ ...newBooking, departureDate: e.target.value })}
                min={newBooking.arrivalDate || today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.departureDate && <p className="text-red-500 text-sm">{errors.departureDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Be Collected (TCS)</label>
              <MT.Input
                type="number"
                value={newBooking.toBeCollectedTCS}
                onChange={(e) => setNewBooking({ ...newBooking, toBeCollectedTCS: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.toBeCollectedTCS && <p className="text-red-500 text-sm">{errors.toBeCollectedTCS}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Be Collected (GST)</label>
              <MT.Input
                type="number"
                value={newBooking.toBeCollectedGST}
                onChange={(e) => setNewBooking({ ...newBooking, toBeCollectedGST: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.toBeCollectedGST && <p className="text-red-500 text-sm">{errors.toBeCollectedGST}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Collected Till Date</label>
              <MT.Input
                type="number"
                value={newBooking.collectedTillDate}
                onChange={(e) => setNewBooking({ ...newBooking, collectedTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.collectedTillDate && <p className="text-red-500 text-sm">{errors.collectedTillDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profit</label>
              <MT.Input
                type="number"
                value={newBooking.profit}
                onChange={(e) => setNewBooking({ ...newBooking, profit: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.profit && <p className="text-red-500 text-sm">{errors.profit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profit Booked Till Date</label>
              <MT.Input
                type="number"
                value={newBooking.profitBookedTillDate}
                onChange={(e) => setNewBooking({ ...newBooking, profitBookedTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.profitBookedTillDate && <p className="text-red-500 text-sm">{errors.profitBookedTillDate}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{booking ? 'Update Booking' : 'Add Booking'}</button>
          </div>
        </div>
      </div>
    )
  );
}