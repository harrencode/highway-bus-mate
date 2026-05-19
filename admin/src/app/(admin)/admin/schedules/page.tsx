"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getSchedules } from "@/lib/services/schedules";
import type { Schedule } from "@/lib/services/schedules";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSchedules(100);
        setSchedules(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load schedules");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            Schedule Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            Departure and arrival times for all routes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: colors.brand }}
        >
          Add Schedule
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {["Schedule ID", "Bus", "Route", "Departure", "Arrival", "Date", "Seats", "Actions"].map((h) => (
                  <Box
                    key={h}
                    component="th"
                    sx={{
                      px: 2,
                      py: 1.2,
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.text3,
                      fontSize: 11,
                      fontWeight: 700,
                      textAlign: "left",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Box key={i} component="tr">
                        {Array(8)
                          .fill(0)
                          .map((_, j) => (
                            <Box key={j} component="td" sx={{ p: 1.5 }}>
                              <Skeleton />
                            </Box>
                          ))}
                      </Box>
                    ))
                : schedules.map((sch) => (
                    <Box key={sch.id} component="tr" sx={{ "&:hover td": { bgcolor: colors.bg } }}>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}`, fontFamily: "monospace" }}>
                        {sch.schedule_id}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.bus_number}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.route_name}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.departure_time}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.arrival_time}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.date}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {sch.available_seats}/{sch.total_seats}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        <Button size="small" sx={{ color: colors.brandMid }}>Edit</Button>
                        <Button size="small" sx={{ color: colors.red }}>Delete</Button>
                      </Box>
                    </Box>
                  ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
