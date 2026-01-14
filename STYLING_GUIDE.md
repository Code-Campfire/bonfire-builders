# Styling Guide

This guide explains how to use the centralized styling system in the Apartment Maintenance Tracker application.

## 📁 File Structure

All centralized styles are located in `client/src/styles/`:

```
client/src/styles/
├── index.js          # Barrel export - import everything from here
├── colors.js         # Color system and theme variables
├── buttons.js        # Button variants and toggle switches
├── cards.js          # Card styling variants
├── forms.js          # Form input styles
├── typography.js     # Text and heading styles
├── layout.js         # Layout utilities (flexbox, spacing, timeline)
└── helpers.js        # Utility functions for style composition
```

## 🎨 Import Pattern

Always import from the centralized styles:

```javascript
// ✅ Correct - Import from centralized styles
import { getButtonClasses, colors, typography } from '../styles';
// or
import { getButtonClasses } from '../styles/helpers';
import { colors } from '../styles/colors';

// ❌ Wrong - Hardcoded Tailwind classes
<button className="bg-blue-600 text-white px-4 py-2">
```

## 🔵 Colors

### Basic Colors

```javascript
import { colors } from '../styles/colors';

// Background colors
<div className={colors.bgCard}>Card background</div>
<div className={colors.bgMuted}>Muted background</div>
<div className={colors.bgPrimary}>Primary background</div>

// Text colors
<p className={colors.textMuted}>Muted text</p>
<p className={colors.textForeground}>Primary text</p>
```

### Icon Colors

```javascript
import { iconColors } from '../styles/colors';

<CheckCircle className={'h-4 w-4 ' + iconColors.success} />
<AlertTriangle className={'h-4 w-4 ' + iconColors.warning} />
<XCircle className={'h-4 w-4 ' + iconColors.error} />
<Info className={'h-4 w-4 ' + iconColors.muted} />
```

### Alert Sections

```javascript
import { alerts } from '../styles/colors';

<div className={alerts.error}>
  Error message
</div>

<div className={alerts.success}>
  Success message
</div>

<div className={alerts.warning}>
  Warning message
</div>
```

### Navbar Styles

```javascript
import { navbar } from '../styles/colors';

<nav className={navbar.container}>
  <button className={navbar.bellButton}>
    <Bell />
  </button>
</nav>
```

### Section Backgrounds

```javascript
import { sectionBg } from '../styles/colors';

<div className={sectionBg.success + ' p-6 rounded-lg'}>
  Success section
</div>

<div className={sectionBg.carouselFooter + ' p-4'}>
  Dark footer
</div>
```

## 🔘 Buttons

### Using Button Helper

The recommended way to create buttons:

```javascript
import { getButtonClasses } from '../styles/helpers';

// Basic button
<button className={getButtonClasses('primary')}>
  Click Me
</button>

// Button with size
<button className={getButtonClasses('secondary', 'lg')}>
  Large Button
</button>

// Button with custom classes
<button className={getButtonClasses('destructive', 'md', 'flex items-center gap-2')}>
  <Trash className="h-4 w-4" />
  Delete
</button>
```

### Available Button Variants

- `primary` - Primary action button (blue)
- `secondary` - Secondary action (gray)
- `destructive` - Dangerous action (red)
- `outline` - Outlined button
- `ghost` - Transparent with hover
- `link` - Text link style
- `settings` - Blue with green hover (custom)

### Available Button Sizes

- `sm` - Small button
- `md` - Medium (default)
- `lg` - Large button

### Toggle Switch

```javascript
import { toggleSwitch } from '../styles/buttons';

<button
  onClick={handleToggle}
  className={isActive ? toggleSwitch.active : toggleSwitch.inactive}
  role="switch"
  aria-checked={isActive}
>
  <span className={isActive ? toggleSwitch.thumbActive : toggleSwitch.thumbInactive} />
</button>
```

## 📝 Forms

### Input Fields

```javascript
import { getInputClasses } from '../styles/helpers';
import { labelBase, errorText } from '../styles/forms';

<div>
  <label htmlFor="email" className={labelBase}>
    Email
  </label>
  <input
    type="email"
    id="email"
    className={getInputClasses(hasError)}
  />
  {hasError && (
    <p className={errorText}>Email is required</p>
  )}
</div>
```

### Select Fields

```javascript
import { getSelectClasses } from '../styles/helpers';
import { labelBase } from '../styles/forms';

<div>
  <label htmlFor="category" className={labelBase}>
    Category
  </label>
  <select
    id="category"
    className={getSelectClasses(hasError)}
  >
    <option value="">Select...</option>
    <option value="plumbing">Plumbing</option>
  </select>
</div>
```

### Textarea Fields

```javascript
import { getTextareaClasses } from '../styles/helpers';

<textarea
  className={getTextareaClasses(hasError)}
  rows={4}
  placeholder="Describe the issue..."
/>
```

## 📄 Typography

```javascript
import { typography } from '../styles/typography';

// Headings
<h1 className={typography.h1}>Page Title</h1>
<h2 className={typography.h2}>Section Heading</h2>
<h3 className={typography.h3}>Subsection</h3>
<h4 className={typography.h4}>Card Title</h4>
<h5 className={typography.h5}>Small Heading</h5>

// Body text
<p className={typography.body}>Regular text</p>
<p className={typography.bodyMuted}>Muted text</p>

// Small text
<span className={typography.small}>Small text</span>
<span className={typography.smallMuted}>Small muted text</span>
<span className={typography.xsmall}>Extra small text</span>

// Labels
<label className={typography.label}>Form Label</label>
<span className={typography.caption}>Caption text</span>
```

## 📐 Layout Utilities

### Flexbox Layouts

```javascript
import { flexRow, flexCol } from '../styles/layout';

// Horizontal layouts
<div className={flexRow.centerCenter}>
  Centered content
</div>

<div className={flexRow.spaceBetween}>
  <span>Left</span>
  <span>Right</span>
</div>

<div className={flexRow.startCenter}>
  Left-aligned, vertically centered
</div>

// Vertical layouts
<div className={flexCol.centerCenter}>
  Centered vertically and horizontally
</div>

<div className={flexCol.startCenter}>
  Top-aligned, horizontally centered
</div>
```

### Spacing

```javascript
import { spacing } from '../styles/layout';

<div className={spacing.p6}>
  Padded container
</div>

<div className={spacing.stack}>
  Vertically stacked items
</div>

<div className={spacing.gap1}>Gap 1</div>
<div className={spacing.gap2}>Gap 2</div>
<div className={spacing.gap3}>Gap 3</div>
<div className={spacing.gap4}>Gap 4</div>
```

### Timeline

```javascript
import { timeline } from '../styles/layout';

<div className={timeline.item}>
  <div className={timeline.dotContainer}>
    <div className={timeline.dot.blue} />
    <div className={timeline.line} />
  </div>
  <div>Timeline content</div>
</div>
```

## 🃏 Cards

```javascript
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

## 🎯 Best Practices

### ✅ DO

1. **Always use centralized styles:**
   ```javascript
   import { getButtonClasses, colors, typography } from '../styles';
   ```

2. **Compose styles with helper functions:**
   ```javascript
   <button className={getButtonClasses('primary', 'md', 'w-full')}>
   ```

3. **Use CSS variables for theming:**
   ```javascript
   className={colors.bgPrimary} // Uses CSS variable --primary
   ```

4. **Combine utilities logically:**
   ```javascript
   <div className={colors.bgCard + ' rounded-lg shadow-md p-6'}>
   ```

### ❌ DON'T

1. **Don't use hardcoded colors:**
   ```javascript
   // ❌ Wrong
   <button className="bg-blue-600 text-white">
   
   // ✅ Correct
   <button className={getButtonClasses('primary')}>
   ```

2. **Don't mix inline styles with Tailwind:**
   ```javascript
   // ❌ Wrong
   <div style={{ color: 'red' }} className="bg-gray-100">
   
   // ✅ Correct
   <div className={alerts.error}>
   ```

3. **Don't duplicate style strings:**
   ```javascript
   // ❌ Wrong
   <button className="px-4 py-2 rounded-md bg-primary">Button 1</button>
   <button className="px-4 py-2 rounded-md bg-primary">Button 2</button>
   
   // ✅ Correct
   <button className={getButtonClasses('primary')}>Button 1</button>
   <button className={getButtonClasses('primary')}>Button 2</button>
   ```

## 🔄 Migration Checklist

When migrating a component to centralized styles:

1. ✅ Import necessary style modules at the top
2. ✅ Replace all button classes with `getButtonClasses()`
3. ✅ Replace all input classes with `getInputClasses()`
4. ✅ Replace all select classes with `getSelectClasses()`
5. ✅ Replace all textarea classes with `getTextareaClasses()`
6. ✅ Replace hardcoded colors with `colors.*` or `iconColors.*`
7. ✅ Replace heading classes with `typography.*`
8. ✅ Test the component visually
9. ✅ Verify no compilation errors

## 🌈 Color System

Our color system uses CSS variables defined in `index.css`:

```css
:root {
  --primary: /* Primary brand color */
  --secondary: /* Secondary color */
  --destructive: /* Error/danger color */
  --muted: /* Muted background */
  --accent: /* Accent color */
  --foreground: /* Main text color */
  --muted-foreground: /* Muted text */
  /* ... and more */
}
```

This makes it easy to support dark mode or theme switching in the future by just updating CSS variables!

## 📚 Examples

### Complete Form Example

```javascript
import { 
  getInputClasses, 
  getSelectClasses, 
  getTextareaClasses,
  getButtonClasses 
} from '../styles/helpers';
import { labelBase, errorText } from '../styles/forms';
import { spacing } from '../styles/layout';

function MyForm() {
  const [errors, setErrors] = useState({});

  return (
    <form className={spacing.stack}>
      <div>
        <label htmlFor="name" className={labelBase}>Name</label>
        <input
          id="name"
          className={getInputClasses(errors.name)}
        />
        {errors.name && <p className={errorText}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="category" className={labelBase}>Category</label>
        <select
          id="category"
          className={getSelectClasses(errors.category)}
        >
          <option>Select...</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelBase}>Description</label>
        <textarea
          id="description"
          className={getTextareaClasses(errors.description)}
          rows={4}
        />
      </div>

      <button className={getButtonClasses('primary', 'md', 'w-full')}>
        Submit
      </button>
    </form>
  );
}
```

### Complete Card Example

```javascript
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { colors, iconColors } from '../styles/colors';
import { typography } from '../styles/typography';
import { getButtonClasses } from '../styles/helpers';
import { CheckCircle } from 'lucide-react';

function IssueCard({ issue }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={typography.h4}>
          {issue.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={typography.body}>
          {issue.description}
        </p>
        <div className="mt-4 flex items-center gap-2">
          <CheckCircle className={'h-4 w-4 ' + iconColors.success} />
          <span className={typography.small}>Completed</span>
        </div>
        <button className={getButtonClasses('primary', 'sm', 'mt-4')}>
          View Details
        </button>
      </CardContent>
    </Card>
  );
}
```

## 🚀 Quick Reference

| Use Case | Import | Example |
|----------|--------|---------|
| Button | `getButtonClasses` | `getButtonClasses('primary')` |
| Input | `getInputClasses` | `getInputClasses(hasError)` |
| Select | `getSelectClasses` | `getSelectClasses(hasError)` |
| Textarea | `getTextareaClasses` | `getTextareaClasses(hasError)` |
| Heading | `typography` | `typography.h1` |
| Text | `typography` | `typography.body` |
| Color | `colors` | `colors.bgCard` |
| Icon Color | `iconColors` | `iconColors.success` |
| Alert | `alerts` | `alerts.error` |
| Layout | `flexRow`, `flexCol` | `flexRow.spaceBetween` |
| Spacing | `spacing` | `spacing.p6` |

---

**Need help?** Check the actual style files in `client/src/styles/` for complete lists of available options!
