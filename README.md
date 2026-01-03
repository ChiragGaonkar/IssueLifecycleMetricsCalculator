# 📈 Issue Lifecycle Metrics Calculator

A production-ready React application for calculating issue lifecycle metrics with 100% accurate date handling. Built with Material UI v5 and dayjs.

![React](https://img.shields.io/badge/React-18-blue)
![Material UI](https://img.shields.io/badge/Material%20UI-v5-blue)
![dayjs](https://img.shields.io/badge/dayjs-latest-green)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Accurate Date Calculations** - Inclusive date counting with proper edge case handling
- **Blocked Date Ranges** - Support for multiple blocked periods with automatic overlap merging
- **Weekend Handling** - Automatically excludes Saturdays and Sundays
- **Holiday Support** - Configurable holiday calendar
- **Real-time Metrics** - Instant calculation updates as you input data
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Professional UI** - Modern Material UI design with gradient highlights
- **Form Validation** - Comprehensive validation with helpful error messages

## 📊 Calculated Metrics

### Highlighted Metrics

1. **Age of Issue** ⭐
   - Formula: `Total Days - Blocked Days - Holiday Count`
   - Represents actual working days the issue was active

2. **Time to Resolve** ⭐
   - Formula: `Total Days - Blocked Days - Holidays - Weekends`
   - Represents actual business days to resolve

3. **Total Blocked Days** ⭐
   - Total days when work was blocked
   - Handles overlapping ranges automatically

### Additional Metrics

- Issue Start Date
- Issue Closed Date
- Weekend Days (Saturdays & Sundays)
- Holiday Days
- Blocked Date Ranges (displayed as chips)

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
# Navigate to project directory
cd TaskTracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

## 🎯 Usage

1. **Enter Issue Dates**
   - Select the Issue Start Date
   - Select the Issue Closed Date

2. **Add Blocked Ranges** (Optional)
   - Click "Add Blocked Range"
   - Set start and end dates for each blocked period
   - Remove ranges using the delete button

3. **View Metrics**
   - Metrics update automatically as you input data
   - See detailed calculation breakdowns for transparency

## 🔧 Configuration

### Customizing Holidays

Edit `src/utils/dateCalculations.js`:

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

### Customizing Theme

Edit `src/App.jsx` to change colors and styling:

```javascript
const theme = createTheme({
  palette: {
    primary: { main: '#667eea' },
    secondary: { main: '#764ba2' },
  },
});
```

## 📐 Calculation Logic

### Business Rules

1. **Inclusive Dates** - Both start and end dates are included in calculations
2. **Overlap Handling** - Overlapping blocked ranges are automatically merged
3. **Priority System** - Blocked dates override weekends and holidays
4. **Weekend Definition** - Saturday and Sunday
5. **Validation** - End date must be on or after start date

### Edge Cases Handled

✅ Same start and end date  
✅ Overlapping blocked ranges  
✅ Blocked dates outside issue range  
✅ Fully blocked issues  
✅ Weekends on blocked dates  
✅ Holidays on blocked dates  
✅ No weekends/holidays in range  

## 🏗️ Project Structure

```
TaskTracker/
├── src/
│   ├── components/
│   │   ├── IssueForm.jsx          # Form with date pickers
│   │   ├── MetricsDashboard.jsx   # Metrics display
│   │   └── BlockedDateRange.jsx   # Blocked range component
│   ├── utils/
│   │   └── dateCalculations.js    # Pure calculation functions
│   ├── App.jsx                     # Main application
│   ├── App.css                     # Styling
│   └── main.jsx                    # Entry point
├── DOCUMENTATION.md                # Detailed documentation
├── package.json
└── README.md
```

## 🧪 Testing

### Manual Test Scenarios

**Test Case 1: Basic Scenario**
- Start: Jan 1, 2026
- End: Jan 15, 2026
- Blocked: Jan 5-7 (3 days)
- Expected Results:
  - Total Days: 15
  - Blocked Days: 3
  - Weekend Days: 4 (Jan 3-4, 10-11)
  - Age of Issue: 12
  - Time to Resolve: 8

**Test Case 2: Overlapping Blocks**
- Start: Jan 1, 2026
- End: Jan 20, 2026
- Blocked: [Jan 5-7, Jan 6-9]
- Expected: Merged to Jan 5-9 (5 blocked days)

**Test Case 3: Same Day Issue**
- Start: Jan 1, 2026
- End: Jan 1, 2026
- Expected: Total Days = 1

## 🛠️ Tech Stack

- **React 18** - UI library with functional components
- **Material UI v5** - Component library
- **@mui/x-date-pickers** - Date picker components
- **dayjs** - Date manipulation library
- **Vite** - Build tool and dev server
- **Emotion** - CSS-in-JS styling

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Responsive grid layout
- Professional typography (Inter font)
- High contrast for accessibility
- Intuitive user interface

## 📚 Documentation

For detailed information about calculation logic, edge cases, and component architecture, see [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using React and Material UI

## 🙏 Acknowledgments

- Material UI team for the excellent component library
- dayjs team for the lightweight date library
- React team for the amazing framework

---

**Note:** This application uses accurate, inclusive date calculations. All edge cases are properly handled to ensure 100% calculation accuracy.
