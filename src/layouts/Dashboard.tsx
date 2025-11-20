import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../widgets/layout/Sidebar';
import Navbar from '../widgets/layout/Navbar';
import PackageList from '../pages/dashboard/PackageList';
import PackageDetails from '../pages/dashboard/PackageDetails';
import Flights from '../pages/dashboard/Flights';

export default function Dashboard() {
  const [openSidenav, setOpenSidenav] = useState(false);
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-gray-900">
      <Sidebar open={openSidenav} setOpen={setOpenSidenav} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`p-4 ${collapsed ? 'xl:ml-20' : 'xl:ml-80'}`}>
        <Navbar openSidenav={openSidenav} setOpenSidenav={setOpenSidenav} />
        <div className="mt-12">
          <Routes>
            <Route path="/packages" element={<PackageList />} />
            <Route path="/packages/:id" element={<PackageDetails />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="*" element={<Navigate to="/dashboard/packages" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
