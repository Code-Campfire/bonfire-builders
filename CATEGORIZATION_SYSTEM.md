# Issue Categorization System Implementation

## Overview
Implemented a comprehensive categorization system for maintenance issues using Prisma enums for type safety and consistency across the application.

## Changes Made

### 1. Database Schema (`server/prisma/schema.prisma`)

#### Added Enums:
```prisma
enum Role {
  TENANT
  LANDLORD
  ADMIN
}

enum Category {
  PLUMBING
  ELECTRICAL
  HVAC
  STRUCTURAL
  APPLIANCE
  PEST_CONTROL
  LOCKS_KEYS
  FLOORING
  WALLS_CEILING
  WINDOWS_DOORS
  LANDSCAPING
  PARKING
  OTHER
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Status {
  OPEN
  IN_PROGRESS
  RESOLVED
  CLOSED
}
```

#### Updated Models:
- **User.role**: Changed from `String` to `Role` enum with `@default(TENANT)`
- **Issue.category**: Changed from `String` to `Category` enum
- **Issue.priority**: Changed from `String` to `Priority` enum
- **Issue.status**: Changed from `String` to `Status` enum with `@default(OPEN)`
- **Issue date fields**: Made `acknowledged_date`, `resolved_date`, `closed_date` nullable (`DateTime?`)
- **Message fields**: Added `@default(false)` to `is_read`, made `read_at` nullable, added `@default(now())` to `sent_at`

#### Added Database Indexes:
```prisma
@@index([user_id])
@@index([complex_id])
@@index([status])
@@index([category])
@@index([priority])
```

### 2. Backend Updates (`server/src/routes/issues.ts`)

- Removed hardcoded temporary dates in issue creation
- Removed hardcoded status (now uses schema default `OPEN`)
- Status and dates now properly managed by Prisma defaults and nullable fields

### 3. Frontend Components

#### IssueForm (`client/src/Components/issueForm.jsx`)
Updated dropdown options to use enum values:
- **Categories**: PLUMBING, ELECTRICAL, HVAC, STRUCTURAL, APPLIANCE, PEST_CONTROL, LOCKS_KEYS, FLOORING, WALLS_CEILING, WINDOWS_DOORS, LANDSCAPING, PARKING, OTHER
- **Priorities**: LOW, MEDIUM, HIGH, URGENT

#### Badge Components
- **PriorityBadge.jsx**: Updated keys to uppercase (LOW, MEDIUM, HIGH, URGENT)
- **StatusBadge.jsx**: Updated keys to uppercase (OPEN, IN_PROGRESS, RESOLVED, CLOSED)

#### IssueCard (`client/src/Components/IssueCard.jsx`)
- Updated status check to use `CLOSED` instead of `'closed'`
- Integrated `formatCategory()` utility for display formatting

#### Mock Data (`client/src/data/mockIssues.js`)
- Updated all mock issues to use uppercase enum values

### 4. New Utilities (`client/src/utils/categoryUtils.js`)

Created helper functions:
- **`formatCategory(category)`**: Converts enum values to display-friendly text
  - Example: `"PEST_CONTROL"` → `"Pest Control"`
- **`getCategories()`**: Returns array of all categories with value/label pairs
- **`getCategoryTheme(category)`**: Returns icon and color suggestions for each category (extensible)

## Category Descriptions

| Category | Description | Example Issues |
|----------|-------------|----------------|
| **PLUMBING** | Water-related issues | Leaky faucets, clogged drains, toilet problems |
| **ELECTRICAL** | Electrical system issues | Outlet not working, lights flickering, breaker trips |
| **HVAC** | Heating/cooling systems | AC not cooling, heater broken, thermostat issues |
| **STRUCTURAL** | Building structure issues | Cracks in walls, foundation problems, roof leaks |
| **APPLIANCE** | Kitchen/laundry appliances | Refrigerator broken, oven malfunction, washer issues |
| **PEST_CONTROL** | Pest infestations | Roaches, mice, bed bugs, ants |
| **LOCKS_KEYS** | Security/access issues | Lock stuck, lost keys, door won't lock |
| **FLOORING** | Floor-related problems | Damaged carpet, broken tiles, squeaky floors |
| **WALLS_CEILING** | Interior surfaces | Peeling paint, water stains, holes in walls |
| **WINDOWS_DOORS** | Windows and doors | Broken window, door won't close, drafty windows |
| **LANDSCAPING** | Outdoor maintenance | Overgrown grass, tree trimming, sprinkler issues |
| **PARKING** | Parking area issues | Pothole, gate broken, assigned spot occupied |
| **OTHER** | Miscellaneous issues | Issues not fitting other categories |

## Migration Required

After pulling these changes, you must:

1. **Generate Prisma Client**:
   ```bash
   docker-compose exec server npx prisma generate
   ```

2. **Create and Run Migration**:
   ```bash
   docker-compose exec server npx prisma migrate dev --name add_categorization_enums
   ```

3. **Restart Server**:
   ```bash
   docker-compose restart server
   ```

## Breaking Changes

⚠️ **Existing data will need migration**:
- String values in `category`, `priority`, `status`, `role` fields must be converted to uppercase enum values
- Any lowercase values (e.g., `"open"`, `"plumbing"`) will cause validation errors
- The migration will handle schema changes, but existing data may need manual updates

## Benefits

1. **Type Safety**: Prisma enforces valid values at the database level
2. **Autocomplete**: TypeScript/IDE autocomplete for enum values
3. **Consistency**: No typos or inconsistent casing across the application
4. **Performance**: Database indexes on category, status, and priority fields
5. **Maintainability**: Single source of truth in Prisma schema
6. **Validation**: Invalid categories rejected at database level, not just in application code

## Future Enhancements

Possible additions to the categorization system:
- Category icons displayed in UI (using `getCategoryTheme()`)
- Category-specific workflows (e.g., URGENT PLUMBING auto-escalates)
- Category-based filtering and search
- Category statistics in dashboard
- Custom categories per property complex
- Sub-categories for more granular classification
