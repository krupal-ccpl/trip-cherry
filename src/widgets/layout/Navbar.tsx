import { useLocation } from 'react-router-dom';
import {
  Navbar as MTNavbar,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useState } from 'react';

interface NavbarProps {
  openSidenav: boolean;
  setOpenSidenav: (open: boolean) => void;
}

export default function Navbar({ openSidenav, setOpenSidenav }: NavbarProps) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('bookings')) return 'Bookings';
    if (path.includes('flights')) return 'Flights';
    return 'Dashboard';
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <MTNavbar
      color="white"
      className="rounded-xl transition-all px-0 py-1 shadow-md"
      fullWidth
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <div className="flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-4">
          <IconButton
            variant="text"
            color="blue-gray"
            className="xl:hidden"
            // @ts-expect-error: IconButton has onClick prop
            onClick={() => setOpenSidenav(!openSidenav)}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>
          <Typography variant="h6" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            {getPageName()}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <IconButton 
            variant="text" 
            color="blue-gray" 
            // @ts-expect-error: IconButton has onClick prop
            onClick={toggleTheme} 
            placeholder={undefined} 
            onPointerEnterCapture={undefined} 
            onPointerLeaveCapture={undefined}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5 text-blue-gray-500" />
            ) : (
              <MoonIcon className="h-5 w-5 text-blue-gray-500" />
            )}
          </IconButton>
          <IconButton variant="text" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </MTNavbar>
  );
}
