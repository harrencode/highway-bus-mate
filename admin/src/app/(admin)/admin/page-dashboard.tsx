"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { getDashboardStats, getRecentBookings, getTopRoutes } from "@/lib/services/dashboard";
import type { DashboardStats, RecentBooking, TopRoute } from "@/lib/services/dashboard";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  brandLight: "#E6F5EE",
  accent: "#F5A623",
  accentLight: "#FEF3DC",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
  blueLight: "#EFF4FF",
  blue: "#2563EB",
};

function StatCard({
  label,
  value,
  change,
  isLoading,
  isPositive,
}: {
  label: string;
  value: string;
  change: string;
  isLoading: boolean;
  isPositive: boolean;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        p: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <Box>
        <Typography fontSize={12} color={colors.text3} mb={0.5}>
          {label}
        </Typography>
        {isLoading ? (
          <Skeleton width={100} height={32} />
        ) : (
          <Typography
            fontSize={26}
            fontWeight={700}
            color={colors.text}
            fontFamily="'Syne', sans-serif"
          >
            {value}
          </Typography>
        )}
        <Box display="flex" alignItems="center" gap={0.5} mt={0.3}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 16, color: colors.brandMid }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 16, color: colors.red }} />
          )}
          <Typography
            fontSize={11}
            color={isPositive ? colors.brandMid : colors.red}
          >
            {change}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

function RecentBookingsPanel() {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getRecentBookings(5);
        setBookings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.25,
          py: 1.6,
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight={700} fontSize={14}>
          Recent Bookings
        </Typography>
        <Typography
          fontSize={12}
          color={colors.brandMid}
          sx={{ cursor: "pointer" }}
        >
          View all →
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead">
            <Box component="tr" sx={{ bgcolor: colors.bg }}>
              {["Booking ID", "Passenger", "Route", "Date", "Fare", "Status"].map(
                (header) => (
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
                )
              )}
            </Box>
          </Box>
          <Box component="tbody">
            {isLoading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <Box key={i} component="tr">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
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
                  colSpan={6}
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
                    }}
                  >
                    {booking.date}
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
                    Rs. {booking.fare}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      px: 2.25,
                      py: 1.35,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        borderRadius: 999,
                        px: 1.1,
                        py: 0.3,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor:
                          booking.status === "confirmed"
                            ? colors.brandLight
                            : colors.accentLight,
                        color:
                          booking.status === "confirmed"
                            ? colors.brand
                            : "#8A6010",
                      }}
                    >
                      {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

function TopRoutesPanel() {
  const [routes, setRoutes] = useState<TopRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getTopRoutes(4);
        setRoutes(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load routes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.25,
          py: 1.6,
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <Typography fontWeight={700} fontSize={14}>
          Top Routes Today
        </Typography>
      </Box>
      <Box sx={{ p: 1.5 }}>
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Box key={i} sx={{ mb: 1 }}>
                <Skeleton width="100%" height={24} />
              </Box>
            ))
        ) : routes.length === 0 ? (
          <Typography color={colors.text3} fontSize={12}>
            No route data available
          </Typography>
        ) : (
          routes.map((route) => {
            const maxBookings = Math.max(...routes.map((r) => r.bookings), 100);
            const percentage = (route.bookings / maxBookings) * 100;

            return (
              <Box
                key={route.name}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.1,
                }}
              >
                <Typography
                  fontSize={12}
                  color={colors.text}
                  sx={{ minWidth: 120 }}
                  noWrap
                >
                  {route.name}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: "#EEF3F0",
                    borderRadius: 999,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      bgcolor: colors.brandMid,
                      width: `${percentage}%`,
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
                <Typography
                  fontSize={12}
                  fontWeight={600}
                  color={colors.text}
                  sx={{ minWidth: 36, textAlign: "right" }}
                >
                  {route.bookings}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Stats Grid */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.75, mb: 2.5 }}>
        <Box sx={{ flex: "1 1 calc(25% - 13px)", minWidth: "220px" }}>
          <StatCard
            label="Total Bookings Today"
            value={stats?.total_bookings_today.toString() || "0"}
            change={`${stats?.booking_change_percent || 0}% from yesterday`}
            isLoading={isLoading}
            isPositive={true}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 13px)", minWidth: "220px" }}>
          <StatCard
            label="Revenue Today"
            value={`Rs.${stats?.revenue_today || 0}`}
            change={`${stats?.revenue_change_percent || 0}% from yesterday`}
            isLoading={isLoading}
            isPositive={true}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 13px)", minWidth: "220px" }}>
          <StatCard
            label="Active Buses"
            value={stats?.active_buses.toString() || "0"}
            change="2 added this week"
            isLoading={isLoading}
            isPositive={true}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(25% - 13px)", minWidth: "220px" }}>
          <StatCard
            label="Pending Contributions"
            value={stats?.pending_contributions.toString() || "0"}
            change="Need review"
            isLoading={isLoading}
            isPositive={false}
          />
        </Box>
      </Box>

      {/* Content Row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.75 }}>
        <Box sx={{ flex: "1 1 calc(66.666% - 9px)", minWidth: "500px" }}>
          <RecentBookingsPanel />
        </Box>
        <Box sx={{ flex: "1 1 calc(33.333% - 9px)", minWidth: "300px" }}>
          <TopRoutesPanel />
        </Box>
      </Box>
    </Box>
  );
}
