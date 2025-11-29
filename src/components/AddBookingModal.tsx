import { useState } from "react";
import * as MT from "@material-tailwind/react";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";
import AirportAutocomplete from "./AirportAutocomplete";

interface Traveller {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
}

interface Booking {
  srNo: number;
  bookingType: 'flight' | 'train';
  bookingDate: string;
  portal: string;
  guestName: string;
  numberOfTravellers: number;
  travellers?: Traveller[];
  
  // Flight specific fields
  airline?: string;
  ticketType?: string;
  sectors?: string[]; // Array of airport codes for sectors
  sector?: string; // Formatted sector string for display
  from?: string; // Deprecated - kept for backward compatibility
  to?: string; // Deprecated - kept for backward compatibility
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
    portal: '',
    guestName: '',
    numberOfTravellers: '1',
    hasGST: false,
    gstNumber: '',
    
    // Flight fields
    airline: '',
    ticketType: 'One Way',
    sector1: '', // Origin for one-way/outbound
    sector2: '', // Destination for one-way/outbound
    sector3: '', // Origin for return (round trip only)
    sector4: '', // Destination for return (round trip only)
    departureDate: '',
    arrivalDate: '',
    pnr: '',
    seatCharges: '',
    luggageCharges: '',
    mealCharges: '',
    otherCharges: '',
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
    collectedTillDate: '',
    processingFees: '',
    actualFare: '',
    grossProfit: '',
    netProfit: '',
    status: 'confirmed' as 'confirmed' | 'pending' | 'cancelled',
  });

  const [travellers, setTravellers] = useState<Traveller[]>([
    { name: '', age: '', gender: '' }
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);

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

  const handleNumberOfTravellersChange = (value: string) => {
    // Allow empty string so user can clear the input
    if (value === '') {
      setNewBooking({ ...newBooking, numberOfTravellers: '' });
      return;
    }
    
    const count = parseInt(value);
    if (isNaN(count) || count < 1) {
      setNewBooking({ ...newBooking, numberOfTravellers: value });
      return;
    }
    
    const validCount = Math.min(count, 20); // Limit maximum to 20
    
    setNewBooking({ ...newBooking, numberOfTravellers: validCount.toString() });
    
    // Update travellers array
    setTravellers(prev => {
      const current = [...prev];
      if (validCount > current.length) {
        // Add new travellers
        const newTravellers = Array(validCount - current.length).fill(null).map(() => ({
          name: '',
          age: '',
          gender: '' as ''
        }));
        return [...current, ...newTravellers];
      } else if (validCount < current.length) {
        // Remove travellers from the end
        return current.slice(0, validCount);
      }
      return current;
    });
  };

  const updateTraveller = (index: number, field: keyof Traveller, value: string) => {
    setTravellers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const deleteTraveller = (index: number) => {
    setTravellers(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Update number of travellers
      const newCount = updated.length;
      setNewBooking(prevBooking => ({ 
        ...prevBooking, 
        numberOfTravellers: newCount.toString() 
      }));
      return updated;
    });
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

    // Validate arrival date if both dates are present
    if (newBooking.bookingType === 'flight' && newBooking.departureDate && newBooking.arrivalDate && 
        new Date(newBooking.arrivalDate) < new Date(newBooking.departureDate)) {
      newErrors.arrivalDate = 'Arrival date cannot be before departure date';
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

    // Ensure numberOfTravellers is at least 1
    const travellersCount = parseInt(newBooking.numberOfTravellers) || 1;

    const booking: Booking = {
      srNo: Date.now(),
      bookingType: newBooking.bookingType,
      bookingDate: formatDateToDisplay(new Date().toISOString().split('T')[0]),
      portal: newBooking.portal.trim(),
      guestName: newBooking.guestName.trim(),
      numberOfTravellers: travellersCount,
      travellers: travellers,
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
      
      // Build sectors array based on ticket type
      // One Way: 2 sectors, Round Trip: 3 sectors, Multi City: 4 sectors
      const sectorsArray = [newBooking.sector1, newBooking.sector2];
      if (newBooking.ticketType === 'Round Trip') {
        sectorsArray.push(newBooking.sector3);
      } else if (newBooking.ticketType === 'Multi City') {
        sectorsArray.push(newBooking.sector3, newBooking.sector4);
      }
      booking.sectors = sectorsArray.filter(s => s); // Remove empty sectors
      
      // Create formatted sector string for display
      booking.sector = booking.sectors.join(' - ');
      
      // For backward compatibility
      booking.from = newBooking.sector1;
      booking.to = newBooking.sector2;
      
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
      portal: '',
      guestName: '',
      numberOfTravellers: '1',
      hasGST: false,
      gstNumber: '',
      airline: '',
      ticketType: 'One Way',
      sector1: '',
      sector2: '',
      sector3: '',
      sector4: '',
      departureDate: '',
      arrivalDate: '',
      pnr: '',
      seatCharges: '',
      luggageCharges: '',
      mealCharges: '',
      otherCharges: '',
      otherChargesRemarks: '',
      trainName: '',
      trainNumber: '',
      trainTicketType: 'One Way',
      class: '3A - Third AC',
      trainFrom: '',
      trainTo: '',
      journeyDate: '',
      collectedTillDate: '',
      processingFees: '',
      actualFare: '',
      grossProfit: '',
      netProfit: '',
      status: 'confirmed',
    });
    setTravellers([{ name: '', age: '', gender: '' }]);
    setErrors({});
    setUploadedFiles([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFilePreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  const isPdfFile = (file: File): boolean => {
    return file.type === 'application/pdf';
  };

  // Reusable Traveller Details Table Component
  const TravellerDetailsSection = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Traveller Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 w-12">#</th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">Name</th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 w-28">Age</th>
              <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 w-36">Gender</th>
              <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 w-16">Action</th>
            </tr>
          </thead>
          <tbody>
            {travellers.map((traveller, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-center">
                  {index + 1}
                </td>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  <input
                    type="text"
                    value={traveller.name}
                    onChange={(e) => updateTraveller(index, 'name', e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  <input
                    type="number"
                    value={traveller.age}
                    onChange={(e) => updateTraveller(index, 'age', e.target.value)}
                    onKeyDown={handleNumberInput}
                    min="0"
                    max="120"
                    placeholder="Age"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </td>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600">
                  <select
                    value={traveller.gender}
                    onChange={(e) => updateTraveller(index, 'gender', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-center">
                  {travellers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteTraveller(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete traveller"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Preview Modal Component - Shows Uploaded Files
  const PreviewModal = () => {
    if (!showPreview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Ticket Preview ({uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'})
            </h2>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No files uploaded yet</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Upload ticket files to preview them here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700">
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">
                            {index + 1}.
                          </span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      {isImageFile(file) ? (
                        <img 
                          src={getFilePreviewUrl(file)} 
                          alt={file.name}
                          className="w-full h-auto max-h-64 object-contain rounded"
                        />
                      ) : isPdfFile(file) ? (
                        <div className="bg-gray-50 dark:bg-gray-600 rounded p-6 text-center h-64 flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-red-500 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">PDF Document</p>
                          <a 
                            href={getFilePreviewUrl(file)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Open PDF
                          </a>
                        </div>
                      ) : (
                        <div className="bg-gray-50 dark:bg-gray-600 rounded p-6 text-center h-64 flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                          </svg>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">Not supported</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex-shrink-0">
            <button
              onClick={() => setShowPreview(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <PreviewModal />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Booking</h2>
          <div className="flex gap-2">
            <MT.Button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-sm py-2 px-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Preview Tickets
            </MT.Button>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-sm py-2 px-4 rounded-lg font-medium transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload Tickets
              </span>
            </label>
          </div>
        </div>
        
        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {isImageFile(file) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    ) : isPdfFile(file) ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                    title="Remove file"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
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
              disabled
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all opacity-50 cursor-not-allowed ${
                newBooking.bookingType === 'train'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 border-2 border-gray-300 dark:border-gray-600'
              }`}
            >
              Train Booking (Coming Soon)
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newBooking.hasGST}
                onChange={(e) => setNewBooking({ ...newBooking, hasGST: e.target.checked, gstNumber: e.target.checked ? newBooking.gstNumber : '' })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Add GST</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Autocomplete
                label="Customer"
                value={newBooking.guestName}
                onChange={handleGuestSelect}
                options={guestOptions}
                placeholder="Type customer name..."
                error={errors.guestName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portal</label>
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
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Travellers</label>
              <input
                type="number"
                value={newBooking.numberOfTravellers}
                onChange={(e) => handleNumberOfTravellersChange(e.target.value)}
                onBlur={(e) => {
                  // Set to 1 if empty or invalid on blur
                  if (!e.target.value || parseInt(e.target.value) < 1) {
                    handleNumberOfTravellersChange('1');
                  }
                }}
                onKeyDown={handleNumberInput}
                min="1"
                max="20"
                placeholder="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
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
          {newBooking.hasGST && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GST Number</label>
                <input
                  type="text"
                  value={newBooking.gstNumber}
                  onChange={(e) => setNewBooking({ ...newBooking, gstNumber: e.target.value.toUpperCase() })}
                  placeholder="Enter GST Number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {errors.gstNumber && <p className="text-red-500 text-sm mt-1">{errors.gstNumber}</p>}
              </div>
              <div></div>
            </div>
          )}
        </div>

        {/* Conditional Fields based on Booking Type */}
        {newBooking.bookingType === 'flight' ? (
          <>
            {/* Flight Specific Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Flight Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Airline</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">PNR</label>
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
                <div></div>
              </div>
              
              {/* Sectors Section */}
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-3 text-gray-900 dark:text-white">Flight Sectors</h4>
                
                {/* First row - Always 2 columns */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <AirportAutocomplete
                    label="Sector 1"
                    value={newBooking.sector1}
                    onChange={(code) => setNewBooking({ ...newBooking, sector1: code })}
                    placeholder="Origin..."
                    error={errors.sector1}
                  />
                  <AirportAutocomplete
                    label="Sector 2"
                    value={newBooking.sector2}
                    onChange={(code) => setNewBooking({ ...newBooking, sector2: code })}
                    placeholder="Destination..."
                    error={errors.sector2}
                  />
                </div>
                  
                {/* Second row - Show for Round Trip and Multi City - Always 2 columns */}
                {(newBooking.ticketType === 'Round Trip' || newBooking.ticketType === 'Multi City') && (
                  <div className="grid grid-cols-2 gap-4">
                    <AirportAutocomplete
                      label="Sector 3"
                      value={newBooking.sector3}
                      onChange={(code) => setNewBooking({ ...newBooking, sector3: code })}
                      placeholder={newBooking.ticketType === 'Round Trip' ? 'Return...' : 'Next...'}
                      error={errors.sector3}
                    />
                    
                    {/* Sector 4 - Show only for Multi City */}
                    {newBooking.ticketType === 'Multi City' ? (
                      <AirportAutocomplete
                        label="Sector 4"
                        value={newBooking.sector4}
                        onChange={(code) => setNewBooking({ ...newBooking, sector4: code })}
                        placeholder="Final..."
                        error={errors.sector4}
                      />
                    ) : (
                      <div></div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
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
            </div>
            
            <TravellerDetailsSection />

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
                    placeholder=""
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
                    placeholder=""
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.luggageCharges && <p className="text-red-500 text-sm mt-1">{errors.luggageCharges}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meal Charges</label>
                  <MT.Input
                    type="number"
                    value={newBooking.mealCharges}
                    onChange={(e) => setNewBooking({ ...newBooking, mealCharges: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder=""
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
                    placeholder=""
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.otherCharges && <p className="text-red-500 text-sm mt-1">{errors.otherCharges}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Note (Other Charges)</label>
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
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Train Specific Fields */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Train Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Train Name</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Train Number</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Station</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Station</label>
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
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Journey Date</label>
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
                <div></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
                  <MT.Input
                    type="number"
                    value={newBooking.actualFare}
                    onChange={(e) => setNewBooking({ ...newBooking, actualFare: e.target.value })}
                    onKeyDown={handleNumberInput}
                    min="0"
                    placeholder=""
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
                    placeholder=""
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                  />
                  {errors.processingFees && <p className="text-red-500 text-sm mt-1">{errors.processingFees}</p>}
                </div>
              </div>
            </div>
            
            <TravellerDetailsSection />
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
