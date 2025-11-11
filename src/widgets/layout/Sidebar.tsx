import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
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
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ open, setOpen, collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Close sidebar on mobile before navigating to sign-in
    if (open) {
      setOpen(false);
    }
    navigate('/auth/sign-in');
  };

  const handleMenuClick = () => {
    // Close sidebar on mobile when menu item is clicked
    if (open) {
      setOpen(false);
    }
  };

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
        className={`bg-white shadow-sm fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] ${collapsed ? 'w-16' : 'w-72'} rounded-xl transition-all duration-300 xl:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-80"
        }`}
      >
        <div className="relative border-b border-blue-gray-50">
          <Link to="/dashboard/bookings" className={`flex items-center gap-4 py-6 ${collapsed ? 'px-2' : 'px-8'}`} onClick={handleMenuClick}>
            <Typography variant="h6" color="blue-gray" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {!collapsed && "Trip Cherry"}
            </Typography>
          </Link>
          <button
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md xl:hidden hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
          </button>
          <button
            className={`absolute top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors hidden xl:block ${collapsed ? 'left-1/2 -translate-x-1/2' : 'right-4'}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRightIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
            ) : (
              <ChevronLeftIcon strokeWidth={2.5} className="h-5 w-5 text-blue-gray-500" />
            )}
          </button>
        </div>
        <div className={collapsed ? "p-2" : "m-4"}>
          {collapsed ? (
            <div className="flex flex-col gap-1">
              {routes.map(({ icon: Icon, name, path }) => {
                const isActive = isRouteActive(path);
                return (
                  <Link to={path} key={name} onClick={handleMenuClick}>
                    <div
                      className={`
                        transition-all duration-200 flex justify-center items-center h-12 rounded-lg cursor-pointer
                        ${isActive
                          ? "bg-blue-600 text-white rounded-full w-12 shadow-md hover:shadow-lg" 
                          : "hover:bg-blue-50"
                        }
                      `}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-blue-gray-600"}`} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <List className="" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              {routes.map(({ icon: Icon, name, path }) => {
                const isActive = isRouteActive(path);
                return (
                  <Link to={path} key={name} onClick={handleMenuClick}>
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
          )}
        </div>
        <div className={`absolute bottom-4 ${collapsed ? 'left-1/2 -translate-x-1/2' : 'left-4'} w-auto`}>
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-50 text-red-600
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            {!collapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
