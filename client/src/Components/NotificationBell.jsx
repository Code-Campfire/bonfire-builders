import { useState, useEffect, useRef } from "react";
import { Bell, Loader2 } from "lucide-react";
import { notificationAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { formatTimeAgo } from "../utils/timeUtils";
import { getButtonClasses } from "../styles/helpers";
import { colors, navbar, notificationStyles } from "../styles/colors";
import { typography } from "../styles/typography";
import { flexRow, flexCol } from "../styles/layout";
import { useSocket } from "../context/SocketContext";

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const socket = useSocket();

  // Fetch unread count on mount and periodically
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (socket) {
      socket.on('new-notification', (notification) => {
        console.log('Received new notification:', notification);
        setUnreadCount((prev) => prev + 1);
        // If dropdown is open, add the new notification to the list
        if (isOpen) {
          setNotifications((prev) => [notification, ...prev]);
        }
      });

      return () => {
        socket.off('new-notification');
      };
    }
  }, [socket, isOpen]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationAPI.getUnreadNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await notificationAPI.markAsRead(notification.id);

      // Update local state
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notification.id)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Navigate to the issue with scroll position
      if (notification.issue_id) {
        setIsOpen(false);

        // For message notifications, navigate with hash to scroll to messages
        if (notification.type === 'MESSAGE_RECEIVED') {
          navigate(`/issues/${notification.issue_id}#messages`);
        } else {
          navigate(`/issues/${notification.issue_id}`);
        }
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className={notificationStyles.container} ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={navbar.bellButton}
      >
        <Bell className="h-6 w-6" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className={colors.bgDestructive + ' absolute -top-1 -right-1 text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 ' + flexRow.centerCenter}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={colors.bgCard + ' ' + notificationStyles.dropdown}>
          {/* Header */}
          <div className={flexRow.spaceBetween + ' px-4 py-3 border-b border-border'}>
            <h3 className={typography.h3}>{"Notifications"}</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className={getButtonClasses('link', 'sm')}
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className={notificationStyles.listContainer}>
            {loading ? (
              <div className={flexCol.centerCenter + ' px-4 py-8'}>
                <Loader2 className={colors.textMutedForeground + ' h-6 w-6 animate-spin'} />
              </div>
            ) : notifications.length === 0 ? (
              <div className={colors.textMutedForeground + ' px-4 py-8 text-center'}>
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={notificationStyles.item}
                >
                  <div className={flexRow.spaceBetween + ' gap-2'}>
                    <div className={notificationStyles.itemContent}>
                      <p className={typography.body + ' font-medium'}>
                        {notification.title}
                      </p>
                      <p className={colors.textMutedForeground + ' text-sm mt-1'}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className={colors.bgPrimary + ' w-2 h-2 rounded-full mt-1 flex-shrink-0'}></div>
                    )}
                  </div>
                  <p className={colors.textMutedForeground + ' text-xs mt-2'}>
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
