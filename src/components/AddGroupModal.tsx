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
  group: string;
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (guests: GuestTour[]) => void;
}

export default function AddGroupModal({ isOpen, onClose, onAdd }: AddGroupModalProps) {
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

  const [groupData, setGroupData] = useState({
    type: 'Domestic',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    group: '',
  });

  const [guestNamesList, setGuestNamesList] = useState<string[]>(['']);
  const destinations = groupData.type === 'International' ? internationalDestinations : domesticDestinations;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});
  const [filteredGuests, setFilteredGuests] = useState<{ [key: number]: typeof guestNames }>({});
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<{ [key: number]: number }>({});
  const guestInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const suggestionsRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [showGroupSuggestions, setShowGroupSuggestions] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState<string[]>([]);
  const [selectedGroupSuggestionIndex, setSelectedGroupSuggestionIndex] = useState(-1);
  const groupInputRef = useRef<HTMLInputElement>(null);
  const groupSuggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check guest name suggestions
      Object.keys(guestInputRefs.current).forEach((key) => {
        const index = parseInt(key);
        const inputRef = guestInputRefs.current[index];
        const suggestionsRef = suggestionsRefs.current[index];
        
        if (
          inputRef &&
          !inputRef.contains(event.target as Node) &&
          suggestionsRef &&
          !suggestionsRef.contains(event.target as Node)
        ) {
          setShowSuggestions(prev => ({ ...prev, [index]: false }));
        }
      });

      // Check group suggestions
      if (
        groupInputRef.current &&
        !groupInputRef.current.contains(event.target as Node) &&
        groupSuggestionsRef.current &&
        !groupSuggestionsRef.current.contains(event.target as Node)
      ) {
        setShowGroupSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-add empty field when all fields are filled
  useEffect(() => {
    const allFilled = guestNamesList.every(name => name.trim() !== '');
    if (allFilled && guestNamesList.length > 0) {
      setGuestNamesList([...guestNamesList, '']);
    }
  }, [guestNamesList]);

  const handleGuestNameChange = (index: number, value: string) => {
    const newList = [...guestNamesList];
    newList[index] = value;
    setGuestNamesList(newList);
    
    if (value.length >= 2) {
      const filtered = guestNames.filter(guest =>
        guest.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGuests(prev => ({ ...prev, [index]: filtered }));
      setShowSuggestions(prev => ({ ...prev, [index]: true }));
      setSelectedSuggestionIndex(prev => ({ ...prev, [index]: -1 }));
    } else {
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
      setFilteredGuests(prev => ({ ...prev, [index]: [] }));
    }
  };

  const handleSuggestionClick = (index: number, name: string) => {
    const newList = [...guestNamesList];
    newList[index] = name;
    setGuestNamesList(newList);
    setShowSuggestions(prev => ({ ...prev, [index]: false }));
    setFilteredGuests(prev => ({ ...prev, [index]: [] }));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions[index] || !filteredGuests[index] || filteredGuests[index].length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => ({
        ...prev,
        [index]: (prev[index] ?? -1) < filteredGuests[index].length - 1 ? (prev[index] ?? -1) + 1 : prev[index] ?? -1
      }));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => ({
        ...prev,
        [index]: (prev[index] ?? -1) > 0 ? (prev[index] ?? -1) - 1 : -1
      }));
    } else if (e.key === "Enter" && (selectedSuggestionIndex[index] ?? -1) >= 0) {
      e.preventDefault();
      handleSuggestionClick(index, filteredGuests[index][selectedSuggestionIndex[index]].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGroupNameChange = (value: string) => {
    setGroupData({ ...groupData, group: value });
    
    if (value.length >= 2) {
      const filtered = groups.filter(group =>
        group.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGroups(filtered);
      setShowGroupSuggestions(true);
      setSelectedGroupSuggestionIndex(-1);
    } else {
      setShowGroupSuggestions(false);
      setFilteredGroups([]);
    }
  };

  const handleGroupSuggestionClick = (name: string) => {
    setGroupData({ ...groupData, group: name });
    setShowGroupSuggestions(false);
    setFilteredGroups([]);
  };

  const handleGroupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showGroupSuggestions || filteredGroups.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedGroupSuggestionIndex(prev =>
        prev < filteredGroups.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedGroupSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedGroupSuggestionIndex >= 0) {
      e.preventDefault();
      handleGroupSuggestionClick(filteredGroups[selectedGroupSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowGroupSuggestions(false);
    }
  };

  const addGuestNameField = () => {
    // Check if all existing fields are filled
    const hasEmptyField = guestNamesList.some(name => name.trim() === '');
    if (!hasEmptyField) {
      setGuestNamesList([...guestNamesList, '']);
    }
  };

  const removeGuestNameField = (index: number) => {
    if (guestNamesList.length > 1) {
      const newList = guestNamesList.filter((_, i) => i !== index);
      setGuestNamesList(newList);
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

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // Validate dates not in past
    if (groupData.arrivalDate && new Date(groupData.arrivalDate) < new Date(today)) {
      newErrors.arrivalDate = 'Arrival date cannot be in the past';
    }
    if (groupData.departureDate && new Date(groupData.departureDate) < new Date(today)) {
      newErrors.departureDate = 'Departure date cannot be in the past';
    }
    if (groupData.arrivalDate && groupData.departureDate && new Date(groupData.departureDate) < new Date(groupData.arrivalDate)) {
      newErrors.departureDate = 'Departure date cannot be before arrival date';
    }

    // Filter out empty guest names (ignore the auto-added empty field)
    const validGuestNames = guestNamesList.filter(name => name.trim() !== '');
    
    // Validate that at least one guest name is provided
    if (validGuestNames.length === 0) {
      newErrors.guestNames = 'At least one guest name is required';
    }

    // Validate strings
    if (!groupData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Create guest objects for all valid guest names
    const guests: GuestTour[] = validGuestNames.map(guestName => ({
      guestName: guestName.trim(),
      destination: groupData.destination.trim(),
      arrivalDate: formatDateToDisplay(groupData.arrivalDate),
      departureDate: formatDateToDisplay(groupData.departureDate),
      tourStartMonth: groupData.arrivalDate ? new Date(groupData.arrivalDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      tourEndMonth: groupData.departureDate ? new Date(groupData.departureDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      balanceCollection: 0,
      toBeCollected: 0,
      collectedTillDate: 0,
      profit: 0,
      profitBookedTillDate: 0,
      group: groupData.group.trim(),
    }));

    onAdd(guests);
    onClose();
    
    // Reset form
    setGroupData({
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      group: '',
    });
    setGuestNamesList(['']);
    setShowSuggestions({});
    setFilteredGuests({});
    setShowGroupSuggestions(false);
    setFilteredGroups([]);
  };

  const hasEmptyFields = guestNamesList.some(name => name.trim() === '');

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Group</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Guest Names Section */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guest Names
              </label>
              <div className="space-y-2">
                {guestNamesList.map((guestName, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="relative flex-1">
                      <input
                        ref={(el) => { guestInputRefs.current[index] = el; }}
                        type="text"
                        value={guestName}
                        onChange={(e) => handleGuestNameChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        placeholder={`Guest ${index + 1} name...`}
                        autoComplete="off"
                        className="w-full px-3 py-2 border border-blue-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      {showSuggestions[index] && filteredGuests[index] && filteredGuests[index].length > 0 && (
                        <div
                          ref={(el) => { suggestionsRefs.current[index] = el; }}
                          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                        >
                          {filteredGuests[index].map((guest, guestIndex) => (
                            <div
                              key={guestIndex}
                              onClick={() => handleSuggestionClick(index, guest.name)}
                              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                                guestIndex === (selectedSuggestionIndex[index] ?? -1)
                                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-600"
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
                    {/* Show X button only if more than 1 guest AND not the auto-added empty field */}
                    {guestNamesList.length > 1 && !(index === guestNamesList.length - 1 && guestName.trim() === '') && (
                      <button
                        onClick={() => removeGuestNameField(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        title="Remove guest"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addGuestNameField}
                disabled={hasEmptyFields}
                className={`mt-2 px-4 py-2 rounded-md transition-colors ${
                  hasEmptyFields
                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
                title={hasEmptyFields ? 'Fill all guest names before adding more' : 'Add another guest'}
              >
                + Add Guest
              </button>
              {errors.guestNames && <p className="text-red-500 text-sm mt-1">{errors.guestNames}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group</label>
              <div className="relative">
                <input
                  ref={groupInputRef}
                  type="text"
                  value={groupData.group}
                  onChange={(e) => handleGroupNameChange(e.target.value)}
                  onKeyDown={handleGroupKeyDown}
                  placeholder="Type group name..."
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-blue-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {showGroupSuggestions && filteredGroups.length > 0 && (
                  <div
                    ref={groupSuggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredGroups.map((group, index) => (
                      <div
                        key={index}
                        onClick={() => handleGroupSuggestionClick(group)}
                        className={`px-4 py-2 cursor-pointer transition-colors ${
                          index === selectedGroupSuggestionIndex
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600"
                        }`}
                      >
                        <span className="font-medium">{group}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={groupData.type}
                onChange={(e) => setGroupData({ ...groupData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <select
                value={groupData.destination}
                onChange={(e) => setGroupData({ ...groupData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Destination</option>
                {destinations.map((dest) => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </select>
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Arrival Date</label>
              <MT.Input
                type="date"
                value={groupData.arrivalDate}
                onChange={(e) => setGroupData({ ...groupData, arrivalDate: e.target.value })}
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
                value={groupData.departureDate}
                onChange={(e) => setGroupData({ ...groupData, departureDate: e.target.value })}
                min={groupData.arrivalDate || today}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.departureDate && <p className="text-red-500 text-sm">{errors.departureDate}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Group</button>
          </div>
        </div>
      </div>
    )
  );
}
