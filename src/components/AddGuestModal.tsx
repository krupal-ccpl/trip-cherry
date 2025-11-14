import { useState } from "react";
import * as MT from "@material-tailwind/react";
import Autocomplete, { type AutocompleteOption } from "./Autocomplete";

interface GuestTour {
  guestName: string;
  destination: string;
  tourStartMonth: string;
  tourEndMonth: string;
  arrivalDate: string;
  departureDate: string;
  group: string;
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

  const [newGuest, setNewGuest] = useState({
    guestName: '',
    type: 'Domestic',
    destination: '',
    arrivalDate: '',
    departureDate: '',
    group: '',
  });

  const destinations = newGuest.type === 'International' ? internationalDestinations : domesticDestinations;

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

  const today = new Date().toISOString().split('T')[0];

  const handleGuestSelect = (value: string) => {
    setNewGuest({ ...newGuest, guestName: value });
  };

  const handleGroupSelect = (value: string) => {
    setNewGuest({ ...newGuest, group: value });
  };

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const guest: GuestTour = {
      guestName: newGuest.guestName.trim(),
      destination: newGuest.destination.trim(),
      arrivalDate: formatDateToDisplay(newGuest.arrivalDate),
      departureDate: formatDateToDisplay(newGuest.departureDate),
      tourStartMonth: newGuest.arrivalDate ? new Date(newGuest.arrivalDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      tourEndMonth: newGuest.departureDate ? new Date(newGuest.departureDate).toLocaleDateString('en-US', { month: 'long' }) : '',
      group: newGuest.group.trim(),
    };
    onAdd(guest);
    onClose();
    setNewGuest({
      guestName: '',
      type: 'Domestic',
      destination: '',
      arrivalDate: '',
      departureDate: '',
      group: '',
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Guest</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Autocomplete
                label="Guest Name"
                value={newGuest.guestName}
                onChange={handleGuestSelect}
                options={guestOptions}
                placeholder="Type guest name..."
                error={errors.guestName}
              />
            </div>
            <div className="col-span-2">
              <Autocomplete
                label="Group"
                value={newGuest.group}
                onChange={handleGroupSelect}
                options={groupOptions}
                placeholder="Type group name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={newGuest.type}
                onChange={(e) => setNewGuest({ ...newGuest, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
              <select
                value={newGuest.destination}
                onChange={(e) => setNewGuest({ ...newGuest, destination: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Departure Date</label>
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
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Guest</button>
          </div>
        </div>
      </div>
    )
  );
}