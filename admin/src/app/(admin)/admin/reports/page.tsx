"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getReportStats, getMostBookedRoutes, getRevenueByBusType } from "@/lib/services/reports";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
};

function StatCard({
  label,
  value,
  change,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  icon: string;
}) {
  return (
    <Card sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography fontSize={12} color={colors.text3}>{label}</Typography>
            <Typography fontSize={24} fontWeight={700} color={colors.text} mt={0.5}>
              {value}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
              <TrendingUpIcon sx={{ fontSize: 14, color: colors.brandMid }} />
              <Typography fontSize={11} color={colors.brandMid}>{change}</Typography>
            </Box>
          </Box>
          <Typography fontSize={24}>{icon}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function BarChart({
  title,
  data,
}: {
  title: string;
  data: Array<{ label: string; value: number }>;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  return (
    <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, p: 2 }}>
      <Typography fontWeight={600} mb={2}>{title}</Typography>
      {data.map((item) => (
        <Box key={item.label} sx={{ mb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5, fontSize: 12 }}>
            <Typography fontSize={12}>{item.label}</Typography>
            <Typography fontSize={12} fontWeight={600}>{item.value}</Typography>
          </Box>
          <Box
            sx={{
              height: 8,
              bgcolor: colors.bg,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                bgcolor: colors.brandMid,
                width: `${(item.value / maxValue) * 100}%`,
                borderRadius: 999,
              }}
            />
          </Box>
        </Box>
      ))}
    </Paper>
  );
}

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [period, setPeriod] = useState("this-month");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, routesData, revenueData] = await Promise.all([
          getReportStats(period),
          getMostBookedRoutes(5),
          getRevenueByBusType(period),
        ]);
        setStats(statsData);
        setRoutes(routesData || []);
        setRevenue(revenueData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            Reports & Analytics
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            Revenue, bookings, and route performance
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="this-month">This Month</MenuItem>
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="this-year">This Year</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<CloudDownloadIcon />}>
            Download
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, i) => (
              <Box key={i} sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
                <Card sx={{ border: `1px solid ${colors.border}` }}>
                  <CardContent>
                    <Skeleton height={40} sx={{ mb: 1 }} />
                    <Skeleton width="80%" height={20} />
                  </CardContent>
                </Card>
              </Box>
            ))
        ) : (
          <>
            <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
              <StatCard label="Monthly Revenue" value={stats?.monthly_revenue} change="▲ 18%" icon="📈" />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
              <StatCard label="Total Bookings" value={stats?.total_bookings.toString()} change="▲ 12%" icon="🎫" />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
              <StatCard label="Active Users" value={stats?.active_users.toString()} change="▲ 24 new" icon="👥" />
            </Box>
            <Box sx={{ flex: "1 1 calc(25% - 16px)", minWidth: "200px" }}>
              <StatCard label="Cancellation Rate" value={`${stats?.cancellation_rate}%`} change="▼ down" icon="❌" />
            </Box>
          </>
        )}
      </Box>

      {/* Charts */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "400px" }}>
          <BarChart
            title="Most Booked Routes"
            data={routes.map((r) => ({ label: r.name, value: r.bookings }))}
          />
        </Box>
        <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "400px" }}>
          <BarChart
            title="Revenue by Bus Type"
            data={revenue.map((r) => ({ label: r.type, value: parseInt(r.revenue) || 0 }))}
          />
        </Box>
      </Box>
    </Box>
  );
}
