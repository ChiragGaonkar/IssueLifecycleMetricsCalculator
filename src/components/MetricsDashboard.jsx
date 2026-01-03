import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Chip,
    Divider,
    Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import {
    calculateTotalDays,
    calculateBlockedDays,
    calculateWeekendDays,
    calculateHolidayDays,
    calculateAgeOfIssue,
    calculateTimeToResolve,
} from '../utils/dateCalculations';

/**
 * MetricsDashboard Component
 * Displays all calculated issue lifecycle metrics
 * @param {Object} props
 * @param {dayjs.Dayjs} props.startDate - Issue start date
 * @param {dayjs.Dayjs} props.endDate - Issue closed date
 * @param {Array} props.blockedRanges - Array of blocked date ranges
 * @param {Array} props.holidays - Array of holiday dates
 */
const MetricsDashboard = ({ startDate, endDate, blockedRanges, holidays }) => {
    // Only calculate if both dates are present and valid
    const hasValidDates = startDate && endDate && dayjs(endDate).isSameOrAfter(dayjs(startDate));

    if (!hasValidDates) {
        return (
            <Card elevation={3}>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        📊 Metrics Dashboard
                    </Typography>
                    <Alert severity="info">
                        Please enter valid issue start and closed dates to see the metrics.
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    // Calculate all metrics
    const totalDays = calculateTotalDays(startDate, endDate);
    const blockedDays = calculateBlockedDays(startDate, endDate, blockedRanges);

    // Convert holiday dates to string format for calculation
    const holidayStrings = holidays
        .filter(date => date && dayjs(date).isValid())
        .map(date => dayjs(date).format('YYYY-MM-DD'));

    const holidayDays = calculateHolidayDays(startDate, endDate, blockedRanges, holidayStrings);
    const weekendDays = calculateWeekendDays(startDate, endDate, blockedRanges);
    const ageOfIssue = calculateAgeOfIssue(startDate, endDate, blockedDays, holidayDays);
    const timeToResolve = calculateTimeToResolve(totalDays, blockedDays, holidayDays, weekendDays);

    // Format blocked ranges for display
    const validBlockedRanges = blockedRanges.filter(range => range.start && range.end);

    // Format holidays for display
    const validHolidays = holidays.filter(date => date && dayjs(date).isValid());

    return (
        <Card elevation={3}>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    📊 Metrics Dashboard
                </Typography>

                <Grid container spacing={3}>
                    {/* Issue Start Date */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
                                color: 'white',
                            }}>
                            <CardContent>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    Issue Start Date
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {dayjs(startDate).format('MMM DD, YYYY')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Issue End Date */}
                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)',
                                color: 'white',
                            }}>
                            <CardContent>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    Issue Closed Date
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {dayjs(endDate).format('MMM DD, YYYY')}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Age of Issue - HIGHLIGHTED */}
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    ⭐ Age of Issue
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                                    {ageOfIssue} days
                                </Typography>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Calculation Breakdown:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        Total Days: {totalDays}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        - Blocked Days: {blockedDays}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        - Holiday Count: {holidayDays}
                                    </Typography>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                        = Age of Issue: {ageOfIssue} days
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Time to Resolve - HIGHLIGHTED */}
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                height: '100%',
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    ⭐ Time to Resolve
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                                    {timeToResolve} days
                                </Typography>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Calculation Breakdown:
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        Total Days: {totalDays}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        - Blocked Days: {blockedDays}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        - Holidays: {holidayDays}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        - Weekends (Sat & Sun): {weekendDays}
                                    </Typography>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                        = Time to Resolve: {timeToResolve} days
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Total Blocked Days - HIGHLIGHTED */}
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                color: 'white',
                                height: '100%',
                            }}
                        >
                            <CardContent>
                                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                    ⭐ Total Blocked Days
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    {blockedDays}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                                    Days when work was blocked
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Blocked Date Ranges Display */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 600 }}>
                                    🚫 Blocked Date Ranges
                                </Typography>
                                {validBlockedRanges.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        No blocked date ranges
                                    </Typography>
                                ) : (
                                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {validBlockedRanges.map((range, index) => (
                                            <Chip
                                                key={index}
                                                label={`${dayjs(range.start).format('MMM DD, YYYY')} → ${dayjs(range.end).format('MMM DD, YYYY')}`}
                                                color="error"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Holiday Dates Display */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 600 }}>
                                    🎉 Holiday Dates
                                </Typography>
                                {validHolidays.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        No holidays added
                                    </Typography>
                                ) : (
                                    <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {validHolidays.map((date, index) => (
                                            <Chip
                                                key={index}
                                                label={dayjs(date).format('MMM DD, YYYY')}
                                                color="success"
                                                variant="outlined"
                                                sx={{ fontWeight: 500 }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Additional Metrics */}
                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom variant="body2">
                                    Weekend Days
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                    {weekendDays}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Saturdays & Sundays (excl. blocked)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom variant="body2">
                                    Holiday Days
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                    {holidayDays}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Holidays (excl. blocked)
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default MetricsDashboard;
