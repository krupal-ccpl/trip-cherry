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
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  openSidenav: boolean;
  setOpenSidenav: (open: boolean) => void;
}

export default function Navbar({ openSidenav, setOpenSidenav }: NavbarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const getPageName = () => {
    const path = location.pathname;
    if (path.includes('bookings')) return 'Bookings';
    if (path.includes('packages')) return 'Packages';
    return 'Dashboard';
  };

  return (
    <MTNavbar
      color="white"
      className="rounded-xl transition-all px-0 py-1 shadow-md bg-white dark:bg-gray-800"
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
          <Typography variant="h6" color="blue-gray" className="dark:text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
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
            {theme === 'dark' ? (
              <SunIcon className="h-5 w-5 text-blue-gray-500 dark:text-gray-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-blue-gray-500 dark:text-gray-400" />
            )}
          </IconButton>
          <IconButton variant="text" color="blue-gray" className="dark:text-gray-400" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <UserCircleIcon className="h-5 w-5 text-blue-gray-500 dark:text-gray-400" />
          </IconButton>
        </div>
      </div>
    </MTNavbar>
  );
}
