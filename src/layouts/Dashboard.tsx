import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../widgets/layout/Sidebar';
import Navbar from '../widgets/layout/Navbar';
import BookingList from '../pages/dashboard/BookingList';
import BookingDetails from '../pages/dashboard/BookingDetails';
import Flights from '../pages/dashboard/Flights';

export default function Dashboard() {
  const [openSidenav, setOpenSidenav] = useState(false);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidebar open={openSidenav} setOpen={setOpenSidenav} />
      <div className="p-4 xl:ml-80">
        <Navbar openSidenav={openSidenav} setOpenSidenav={setOpenSidenav} />
        <div className="mt-12">
          <Routes>
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="*" element={<Navigate to="/dashboard/bookings" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
