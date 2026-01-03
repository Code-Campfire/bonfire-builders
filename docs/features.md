# Features Documentation

This document describes how features in the Apartment Maintenance Tracker work, written in plain English for the team.

---

## Email Notification Preferences

**Added:** January 1, 2026
**Developer:** Justin

### What It Does

Users can control whether they receive email notifications when their landlord sends them a message about a maintenance issue.

### How It Works

1. **Settings Page**
   - Users click the "Settings" button in the navigation bar
   - They see a toggle switch for "Email notifications for landlord messages"
   - The toggle is ON by default for all users

2. **Saving Preferences**
   - When a user toggles the setting, a "Save Changes" button appears
   - Clicking save updates their preference in the database
   - The setting is remembered across browser sessions and devices

3. **Email Behavior**
   - When a landlord sends a message on an issue:
     - If the tenant has notifications ON → they receive an email
     - If the tenant has notifications OFF → no email is sent
   - The landlord always sends messages the same way (no change for them)

### Technical Details

**Database:**
- User preferences are stored in a `preferences` JSON field on the User table
- Structure: `{ "emailNotifications": true/false }`
- Default value: `{ "emailNotifications": true }`

**Backend:**
- Before sending an email (in `messages.ts`), we check the user's `preferences.emailNotifications` value
- If undefined or not set, defaults to `true` (send email)

**Frontend:**
- Settings page at `/settings` route
- Uses existing `PUT /api/users/:id` endpoint to save preferences
- User's preference loads from AuthContext (decoded from JWT)

### Future Extensions

This JSON preferences field can easily store additional settings:
- SMS notifications
- Email digest frequency (instant, daily, weekly)
- UI theme (light/dark mode)
- Language preference

Just add new fields to the preferences object without database migrations.

---

## [Next Feature]

**Added:** [Date]
**Developer:** [Name]

### What It Does

[Plain English description]

### How It Works

[Step-by-step user flow]

### Technical Details

[Key implementation notes]

---

*Team: Add your features above this line using the same format*
