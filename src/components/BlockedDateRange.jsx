import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

/**
 * BlockedDateRange Component
 * Represents a single blocked date range with start and end date pickers
 * @param {Object} props
 * @param {Object} props.range - The blocked range object {start, end}
 * @param {number} props.index - Index of this range in the parent array
 * @param {Function} props.onChange - Callback when dates change
 * @param {Function} props.onRemove - Callback when remove button is clicked
 */
const BlockedDateRange = ({ range, index, onChange, onRemove }) => {
  const handleStartChange = (newDate) => {
    onChange(index, { ...range, start: newDate });
  };

  const handleEndChange = (newDate) => {
    onChange(index, { ...range, end: newDate });
  };

  // Validation: end date should be >= start date
  const hasError =
    range.start && range.end && dayjs(range.end).isBefore(dayjs(range.start));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "flex-start",
        gap: 2,
        mb: 2,
        p: 2,
        border: "1px solid",
        borderColor: hasError ? "error.main" : "divider",
        borderRadius: 1,
        backgroundColor: hasError ? "error.light" : "background.paper",
        transition: "all 0.2s",
      }}
    >
      <Box sx={{ flex: 1 }}>
        <DatePicker
          label="Blocked Start Date"
          value={range.start}
          onChange={handleStartChange}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
            },
          }}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <DatePicker
          label="Blocked End Date"
          value={range.end}
          onChange={handleEndChange}
          minDate={range.start || undefined}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              error: hasError,
              helperText: hasError
                ? "End date must be on or after start date"
                : "",
            },
          }}
        />
      </Box>

      <IconButton
        onClick={() => onRemove(index)}
        color="error"
        size="small"
        sx={{ mt: 0.5 }}
        aria-label="Remove blocked date range"
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default BlockedDateRange;
