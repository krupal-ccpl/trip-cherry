import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as MT from "@material-tailwind/react";
import { PlusIcon, PencilIcon, CheckIcon, XMarkIcon, ClockIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
// @ts-expect-error: JS module has no types
import bookingsListData from "@/data/bookings-list-data.js";
import AddBookingModal from "@/components/AddPackageModal";
import { useInlineAutocomplete } from "@/hooks/useInlineAutocomplete";
import PaymentModal from "@/components/PaymentModal";
import HistoryPopover from "@/components/HistoryPopover";

interface Booking {
  id: number;
  bookingDate: string;
  customerName: string;
  phone: string;
  type: string;
  destination: string;
  noOfTravellers: number;
  arrivalDate: string;
  departureDate: string;
  tourStartMonth: string;
  tourEndMonth: string;
  bookingAmount: number;
  advancePayment: number;
  collectionRemaining: number;
  profit: number;
  profitBookedTillDate: number;
}

export default function BookingList() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState(bookingsListData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Payment functionality state
  const [paymentHistory, setPaymentHistory] = useState<{[key: number]: Array<{amount: number; method: 'cash' | 'online'; date: string; timestamp: string}>}>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentPaymentBooking, setCurrentPaymentBooking] = useState<{index: number; maxAmount: number; currentCollected: number} | null>(null);

  // History functionality state
  const [isHistoryPopoverOpen, setIsHistoryPopoverOpen] = useState(false);
  const [currentHistoryBooking, setCurrentHistoryBooking] = useState<number | null>(null);

  // Search, Sort, Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    destination: '',
    collectionStatus: '' // 'pending', 'partial', 'completed'
  });

  // Inline editing state
  const [editingBooking, setEditingBooking] = useState<{ index: number; field: string } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  
  // Inline ADD functionality state
  const [isEditingNewRow, setIsEditingNewRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    id: -1,
    bookingDate: new Date().toISOString().split('T')[0],
    customerName: '',
    phone: '',
    type: 'Domestic',
    destination: '',
    noOfTravellers: 1,
    arrivalDate: '',
    departureDate: '',
    tourStartMonth: '',
    tourEndMonth: '',
    bookingAmount: 0,
    advancePayment: 0,
    profit: 0,
    profitBookedTillDate: 0,
    collectionRemaining: 0,
  });

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

  // Use the reusable inline autocomplete hook for customer names
  const customerAutocomplete = useInlineAutocomplete({
    items: customerNames,
    filterFunction: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
    onSelect: (customer) => {
      setEditValues({ ...editValues, customerName: customer.name });
    },
  });

  const handleRowClick = (bookingId: number) => {
    navigate(`/dashboard/bookings/${bookingId}`);
  };

  // Payment functionality functions
  const openPaymentModal = (index: number) => {
    const booking = bookings[index];
    const maxAmount = booking.bookingAmount;
    const currentCollected = booking.advancePayment;
    
    setCurrentPaymentBooking({ index, maxAmount, currentCollected });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentAdd = (payment: { amount: number; method: 'cash' | 'online'; date: string; timestamp: string }) => {
    if (!currentPaymentBooking) return;

    const { index } = currentPaymentBooking;
    const bookingId = bookings[index].id;

    // Update payment history
    setPaymentHistory(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), payment]
    }));

    // Update booking collected amount
    const updatedBookings = [...bookings];
    updatedBookings[index] = {
      ...updatedBookings[index],
      advancePayment: updatedBookings[index].advancePayment + payment.amount,
      collectionRemaining: updatedBookings[index].bookingAmount - (updatedBookings[index].advancePayment + payment.amount)
    };

    setBookings(updatedBookings);
    setIsPaymentModalOpen(false);
    setCurrentPaymentBooking(null);
  };

  const openHistoryPopover = (bookingIndex: number) => {
    setCurrentHistoryBooking(bookingIndex);
    setIsHistoryPopoverOpen(true);
  };

  const handlePaymentEdit = (index: number, newPayment: { amount: number; method: 'cash' | 'online'; date: string; timestamp: string }) => {
    if (currentHistoryBooking === null) return;

    const bookingId = bookings[currentHistoryBooking].id;
    const oldPayment = paymentHistory[bookingId][index];
    const diff = newPayment.amount - oldPayment.amount;

    // Update payment history
    setPaymentHistory(prev => ({
      ...prev,
      [bookingId]: prev[bookingId].map((p, i) => i === index ? newPayment : p)
    }));

    // Update booking totals
    const updatedBookings = [...bookings];
    updatedBookings[currentHistoryBooking] = {
      ...updatedBookings[currentHistoryBooking],
      advancePayment: updatedBookings[currentHistoryBooking].advancePayment + diff,
      collectionRemaining: updatedBookings[currentHistoryBooking].bookingAmount - (updatedBookings[currentHistoryBooking].advancePayment + diff)
    };
    setBookings(updatedBookings);
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
    if (field === 'bookingAmount') {
      updatedBookings[index].bookingAmount = parseFloat(newValue) || 0;
    }
    if (field === 'advancePayment') {
      updatedBookings[index].advancePayment = parseFloat(newValue) || 0;
    }
    if (field === 'profit') {
      updatedBookings[index].profit = parseFloat(newValue) || 0;
    }
    if (field === 'profitBookedTillDate') {
      updatedBookings[index].profitBookedTillDate = parseFloat(newValue) || 0;
    }
    if (field === 'noOfTravellers') {
      updatedBookings[index].noOfTravellers = parseInt(newValue) || 1;
    }
    if (field === 'phone') {
      // Validate phone number
      if (newValue && (newValue.length !== 10 || !/^\d{10}$/.test(newValue))) {
        alert('Phone number must be exactly 10 digits');
        return;
      }
      updatedBookings[index].phone = newValue;
    }

    // Recalculate derived fields
    if (field === 'bookingAmount' || field === 'advancePayment') {
      const bookingAmt = parseFloat(updatedBookings[index].bookingAmount) || 0;
      const advance = parseFloat(updatedBookings[index].advancePayment) || 0;
      updatedBookings[index].collectionRemaining = bookingAmt - advance;
    }

    setBookings(updatedBookings);
    setEditingBooking(null);
    setEditValues({});
    customerAutocomplete.reset();
  };

  const cancelBookingEdit = () => {
    setEditingBooking(null);
    setEditValues({});
    customerAutocomplete.reset();
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

  const handlePhoneInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only digits 0-9, backspace, delete, tab, escape, enter, and arrow keys
    if (!/[0-9]/.test(e.key) && 
        e.key !== 'Backspace' && 
        e.key !== 'Delete' && 
        e.key !== 'Tab' && 
        e.key !== 'Escape' && 
        e.key !== 'Enter' && 
        !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
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
      phone: '',
      type: 'Domestic',
      destination: '',
      noOfTravellers: 1,
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      bookingAmount: 0,
      advancePayment: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
    });
  };

  const handleNewRowChange = (field: string, value: any) => {
    const updatedData = { ...newRowData };
    
    // Store numeric fields as numbers, not strings
    if (['bookingAmount', 'advancePayment', 'profit', 'profitBookedTillDate', 'noOfTravellers'].includes(field)) {
      (updatedData as any)[field] = parseFloat(value) || 0;
    } else {
      (updatedData as any)[field] = value;
    }
    
    // Auto-calculate derived fields
    if (field === 'arrivalDate' && value) {
      updatedData.tourStartMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    if (field === 'departureDate' && value) {
      updatedData.tourEndMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    
    // Calculate collection remaining - ensure all values are numbers
    const bookingAmt = typeof updatedData.bookingAmount === 'string' ? parseFloat(updatedData.bookingAmount) || 0 : updatedData.bookingAmount || 0;
    const advance = typeof updatedData.advancePayment === 'string' ? parseFloat(updatedData.advancePayment) || 0 : updatedData.advancePayment || 0;
    updatedData.collectionRemaining = bookingAmt - advance;
    
    setNewRowData(updatedData);
  };

  const saveNewBooking = () => {
    if (!newRowData.customerName.trim()) {
      alert('Customer name is required');
      return;
    }
    
    // Validate phone number
    if (newRowData.phone && (newRowData.phone.length !== 10 || !/^\d{10}$/.test(newRowData.phone))) {
      alert('Phone number must be exactly 10 digits');
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
    customerAutocomplete.reset();
    
    // Reset for next entry
    setNewRowData({
      id: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      phone: '',
      type: 'Domestic',
      destination: '',
      noOfTravellers: 1,
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      bookingAmount: 0,
      advancePayment: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
    });
  };

  const cancelNewBooking = () => {
    setIsEditingNewRow(false);
    customerAutocomplete.reset();
    setNewRowData({
      id: -1,
      bookingDate: new Date().toISOString().split('T')[0],
      customerName: '',
      phone: '',
      type: 'Domestic',
      destination: '',
      noOfTravellers: 1,
      arrivalDate: '',
      departureDate: '',
      tourStartMonth: '',
      tourEndMonth: '',
      bookingAmount: 0,
      advancePayment: 0,
      profit: 0,
      profitBookedTillDate: 0,
      collectionRemaining: 0,
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

  const getFilteredAndSortedBookings = () => {
    let filtered = bookings.filter((booking: Booking) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.destination.toLowerCase().includes(searchLower) ||
        booking.phone.includes(searchTerm) ||
        booking.bookingDate.includes(searchTerm) ||
        booking.type.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = !filters.type || booking.type === filters.type;

      // Destination filter
      const matchesDestination = !filters.destination || booking.destination === filters.destination;

      // Collection status filter
      let matchesCollectionStatus = true;
      if (filters.collectionStatus) {
        const totalToCollect = booking.bookingAmount;
        const collected = booking.advancePayment;
        if (filters.collectionStatus === 'pending') {
          matchesCollectionStatus = collected === 0;
        } else if (filters.collectionStatus === 'partial') {
          matchesCollectionStatus = collected > 0 && collected < totalToCollect;
        } else if (filters.collectionStatus === 'completed') {
          matchesCollectionStatus = collected >= totalToCollect;
        }
      }

      return matchesSearch && matchesType && matchesDestination && matchesCollectionStatus;
    });

    // Sort
    if (sortConfig) {
      filtered.sort((a: Booking, b: Booking) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        // Handle numeric fields
        if (['bookingAmount', 'advancePayment', 'profit', 'profitBookedTillDate', 'collectionRemaining'].includes(sortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        // Handle date fields
        if (['bookingDate', 'arrivalDate', 'departureDate'].includes(sortConfig.key)) {
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

  const filteredAndSortedBookings = getFilteredAndSortedBookings();

  return (
    <div className="mt-8">
      {/* Header with Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <MT.Typography variant="h4" color="blue-gray" className="dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Packages Management
        </MT.Typography>
        <MT.Button 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsFormOpen(true)}
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Package
        </MT.Button>
      </div>

      {/* Search, Sort, Filter Controls */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => handleFilter('type', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Types</option>
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.destination}
              onChange={(e) => handleFilter('destination', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Destinations</option>
              {[...domesticDestinations, ...internationalDestinations].map((dest) => (
                <option key={dest} value={dest}>{dest}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.collectionStatus}
              onChange={(e) => handleFilter('collectionStatus', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Collection Status</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Packages List Table */}
      <MT.Card className="shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
          <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            All Packages
          </MT.Typography>
        </div>
        <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <table className="w-full min-w-[1800px] table-auto">
            <thead>
              <tr className="bg-blue-50 dark:bg-blue-900/50">
                {[
                  { key: "bookingDate", label: "BOOKING DATE" },
                  { key: "customerName", label: "CUSTOMER NAME" },
                  { key: "phone", label: "PHONE" },
                  { key: "type", label: "DOMESTIC / INTERNATIONAL" },
                  { key: "destination", label: "DESTINATION" },
                  { key: "noOfTravellers", label: "NO OF TRAVELLERS" },
                  { key: "arrivalDate", label: "ARRIVAL DATE" },
                  { key: "departureDate", label: "DEPARTURE DATE" },
                  { key: "tourStartMonth", label: "TOUR START MONTH" },
                  { key: "tourEndMonth", label: "TOUR END MONTH" },
                  { key: "bookingAmount", label: "BOOKING AMOUNT" },
                  { key: "advancePayment", label: "PAYMENT RECEIVED" },
                  { key: "collectionRemaining", label: "COLLECTION REMAINING" },
                  { key: "profit", label: "PROFIT" },
                  { key: "profitBookedTillDate", label: "PROFIT BOOKED TILL DATE" }
                ].map((header) => (
                  <th
                    key={header.key}
                    className="border-b-2 border-blue-200 py-3 px-3 text-left cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleSort(header.key)}
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
                      <div className="flex flex-col ml-1">
                        <ArrowUpIcon className={`h-3 w-3 ${sortConfig?.key === header.key && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                        <ArrowDownIcon className={`h-3 w-3 -mt-1 ${sortConfig?.key === header.key && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBookings.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (booking: any, index: number) => {
                  const isLastRow = index === bookings.length - 1;
                  const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                  return (
                    <tr 
                      key={booking.id} 
                      className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
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
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                              ref={customerAutocomplete.inputRef}
                              type="text"
                              value={editValues.customerName !== undefined ? editValues.customerName : booking.customerName}
                              onChange={(e) => {
                                setEditValues({ ...editValues, customerName: e.target.value });
                                customerAutocomplete.handleChange(e.target.value);
                              }}
                              onKeyDown={customerAutocomplete.handleKeyDown}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Type customer name..."
                              onClick={(e) => e.stopPropagation()}
                            />
                            {customerAutocomplete.showSuggestions && customerAutocomplete.filteredItems.length > 0 && (
                              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                {customerAutocomplete.filteredItems.map((customer, idx) => (
                                  <div
                                    key={idx}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      customerAutocomplete.selectSuggestion(customer);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
                                      idx === customerAutocomplete.selectedIndex
                                        ? "bg-blue-100 text-blue-900"
                                        : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full" />
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{customer.name}</span>
                                      <span className="text-xs text-gray-500">{customer.phone}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.customerName}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'customerName', booking.customerName); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'phone' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValues.phone !== undefined ? editValues.phone : booking.phone}
                              onChange={(e) => setEditValues({ ...editValues, phone: e.target.value })}
                              onKeyDown={handlePhoneInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="10-digit phone number"
                              maxLength={10}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.phone}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'phone', booking.phone); }} />
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
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.destination}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'destination', booking.destination); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'noOfTravellers' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.noOfTravellers !== undefined ? editValues.noOfTravellers : booking.noOfTravellers}
                              onChange={(e) => setEditValues({ ...editValues, noOfTravellers: parseInt(e.target.value) || 0 })}
                              onKeyDown={handleNumberInput}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              min="1"
                              placeholder="Number of travellers"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); saveBookingEdit(); }} />
                            <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={(e) => { e.stopPropagation(); cancelBookingEdit(); }} />
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.noOfTravellers}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'noOfTravellers', booking.noOfTravellers); }} />
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
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                            <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              {booking.departureDate}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'departureDate', formatDateToISO(booking.departureDate)); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {booking.tourStartMonth}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {booking.tourEndMonth}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        {editingBooking?.index === index && editingBooking?.field === 'bookingAmount' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editValues.bookingAmount !== undefined ? editValues.bookingAmount : booking.bookingAmount}
                              onChange={(e) => setEditValues({ ...editValues, bookingAmount: e.target.value })}
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
                            <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{booking.bookingAmount.toLocaleString()}
                            </MT.Typography>
                            <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEditingBooking(index, 'bookingAmount', booking.bookingAmount); }} />
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass} relative group`}>
                        <div className="flex items-center justify-between">
                          <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            ₹{booking.advancePayment.toLocaleString()}
                          </MT.Typography>
                          <div className="flex items-center gap-1">
                            <PlusIcon 
                              className="h-6 w-6 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1 transition-colors" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                const originalIndex = bookings.findIndex((b: Booking) => b.id === booking.id);
                                openPaymentModal(originalIndex); 
                              }} 
                              title="Add Payment"
                            />
                            <ClockIcon 
                              className="h-6 w-6 text-blue-600 cursor-pointer hover:bg-blue-100 rounded p-1 transition-colors" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                const originalIndex = bookings.findIndex((b: Booking) => b.id === booking.id);
                                openHistoryPopover(originalIndex); 
                              }} 
                              title="View Payment History"
                            />
                          </div>
                        </div>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <div className="flex items-center justify-between">
                          <MT.Typography 
                            className={`text-sm font-medium ${booking.collectionRemaining < 0 ? 'text-green-600 dark:text-green-400' : booking.collectionRemaining > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}
                            placeholder={undefined} 
                            onPointerEnterCapture={undefined} 
                            onPointerLeaveCapture={undefined}
                          >
                            ₹{booking.collectionRemaining.toLocaleString()}
                          </MT.Typography>
                        </div>
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
                            <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                            <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
                <tr className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-b border-dashed border-gray-300 dark:border-gray-600">
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
                          ref={customerAutocomplete.inputRef}
                          type="text"
                          value={newRowData.customerName}
                          onChange={(e) => {
                            handleNewRowChange('customerName', e.target.value);
                            customerAutocomplete.handleChange(e.target.value);
                          }}
                          onKeyDown={customerAutocomplete.handleKeyDown}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Type customer name..."
                        />
                        {customerAutocomplete.showSuggestions && customerAutocomplete.filteredItems.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                            {customerAutocomplete.filteredItems.map((customer, idx) => (
                              <div
                                key={idx}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleNewRowChange('customerName', customer.name);
                                  customerAutocomplete.reset();
                                }}
                                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                  idx === customerAutocomplete.selectedIndex ? "bg-blue-100 text-blue-900" : ""
                                }`}
                              >
                                <img src={customer.avatar} alt={customer.name} className="w-6 h-6 rounded-full" />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{customer.name}</span>
                                  <span className="text-xs text-gray-500">{customer.phone}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={newRowData.phone}
                          onChange={(e) => handleNewRowChange('phone', e.target.value)}
                          onKeyDown={handlePhoneInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="10-digit phone number"
                          maxLength={10}
                        />
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
                          type="number"
                          value={newRowData.noOfTravellers}
                          onChange={(e) => handleNewRowChange('noOfTravellers', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="1"
                          placeholder="No of Travellers"
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
                          value={newRowData.bookingAmount}
                          onChange={(e) => handleNewRowChange('bookingAmount', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="Booking Amount"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <input
                          type="number"
                          value={newRowData.advancePayment}
                          onChange={(e) => handleNewRowChange('advancePayment', e.target.value)}
                          onKeyDown={handleNumberInput}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          min="0"
                          placeholder="Payment Received"
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
                        <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          Phone
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
                          Payment Received
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

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAdd={handlePaymentAdd}
        maxAmount={currentPaymentBooking?.maxAmount || 0}
        currentCollected={currentPaymentBooking?.currentCollected || 0}
      />

      <HistoryPopover
        isOpen={isHistoryPopoverOpen}
        onClose={() => setIsHistoryPopoverOpen(false)}
        history={currentHistoryBooking !== null ? (paymentHistory[bookings[currentHistoryBooking]?.id] || []) : []}
        onEdit={handlePaymentEdit}
      />

    </div>
  );
}
