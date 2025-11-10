import { useState, useRef, useEffect } from "react";
import * as MT from "@material-tailwind/react";

interface BookingPayment {
  productType: string;
  bookedProduct: string;
  supplierReference: string;
  invRequired: string;
  toBePaid: number;
  paidTillDate: number;
  paymentRemaining: number;
}

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: BookingPayment) => void;
}

export default function AddServiceModal({ isOpen, onClose, onAdd }: AddServiceModalProps) {
  // Sample supplier names for autocomplete with avatars
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

  const [newService, setNewService] = useState({
    productType: '',
    bookedProduct: '',
    supplierReference: '',
    invRequired: false,
    toBePaid: '0',
    paidTillDate: '0',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState<typeof supplierNames>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const supplierInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        supplierInputRef.current &&
        !supplierInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSupplierNameChange = (value: string) => {
    setNewService({ ...newService, supplierReference: value });
    
    if (value.length >= 2) {
      const filtered = supplierNames.filter(supplier =>
        supplier.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuppliers(filtered);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredSuppliers([]);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setNewService({ ...newService, supplierReference: name });
    setShowSuggestions(false);
    setFilteredSuppliers([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuppliers.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev =>
        prev < filteredSuppliers.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(filteredSuppliers[selectedSuggestionIndex].name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'e' || e.key === 'E' || e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // Validate strings
    if (!newService.productType.trim()) {
      newErrors.productType = 'Product type is required';
    }
    if (!newService.bookedProduct.trim()) {
      newErrors.bookedProduct = 'Booked product is required';
    }
    if (!newService.supplierReference.trim()) {
      newErrors.supplierReference = 'Supplier reference is required';
    }

    // Validate numbers
    const toBePaid = parseFloat(newService.toBePaid);
    if (newService.toBePaid && (isNaN(toBePaid) || toBePaid < 0)) {
      newErrors.toBePaid = 'Must be a valid non-negative number';
    }
    const paidTillDate = parseFloat(newService.paidTillDate);
    if (newService.paidTillDate && (isNaN(paidTillDate) || paidTillDate < 0)) {
      newErrors.paidTillDate = 'Must be a valid non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const toBePaidNum = parseFloat(newService.toBePaid) || 0;
    const paidTillDateNum = parseFloat(newService.paidTillDate) || 0;
    const paymentRemaining = toBePaidNum - paidTillDateNum;

    const service: BookingPayment = {
      productType: newService.productType.trim(),
      bookedProduct: newService.bookedProduct.trim(),
      supplierReference: newService.supplierReference.trim(),
      invRequired: newService.invRequired ? 'Yes' : 'No',
      toBePaid: toBePaidNum,
      paidTillDate: paidTillDateNum,
      paymentRemaining,
    };
    onAdd(service);
    onClose();
    setNewService({
      productType: '',
      bookedProduct: '',
      supplierReference: '',
      invRequired: false,
      toBePaid: '0',
      paidTillDate: '0',
    });
    setShowSuggestions(false);
    setFilteredSuppliers([]);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Add New Service</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
              <select
                value={newService.productType}
                onChange={(e) => setNewService({ ...newService, productType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product Type</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.productType && <p className="text-red-500 text-sm">{errors.productType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booked Product</label>
              <select
                value={newService.bookedProduct}
                onChange={(e) => setNewService({ ...newService, bookedProduct: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Booked Product</option>
                {bookedProducts.map((product) => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              {errors.bookedProduct && <p className="text-red-500 text-sm">{errors.bookedProduct}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Reference</label>
              <div className="relative">
                <input
                  ref={supplierInputRef}
                  type="text"
                  value={newService.supplierReference}
                  onChange={(e) => handleSupplierNameChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type supplier name..."
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-blue-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {showSuggestions && filteredSuppliers.length > 0 && (
                  <div
                    ref={suggestionsRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredSuppliers.map((supplier, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(supplier.name)}
                        className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                          index === selectedSuggestionIndex
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <img 
                          src={supplier.avatar} 
                          alt={supplier.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <span className="font-medium">{supplier.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.supplierReference && <p className="text-red-500 text-sm">{errors.supplierReference}</p>}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Required</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newService.invRequired}
                  onChange={(e) => setNewService({ ...newService, invRequired: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Yes, invoice is required</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Be Paid</label>
              <MT.Input
                type="number"
                value={newService.toBePaid}
                onChange={(e) => setNewService({ ...newService, toBePaid: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.toBePaid && <p className="text-red-500 text-sm">{errors.toBePaid}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paid Till Date</label>
              <MT.Input
                type="number"
                value={newService.paidTillDate}
                onChange={(e) => setNewService({ ...newService, paidTillDate: e.target.value })}
                onKeyDown={handleNumberInput}
                min="0"
                placeholder="0"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              />
              {errors.paidTillDate && <p className="text-red-500 text-sm">{errors.paidTillDate}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Add Service</button>
          </div>
        </div>
      </div>
    )
  );
}