import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import BlockedDateRange from "./BlockedDateRange";
import HolidayDate from "./HolidayDate";
import { validateDateRange } from "../utils/dateCalculations";
import dayjs from "dayjs";

/**
 * IssueForm Component
 * Form section for inputting issue dates, blocked date ranges, and holidays
 * @param {Object} props
 * @param {dayjs.Dayjs} props.startDate - Issue start date
 * @param {dayjs.Dayjs} props.endDate - Issue closed date
 * @param {Array} props.blockedRanges - Array of blocked date ranges
 * @param {Array} props.holidays - Array of holiday dates
 * @param {Function} props.onStartDateChange - Callback for start date change
 * @param {Function} props.onEndDateChange - Callback for end date change
 * @param {Function} props.onBlockedRangesChange - Callback for blocked ranges change
 * @param {Function} props.onHolidaysChange - Callback for holidays change
 */
const IssueForm = ({
  startDate,
  endDate,
  blockedRanges,
  holidays,
  onStartDateChange,
  onEndDateChange,
  onBlockedRangesChange,
  onHolidaysChange,
}) => {
  // Validate main date range
  const validation = validateDateRange(startDate, endDate);

  // Add a new blocked date range
  const handleAddBlockedRange = () => {
    onBlockedRangesChange([...blockedRanges, { start: null, end: null }]);
  };

  // Update a specific blocked range
  const handleBlockedRangeChange = (index, updatedRange) => {
    const newRanges = [...blockedRanges];
    newRanges[index] = updatedRange;
    onBlockedRangesChange(newRanges);
  };

  // Remove a blocked range
  const handleRemoveBlockedRange = (index) => {
    const newRanges = blockedRanges.filter((_, i) => i !== index);
    onBlockedRangesChange(newRanges);
  };

  // Add a new holiday date
  const handleAddHoliday = () => {
    onHolidaysChange([...holidays, null]);
  };

  // Update a specific holiday date
  const handleHolidayChange = (index, updatedDate) => {
    const newHolidays = [...holidays];
    newHolidays[index] = updatedDate;
    onHolidaysChange(newHolidays);
  };

  // Remove a holiday date
  const handleRemoveHoliday = (index) => {
    const newHolidays = holidays.filter((_, i) => i !== index);
    onHolidaysChange(newHolidays);
  };

  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600, mb: 3 }}
        >
          📝 Issue Details
        </Typography>

        {/* Main Date Inputs */}
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DatePicker
              label="Issue Start Date"
              value={startDate}
              onChange={onStartDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />
          </Box>

          <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
            <DatePicker
              label="Issue Closed Date"
              value={endDate}
              onChange={onEndDateChange}
              minDate={startDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  error: !validation.isValid && startDate && endDate,
                  helperText:
                    !validation.isValid && startDate && endDate
                      ? validation.error
                      : "",
                },
              }}
            />
          </Box>
        </Box>

        {/* Validation Error Alert */}
        {!validation.isValid && startDate && endDate && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {validation.error}
          </Alert>
        )}

        {/* Blocked Date Ranges Section */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              🚫 Blocked Date Ranges
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddBlockedRange}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Blocked Range
            </Button>
          </Box>

          {blockedRanges.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No blocked date ranges added. Click "Add Blocked Range" to add
              periods when work was blocked.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {blockedRanges.map((range, index) => (
                <BlockedDateRange
                  key={index}
                  range={range}
                  index={index}
                  onChange={handleBlockedRangeChange}
                  onRemove={handleRemoveBlockedRange}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Holiday Dates Section */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              🎉 Holiday Dates
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddHoliday}
              size="small"
              sx={{
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Add Holiday
            </Button>
          </Box>

          {holidays.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No holidays added. Click "Add Holiday" to add dates that should be
              excluded from calculations.
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {holidays.map((date, index) => (
                <HolidayDate
                  key={index}
                  date={date}
                  index={index}
                  onChange={handleHolidayChange}
                  onRemove={handleRemoveHoliday}
                />
              ))}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default IssueForm;
