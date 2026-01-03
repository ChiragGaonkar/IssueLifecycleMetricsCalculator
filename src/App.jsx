import React, { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Container, Typography, Box, CssBaseline } from "@mui/material";
import IssueForm from "./components/IssueForm";
import MetricsDashboard from "./components/MetricsDashboard";
import "./App.css";

// Create a custom MUI theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  // State management
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [blockedRanges, setBlockedRanges] = useState([]);
  const [holidays, setHolidays] = useState([]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(120deg, #ff8c00 50%, #1c1c1c 50%)",
            py: 4,
            overflowX: "hidden",
          }}
        >
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  color: "white",
                  mb: 1,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                📈 Issue Lifecycle Metrics Calculator
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontWeight: 400,
                }}
              >
                Calculate accurate issue metrics with precise date handling
              </Typography>
            </Box>

            {/* Form Section */}
            <IssueForm
              startDate={startDate}
              endDate={endDate}
              blockedRanges={blockedRanges}
              holidays={holidays}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onBlockedRangesChange={setBlockedRanges}
              onHolidaysChange={setHolidays}
            />

            {/* Dashboard Section */}
            <MetricsDashboard
              startDate={startDate}
              endDate={endDate}
              blockedRanges={blockedRanges}
              holidays={holidays}
            />

            {/* Footer */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                Built with love by Chirag, using Antigravity🚀
              </Typography>
            </Box>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
