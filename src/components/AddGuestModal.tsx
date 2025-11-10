import { useState, useRef, useEffect } from "react";
import * as MT from "@material-tailwind/react";

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
}

interface AddGuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guest: GuestTour) => void;
}

export default function AddGuestModal({ isOpen, onClose, onAdd }: AddGuestModalProps) {
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

  const [newGuest, setNewGuest] = useState({
    guestName: '',
    type: 'Domestic',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    toBeCollected: '0',
    collectedTillDate: '0',
    profit: '0',
    profitBookedTillDate: '0',
  });

  const destinations = newGuest.type === 'International' ? internationalDestinations : domesticDestinations;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredGuests, setFilteredGuests] = useState<typeof guestNames>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const guestInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        guestInputRef.current &&
        !guestInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGuestNameChange = (value: string) => {
    setNewGuest({ ...newGuest, guestName: value });
    
    if (value.length >= 2) {
      const filtered = guestNames.filter(guest =>
        guest.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGuests(filtered);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredGuests([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setNewGuest({ ...newGuest, guestName: name });
    setShowSuggestions(false);
    setFilteredGuests([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredGuests.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < filteredGuests.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredGuests[selectedSuggestionIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };
  const today = new Date().toISOString().split('T')[0];

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
    const newErrors: Record<string, string> = {};

    // Validate dates not in past
    if (newGuest.arrivalDate && new Date(newGuest.arrivalDate) < new Date(today)) {
      newErrors.arrivalDate = 'Arrival date cannot be in the past';
    }
    if (newGuest.departureDate && new Date(newGuest.departureDate) < new Date(today)) {
      newErrors.departureDate = 'Departure date cannot be in the past';
    }
    if (newGuest.arrivalDate && newGuest.departureDate && new Date(newGuest.departureDate) < new Date(newGuest.arrivalDate)) {
      newErrors.departureDate = 'Departure date cannot be before arrival date';
    }

    // Validate strings
    if (!newGuest.guestName.trim()) {
      newErrors.guestName = 'Guest name is required';
    }
    if (!newGuest.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    // Validate numbers
    const toBeCollected = parseFloat(newGuest.toBeCollected);
    if (newGuest.toBeCollected && (isNaN(toBeCollected) || toBeCollected < 0)) {
      newErrors.toBeCollected = 'Must be a valid non-negative number';
    }
    const collectedTillDate = parseFloat(newGuest.collectedTillDate);
    if (newGuest.collectedTillDate && (isNaN(collectedTillDate) || collectedTillDate < 0)) {
      newErrors.collectedTillDate = 'Must be a valid non-negative number';
    }
    const profit = parseFloat(newGuest.profit);
    if (newGuest.profit && (isNaN(profit) || profit < 0)) {
      newErrors.profit = 'Must be a valid non-negative number';
    }
    const profitBookedTillDate = parseFloat(newGuest.profitBookedTillDate);
    if (newGuest.profitBookedTillDate && (isNaN(profitBookedTillDate) || profitBookedTillDate < 0)) {
      newErrors.profitBookedTillDate = 'Must be a valid non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const toBeCollectedNum = parseFloat(newGuest.toBeCollected) || 0;
    const collectedTillDateNum = parseFloat(newGuest.collectedTillDate) || 0;
    const profitNum = parseFloat(newGuest.profit) || 0;
    const profitBookedTillDateNum = parseFloat(newGuest.profitBookedTillDate) || 0;
    const balanceCollection = toBeCollectedNum - collectedTillDateNum;

    const guest: GuestTour = {
      guestName: newGuest.guestName.trim(),
      destination: newGuest.destination.trim(),
      arrivalDate: formatDateToDisplay(newGuest.arrivalDate),
      departureDate: formatDateToDisplay(newGuest.departureDate),
      tourStartMonth: newGuest.arrivalDate ? new Date(newGuest.arrivalDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      tourEndMonth: newGuest.departureDate ? new Date(newGuest.departureDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      balanceCollection,
      toBeCollected: toBeCollectedNum,
      collectedTillDate: collectedTillDateNum,
      profit: profitNum,
      profitBookedTillDate: profitBookedTillDateNum,
    };
    onAdd(guest);
    onClose();
    setNewGuest({
      guestName: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      toBeCollected: '0',
      collectedTillDate: '0',
      profit: '0',
      profitBookedTillDate: '0',
    });
    setShowSuggestions(false);
    setFilteredGuests([]);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add New Guest</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
              <div className="relative">
                <input
                  ref={guestInputRef}
                  type="text"
                  value={newGuest.guestName}
                  onChange={(e) => handleGuestNameChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type guest name..."
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {showSuggestions && filteredGuests.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredGuests.map((guest, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(guest.name)}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                          index === selectedSuggestionIndex
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <img 
                          src={guest.avatar} 
                          alt={guest.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="font-medium">{guest.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.guestName && <p className="text-red-500 text-sm">{errors.guestName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={newGuest.type}
                onChange={(e) => setNewGuest({ ...newGuest, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={newGuest.destination}
                onChange={(e) => setNewGuest({ ...newGuest, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
              <MT.Input
                type="date"
                value={newGuest.arrivalDate}
                onChange={(e) => setNewGuest({ ...newGuest, arrivalDate: e.target.value })}
                min={today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.arrivalDate && <p className="text-red-500 text-sm">{errors.arrivalDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <MT.Input
                type="date"
                value={newGuest.departureDate}
                onChange={(e) => setNewGuest({ ...newGuest, departureDate: e.target.value })}
                min={newGuest.arrivalDate || today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.departureDate && <p className="text-red-500 text-sm">{errors.departureDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Be Collected</label>
              <MT.Input
                type="number"
                value={newGuest.toBeCollected}
                onChange={(e) => setNewGuest({ ...newGuest, toBeCollected: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.toBeCollected && <p className="text-red-500 text-sm">{errors.toBeCollected}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collected Till Date</label>
              <MT.Input
                type="number"
                value={newGuest.collectedTillDate}
                onChange={(e) => setNewGuest({ ...newGuest, collectedTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.collectedTillDate && <p className="text-red-500 text-sm">{errors.collectedTillDate}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profit</label>
              <MT.Input
                type="number"
                value={newGuest.profit}
                onChange={(e) => setNewGuest({ ...newGuest, profit: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.profit && <p className="text-red-500 text-sm">{errors.profit}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profit Booked Till Date</label>
              <MT.Input
                type="number"
                value={newGuest.profitBookedTillDate}
                onChange={(e) => setNewGuest({ ...newGuest, profitBookedTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.profitBookedTillDate && <p className="text-red-500 text-sm">{errors.profitBookedTillDate}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add Guest</button>
          </div>
        </div>
      </div>
    )
  );
}