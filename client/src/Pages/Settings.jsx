import { useState, useEffect } from 'react';
import { useAuth } from '../context/context';
import { userAPI } from '../services/api';

function Settings() {
  const { user, updateUser } = useAuth();

  // Get preferences from user context, default to true if not set
  const initialPreference = user?.preferences?.emailNotifications ?? true;

  const [emailNotifications, setEmailNotifications] = useState(initialPreference);
  const [originalEmailNotifications, setOriginalEmailNotifications] = useState(initialPreference);
  const [saving, setSaving] = useState(false);

  // Update state when user context changes (e.g., after login)
  useEffect(() => {
    const preference = user?.preferences?.emailNotifications ?? true;
    setEmailNotifications(preference);
    setOriginalEmailNotifications(preference);
  }, [user?.preferences?.emailNotifications]);

  const hasChanges = emailNotifications !== originalEmailNotifications;

  const handleToggleNotifications = () => {
    setEmailNotifications(!emailNotifications);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await userAPI.updateUser({
        id: user.id,
        preferences: { emailNotifications }
      });

      // Update context with fresh user data from response
      updateUser(response.user);
      setOriginalEmailNotifications(emailNotifications);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                Email notifications for landlord messages
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Receive an email when your landlord sends you a message
              </p>
            </div>

            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={emailNotifications}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end h-10">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className={`bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
              hasChanges ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
