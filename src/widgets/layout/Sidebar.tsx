import { Link, useLocation } from 'react-router-dom';
import {
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  CalendarDaysIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const routes = [
  {
    icon: CalendarDaysIcon,
    name: "Bookings",
    path: "/dashboard/bookings",
  },
  {
    icon: PaperAirplaneIcon,
    name: "Flights",
    path: "/dashboard/flights",
  },
];

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const location = useLocation();

  // Helper function to check if a route is active
  const isRouteActive = (path: string) => {
    // For bookings, match both /bookings and /bookings/:id
    if (path === "/dashboard/bookings") {
      return location.pathname === path || location.pathname.startsWith("/dashboard/bookings/");
    }
    return location.pathname === path;
  };

  return (
    <>
      <aside
        className={`bg-white shadow-sm fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-80"
        }`}
      >
        <div className="relative border-b border-blue-gray-50">
          <Link to="/dashboard/bookings" className="flex items-center gap-4 py-6 px-8">
            <Typography variant="h5" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              Trip Cherry
            </Typography>
          </Link>
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md xl:hidden hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
          </button>
        </div>
        <div className="m-4">
          <List placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            {routes.map(({ icon: Icon, name, path }) => {
              const isActive = isRouteActive(path);
              return (
                <Link to={path} key={name}>
                  <ListItem
                    className={`
                      transition-all duration-200 mb-2 rounded-lg
                      ${isActive
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg hover:from-blue-700 hover:to-blue-800" 
                        : "hover:bg-blue-50"
                      }
                    `}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <ListItemPrefix placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                      <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-blue-gray-600"}`} />
                    </ListItemPrefix>
                    <span className={`font-medium ${isActive ? "text-white" : "text-blue-gray-700"}`}>{name}</span>
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </div>
      </aside>
    </>
  );
}
