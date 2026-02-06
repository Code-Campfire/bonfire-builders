import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/context";
import { Plus, LogOut, List, Settings, BarChart3 } from "lucide-react";
import { NotificationBell } from "../NotificationBell";
import { getButtonClasses } from "../../styles/helpers";
import { navbar } from "../../styles/colors";

export const Layout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleReportIssue = () => {
    navigate("/issues/new");
  };

  const handleViewIssues = () => {
    navigate("/issues");
  };

  return (
    <div>
      <nav className={navbar.container}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            Apartment Maintenance Tracker
          </h1>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleViewIssues}
              className={getButtonClasses('secondary', 'md', 'flex items-center gap-2')}
            >
              <List className="h-4 w-4" />
              View All Issues
            </button>
            <button
              onClick={handleReportIssue}
              className={getButtonClasses('primary', 'md', 'flex items-center gap-2')}
            >
              <Plus className="h-4 w-4" />
              Report New Issue
            </button>
            <button
              onClick={() => navigate("/metrics")}
              className={getButtonClasses('metrics', 'md', 'flex items-center gap-2')}
            >
              <BarChart3 className="h-4 w-4" />
              Metrics
            </button>
            <button
              onClick={logout}
              className={getButtonClasses('destructive', 'md', 'flex items-center gap-2')}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button
              onClick={() => navigate("/settings")}
              className={getButtonClasses('settings', 'md', 'flex items-center gap-2')}
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
