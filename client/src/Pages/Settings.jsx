import { useState, useEffect } from "react";
import { useAuth } from "../context/context";
import { userAPI } from "../services/api";
import { getButtonClasses } from "../styles/helpers";
import { colors } from "../styles/colors";
import { toggleSwitch } from "../styles/buttons";
import { typography } from "../styles/typography";
import { spacing, flexRow } from "../styles/layout";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

function Settings() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);

  // Get preferences from user context, default to true if not set
  const initialPreference = user?.preferences?.emailNotifications ?? true;

  const [emailNotifications, setEmailNotifications] =
    useState(initialPreference);
  const [originalEmailNotifications, setOriginalEmailNotifications] =
    useState(initialPreference);
  const [saving, setSaving] = useState(false);

  // Update state when user context changes (e.g., after login)
  useEffect(() => {
    if (user) {
      const preference = user.preferences?.emailNotifications ?? true;
      setEmailNotifications(preference);
      setOriginalEmailNotifications(preference);
      setLoading(false);
    }
  }, [user]);

  const hasChanges = emailNotifications !== originalEmailNotifications;

  const handleToggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await userAPI.updateUser({
        id: user.id,
        preferences: { emailNotifications },
      });

      // Update context with fresh user data from response
      updateUser(response.user);
      setOriginalEmailNotifications(emailNotifications);
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={spacing.p6}>
      <div className={flexRow.spaceBetween + " mb-6 max-w-3xl mx-auto"}>
        <h1 className={typography.h1}>Settings</h1>
      </div>

      <div
        className={
          colors.bgCard +
          " rounded-lg shadow-sm border border-border " +
          spacing.p6 +
          " max-w-3xl mx-auto"
        }
      >
        <h2 className={typography.h2 + " mb-6"}>Notifications</h2>

        <div className="space-y-4">
          <div
            className={flexRow.spaceBetween + " py-3 border-b border-border"}
          >
            <div className="flex-1">
              <h3 className={typography.body + " font-medium"}>
                Email notifications for landlord messages
              </h3>
              <p className={colors.textMutedForeground + " text-sm mt-1"}>
                Receive an email when your landlord sends you a message
              </p>
            </div>
            {loading ? (
              <div className="w-11 h-6 flex items-center justify-center">
                <Loader2Icon className="animate-spin h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <button
                onClick={handleToggleNotifications}
                className={
                  emailNotifications
                    ? toggleSwitch.active
                    : toggleSwitch.inactive
                }
                role="switch"
                aria-checked={emailNotifications}
              >
                <span
                  className={
                    emailNotifications
                      ? toggleSwitch.thumbActive
                      : toggleSwitch.thumbInactive
                  }
                />
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end h-10">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className={
              getButtonClasses("primary") +
              ` transition-all duration-300 ease-in-out ${
                hasChanges
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`
            }
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
