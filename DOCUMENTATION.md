# Issue Lifecycle Metrics Calculator - Documentation

## Overview

This React application calculates issue lifecycle metrics with 100% accurate date handling using dayjs. It provides a clean, professional interface built with Material UI v5.

## Calculation Logic

### 1. Total Days Calculation

**Formula:** `End Date - Start Date + 1`

**Implementation:** Inclusive calculation that counts both the start and end dates.

```javascript
// Example: Jan 1 to Jan 15
// Result: 15 days (not 14)
```

**Edge Cases Handled:**
- Same start and end date = 1 day
- Invalid dates return 0

---

### 2. Blocked Days Calculation

**Formula:** Sum of all blocked days that fall within the issue date range

**Key Features:**
- **Overlap Handling:** Overlapping blocked ranges are automatically merged to prevent double-counting
- **Range Intersection:** Only counts blocked days that fall within [Start Date, End Date]
- **Normalization:** Ranges are sorted and merged before calculation

**Algorithm:**
1. Filter out invalid ranges (where end < start)
2. Sort ranges by start date
3. Merge overlapping or adjacent ranges
4. For each merged range, calculate intersection with issue range
5. Sum all intersection days

**Example:**
```javascript
Issue: Jan 1 - Jan 15
Blocked Ranges:
  - Jan 5 to Jan 7 (3 days)
  - Jan 6 to Jan 9 (overlaps with above)
  
After normalization: Jan 5 to Jan 9 (5 days)
Result: 5 blocked days
```

**Edge Cases Handled:**
- Overlapping ranges
- Adjacent ranges (merged automatically)
- Blocked ranges outside issue range (ignored)
- Blocked ranges partially overlapping issue range (only intersection counted)

---

### 3. Weekend Days Calculation

**Formula:** Count of Saturdays and Sundays within the issue range, excluding blocked dates

**Key Rule:** Blocked dates override weekends (if a weekend day is blocked, it's not counted as a weekend)

**Implementation:**
1. Iterate through each day in the issue range
2. Check if day is Saturday (6) or Sunday (0)
3. Check if day is NOT in any blocked range
4. Count if both conditions are true

**Example:**
```javascript
Issue: Jan 1 - Jan 15, 2026
Weekends in range:
  - Jan 3 (Sat), Jan 4 (Sun)
  - Jan 10 (Sat), Jan 11 (Sun)
  
If Jan 3-4 are blocked:
  - Weekend count = 2 (only Jan 10-11)
```

**Edge Cases Handled:**
- Weekends that fall on blocked dates
- Issue ranges with no weekends
- Single-day issues that are weekends

---

### 4. Holiday Days Calculation

**Formula:** Count of holidays within the issue range, excluding blocked dates

**Key Rule:** Blocked dates override holidays (if a holiday is blocked, it's not counted as a holiday)

**Configurable Holidays:**
The application includes a default holiday list in `src/utils/dateCalculations.js`:

```javascript
export const DEFAULT_HOLIDAYS = [
  '2026-01-26', // Republic Day
  '2026-03-14', // Holi
  '2026-08-15', // Independence Day
  '2026-10-02', // Gandhi Jayanti
  '2026-10-24', // Diwali
  '2026-12-25', // Christmas
];
```

**Customization:** You can modify this array to match your organization's holiday calendar.

**Implementation:**
1. For each holiday in the list
2. Check if holiday falls within [Start Date, End Date]
3. Check if holiday is NOT in any blocked range
4. Count if both conditions are true

**Edge Cases Handled:**
- Holidays outside issue range (ignored)
- Holidays on blocked dates (not counted)
- Holidays on weekends (counted separately)

---

### 5. Age of Issue

**Formula:** `Total Days - Blocked Days - Holiday Days`

**Business Logic:** Represents the actual working days the issue was active, excluding blocked periods and holidays.

**Example:**
```javascript
Total Days: 15
Blocked Days: 3
Holiday Days: 1

Age of Issue = 15 - 3 - 1 = 11 days
```

**Edge Cases Handled:**
- Result never goes below 0 (using Math.max)
- Fully blocked issues return 0

---

### 6. Time to Resolve

**Formula:** `Total Days - Blocked Days - Holiday Days - Weekend Days`

**Business Logic:** Represents the actual business days (working days) to resolve the issue, excluding blocked periods, holidays, and weekends.

**Example:**
```javascript
Total Days: 15
Blocked Days: 3
Holiday Days: 1
Weekend Days: 4

Time to Resolve = 15 - 3 - 1 - 4 = 7 days
```

**Edge Cases Handled:**
- Result never goes below 0 (using Math.max)
- Fully blocked issues return 0
- Issues with no working days return 0

---

## Component Architecture

### 1. **App.jsx** (Main Component)
- State management for dates and blocked ranges
- MUI ThemeProvider configuration
- LocalizationProvider for date pickers
- Coordinates IssueForm and MetricsDashboard

### 2. **IssueForm.jsx** (Form Section)
- Issue start and closed date pickers
- Dynamic blocked date ranges
- Add/remove blocked ranges
- Form validation with error messages

### 3. **BlockedDateRange.jsx** (Reusable Component)
- Single blocked range with start/end pickers
- Validation (end >= start)
- Remove button
- Visual error feedback

### 4. **MetricsDashboard.jsx** (Dashboard Section)
- Displays all calculated metrics
- Highlighted key metrics with gradient backgrounds
- Calculation breakdowns for transparency
- Responsive grid layout

### 5. **dateCalculations.js** (Utility Functions)
- Pure functions for all calculations
- No side effects
- Comprehensive edge case handling
- Well-documented with JSDoc comments

---

## Validation Rules

### Main Date Range
- Both start and end dates are required
- End date must be on or after start date
- Invalid dates show error messages

### Blocked Date Ranges
- End date must be on or after start date
- Invalid ranges show visual error feedback
- Can be added/removed dynamically

---

## Edge Cases Covered

### 1. Same Start and End Date
- Total Days = 1
- All calculations work correctly

### 2. Fully Blocked Issue
- If all days are blocked, Age = 0, Time to Resolve = 0

### 3. Overlapping Blocked Ranges
- Automatically merged to prevent double-counting
- Example: [Jan 5-7] + [Jan 6-9] = [Jan 5-9]

### 4. Blocked Dates Outside Issue Range
- Ignored in calculations
- Example: Issue [Jan 1-15], Blocked [Jan 20-25] = 0 blocked days

### 5. Blocked Dates Partially Overlapping
- Only intersection is counted
- Example: Issue [Jan 1-15], Blocked [Jan 10-20] = 6 blocked days (Jan 10-15)

### 6. Weekend on Blocked Date
- Not counted as weekend (blocked overrides)
- Example: If Jan 3 (Sat) is blocked, weekend count excludes it

### 7. Holiday on Blocked Date
- Not counted as holiday (blocked overrides)
- Example: If Jan 26 (holiday) is blocked, holiday count excludes it

### 8. No Weekends in Range
- Weekend count = 0
- Example: Mon-Fri only range

### 9. No Holidays in Range
- Holiday count = 0
- Works correctly

### 10. Empty Blocked Ranges
- All calculations work with blockedRanges = []
- No errors thrown

---

## Technology Stack

- **React 18** - Functional components with hooks
- **Material UI v5** - Component library
- **@mui/x-date-pickers** - Date picker components
- **dayjs** - Date manipulation and calculations
- **Vite** - Build tool and dev server

---

## Running the Application

### Development Mode
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Customization

### Changing Holidays
Edit `src/utils/dateCalculations.js`:

```javascript
export const DEFAULT_HOLIDAYS = [
  '2026-01-01', // New Year
  '2026-12-25', // Christmas
  // Add your holidays here
];
```

### Changing Theme Colors
Edit `src/App.jsx`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Change this
    },
  },
});
```

---

## Testing Scenarios

### Test Case 1: Basic Scenario
- Start: Jan 1, 2026
- End: Jan 15, 2026
- Blocked: Jan 5-7
- Expected: Total=15, Blocked=3, Weekends=4, Age=12, TTR=8

### Test Case 2: Same Day
- Start: Jan 1, 2026
- End: Jan 1, 2026
- Blocked: None
- Expected: Total=1, Blocked=0, Age=1, TTR=1

### Test Case 3: Overlapping Blocks
- Start: Jan 1, 2026
- End: Jan 20, 2026
- Blocked: [Jan 5-7, Jan 6-9]
- Expected: Merged to Jan 5-9 (5 days)

### Test Case 4: Fully Blocked
- Start: Jan 1, 2026
- End: Jan 5, 2026
- Blocked: Jan 1-5
- Expected: Total=5, Blocked=5, Age=0, TTR=0

---

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

---

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios for text

---

## Performance Considerations

- Pure utility functions (no unnecessary re-renders)
- Efficient date calculations (O(n) complexity)
- Memoization opportunities for future optimization
- Lazy loading not needed (small bundle size)

---

## Future Enhancements

1. Export metrics to CSV/PDF
2. Multiple issue tracking
3. Custom holiday calendar upload
4. Historical data visualization
5. Team-level metrics aggregation
6. Integration with issue tracking systems (Jira, GitHub)

---

## Support

For issues or questions, refer to:
- Material UI docs: https://mui.com/
- dayjs docs: https://day.js.org/
- React docs: https://react.dev/
