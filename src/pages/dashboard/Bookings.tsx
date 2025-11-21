import { useState } from "react";
import * as MT from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, FunnelIcon } from "@heroicons/react/24/outline";
import AddBookingModal from "@/components/AddBookingModal";
import { bookingsData } from '@/data/bookings-data';

interface Booking {
  srNo: number;
  bookingType: 'flight' | 'train';
  bookingDate: string;
  portal: string;
  guestName: string;
  numberOfTravellers: number;
  
  // Flight specific fields
  airline?: string;
  ticketType?: string;
  sector?: string;
  from?: string;
  to?: string;
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

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>(bookingsData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Search, Sort, Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string; direction: 'asc' | 'desc'} | null>(null);
  const [filters, setFilters] = useState({
    bookingType: '',
    portal: '',
    status: ''
  });

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
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        booking.guestName.toLowerCase().includes(searchLower) ||
        booking.portal.toLowerCase().includes(searchLower) ||
        (booking.pnr && booking.pnr.toLowerCase().includes(searchLower)) ||
        (booking.trainNumber && booking.trainNumber.toLowerCase().includes(searchLower)) ||
        booking.bookingDate.includes(searchTerm);

      const matchesBookingType = !filters.bookingType || booking.bookingType === filters.bookingType;
      const matchesPortal = !filters.portal || booking.portal === filters.portal;
      const matchesStatus = !filters.status || booking.status === filters.status;

      return matchesSearch && matchesBookingType && matchesPortal && matchesStatus;
    });

    if (sortConfig) {
      filtered.sort((a: Booking, b: Booking) => {
        let aValue: any = a[sortConfig.key as keyof typeof a];
        let bValue: any = b[sortConfig.key as keyof typeof b];

        if (['collectedTillDate', 'processingFees', 'actualFare', 'grossProfit', 'netProfit', 'ancillary'].includes(sortConfig.key)) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
        }

        if (['bookingDate', 'departureDate', 'arrivalDate', 'journeyDate'].includes(sortConfig.key)) {
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

  // Calculate totals
  const totalCollected = filteredAndSortedBookings.reduce((sum: number, item: Booking) => sum + item.collectedTillDate, 0);
  const totalGrossProfit = filteredAndSortedBookings.reduce((sum: number, item: Booking) => sum + item.grossProfit, 0);
  const totalNetProfit = filteredAndSortedBookings.reduce((sum: number, item: Booking) => sum + item.netProfit, 0);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="mt-8">
      {/* Header with Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <MT.Typography variant="h4" color="blue-gray" className="dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Booking Management
        </MT.Typography>
        <MT.Button 
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsFormOpen(true)}
          placeholder={undefined} 
          onPointerEnterCapture={undefined} 
          onPointerLeaveCapture={undefined}
        >
          <PlusIcon className="h-5 w-5" />
          Add New Booking
        </MT.Button>
      </div>

      {/* Search, Sort, Filter Controls */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.bookingType}
              onChange={(e) => handleFilter('bookingType', e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Types</option>
              <option value="flight">Flight</option>
              <option value="train">Train</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.portal}
              onChange={(e) => handleFilter('portal', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Portals</option>
              {portals.map((portal) => (
                <option key={portal} value={portal}>{portal}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleFilter('status', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-gray-900/5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Bookings Table */}
        <MT.Card className="shadow-lg border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 rounded-t-xl">
            <MT.Typography variant="h6" color="white" className="font-semibold" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              All Bookings
            </MT.Typography>
          </div>
          <MT.CardBody className="overflow-x-auto px-0 pt-0 pb-2" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="w-full min-w-[1600px] table-auto">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/50">
                  {[
                    { key: "srNo", label: "Sr No" },
                    { key: "bookingType", label: "Type" },
                    { key: "bookingDate", label: "Booking Date" },
                    { key: "portal", label: "Portal" },
                    { key: "guestName", label: "Guest Name" },
                    { key: "details", label: "Travel Details" },
                    { key: "reference", label: "Reference" },
                    { key: "journeyDate", label: "Journey Date" },
                    { key: "pnr", label: "PNR" },
                    { key: "ancillary", label: "Ancillary" },
                    { key: "collectedTillDate", label: "Collected" },
                    { key: "processingFees", label: "Processing Fees" },
                    { key: "actualFare", label: "Actual Fare" },
                    { key: "grossProfit", label: "Gross Profit" },
                    { key: "netProfit", label: "Net Profit" },
                    { key: "status", label: "Status" },
                  ].map((header) => (
                    <th
                      key={header.key}
                      className={`border-b-2 border-blue-200 py-3 px-3 text-left ${header.key !== 'details' && header.key !== 'reference' ? 'cursor-pointer hover:bg-blue-100 transition-colors' : ''}`}
                      onClick={() => header.key !== 'details' && header.key !== 'reference' && handleSort(header.key)}
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
                        {header.key !== 'details' && header.key !== 'reference' && (
                          <div className="flex flex-col ml-1">
                            <ArrowUpIcon className={`h-3 w-3 ${sortConfig?.key === header.key && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-gray-300'}`} />
                            <ArrowDownIcon className={`h-3 w-3 -mt-1 ${sortConfig?.key === header.key && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-gray-300'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedBookings.map((item: Booking, index: number) => {
                  const isLastRow = index === bookings.length - 1;
                  const rowClass = `${!isLastRow ? "border-b border-gray-200" : ""}`;

                  return (
                    <tr key={index} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.srNo}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.bookingType === 'flight' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {item.bookingType === 'flight' ? 'Flight' : 'Train'}
                        </span>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.bookingDate}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.portal}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.guestName}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        {item.bookingType === 'flight' ? (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">{item.airline}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.sector} • {item.ticketType}</div>
                          </div>
                        ) : (
                          <div className="text-sm">
                            <div className="font-medium text-gray-900 dark:text-white">{item.trainName}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{item.trainFrom} → {item.trainTo} • {item.class}</div>
                          </div>
                        )}
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.bookingType === 'flight' ? item.pnr : item.trainNumber}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.bookingType === 'flight' ? item.departureDate : item.journeyDate}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.pnr || '-'}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          {item.ancillary && item.ancillary > 0 ? `₹${item.ancillary.toLocaleString()}` : '-'}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-medium text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{item.collectedTillDate.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{item.processingFees.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm text-gray-700 dark:text-gray-300" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{item.actualFare.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-bold text-green-600 dark:text-green-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{item.grossProfit.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <MT.Typography className="text-sm font-bold text-blue-600 dark:text-blue-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                          ₹{item.netProfit.toLocaleString()}
                        </MT.Typography>
                      </td>
                      <td className={`py-3 px-3 ${rowClass}`}>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredAndSortedBookings.length === 0 && (
                  <tr>
                    <td colSpan={16} className="py-8 text-center">
                      <MT.Typography className="text-gray-500 dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        No bookings found. Click "Add New Booking" to create one.
                      </MT.Typography>
                    </td>
                  </tr>
                )}

                {/* Total Row */}
                {filteredAndSortedBookings.length > 0 && (
                  <tr className="bg-blue-50 dark:bg-blue-900/50 font-bold border-t-2 border-blue-200">
                    <td colSpan={10} className="py-3 px-3 text-right">
                      <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        Total
                      </MT.Typography>
                    </td>
                    <td className="py-3 px-3">
                      <MT.Typography className="text-sm font-bold text-gray-900 dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{totalCollected.toLocaleString()}
                      </MT.Typography>
                    </td>
                    <td colSpan={2} className="py-3 px-3"></td>
                    <td className="py-3 px-3">
                      <MT.Typography className="text-sm font-bold text-green-600 dark:text-green-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{totalGrossProfit.toLocaleString()}
                      </MT.Typography>
                    </td>
                    <td className="py-3 px-3">
                      <MT.Typography className="text-sm font-bold text-blue-600 dark:text-blue-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                        ₹{totalNetProfit.toLocaleString()}
                      </MT.Typography>
                    </td>
                    <td className="py-3 px-3"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </MT.CardBody>
        </MT.Card>
      </div>

      <AddBookingModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAdd={(booking) => {
          const maxSrNo = bookings.reduce((max, b) => Math.max(max, b.srNo), 0);
          setBookings([...bookings, { ...booking, srNo: maxSrNo + 1 }]);
        }}
      />
    </div>
  );
}
