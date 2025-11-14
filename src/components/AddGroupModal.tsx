import { useState, useEffect } from "react";
import * as MT from "@material-tailwind/react";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";

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

  // Transform guest names and groups to autocomplete options
  const guestOptions: AutocompleteOption[] = guestNames.map(guest => ({
    label: guest.name,
    value: guest.name,
    avatar: guest.avatar
  }));

  const groupOptions: AutocompleteOption[] = groups.map(group => ({
    label: group,
    value: group
  }));

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
  };

  const handleGroupSelect = (value: string) => {
    setGroupData({ ...groupData, group: value });
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
  };

  const hasEmptyFields = guestNamesList.some(name => name.trim() === '');

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Group</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Autocomplete
                label="Group"
                value={groupData.group}
                onChange={handleGroupSelect}
                options={groupOptions}
                placeholder="Type group name..."
              />
            </div>
                        {/* Guest Names Section */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Guest Names
              </label>
              <div className="space-y-2">
                {guestNamesList.map((guestName, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Autocomplete
                      value={guestName}
                      onChange={(value) => handleGuestNameChange(index, value)}
                      options={guestOptions}
                      placeholder={`Guest ${index + 1} name...`}
                      className="flex-1"
                    />
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
