import { getSelectClasses, getInputClasses } from "../styles/helpers";

export const IssueFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-4">
      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className={getSelectClasses()}
      >
        <option value="all">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>

      {/* Priority filter */}
      <select
        value={filters.priority}
        onChange={(e) => onFilterChange("priority", e.target.value)}
        className={getSelectClasses()}
      >
        <option value="all">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => onFilterChange("category", e.target.value)}
        className={getSelectClasses()}
      >
        <option value="all">All Categories</option>
        <option value="PLUMBING">Plumbing</option>
        <option value="HVAC">HVAC</option>
        <option value="ELECTRICAL">Electrical</option>
        <option value="APPLIANCE">Appliance</option>
        <option value="STRUCTURAL">Structural</option>
        <option value="PEST_CONTROL">Pest Control</option>
        <option value="LOCKS_KEYS">Locks & Keys</option>
        <option value="FLOORING">Flooring</option>
        <option value="WALLS_CEILING">Walls & Ceiling</option>
        <option value="WINDOWS_DOORS">Windows & Doors</option>
        <option value="LANDSCAPING">Landscaping</option>
        <option value="PARKING">Parking</option>
        <option value="OTHER">Other</option>
      </select>

      {/* Date filter */}
      <div className="flex items-center">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className={getInputClasses() + ' mr-2'}
        />
        <span className="mx-2">to</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className={getInputClasses()}
        />
      </div>
    </div>
  );
};
