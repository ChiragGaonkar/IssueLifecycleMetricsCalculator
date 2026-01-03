import React from 'react';
import { Box, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * HolidayDate Component
 * Represents a single holiday date picker
 * @param {Object} props
 * @param {dayjs.Dayjs} props.date - The holiday date
 * @param {number} props.index - Index of this holiday in the parent array
 * @param {Function} props.onChange - Callback when date changes
 * @param {Function} props.onRemove - Callback when remove button is clicked
 */
const HolidayDate = ({ date, index, onChange, onRemove }) => {
    const handleDateChange = (newDate) => {
        onChange(index, newDate);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                mb: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                transition: 'all 0.2s',
            }}
        >
            <Box sx={{ flex: 1 }}>
                <DatePicker
                    label="Holiday Date"
                    value={date}
                    onChange={handleDateChange}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: 'small',
                        },
                    }}
                />
            </Box>

            <IconButton
                onClick={() => onRemove(index)}
                color="error"
                size="small"
                sx={{ mt: 0.5 }}
                aria-label="Remove holiday date"
            >
                <DeleteIcon />
            </IconButton>
        </Box>
    );
};

export default HolidayDate;
