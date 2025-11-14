import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as MT from "@material-tailwind/react";
import { ArrowLeftIcon, PlusIcon, PencilIcon, CheckIcon, XMarkIcon, ClockIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
// @ts-expect-error: JS module has no types
import bookingPaymentsData from "@/data/booking-payments-data.js";
// @ts-expect-error: JS module has no types
import guestTourData from "@/data/guest-tour-data.js";
// @ts-expect-error: JS module has no types
import bookingsListData from "@/data/bookings-list-data.js";
import AddServiceModal from "@/components/AddServiceModal";
import AddGuestModal from "@/components/AddGuestModal";
import AddGroupModal from "@/components/AddGroupModal";
import AddBookingModal from "@/components/AddBookingModal";
import PaymentModal from "@/components/PaymentModal";
import HistoryPopover from "@/components/HistoryPopover";

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
  bookingAmount: number;
  advancePayment: number;
  collectionRemaining: number;
  profit: number;
  profitBookedTillDate: number;
}

interface BookingPayment {
  productType: string;
  bookedProduct: string;
  supplierReference: string;
  invRequired: string;
  toBePaid: number;
  paidTillDate: number;
  paymentRemaining: number;
}

interface GuestTour {
  guestName: string;
  destination: string;
  tourStartMonth: string;
  tourEndMonth: string;
  arrivalDate: string;
  departureDate: string;
  balanceCollection: number;
  toBeCollected: number;
  collectedTillDate: number;
  profit: number;
  profitBookedTillDate: number;
  group: string;
}

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [services, setServices] = useState(bookingPaymentsData);
  const [guests, setGuests] = useState(guestTourData);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  // Payment functionality state
  const [guestPaymentHistory, setGuestPaymentHistory] = useState<{[key: number]: Array<{amount: number; method: 'cash' | 'online'; date: string; timestamp: string}>}>({});
  const [isGuestPaymentModalOpen, setIsGuestPaymentModalOpen] = useState(false);
  const [isHistoryPopoverOpen, setIsHistoryPopoverOpen] = useState(false);
  const [currentGuestPayment, setCurrentGuestPayment] = useState<{index: number; maxAmount: number; currentCollected: number} | null>(null);
  const [currentHistoryGuest, setCurrentHistoryGuest] = useState<number | null>(null);

  // Service payment functionality state
  const [servicePaymentHistory, setServicePaymentHistory] = useState<{[key: number]: Array<{amount: number; method: 'cash' | 'online'; date: string; timestamp: string}>}>({});
  const [isServicePaymentModalOpen, setIsServicePaymentModalOpen] = useState(false);
  const [isServiceHistoryPopoverOpen, setIsServiceHistoryPopoverOpen] = useState(false);
  const [currentServicePayment, setCurrentServicePayment] = useState<{index: number; maxAmount: number; currentCollected: number} | null>(null);
  const [currentHistoryService, setCurrentHistoryService] = useState<number | null>(null);

  // Editing states
  const [editingService, setEditingService] = useState<{ index: number; field: string } | null>(null);
  const [editingGuest, setEditingGuest] = useState<{ index: number; field: string } | null>(null);
  const [editValues, setEditValues] = useState<any>({});
  const [supplierSuggestions, setSupplierSuggestions] = useState<typeof supplierNames>([]);
  const [guestSuggestions, setGuestSuggestions] = useState<typeof guestNames>([]);
  const [showSupplierSuggestions, setShowSupplierSuggestions] = useState(false);
  const [showGuestSuggestions, setShowGuestSuggestions] = useState(false);
  const supplierInputRef = useRef<HTMLInputElement>(null);
  const guestInputRef = useRef<HTMLInputElement>(null);

  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([]);
  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);
  const groupInputRef = useRef<HTMLInputElement>(null);

  // Inline ADD functionality state for services
  const [hasEmptyServiceRow, setHasEmptyServiceRow] = useState(true);
  const [isEditingNewService, setIsEditingNewService] = useState(false);
  const [newServiceData, setNewServiceData] = useState({
    productType: '',
    bookedProduct: '',
    supplierReference: '',
    invRequired: 'No',
    toBePaid: 0,
    paidTillDate: 0,
    paymentRemaining: 0,
  });

  // Inline ADD functionality state for guests
  const [hasEmptyGuestRow, setHasEmptyGuestRow] = useState(true);
  const [isEditingNewGuest, setIsEditingNewGuest] = useState(false);
  const [newGuestData, setNewGuestData] = useState({
    guestName: '',
    destination: '',
    tourStartMonth: '',
    tourEndMonth: '',
    arrivalDate: '',
    departureDate: '',
    balanceCollection: 0,
    toBeCollected: 0,
    collectedTillDate: 0,
    profit: 0,
    profitBookedTillDate: 0,
    group: '',
  });

  // Expand/collapse state for booking details
  const [isBookingDetailsExpanded, setIsBookingDetailsExpanded] = useState(true);
  const [isEditBookingModalOpen, setIsEditBookingModalOpen] = useState(false);

  // Search, Sort, Filter state for Services table
  const [servicesSearchTerm, setServicesSearchTerm] = useState('');
  const [servicesSortConfig, setServicesSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [servicesFilters, setServicesFilters] = useState({
    productType: '',
    invRequired: ''
  });

  // Search, Sort, Filter state for Guests table
  const [guestsSearchTerm, setGuestsSearchTerm] = useState('');
  const [guestsSortConfig, setGuestsSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [guestsFilters, setGuestsFilters] = useState({
    destination: '',
    group: '',
    tourStartMonth: '',
    tourEndMonth: '',
    paymentStatus: '', // 'pending', 'partial', 'completed'
    profitStatus: '' // 'booked', 'pending', 'completed'
  });

  // Sample data for autocomplete and selects
  const supplierNames = [
    { name: "Taj Hotels", avatar: "https://i.pravatar.cc/150?img=1" },
    { name: "Air India", avatar: "https://i.pravatar.cc/150?img=2" },
    { name: "Uber Travels", avatar: "https://i.pravatar.cc/150?img=3" },
    { name: "Goa Adventures", avatar: "https://i.pravatar.cc/150?img=4" },
    { name: "Kerala Tours", avatar: "https://i.pravatar.cc/150?img=5" },
    { name: "Delhi Transport", avatar: "https://i.pravatar.cc/150?img=6" },
    { name: "Mumbai Hotels", avatar: "https://i.pravatar.cc/150?img=7" },
    { name: "Rishikesh Rafting", avatar: "https://i.pravatar.cc/150?img=8" },
    { name: "Ladakh Expeditions", avatar: "https://i.pravatar.cc/150?img=9" },
    { name: "Udaipur Palace", avatar: "https://i.pravatar.cc/150?img=10" },
    { name: "Varanasi Ghats", avatar: "https://i.pravatar.cc/150?img=11" },
    { name: "Mysore Heritage", avatar: "https://i.pravatar.cc/150?img=12" },
    { name: "Darjeeling Tea", avatar: "https://i.pravatar.cc/150?img=13" },
    { name: "Shimla Resorts", avatar: "https://i.pravatar.cc/150?img=14" },
    { name: "Andaman Cruises", avatar: "https://i.pravatar.cc/150?img=15" }
  ];

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

  const groups = [
    "A's Family",
    "B's Friends",
    "Corporate tour by company ABC",
    "School Trip Group",
    "Wedding Party",
    "Adventure Seekers",
    "Business Conference",
    "Family Reunion",
    "College Friends",
    "Retirement Celebration"
  ];

  const productTypes = [
    "Hotel",
    "Flight",
    "Transport",
    "Activity",
    "Guide",
    "Restaurant",
    "Cruise",
    "Train",
    "Bus",
    "Car Rental"
  ];

  const bookedProducts = [
    "Standard Room",
    "Deluxe Room",
    "Suite",
    "Economy Flight",
    "Business Flight",
    "First Class Flight",
    "Private Car",
    "Shared Taxi",
    "Rafting Adventure",
    "Trekking Tour",
    "Cultural Show",
    "Local Guide",
    "Fine Dining",
    "Beach Cruise",
    "Mountain Train",
    "Luxury Bus",
    "Economy Bus",
    "Sedan Rental",
    "SUV Rental",
    "Motorcycle Rental"
  ];

  const destinations = [
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
    "Andaman Islands",
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

  // Helper functions
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

  // Search, Sort, Filter handlers for Services table
  const handleServicesSearch = (term: string) => {
    setServicesSearchTerm(term);
  };

  const handleServicesSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (servicesSortConfig && servicesSortConfig.key === key && servicesSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setServicesSortConfig({ key, direction });
  };

  const handleServicesFilter = (filterType: string, value: string) => {
    setServicesFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Search, Sort, Filter handlers for Guests table
  const handleGuestsSearch = (term: string) => {
    setGuestsSearchTerm(term);
  };

  const handleGuestsSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (guestsSortConfig && guestsSortConfig.key === key && guestsSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setGuestsSortConfig({ key, direction });
  };

  const handleGuestsFilter = (filterType: string, value: string) => {
    setGuestsFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Filtered and sorted data functions
  const getFilteredAndSortedServices = () => {
    let filtered = services.filter((service: BookingPayment) => {
      // Search filter
      const searchLower = servicesSearchTerm.toLowerCase();
      const matchesSearch = !servicesSearchTerm || 
        service.productType.toLowerCase().includes(searchLower) ||
        service.bookedProduct.toLowerCase().includes(searchLower) ||
        service.supplierReference.toLowerCase().includes(searchLower);

      // Product type filter
      const matchesProductType = !servicesFilters.productType || service.productType === servicesFilters.productType;

      // Invoice required filter
      const matchesInvRequired = !servicesFilters.invRequired || service.invRequired === servicesFilters.invRequired;

      return matchesSearch && matchesProductType && matchesInvRequired;
    });

    // Sort
    if (servicesSortConfig) {
      filtered.sort((a: BookingPayment, b: BookingPayment) => {
        let aValue: any = a[servicesSortConfig.key as keyof typeof a];
        let bValue: any = b[servicesSortConfig.key as keyof typeof b];

        // Handle numeric fields
        if (['toBePaid', 'paidTillDate', 'paymentRemaining'].includes(servicesSortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (aValue < bValue) {
          return servicesSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return servicesSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const getFilteredAndSortedGuests = () => {
    let filtered = guests.filter((guest: GuestTour) => {
      // Search filter
      const searchLower = guestsSearchTerm.toLowerCase();
      const matchesSearch = !guestsSearchTerm || 
        guest.guestName.toLowerCase().includes(searchLower) ||
        guest.group.toLowerCase().includes(searchLower) ||
        guest.destination.toLowerCase().includes(searchLower) ||
        guest.tourStartMonth.toLowerCase().includes(searchLower) ||
        guest.tourEndMonth.toLowerCase().includes(searchLower);

      // Destination filter
      const matchesDestination = !guestsFilters.destination || guest.destination === guestsFilters.destination;

      // Group filter
      const matchesGroup = !guestsFilters.group || guest.group === guestsFilters.group;

      // Tour start month filter
      const matchesTourStartMonth = !guestsFilters.tourStartMonth || guest.tourStartMonth === guestsFilters.tourStartMonth;

      // Tour end month filter
      const matchesTourEndMonth = !guestsFilters.tourEndMonth || guest.tourEndMonth === guestsFilters.tourEndMonth;

      // Payment status filter
      let matchesPaymentStatus = true;
      if (guestsFilters.paymentStatus) {
        const totalToCollect = guest.toBeCollected;
        const collected = guest.collectedTillDate;
        if (guestsFilters.paymentStatus === 'pending') {
          matchesPaymentStatus = collected === 0;
        } else if (guestsFilters.paymentStatus === 'partial') {
          matchesPaymentStatus = collected > 0 && collected < totalToCollect;
        } else if (guestsFilters.paymentStatus === 'completed') {
          matchesPaymentStatus = collected >= totalToCollect;
        }
      }

      // Profit status filter
      let matchesProfitStatus = true;
      if (guestsFilters.profitStatus) {
        const totalProfit = guest.profit;
        const bookedProfit = guest.profitBookedTillDate;
        if (guestsFilters.profitStatus === 'pending') {
          matchesProfitStatus = bookedProfit === 0;
        } else if (guestsFilters.profitStatus === 'partial') {
          matchesProfitStatus = bookedProfit > 0 && bookedProfit < totalProfit;
        } else if (guestsFilters.profitStatus === 'completed') {
          matchesProfitStatus = bookedProfit >= totalProfit;
        }
      }

      return matchesSearch && matchesDestination && matchesGroup && matchesTourStartMonth && matchesTourEndMonth && matchesPaymentStatus && matchesProfitStatus;
    });

    // Sort
    if (guestsSortConfig) {
      filtered.sort((a: GuestTour, b: GuestTour) => {
        let aValue: any = a[guestsSortConfig.key as keyof typeof a];
        let bValue: any = b[guestsSortConfig.key as keyof typeof b];

        // Handle numeric fields
        if (['toBeCollected', 'collectedTillDate', 'balanceCollection', 'profit', 'profitBookedTillDate'].includes(guestsSortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        // Handle date fields
        if (['arrivalDate', 'departureDate'].includes(guestsSortConfig.key)) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }

        if (aValue < bValue) {
          return guestsSortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return guestsSortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  const filteredAndSortedServices = getFilteredAndSortedServices();
  const filteredAndSortedGuests = getFilteredAndSortedGuests();

  // Payment functionality functions
  const openGuestPaymentModal = (index: number) => {
    const guest = guests[index];
    const maxAmount = guest.toBeCollected;
    const currentCollected = guest.collectedTillDate;
    
    setCurrentGuestPayment({ index, maxAmount, currentCollected });
    setIsGuestPaymentModalOpen(true);
  };

  const handleGuestPaymentAdd = (payment: { amount: number; method: 'cash' | 'online'; date: string; timestamp: string }) => {
    if (!currentGuestPayment) return;

    const { index } = currentGuestPayment;
    const guestId = index; // Using index as guest ID for simplicity

    // Update payment history
    setGuestPaymentHistory(prev => ({
      ...prev,
      [guestId]: [...(prev[guestId] || []), payment]
    }));

    // Update guest collected amount and balance collection
    setGuests((prev: GuestTour[]) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        collectedTillDate: updated[index].collectedTillDate + payment.amount,
        balanceCollection: updated[index].toBeCollected - (updated[index].collectedTillDate + payment.amount)
      };
      return updated;
    });

    setIsGuestPaymentModalOpen(false);
    setCurrentGuestPayment(null);
  };

  const openHistoryPopover = (guestIndex: number) => {
    setCurrentHistoryGuest(guestIndex);
    setIsHistoryPopoverOpen(true);
  };

  // Service payment functionality functions
  const openServicePaymentModal = (index: number) => {
    const service = services[index];
    const maxAmount = service.toBePaid;
    const currentCollected = service.paidTillDate;
    
    setCurrentServicePayment({ index, maxAmount, currentCollected });
    setIsServicePaymentModalOpen(true);
  };

  const handleServicePaymentAdd = (payment: { amount: number; method: 'cash' | 'online'; date: string; timestamp: string }) => {
    if (!currentServicePayment) return;

    const { index } = currentServicePayment;
    const serviceId = index; // Using index as service ID for simplicity

    // Update payment history
    setServicePaymentHistory(prev => ({
      ...prev,
      [serviceId]: [...(prev[serviceId] || []), payment]
    }));

    // Update service paid amount and payment remaining
    setServices((prev: BookingPayment[]) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        paidTillDate: updated[index].paidTillDate + payment.amount,
        paymentRemaining: updated[index].toBePaid - (updated[index].paidTillDate + payment.amount)
      };
      return updated;
    });

    setIsServicePaymentModalOpen(false);
    setCurrentServicePayment(null);
  };

  const openServiceHistoryPopover = (serviceIndex: number) => {
    setCurrentHistoryService(serviceIndex);
    setIsServiceHistoryPopoverOpen(true);
  };

  // Service editing functions
  const startEditingService = (index: number, field: string, currentValue: any) => {
    setEditingService({ index, field });
    setEditValues({ ...editValues, [field]: currentValue });
    if (field === 'supplierReference') {
      setShowSupplierSuggestions(false);
    }
  };

  const saveServiceEdit = () => {
    if (!editingService) return;

    const { index, field } = editingService;
    const newValue = editValues[field];
    
    if (index === -1) {
      // Handle new service row save
      saveNewService();
      return;
    }

    setServices((prev: BookingPayment[]) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };

      // Recalculate paymentRemaining if toBePaid or paidTillDate changed
      if (field === 'toBePaid' || field === 'paidTillDate') {
        const toBePaid = field === 'toBePaid' ? parseFloat(newValue) || 0 : updated[index].toBePaid;
        const paidTillDate = field === 'paidTillDate' ? parseFloat(newValue) || 0 : updated[index].paidTillDate;
        updated[index].paymentRemaining = toBePaid - paidTillDate;
      }

      // Ensure numeric fields are properly converted
      if (field === 'toBePaid') {
        updated[index].toBePaid = parseFloat(newValue) || 0;
      }
      if (field === 'paidTillDate') {
        updated[index].paidTillDate = parseFloat(newValue) || 0;
      }
      if (field === 'invRequired') {
        updated[index].invRequired = newValue ? 'Yes' : 'No';
      }

      return updated;
    });

    setEditingService(null);
    setEditValues({});
    setShowSupplierSuggestions(false);
  };

  const cancelServiceEdit = () => {
    setEditingService(null);
    setEditValues({});
    setShowSupplierSuggestions(false);
    
    // If canceling edit on new service row, reset the empty row
    if (editingService?.index === -1) {
      addEmptyServiceRow();
    }
  };

  const addEmptyServiceRow = () => {
    setNewServiceData({
      productType: '',
      bookedProduct: '',
      supplierReference: '',
      invRequired: 'No',
      toBePaid: 0,
      paidTillDate: 0,
      paymentRemaining: 0,
    });
    setHasEmptyServiceRow(true);
  };

  const startEditingNewService = () => {
    setIsEditingNewService(true);
    setNewServiceData({
      productType: '',
      bookedProduct: '',
      supplierReference: '',
      invRequired: 'No',
      toBePaid: 0,
      paidTillDate: 0,
      paymentRemaining: 0,
    });
  };

  const handleNewServiceChange = (field: string, value: any) => {
    const updatedData = { ...newServiceData };
    
    // Store numeric fields as numbers, not strings
    if (['toBePaid', 'paidTillDate'].includes(field)) {
      (updatedData as any)[field] = parseFloat(value) || 0;
    } else {
      (updatedData as any)[field] = value;
    }
    
    // Handle supplier reference change for autocomplete
    if (field === 'supplierReference') {
      if (value.length >= 2) {
        const filtered = supplierNames.filter(supplier =>
          supplier.name.toLowerCase().includes(value.toLowerCase())
        );
        setSupplierSuggestions(filtered);
        setShowSupplierSuggestions(true);
      } else {
        setShowSupplierSuggestions(false);
        setSupplierSuggestions([]);
      }
    }
    
    // Calculate payment remaining - ensure all values are numbers
    const toBePaid = typeof updatedData.toBePaid === 'string' ? parseFloat(updatedData.toBePaid) || 0 : updatedData.toBePaid || 0;
    const paidTillDate = typeof updatedData.paidTillDate === 'string' ? parseFloat(updatedData.paidTillDate) || 0 : updatedData.paidTillDate || 0;
    updatedData.paymentRemaining = toBePaid - paidTillDate;
    
    setNewServiceData(updatedData);
  };

  const saveNewService = () => {
    if (!newServiceData.productType.trim() || !newServiceData.supplierReference.trim()) {
      alert('Product type and supplier reference are required');
      return;
    }
    
    const newService: BookingPayment = {
      ...newServiceData,
      invRequired: newServiceData.invRequired,
    };
    
    setServices([...services, newService]);
    setIsEditingNewService(false);
    setShowSupplierSuggestions(false);
    
    // Reset for next entry
    setNewServiceData({
      productType: '',
      bookedProduct: '',
      supplierReference: '',
      invRequired: 'No',
      toBePaid: 0,
      paidTillDate: 0,
      paymentRemaining: 0,
    });
  };

  const cancelNewService = () => {
    setIsEditingNewService(false);
    setShowSupplierSuggestions(false);
    setNewServiceData({
      productType: '',
      bookedProduct: '',
      supplierReference: '',
      invRequired: 'No',
      toBePaid: 0,
      paidTillDate: 0,
      paymentRemaining: 0,
    });
  };

  const handleSupplierChange = (value: string) => {
    setEditValues({ ...editValues, supplierReference: value });

    if (value.length >= 2) {
      const filtered = supplierNames.filter(supplier =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      );
      setSupplierSuggestions(filtered);
      setShowSupplierSuggestions(true);
    } else {
      setShowSupplierSuggestions(false);
      setSupplierSuggestions([]);
    }
  };

  const selectSupplierSuggestion = (name: string) => {
    setEditValues({ ...editValues, supplierReference: name });
    setShowSupplierSuggestions(false);
  };

  const selectNewServiceSupplier = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleNewServiceChange('supplierReference', name);
    setShowSupplierSuggestions(false);
  };

  // Guest editing functions
  const startEditingGuest = (index: number, field: string, currentValue: any) => {
    setEditingGuest({ index, field });
    setEditValues({ ...editValues, [field]: currentValue });
    if (field === 'guestName') {
      setShowGuestSuggestions(false);
    }
  };

  const saveGuestEdit = () => {
    if (!editingGuest) return;

    const { index, field } = editingGuest;
    const newValue = editValues[field];
    
    if (index === -1) {
      // Handle new guest row save
      saveNewGuest();
      return;
    }

    setGuests((prev: GuestTour[]) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: newValue };

      // Recalculate derived fields
      if (field === 'arrivalDate') {
        updated[index].tourStartMonth = newValue ? new Date(newValue).toLocaleDateString('en-US', { month: 'long' }) : '';
        updated[index].arrivalDate = formatDateToDisplay(newValue);
      }
      if (field === 'departureDate') {
        updated[index].tourEndMonth = newValue ? new Date(newValue).toLocaleDateString('en-US', { month: 'long' }) : '';
        updated[index].departureDate = formatDateToDisplay(newValue);
      }

      // Update balanceCollection when toBeCollected or collectedTillDate changes
      if (field === 'toBeCollected' || field === 'collectedTillDate') {
        const toBeCollected = field === 'toBeCollected' ? parseFloat(newValue) || 0 : updated[index].toBeCollected;
        const collectedTillDate = field === 'collectedTillDate' ? parseFloat(newValue) || 0 : updated[index].collectedTillDate;
        updated[index].balanceCollection = toBeCollected - collectedTillDate;
      }

      // Ensure numeric fields are properly converted
      if (field === 'toBeCollected') {
        updated[index].toBeCollected = parseFloat(newValue) || 0;
      }
      if (field === 'collectedTillDate') {
        updated[index].collectedTillDate = parseFloat(newValue) || 0;
      }

      return updated;
    });

    setEditingGuest(null);
    setEditValues({});
    setShowGuestSuggestions(false);
  };

  const cancelGuestEdit = () => {
    setEditingGuest(null);
    setEditValues({});
    setShowGuestSuggestions(false);
    
    // If canceling edit on new guest row, reset the empty row
    if (editingGuest?.index === -1) {
      addEmptyGuestRow();
    }
  };

  const addEmptyGuestRow = () => {
    setNewGuestData({
      guestName: '',
      destination: '',
      tourStartMonth: '',
      tourEndMonth: '',
      arrivalDate: '',
      departureDate: '',
      balanceCollection: 0,
      toBeCollected: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      group: '',
    });
    setHasEmptyGuestRow(true);
  };

  const startEditingNewGuest = () => {
    setIsEditingNewGuest(true);
    setNewGuestData({
      guestName: '',
      destination: '',
      tourStartMonth: '',
      tourEndMonth: '',
      arrivalDate: '',
      departureDate: '',
      balanceCollection: 0,
      toBeCollected: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      group: '',
    });
  };

  const handleNewGuestChange = (field: string, value: any) => {
    const updatedData = { ...newGuestData };
    
    // Store numeric fields as numbers, not strings
    if (['toBeCollected', 'collectedTillDate', 'profit', 'profitBookedTillDate'].includes(field)) {
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
        setGuestSuggestions(filtered);
        setShowGuestSuggestions(true);
      } else {
        setShowGuestSuggestions(false);
        setGuestSuggestions([]);
      }
    }

    // Handle group name change for autocomplete
    if (field === 'group') {
      if (value.length >= 2) {
        const filtered = groups.filter(group =>
          group.toLowerCase().includes(value.toLowerCase())
        );
        setGroupSuggestions(filtered);
        setShowGroupSuggestions(true);
      } else {
        setShowGroupSuggestions(false);
        setGroupSuggestions([]);
      }
    }
    
    // Auto-calculate derived fields
    if (field === 'arrivalDate' && value) {
      updatedData.tourStartMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    if (field === 'departureDate' && value) {
      updatedData.tourEndMonth = new Date(value).toLocaleDateString('en-US', { month: 'long' });
    }
    
    // Calculate balance collection - ensure all values are numbers
    const toBeCollected = typeof updatedData.toBeCollected === 'string' ? parseFloat(updatedData.toBeCollected) || 0 : updatedData.toBeCollected || 0;
    const collectedTillDate = typeof updatedData.collectedTillDate === 'string' ? parseFloat(updatedData.collectedTillDate) || 0 : updatedData.collectedTillDate || 0;
    updatedData.balanceCollection = toBeCollected - collectedTillDate;
    
    setNewGuestData(updatedData);
  };

  const saveNewGuest = () => {
    if (!newGuestData.guestName.trim()) {
      alert('Guest name is required');
      return;
    }
    
    const newGuest: GuestTour = {
      ...newGuestData,
      arrivalDate: newGuestData.arrivalDate ? formatDateToDisplay(newGuestData.arrivalDate) : '',
      departureDate: newGuestData.departureDate ? formatDateToDisplay(newGuestData.departureDate) : '',
    };
    
    setGuests([...guests, newGuest]);
    setIsEditingNewGuest(false);
    setShowGuestSuggestions(false);
    
    // Reset for next entry
    setNewGuestData({
      guestName: '',
      destination: '',
      tourStartMonth: '',
      tourEndMonth: '',
      arrivalDate: '',
      departureDate: '',
      balanceCollection: 0,
      toBeCollected: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      group: '',
    });
  };

  const cancelNewGuest = () => {
    setIsEditingNewGuest(false);
    setShowGuestSuggestions(false);
    setNewGuestData({
      guestName: '',
      destination: '',
      tourStartMonth: '',
      tourEndMonth: '',
      arrivalDate: '',
      departureDate: '',
      balanceCollection: 0,
      toBeCollected: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      group: '',
    });
  };

  const handleGuestChange = (value: string) => {
    setEditValues({ ...editValues, guestName: value });

    if (value.length >= 2) {
      const filtered = guestNames.filter(guest =>
        guest.name.toLowerCase().includes(value.toLowerCase())
      );
      setGuestSuggestions(filtered);
      setShowGuestSuggestions(true);
    } else {
      setShowGuestSuggestions(false);
      setGuestSuggestions([]);
    }
  };

  const selectGuestSuggestion = (name: string) => {
    setEditValues({ ...editValues, guestName: name });
    setShowGuestSuggestions(false);
  };

  const handleGroupChange = (value: string) => {
    setEditValues({ ...editValues, group: value });

    if (value.length >= 2) {
      const filtered = groups.filter(group =>
        group.toLowerCase().includes(value.toLowerCase())
      );
      setGroupSuggestions(filtered);
      setShowGroupSuggestions(true);
    } else {
      setShowGroupSuggestions(false);
      setGroupSuggestions([]);
    }
  };

  const selectGroupSuggestion = (name: string) => {
    setEditValues({ ...editValues, group: name });
    setShowGroupSuggestions(false);
  };

  const selectNewGuestSuggestion = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleNewGuestChange('guestName', name);
    setShowGuestSuggestions(false);
  };

  const selectNewGroupSuggestion = (name: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    handleNewGuestChange('group', name);
    setShowGroupSuggestions(false);
  };

  // Find the booking by ID
  const booking = bookingsListData.find((b: Booking) => b.id === Number(id));

  // Handle booking update
  const handleBookingUpdate = (updatedBooking: Booking) => {
    // Update the booking in the data (this would typically be an API call)
    const bookingIndex = bookingsListData.findIndex((b: Booking) => b.id === Number(id));
    if (bookingIndex !== -1) {
      bookingsListData[bookingIndex] = updatedBooking;
    }
    setIsEditBookingModalOpen(false);
  };

  // Calculate totals for payment table from filtered data
  const totalToBePaid = filteredAndSortedServices.reduce((sum: number, item: BookingPayment) => sum + (parseFloat(item.toBePaid as any) || 0), 0);
  const totalPaidTillDate = filteredAndSortedServices.reduce((sum: number, item: BookingPayment) => sum + (parseFloat(item.paidTillDate as any) || 0), 0);
  const totalPaymentRemaining = filteredAndSortedServices.reduce((sum: number, item: BookingPayment) => sum + (parseFloat(item.paymentRemaining as any) || 0), 0);

  // Calculate totals for guest tour table from filtered data
  const totalToBeCollected = filteredAndSortedGuests.reduce((sum: number, item: GuestTour) => sum + (parseFloat(item.toBeCollected as any) || 0), 0);
  const totalCollectedTillDate = filteredAndSortedGuests.reduce((sum: number, item: GuestTour) => sum + (parseFloat(item.collectedTillDate as any) || 0), 0);
  const totalBalanceCollection = filteredAndSortedGuests.reduce((sum: number, item: GuestTour) => sum + (parseFloat(item.balanceCollection as any) || 0), 0);
  const totalProfit = filteredAndSortedGuests.reduce((sum: number, item: GuestTour) => sum + (parseFloat(item.profit as any) || 0), 0);
  const totalProfitBookedTillDate = filteredAndSortedGuests.reduce((sum: number, item: GuestTour) => sum + (parseFloat(item.profitBookedTillDate as any) || 0), 0);

  if (!booking) {
    return (
      <div className="mt-8">
        <MT.Typography variant="h4" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Booking not found
        </MT.Typography>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-6">
        
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/dashboard/bookings")}>
              <ArrowLeftIcon className="h-5 w-5 text-blue-gray-700 dark:text-gray-200" />
              <MT.Typography variant="h4" color="blue-gray" className="dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                {booking.customerName}
              </MT.Typography>
            </div>
            <MT.Typography variant="small" color="gray" className="mt-1 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {booking.destination} • {booking.bookingDate}
            </MT.Typography>
          </div>
          <MT.Chip
            size="lg"
            value={booking.type}
            color={booking.type === "International" ? "blue" : "green"}
          />
        </div>

        {/* Comprehensive Booking Details - Expandable/Collapsible */}
        <MT.Card className="shadow-lg border border-gray-100 mt-6 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <div className="flex justify-between items-center">
              <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                Complete Booking Information
              </MT.Typography>
              <div className="flex items-center gap-2">
                <PencilIcon 
                  className="h-5 w-5 text-white hover:text-blue-200 cursor-pointer transition-colors" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditBookingModalOpen(true);
                  }}
                  title="Edit Booking Details"
                />
              </div>
            </div>
          </div>

          {isBookingDetailsExpanded && (
            <MT.CardBody className="px-6 py-6" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Travel Details */}
                <div className="space-y-4">
                  <MT.Typography variant="h6" color="blue-gray" className="font-semibold border-b border-gray-200 pb-2 dark:text-white dark:border-gray-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Travel Details
                  </MT.Typography>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Arrival Date:
                      </MT.Typography>
                      <MT.Typography variant="small" color="blue-gray" className="font-semibold dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {formatDateToDisplay(booking.arrivalDate)}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Departure Date:
                      </MT.Typography>
                      <MT.Typography variant="small" color="blue-gray" className="font-semibold dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {formatDateToDisplay(booking.departureDate)}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Total Travelers:
                      </MT.Typography>
                      <MT.Typography variant="small" color="blue-gray" className="font-semibold dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        {(booking.numAdults || 2) + (booking.numChildren || 1) + (booking.numInfants || 0)}
                      </MT.Typography>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <MT.Typography variant="h6" color="blue-gray" className="font-semibold border-b border-gray-200 pb-2 dark:text-white dark:border-gray-600" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    Financial Details
                  </MT.Typography>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Booking Amount:
                      </MT.Typography>
                      <MT.Typography variant="small" color="green" className="font-bold dark:text-green-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking.toBeCollectedGST?.toLocaleString() || '0'}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Collected Till Date:
                      </MT.Typography>
                      <MT.Typography variant="small" color="blue" className="font-bold dark:text-blue-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking.collectedTillDate?.toLocaleString() || '0'}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Collection Remaining:
                      </MT.Typography>
                      <MT.Typography variant="small" color="orange" className="font-bold dark:text-orange-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking.collectionRemaining?.toLocaleString() || '0'}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Total Profit:
                      </MT.Typography>
                      <MT.Typography variant="small" color="purple" className="font-bold dark:text-purple-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking.profit?.toLocaleString() || '0'}
                      </MT.Typography>
                    </div>

                    <div className="flex justify-between items-center">
                      <MT.Typography variant="small" color="gray" className="font-medium dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Profit Booked Till Date:
                      </MT.Typography>
                      <MT.Typography variant="small" color="purple" className="font-bold dark:text-purple-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{booking.profitBookedTillDate?.toLocaleString() || '0'}
                      </MT.Typography>
                    </div>
                  </div>
                </div>
              </div>
            </MT.CardBody>
          )}
        </MT.Card>
      </div>

      <div className="flex flex-col gap-8">
        {/* Booking Payments Table */}
        <MT.Card className="shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
            <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Services
            </MT.Typography>
            <MT.Button 
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsServiceModalOpen(true)}
              placeholder={undefined} 
              onPointerEnterCapture={undefined} 
              onPointerLeaveCapture={undefined}
            >
              <PlusIcon className="h-4 w-4" />
              Add Service
            </MT.Button>
          </div>

          {/* Search, Sort, Filter Controls for Services */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={servicesSearchTerm}
                  onChange={(e) => handleServicesSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={servicesFilters.productType}
                    onChange={(e) => handleServicesFilter('productType', e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Product Types</option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={servicesFilters.invRequired}
                    onChange={(e) => handleServicesFilter('invRequired', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Invoice Status</option>
                    <option value="Yes">Invoice Required</option>
                    <option value="No">No Invoice</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="w-full min-w-[1200px] table-auto">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/50">
                  {[
                    { key: "productType", label: "PRODUCT TYPE" },
                    { key: "bookedProduct", label: "BOOKED PRODUCT" },
                    { key: "supplierReference", label: "SUPPLIER REFERENCE" },
                    { key: "invRequired", label: "INV REQUIRED" },
                    { key: "toBePaid", label: "TO BE PAID" },
                    { key: "paidTillDate", label: "PAID TILL DATE" },
                    { key: "paymentRemaining", label: "PAYMENT REMAINING" }
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="border-b-2 border-blue-200 py-3 px-4 text-left cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleServicesSort(header.key)}
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
                          <ArrowUpIcon className={`h-3 w-3 ${servicesSortConfig?.key === header.key && servicesSortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                          <ArrowDownIcon className={`h-3 w-3 -mt-1 ${servicesSortConfig?.key === header.key && servicesSortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedServices.map(
                  (item: BookingPayment, index: number) => {
                    const isLastRow = index === services.length - 1;
                    const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'productType' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.productType || item.productType}
                                onChange={(e) => setEditValues({ ...editValues, productType: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select Product Type</option>
                                {productTypes.map((type) => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.productType}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingService(index, 'productType', item.productType)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'bookedProduct' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.bookedProduct || item.bookedProduct}
                                onChange={(e) => setEditValues({ ...editValues, bookedProduct: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select Booked Product</option>
                                {bookedProducts.map((product) => (
                                  <option key={product} value={product}>{product}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.bookedProduct}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingService(index, 'bookedProduct', item.bookedProduct)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'supplierReference' ? (
                            <div className="relative flex items-center gap-2">
                              <input
                                ref={supplierInputRef}
                                type="text"
                                value={editValues.supplierReference !== undefined ? editValues.supplierReference : item.supplierReference}
                                onChange={(e) => handleSupplierChange(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type supplier name..."
                              />
                              {showSupplierSuggestions && supplierSuggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-20 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                  {supplierSuggestions.map((supplier, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => selectSupplierSuggestion(supplier.name)}
                                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                      <img src={supplier.avatar} alt={supplier.name} className="w-6 h-6 rounded-full" />
                                      <span className="text-sm">{supplier.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.supplierReference}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingService(index, 'supplierReference', item.supplierReference)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'invRequired' ? (
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editValues.invRequired !== undefined ? editValues.invRequired : item.invRequired === 'Yes'}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValues({ ...editValues, invRequired: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.invRequired}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingService(index, 'invRequired', item.invRequired === 'Yes')} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'toBePaid' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.toBePaid !== undefined ? editValues.toBePaid : item.toBePaid}
                                onChange={(e) => setEditValues({ ...editValues, toBePaid: e.target.value })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                min="0"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.toBePaid.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingService(index, 'toBePaid', item.toBePaid)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass} relative group`}>
                          {editingService?.index === index && editingService?.field === 'paidTillDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.paidTillDate !== undefined ? editValues.paidTillDate : item.paidTillDate}
                                onChange={(e) => setEditValues({ ...editValues, paidTillDate: e.target.value })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                min="0"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveServiceEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelServiceEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.paidTillDate.toLocaleString()}
                              </MT.Typography>
                              <PlusIcon 
                                className="h-6 w-6 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1 transition-colors" 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  openServicePaymentModal(index); 
                                }} 
                                title="Add Payment"
                              />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-4 ${rowClass}`}>
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{item.paymentRemaining.toLocaleString()}
                            </MT.Typography>
                            <ClockIcon 
                              className="h-6 w-6 text-blue-600 cursor-pointer hover:bg-blue-100 rounded p-1 transition-colors" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                openServiceHistoryPopover(index); 
                              }} 
                              title="View Payment History"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
                
                {/* Empty Row for Inline ADD functionality - ENTIRE ROW APPROACH */}
                {hasEmptyServiceRow && (
                  <tr className="hover:bg-green-50 transition-colors border-b border-dashed border-gray-300">
                    {isEditingNewService ? (
                      // EDITING MODE: All fields become inputs, single Save/Cancel for entire row
                      <>
                        <td className="py-3 px-4">
                          <select
                            value={newServiceData.productType}
                            onChange={(e) => handleNewServiceChange('productType', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Product Type</option>
                            {productTypes.map((type) => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={newServiceData.bookedProduct}
                            onChange={(e) => handleNewServiceChange('bookedProduct', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select Booked Product</option>
                            {bookedProducts.map((product) => (
                              <option key={product} value={product}>{product}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4 relative">
                          <input
                            ref={supplierInputRef}
                            type="text"
                            value={newServiceData.supplierReference}
                            onChange={(e) => handleNewServiceChange('supplierReference', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Type supplier name..."
                          />
                          {showSupplierSuggestions && supplierSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {supplierSuggestions.map((supplier, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => selectNewServiceSupplier(supplier.name, e)}
                                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                  <img src={supplier.avatar} alt={supplier.name} className="w-6 h-6 rounded-full" />
                                  <span className="text-sm">{supplier.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newServiceData.invRequired === 'Yes'}
                              onChange={(e) => handleNewServiceChange('invRequired', e.target.checked ? 'Yes' : 'No')}
                              className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={newServiceData.toBePaid}
                            onChange={(e) => handleNewServiceChange('toBePaid', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            placeholder="To Be Paid"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={newServiceData.paidTillDate}
                            onChange={(e) => handleNewServiceChange('paidTillDate', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="0"
                            placeholder="Paid Till Date"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            ₹{newServiceData.paymentRemaining.toLocaleString()}
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <CheckIcon 
                              className="h-5 w-5 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1" 
                              onClick={saveNewService}
                              title="Save entire row"
                            />
                            <XMarkIcon 
                              className="h-5 w-5 text-red-600 cursor-pointer hover:bg-red-100 rounded p-1" 
                              onClick={cancelNewService}
                              title="Cancel entire row"
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      // DISPLAY MODE: Show placeholder with single click to start editing entire row
                      <>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Product Type
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Click to add new service
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Supplier
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            No
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Amount
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Paid
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Auto
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <PlusIcon 
                            className="h-5 w-5 text-green-500 cursor-pointer hover:bg-green-100 rounded p-1 mx-auto" 
                            onClick={startEditingNewService}
                            title="Start adding new service"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                )}
                
                {/* Total Row */}
                <tr className="bg-blue-50 font-bold border-t-2 border-blue-200 dark:bg-blue-900/50 dark:border-blue-700">
                  <td colSpan={4} className="py-3 px-4 text-right">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Total
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-4">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalToBePaid.toLocaleString()}
                    </MT.Typography>
                    <MT.Typography className="text-xs font-medium text-gray-600 dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Amount To Be Paid
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-4">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalPaidTillDate.toLocaleString()}
                    </MT.Typography>
                    <MT.Typography className="text-xs font-medium text-gray-600 dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Amount Paid
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-4">
                    <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalPaymentRemaining.toLocaleString()}
                    </MT.Typography>
                    <MT.Typography className="text-xs font-medium text-gray-600 dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Balance Payment
                    </MT.Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </MT.CardBody>
        </MT.Card>

        {/* Guest Tour Table */}
        <MT.Card className="shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl flex justify-between items-center">
            <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Guest Tour Details
            </MT.Typography>
            <div className="flex gap-2">
              <MT.Button 
                className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsGuestModalOpen(true)}
                placeholder={undefined} 
                onPointerEnterCapture={undefined} 
                onPointerLeaveCapture={undefined}
              >
                <PlusIcon className="h-4 w-4" />
                Add Guest
              </MT.Button>
              <MT.Button 
                className="flex items-center gap-2 bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transition-all"
                onClick={() => setIsGroupModalOpen(true)}
                placeholder={undefined} 
                onPointerEnterCapture={undefined} 
                onPointerLeaveCapture={undefined}
              >
                <PlusIcon className="h-4 w-4" />
                Add Group
              </MT.Button>
            </div>
          </div>

          {/* Search, Sort, Filter Controls for Guests */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={guestsSearchTerm}
                  onChange={(e) => handleGuestsSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={guestsFilters.destination}
                    onChange={(e) => handleGuestsFilter('destination', e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Destinations</option>
                    {destinations.map((dest) => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={guestsFilters.group}
                    onChange={(e) => handleGuestsFilter('group', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Groups</option>
                    {groups.map((group) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={guestsFilters.tourStartMonth}
                    onChange={(e) => handleGuestsFilter('tourStartMonth', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Start Months</option>
                    {([...new Set(guests.map((g: GuestTour) => g.tourStartMonth))] as string[]).sort().map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={guestsFilters.tourEndMonth}
                    onChange={(e) => handleGuestsFilter('tourEndMonth', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All End Months</option>
                    {([...new Set(guests.map((g: GuestTour) => g.tourEndMonth))] as string[]).sort().map((month) => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={guestsFilters.paymentStatus}
                    onChange={(e) => handleGuestsFilter('paymentStatus', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Payment Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={guestsFilters.profitStatus}
                    onChange={(e) => handleGuestsFilter('profitStatus', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">All Profit Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="w-full min-w-[1600px] table-auto">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/50">
                  {[
                    { key: "guestName", label: "NAME OF GUEST" },
                    { key: "group", label: "GROUP" },
                    { key: "destination", label: "DESTINATION" },
                    { key: "arrivalDate", label: "ARRIVAL DATE" },
                    { key: "departureDate", label: "DEPARTURE DATE" },
                    { key: "tourStartMonth", label: "TOUR START MONTH" },
                    { key: "tourEndMonth", label: "TOUR END MONTH" },
                    { key: "toBeCollected", label: "TO BE COLLECTED" },
                    { key: "collectedTillDate", label: "COLLECTED TILL DATE" },
                    { key: "balanceCollection", label: "BALANCE COLLECTION" },
                    { key: "profit", label: "PROFIT" },
                    { key: "profitBookedTillDate", label: "PROFIT BOOKED TILL DATE" }
                  ].map((header) => (
                    <th
                      key={header.key}
                      className="border-b-2 border-blue-200 py-3 px-3 text-left cursor-pointer hover:bg-blue-100 transition-colors"
                      onClick={() => handleGuestsSort(header.key)}
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
                          <ArrowUpIcon className={`h-3 w-3 ${guestsSortConfig?.key === header.key && guestsSortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                          <ArrowDownIcon className={`h-3 w-3 -mt-1 ${guestsSortConfig?.key === header.key && guestsSortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedGuests.map(
                  (item: GuestTour, index: number) => {
                    const isLastRow = index === guests.length - 1;
                    const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                    return (
                      <tr key={index} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'guestName' ? (
                            <div className="relative flex items-center gap-2">
                              <input
                                ref={guestInputRef}
                                type="text"
                                value={editValues.guestName !== undefined ? editValues.guestName : item.guestName}
                                onChange={(e) => handleGuestChange(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type guest name..."
                              />
                              {showGuestSuggestions && guestSuggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                  {guestSuggestions.map((guest, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => selectGuestSuggestion(guest.name)}
                                      className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                    >
                                      <img src={guest.avatar} alt={guest.name} className="w-6 h-6 rounded-full" />
                                      <span className="text-sm">{guest.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.guestName}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'guestName', item.guestName)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'group' ? (
                            <div className="relative flex items-center gap-2">
                              <input
                                ref={groupInputRef}
                                type="text"
                                value={editValues.group !== undefined ? editValues.group : item.group}
                                onChange={(e) => handleGroupChange(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Type group name..."
                              />
                              {showGroupSuggestions && groupSuggestions.length > 0 && (
                                <div className="absolute z-50 w-full mt-20 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                  {groupSuggestions.map((group, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => selectGroupSuggestion(group)}
                                      className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                    >
                                      <span className="text-sm">{group}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.group}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'group', item.group)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'destination' ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={editValues.destination !== undefined ? editValues.destination : item.destination}
                                onChange={(e) => setEditValues({ ...editValues, destination: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              >
                                <option value="">Select Destination</option>
                                {destinations.map((dest) => (
                                  <option key={dest} value={dest}>{dest}</option>
                                ))}
                              </select>
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.destination}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'destination', item.destination)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass}`}>
                          <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {item.tourStartMonth}
                          </MT.Typography>
                        </td>
                        <td className={`py-3 px-3 ${rowClass}`}>
                          <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {item.tourEndMonth}
                          </MT.Typography>
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'arrivalDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={editValues.arrivalDate !== undefined ? editValues.arrivalDate : item.arrivalDate}
                                onChange={(e) => setEditValues({ ...editValues, arrivalDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.arrivalDate}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'arrivalDate', item.arrivalDate)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'departureDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="date"
                                value={editValues.departureDate !== undefined ? editValues.departureDate : item.departureDate}
                                onChange={(e) => setEditValues({ ...editValues, departureDate: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                {item.departureDate}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'departureDate', item.departureDate)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'toBeCollected' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.toBeCollected !== undefined ? editValues.toBeCollected : item.toBeCollected}
                                onChange={(e) => setEditValues({ ...editValues, toBeCollected: e.target.value })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.toBeCollected.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'toBeCollected', item.toBeCollected)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{item.collectedTillDate.toLocaleString()}
                            </MT.Typography>
                            <PlusIcon 
                              className="h-6 w-6 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1 transition-colors" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                openGuestPaymentModal(index); 
                              }} 
                              title="Add Payment"
                            />
                          </div>
                        </td>
                        <td className={`py-3 px-3 ${rowClass}`}>
                          <div className="flex items-center justify-between">
                            <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                              ₹{item.balanceCollection.toLocaleString()}
                            </MT.Typography>
                            <ClockIcon 
                              className="h-6 w-6 text-blue-600 cursor-pointer hover:bg-blue-100 rounded p-1 transition-colors" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                openHistoryPopover(index); 
                              }} 
                              title="View Payment History"
                            />
                          </div>
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'profit' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.profit !== undefined ? editValues.profit : item.profit}
                                onChange={(e) => setEditValues({ ...editValues, profit: e.target.value })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.profit.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'profit', item.profit)} />
                            </div>
                          )}
                        </td>
                        <td className={`py-3 px-3 ${rowClass} relative group`}>
                          {editingGuest?.index === index && editingGuest?.field === 'profitBookedTillDate' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={editValues.profitBookedTillDate !== undefined ? editValues.profitBookedTillDate : item.profitBookedTillDate}
                                onChange={(e) => setEditValues({ ...editValues, profitBookedTillDate: e.target.value })}
                                onKeyDown={handleNumberInput}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <CheckIcon className="h-4 w-4 text-green-600 cursor-pointer" onClick={saveGuestEdit} />
                              <XMarkIcon className="h-4 w-4 text-red-600 cursor-pointer" onClick={cancelGuestEdit} />
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                                ₹{item.profitBookedTillDate.toLocaleString()}
                              </MT.Typography>
                              <PencilIcon className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEditingGuest(index, 'profitBookedTillDate', item.profitBookedTillDate)} />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }
                )}
                
                {/* Empty Row for Inline ADD functionality - ENTIRE ROW APPROACH */}
                {hasEmptyGuestRow && (
                  <tr className="hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors border-b border-dashed border-gray-300 dark:border-gray-600">
                    {isEditingNewGuest ? (
                      // EDITING MODE: All fields become inputs, single Save/Cancel for entire row
                      <>
                        <td className="py-3 px-3 relative">
                          <input
                            ref={guestInputRef}
                            type="text"
                            value={newGuestData.guestName}
                            onChange={(e) => handleNewGuestChange('guestName', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Type guest name..."
                          />
                          {showGuestSuggestions && guestSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {guestSuggestions.map((guest, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => selectNewGuestSuggestion(guest.name, e)}
                                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                >
                                  <img src={guest.avatar} alt={guest.name} className="w-6 h-6 rounded-full" />
                                  <span className="text-sm">{guest.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 relative">
                          <input
                            ref={groupInputRef}
                            type="text"
                            value={newGuestData.group}
                            onChange={(e) => handleNewGuestChange('group', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="Type group name..."
                          />
                          {showGroupSuggestions && groupSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {groupSuggestions.map((group, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => selectNewGroupSuggestion(group, e)}
                                  className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                                >
                                  <span className="text-sm">{group}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={newGuestData.destination}
                            onChange={(e) => handleNewGuestChange('destination', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">Select Destination</option>
                            {destinations.map((dest) => (
                              <option key={dest} value={dest}>{dest}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newGuestData.arrivalDate}
                            onChange={(e) => handleNewGuestChange('arrivalDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="date"
                            value={newGuestData.departureDate}
                            onChange={(e) => handleNewGuestChange('departureDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {newGuestData.tourStartMonth || 'Auto'}
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            {newGuestData.tourEndMonth || 'Auto'}
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newGuestData.toBeCollected}
                            onChange={(e) => handleNewGuestChange('toBeCollected', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="0"
                            placeholder="To Be Collected"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newGuestData.collectedTillDate}
                            onChange={(e) => handleNewGuestChange('collectedTillDate', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="0"
                            placeholder="Collected"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <MT.Typography variant="small" className="text-gray-500" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            ₹{newGuestData.balanceCollection.toLocaleString()}
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newGuestData.profit}
                            onChange={(e) => handleNewGuestChange('profit', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="0"
                            placeholder="Profit"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            value={newGuestData.profitBookedTillDate}
                            onChange={(e) => handleNewGuestChange('profitBookedTillDate', e.target.value)}
                            onKeyDown={handleNumberInput}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            min="0"
                            placeholder="Profit Booked"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <CheckIcon 
                              className="h-5 w-5 text-green-600 cursor-pointer hover:bg-green-100 rounded p-1" 
                              onClick={saveNewGuest}
                              title="Save entire row"
                            />
                            <XMarkIcon 
                              className="h-5 w-5 text-red-600 cursor-pointer hover:bg-red-100 rounded p-1" 
                              onClick={cancelNewGuest}
                              title="Cancel entire row"
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      // DISPLAY MODE: Show placeholder with single click to start editing entire row
                      <>
                        <td className="py-3 px-3">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Click to add new guest
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Group
                          </MT.Typography>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <MT.Typography className="text-sm text-gray-400 italic" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                            Destination
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
                            Amount
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
                            onClick={startEditingNewGuest}
                            title="Start adding new guest"
                          />
                        </td>
                      </>
                    )}
                  </tr>
                )}
                
                {/* Total Row */}
                <tr className="bg-blue-100 font-bold border-t-2 border-blue-300 dark:bg-blue-900/50 dark:border-blue-700">
                  <td colSpan={6} className="py-3 px-3 text-left">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      Total
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalToBeCollected.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalCollectedTillDate.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalBalanceCollection.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalProfit.toLocaleString()}
                    </MT.Typography>
                  </td>
                  <td className="py-3 px-3">
                    <MT.Typography className="text-sm font-bold text-blue-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      ₹{totalProfitBookedTillDate.toLocaleString()}
                    </MT.Typography>
                  </td>
                </tr>
              </tbody>
            </table>
          </MT.CardBody>
        </MT.Card>

        <AddServiceModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          onAdd={(service) => setServices([...services, service])}
        />

        <AddGuestModal
          isOpen={isGuestModalOpen}
          onClose={() => setIsGuestModalOpen(false)}
          onAdd={(guest) => setGuests([...guests, guest])}
        />

        <AddGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          onAdd={(guestsList) => setGuests([...guests, ...guestsList])}
        />

        <PaymentModal
          isOpen={isGuestPaymentModalOpen}
          onClose={() => setIsGuestPaymentModalOpen(false)}
          onAdd={handleGuestPaymentAdd}
          maxAmount={currentGuestPayment?.maxAmount || 0}
          currentCollected={currentGuestPayment?.currentCollected || 0}
        />

        <HistoryPopover
          isOpen={isHistoryPopoverOpen}
          onClose={() => setIsHistoryPopoverOpen(false)}
          history={currentHistoryGuest !== null ? (guestPaymentHistory[currentHistoryGuest] || []) : []}
        />

        <PaymentModal
          isOpen={isServicePaymentModalOpen}
          onClose={() => setIsServicePaymentModalOpen(false)}
          onAdd={handleServicePaymentAdd}
          maxAmount={currentServicePayment?.maxAmount || 0}
          currentCollected={currentServicePayment?.currentCollected || 0}
        />

        <HistoryPopover
          isOpen={isServiceHistoryPopoverOpen}
          onClose={() => setIsServiceHistoryPopoverOpen(false)}
          history={currentHistoryService !== null ? (servicePaymentHistory[currentHistoryService] || []) : []}
        />

        <AddBookingModal
          isOpen={isEditBookingModalOpen}
          onClose={() => setIsEditBookingModalOpen(false)}
          onAdd={handleBookingUpdate}
          booking={booking}
        />
      </div>
    </div>
  );
}
