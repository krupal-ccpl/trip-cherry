import { useState, useEffect } from "react";
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
  isAdult: boolean;
  documents: {name: string, uploaded: boolean, path?: string}[];
}

interface Group {
  name: string;
  leadPerson: string;
  members: string[];
}

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (group: Group, updatedGuests: GuestTour[]) => void;
  guests: GuestTour[];
}

export default function AddGroupModal({ isOpen, onClose, onAdd, guests }: AddGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [leadPerson, setLeadPerson] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get ungrouped guests
  const ungroupedGuests = guests.filter(g => !g.group || g.group.trim() === "");

  // All guests for lead person selection
  const allGuests = guests;

  // Transform to autocomplete options
  const leadOptions: AutocompleteOption[] = allGuests.map(guest => ({
    label: guest.guestName,
    value: guest.guestName,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`
  }));

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    }

    if (!leadPerson.trim()) {
      newErrors.leadPerson = "Lead person is required";
    }

    if (selectedMembers.length === 0) {
      newErrors.members = "At least one member is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Create the group
    const newGroup: Group = {
      name: groupName.trim(),
      leadPerson: leadPerson.trim(),
      members: selectedMembers
    };

    // Update guests: assign group to selected members
    const updatedGuests = guests.map(guest => {
      if (selectedMembers.includes(guest.guestName)) {
        return { ...guest, group: groupName.trim() };
      }
      return guest;
    });

    onAdd(newGroup, updatedGuests);
    onClose();

    // Reset form
    setGroupName("");
    setLeadPerson("");
    setSelectedMembers([]);
  };

  const handleLeadPersonSelect = (value: string) => {
    const oldLeadPerson = leadPerson;
    setLeadPerson(value);
    
    setSelectedMembers(prev => {
      let newSelected = [...prev];
      
      // Remove old lead person
      if (oldLeadPerson) {
        newSelected = newSelected.filter(name => name !== oldLeadPerson);
      }
      
      // Add new lead person if not already selected
      if (value && !newSelected.includes(value)) {
        newSelected.push(value);
      }
      
      return newSelected;
    });
  };

  const toggleMember = (memberName: string) => {
    // Don't allow removing the lead person from members
    if (memberName === leadPerson) return;
    
    setSelectedMembers(prev =>
      prev.includes(memberName)
        ? prev.filter(name => name !== memberName)
        : [...prev, memberName]
    );
  };

  useEffect(() => {
    if (isOpen) {
      setGroupName("");
      setLeadPerson("");
      setSelectedMembers([]);
      setErrors({});
    }
  }, [isOpen]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Group</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter group name..."
              />
              {errors.groupName && <p className="text-red-500 text-sm mt-1">{errors.groupName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lead Person
              </label>
              <Autocomplete
                value={leadPerson}
                onChange={handleLeadPersonSelect}
                options={leadOptions}
                placeholder="Select lead person..."
              />
              {errors.leadPerson && <p className="text-red-500 text-sm mt-1">{errors.leadPerson}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Members (Ungrouped Guests)
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-md p-2">
                {ungroupedGuests.length === 0 ? (
                  <p className="text-gray-500 text-sm">No ungrouped guests available</p>
                ) : (
                  ungroupedGuests.map((guest) => (
                    <div key={guest.guestName} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(guest.guestName)}
                        onChange={() => toggleMember(guest.guestName)}
                        className="rounded"
                        disabled={leadPerson === guest.guestName}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {guest.guestName}
                        {leadPerson === guest.guestName && <span className="ml-1">👑</span>}
                      </span>
                    </div>
                  ))
                )}
              </div>
              {errors.members && <p className="text-red-500 text-sm mt-1">{errors.members}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    )
  );
}
