import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { Plus, LogOut, List, Settings } from "lucide-react";
import { NotificationBell } from "../NotificationBell";

export const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleReportIssue = () => {
    navigate("/issues/new");
  };

  const handleViewIssues = () => {
    navigate("/issues");
  };

  return (
    <div>
      <nav className="bg-slate-800 shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            Apartment Maintenance Tracker
          </h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleViewIssues}
              className="flex items-center gap-2 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
            >
              <List className="h-4 w-4" />
              View All Issues
            </button>
            <button
              onClick={handleReportIssue}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Report New Issue
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium shadow-sm"
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
            <NotificationBell />
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
