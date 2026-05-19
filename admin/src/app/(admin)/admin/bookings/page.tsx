"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { getBookings, getBookingStats, cancelBooking } from "@/lib/services/bookings";
import type { Booking, BookingStats } from "@/lib/services/bookings";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  brandLight: "#E6F5EE",
  accent: "#F5A623",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
};

function StatBox({
  icon,
  value,
  label,
  isLoading,
}: {
  icon: string;
  value: string;
  label: string;
  isLoading: boolean;
}) {
  return (
    <Card sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ fontSize: 20 }}>{icon}</Box>
        <Box>
          {isLoading ? (
            <>
              <Skeleton width={60} />
              <Skeleton width={100} />
            </>
          ) : (
            <>
              <Typography fontWeight={700} fontSize={18}>
                {value}
              </Typography>
              <Typography fontSize={11} color={colors.text3}>
                {label}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [bookingsData, statsData] = await Promise.all([
          getBookings(100),
          getBookingStats(),
        ]);
        setBookings(bookingsData || []);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel booking");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            Booking Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            All passenger reservations
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<CloudDownloadIcon />}
          sx={{ borderColor: colors.border, color: colors.text }}
        >
          Export CSV
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
        <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "250px" }}>
          <StatBox
            icon="🎫"
            value={stats?.today_bookings.toString() || "0"}
            label="Today's bookings"
            isLoading={isLoading}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "250px" }}>
          <StatBox
            icon="✅"
            value={stats?.confirmed.toString() || "0"}
            label="Confirmed"
            isLoading={isLoading}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "250px" }}>
          <StatBox
            icon="⏳"
            value={stats?.pending.toString() || "0"}
            label="Pending"
            isLoading={isLoading}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "250px" }}>
          <StatBox
            icon="❌"
            value={stats?.cancelled.toString() || "0"}
            label="Cancelled"
            isLoading={isLoading}
          />
        </Box>
      </Box>

      {/* Bookings Table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 900,
            }}
          >
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {[
                  "Booking ID",
                  "Passenger",
                  "Route",
                  "Bus",
                  "Seats",
                  "Date",
                  "Fare",
                  "Payment",
                  "Status",
                  "Action",
                ].map((header) => (
                  <Box
                    key={header}
                    component="th"
                    sx={{
                      px: 2.25,
                      py: 1.2,
                      borderBottom: `1px solid ${colors.border}`,
                      color: colors.text3,
                      fontSize: 11,
                      fontWeight: 700,
                      textAlign: "left",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {header}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Box key={i} component="tr">
                      {Array(10)
                        .fill(0)
                        .map((_, j) => (
                          <Box
                            key={j}
                            component="td"
                            sx={{
                              px: 2.25,
                              py: 1.35,
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            <Skeleton width="80%" />
                          </Box>
                        ))}
                    </Box>
                  ))
              ) : bookings.length === 0 ? (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan={10}
                    sx={{
                      textAlign: "center",
                      py: 3,
                      color: colors.text3,
                    }}
                  >
                    No bookings found
                  </Box>
                </Box>
              ) : (
                bookings.map((booking) => (
                  <Box
                    key={booking.id}
                    component="tr"
                    sx={{ "&:hover td": { bgcolor: colors.bg } }}
                  >
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontFamily: "monospace",
                        fontSize: 12,
                      }}
                    >
                      {booking.booking_id}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                      }}
                    >
                      {booking.passenger_name}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                      }}
                    >
                      {booking.route_name}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                        fontFamily: "monospace",
                      }}
                    >
                      {booking.bus_number}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                      }}
                    >
                      {booking.seats.join(", ")}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                      }}
                    >
                      {booking.travel_date}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        fontSize: 13,
                      }}
                    >
                      Rs. {booking.total_fare}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <Chip
                        label={
                          booking.payment_status === "paid"
                            ? "Paid"
                            : "Pending"
                        }
                        size="small"
                        color={
                          booking.payment_status === "paid"
                            ? "success"
                            : "warning"
                        }
                      />
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                      }}
                    >
                      <Chip
                        label={booking.status === "confirmed" ? "Confirmed" : "Pending"}
                        size="small"
                        color={
                          booking.status === "confirmed"
                            ? "success"
                            : "warning"
                        }
                      />
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Button
                        size="small"
                        sx={{ color: colors.brandMid, minWidth: 0, px: 0.5 }}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        sx={{ color: colors.red, minWidth: 0, px: 0.5 }}
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
