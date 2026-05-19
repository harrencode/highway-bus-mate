"use client";

import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PaidIcon from "@mui/icons-material/Paid";
import SearchIcon from "@mui/icons-material/Search";

type Screen =
  | "dashboard"
  | "routes"
  | "buses"
  | "schedules"
  | "pricing"
  | "bookings"
  | "contributions"
  | "notifications"
  | "reports"
  | "users";

type StatusTone = "success" | "warning" | "error" | "info" | "neutral";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  brandLight: "#E6F5EE",
  brandDark: "#0D3D27",
  accent: "#F5A623",
  accentLight: "#FEF3DC",
  bg: "#F3F7F5",
  surface2: "#EEF3F0",
  text: "#111B16",
  text2: "#4A6055",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
  redLight: "#FCEAEA",
  blue: "#2563EB",
  blueLight: "#EFF4FF",
};

const screenCopy: Record<Screen, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Live operations for Highway Bus Mate",
  },
  routes: {
    title: "Route Management",
    subtitle: "Create and maintain expressway routes across Sri Lanka",
  },
  buses: {
    title: "Bus Management",
    subtitle: "Fleet registry, capacities, and service status",
  },
  schedules: {
    title: "Schedule Management",
    subtitle: "Daily departures and trip availability",
  },
  pricing: {
    title: "Pricing Management",
    subtitle: "Fare rules by route and bus type",
  },
  bookings: {
    title: "Booking Management",
    subtitle: "Passenger reservations, payments, and cancellations",
  },
  contributions: {
    title: "Community Contributions",
    subtitle: "Review passenger-submitted route and bus updates",
  },
  notifications: {
    title: "Notification Management",
    subtitle: "Send alerts and announcements to passengers",
  },
  reports: {
    title: "Reports & Analytics",
    subtitle: "Revenue, bookings, and route performance",
  },
  users: {
    title: "User Management",
    subtitle: "Registered passengers and admin accounts",
  },
};

const stats = [
  {
    label: "Total Bookings Today",
    value: "148",
    change: "12% from yesterday",
    tone: "success" as const,
    Icon: EventSeatIcon,
  },
  {
    label: "Revenue Today",
    value: "Rs.58,240",
    change: "8.4% from yesterday",
    tone: "warning" as const,
    Icon: PaidIcon,
  },
  {
    label: "Active Buses",
    value: "34",
    change: "2 added this week",
    tone: "info" as const,
    Icon: DirectionsBusIcon,
  },
  {
    label: "Pending Contributions",
    value: "5",
    change: "Need review",
    tone: "error" as const,
    Icon: EditNoteIcon,
  },
];

const bookings = [
  ["#BM-20470", "Kasun Perera", "077-123-4567", "Matara to Colombo", "NB-2241", "04, 08", "7 Apr", "Rs.900", "Paid", "Confirmed"],
  ["#BM-20469", "Nimal Silva", "071-456-7890", "Galle to Kandy", "GL-5512", "12", "7 Apr", "Rs.550", "Paid", "Confirmed"],
  ["#BM-20468", "Amara Fernando", "076-789-0123", "Colombo to Matara", "CP-1187", "22", "7 Apr", "Rs.450", "Pending", "Pending"],
  ["#BM-20467", "Ruwan Jayasena", "070-321-0987", "Negombo to Matara", "WP-0044", "01, 02, 03", "6 Apr", "Rs.2,160", "Refunded", "Cancelled"],
];

const routes = [
  ["R-001", "Matara", "Colombo", "Southern Expressway", "164 km", "2h 20m", "18", "Active"],
  ["R-002", "Galle", "Kandy", "E01, E04", "235 km", "4h 10m", "8", "Active"],
  ["R-003", "Colombo", "Negombo", "Colombo Katunayake Expressway", "38 km", "45m", "12", "Active"],
  ["R-004", "Kurunegala", "Colombo", "Central Expressway", "94 km", "1h 50m", "6", "Inactive"],
  ["R-005", "Hambantota", "Colombo", "Southern Expressway", "238 km", "3h 15m", "4", "Active"],
];

const buses = [
  ["NB-2241", "AC Express", "Matara to Colombo", "45 seats", "06:30, 14:30", "Saman Travels", "Active"],
  ["GL-5512", "Super Luxury", "Galle to Kandy", "42 seats", "07:00", "Ruhunu Express", "Active"],
  ["CP-1187", "Semi-Luxury", "Colombo to Matara", "50 seats", "08:15, 17:45", "CityLine", "Active"],
  ["WP-0044", "AC Express", "Negombo to Matara", "44 seats", "09:00", "Airport Connect", "Maintenance"],
  ["HB-8821", "Semi-Luxury", "Hambantota to Colombo", "45 seats", "05:45", "Southern Star", "Active"],
  ["KG-7032", "Normal", "Kurunegala to Colombo", "54 seats", "10:30", "Wayamba Transit", "Inactive"],
];

const schedules = [
  ["SCH-101", "NB-2241", "Matara to Colombo", "06:30", "08:50", "Daily", "Scheduled"],
  ["SCH-102", "GL-5512", "Galle to Kandy", "07:00", "11:10", "Weekdays", "Scheduled"],
  ["SCH-103", "CP-1187", "Colombo to Matara", "08:15", "10:45", "Daily", "Boarding"],
  ["SCH-104", "WP-0044", "Negombo to Matara", "09:00", "12:30", "Weekend", "Cancelled"],
];

const pricing = [
  ["Matara to Colombo", "Normal", "Rs.350", "Rs.420", "Rs.450", "Active"],
  ["Galle to Kandy", "Super Luxury", "Rs.500", "Rs.550", "Rs.650", "Active"],
  ["Colombo to Negombo", "AC Express", "Rs.220", "Rs.280", "Rs.300", "Active"],
  ["Hambantota to Colombo", "Semi-Luxury", "Rs.700", "Rs.760", "Rs.820", "Draft"],
];

const contributions = [
  ["New Route", "Tharaka Perera", "Hambantota to Colombo via Southern Expressway", "7 Apr, 2h ago", "Daily, 2 buses estimated"],
  ["New Bus", "Pradeep Kumara", "WP-3349 on Route R-003", "7 Apr, 5h ago", "AC, departs 08:00"],
  ["Update", "Chamara Silva", "NB-2241 departure changed from 06:00 to 06:30", "6 Apr, 1d ago", "Operator confirmed"],
  ["Update", "Dilini Jayawardena", "Fare correction for GL-5512 Galle to Kandy", "5 Apr, 2d ago", "Fare should be Rs.550"],
  ["New Bus", "Asanka Rathnayake", "HB-8821 on Route R-005", "5 Apr, 2d ago", "Semi-luxury, 45 seats"],
];

const users = [
  ["Kasun Perera", "kasun@email.com", "077-123-4567", "User", "12", "Jan 2025", "Active"],
  ["Nimal Silva", "nimal@email.com", "071-456-7890", "User", "5", "Mar 2025", "Active"],
  ["Sunil Admin", "sunil@busmate.lk", "076-000-0001", "Admin", "-", "Oct 2024", "Active"],
  ["Amara Fernando", "amara@email.com", "070-987-6543", "User", "3", "Feb 2026", "Active"],
];

function toneStyles(tone: StatusTone) {
  const map = {
    success: { bg: colors.brandLight, fg: colors.brand },
    warning: { bg: colors.accentLight, fg: "#8A6010" },
    error: { bg: colors.redLight, fg: colors.red },
    info: { bg: colors.blueLight, fg: colors.blue },
    neutral: { bg: colors.surface2, fg: colors.text2 },
  };
  return map[tone];
}

function statusTone(value: string): StatusTone {
  const status = value.toLowerCase();
  if (["active", "confirmed", "paid", "scheduled", "boarding"].includes(status)) return "success";
  if (["pending", "draft", "maintenance"].includes(status)) return "warning";
  if (["cancelled", "inactive", "refunded"].includes(status)) return "error";
  return "neutral";
}

function StatusChip({ label, tone }: { label: string; tone?: StatusTone }) {
  const style = toneStyles(tone ?? statusTone(label));
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        borderRadius: 999,
        bgcolor: style.bg,
        color: style.fg,
        fontSize: 11,
        fontWeight: 700,
      }}
    />
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, overflow: "hidden" }}
    >
      {title ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2.25, py: 1.6, borderBottom: `1px solid ${colors.border}` }}
        >
          <Typography fontWeight={700} fontSize={14}>
            {title}
          </Typography>
          {action}
        </Stack>
      ) : null}
      {children}
    </Paper>
  );
}

function DataTable({
  headers,
  rows,
  actions = true,
}: {
  headers: string[];
  rows: string[][];
  actions?: boolean;
}) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: colors.bg }}>
            {headers.map((header) => (
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
                  letterSpacing: "0.04em",
                  textAlign: "left",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {header}
              </Box>
            ))}
            {actions ? <Box component="th" sx={{ px: 2.25, py: 1.2 }} /> : null}
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row) => (
            <Box
              key={row.join("|")}
              component="tr"
              sx={{ "&:hover td": { bgcolor: colors.bg } }}
            >
              {row.map((cell, index) => (
                <Box
                  key={`${cell}-${index}`}
                  component="td"
                  sx={{
                    px: 2.25,
                    py: 1.35,
                    borderBottom: `1px solid ${colors.border}`,
                    color: index === 0 ? colors.text : colors.text2,
                    fontFamily: index === 0 && cell.includes("-") ? "monospace" : "inherit",
                    fontSize: index === 0 && cell.includes("-") ? 12 : 13,
                    fontWeight: index === 0 && !cell.includes("-") ? 700 : 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  {["Active", "Inactive", "Pending", "Confirmed", "Paid", "Refunded", "Cancelled", "Scheduled", "Boarding", "Draft", "Maintenance"].includes(cell) ? (
                    <StatusChip label={cell} />
                  ) : (
                    cell
                  )}
                </Box>
              ))}
              {actions ? (
                <Box component="td" sx={{ px: 2.25, py: 1.35, borderBottom: `1px solid ${colors.border}`, whiteSpace: "nowrap" }}>
                  <Button size="small" sx={{ color: colors.brandMid, minWidth: 0, px: 0.75 }}>
                    View
                  </Button>
                  <Button size="small" sx={{ color: colors.red, minWidth: 0, px: 0.75 }}>
                    Cancel
                  </Button>
                </Box>
              ) : null}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function PageHeader({
  screen,
  actionLabel,
}: {
  screen: Screen;
  actionLabel?: string;
}) {
  const copy = screenCopy[screen];
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      gap={2}
      mb={2.5}
    >
      <Box>
        <Typography variant="h5" fontWeight={800} color={colors.text}>
          {copy.title}
        </Typography>
        <Typography fontSize={13} color={colors.text3} mt={0.25}>
          {copy.subtitle}
        </Typography>
      </Box>
      {actionLabel ? (
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: colors.brand, borderRadius: 1.25 }}>
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
}

function SearchFilters({ placeholder }: { placeholder: string }) {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} gap={1.25} mb={1.75}>
      <TextField
        id={`admin-filter-search-${placeholder.toLowerCase().replace(/\s+/g, "-")}`}
        size="small"
        placeholder={placeholder}
        sx={{ minWidth: { sm: 280 }, bgcolor: "white" }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Select
        id={`admin-filter-status-${placeholder.toLowerCase().replace(/\s+/g, "-")}`}
        size="small"
        value="all"
        sx={{ minWidth: 150, bgcolor: "white" }}
      >
        <MenuItem value="all">All statuses</MenuItem>
        <MenuItem value="active">Active</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
      </Select>
    </Stack>
  );
}

function StatGrid() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, gap: 1.75, mb: 2.5 }}>
      {stats.map(({ label, value, change, tone, Icon }) => {
        const style = toneStyles(tone);
        return (
          <Paper key={label} elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.border}` }}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2}>
              <Box>
                <Typography fontSize={12} color={colors.text3} mb={0.5}>
                  {label}
                </Typography>
                <Typography fontSize={26} fontWeight={800} color={colors.text}>
                  {value}
                </Typography>
                <Typography fontSize={11} color={tone === "error" ? colors.red : colors.brandMid}>
                  {change}
                </Typography>
              </Box>
              <Box sx={{ width: 38, height: 38, borderRadius: 1.25, bgcolor: style.bg, color: style.fg, display: "grid", placeItems: "center" }}>
                <Icon fontSize="small" />
              </Box>
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}

function MiniChart() {
  const bars = [28, 36, 24, 44, 38, 48, 32];
  return (
    <Box sx={{ px: 2.25, py: 1.25 }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography fontSize={11} color={colors.text3}>Bookings this week</Typography>
        <Typography fontSize={11} fontWeight={700} color={colors.brand}>817 total</Typography>
      </Stack>
      <Stack direction="row" alignItems="flex-end" gap={0.5} height={58}>
        {bars.map((height, index) => (
          <Stack key={height} alignItems="center" gap={0.4} flex={1}>
            <Box sx={{ width: "100%", height, bgcolor: index === 5 ? colors.brandMid : colors.brandLight, borderRadius: "3px 3px 0 0" }} />
            <Typography fontSize={9} color={colors.text3}>{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function DashboardScreen() {
  return (
    <>
      <PageHeader screen="dashboard" />
      <StatGrid />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" }, gap: 1.75 }}>
        <Panel
          title="Recent Bookings"
          action={<Button size="small" endIcon={<ArrowForwardIcon />} sx={{ color: colors.brandMid }}>View all</Button>}
        >
          <MiniChart />
          <DataTable
            headers={["Booking ID", "Passenger", "Phone", "Route", "Bus", "Seats", "Date", "Fare", "Payment", "Status"]}
            rows={bookings.slice(0, 4)}
            actions
          />
        </Panel>
        <Panel title="Pending Contributions">
          <Stack>
            {contributions.slice(0, 4).map((item) => (
              <Stack key={item[2]} direction="row" gap={1.5} sx={{ px: 2.25, py: 1.4, borderBottom: `1px solid ${colors.border}` }}>
                <StatusChip label={item[0]} tone={item[0] === "New Route" ? "info" : item[0] === "New Bus" ? "warning" : "success"} />
                <Box>
                  <Typography fontSize={13} fontWeight={700}>{item[2]}</Typography>
                  <Typography fontSize={11} color={colors.text3}>{item[1]} · {item[3]}</Typography>
                  <Stack direction="row" gap={0.75} mt={0.75}>
                    <Button size="small" startIcon={<CheckIcon />} sx={{ color: colors.brand, bgcolor: colors.brandLight, py: 0.25 }}>Approve</Button>
                    <Button size="small" startIcon={<CloseIcon />} sx={{ color: colors.red, bgcolor: colors.redLight, py: 0.25 }}>Reject</Button>
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Panel>
      </Box>
    </>
  );
}

function BusCards() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", xl: "repeat(3, 1fr)" }, gap: 1.75 }}>
      {buses.map(([number, type, route, seats, departures, operator, status]) => (
        <Paper key={number} elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, overflow: "hidden" }}>
          <Stack direction="row" justifyContent="space-between" sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
            <Box>
              <Typography fontSize={16} fontWeight={800}>{number}</Typography>
              <Typography fontSize={11} color={colors.text3}>{type}</Typography>
            </Box>
            <StatusChip label={status} />
          </Stack>
          <Stack gap={0.85} sx={{ p: 2 }}>
            {[["Route", route], ["Capacity", seats], ["Departures", departures], ["Operator", operator]].map(([label, value]) => (
              <Typography key={label} fontSize={12} color={colors.text2}>
                <Box component="span" sx={{ color: colors.text3, display: "inline-block", width: 78 }}>{label}</Box>
                {value}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" gap={0.75} sx={{ p: 1.25, bgcolor: colors.bg, borderTop: `1px solid ${colors.border}` }}>
            <Button size="small" fullWidth sx={{ color: colors.brand, bgcolor: colors.brandLight }}>Edit</Button>
            <Button size="small" fullWidth sx={{ color: "#8A6010", bgcolor: colors.accentLight }}>Schedule</Button>
            <Button size="small" fullWidth sx={{ color: colors.red, bgcolor: colors.redLight }}>Delete</Button>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

function NotificationsScreen() {
  return (
    <>
      <PageHeader screen="notifications" />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" }, gap: 1.75 }}>
        <Paper elevation={0} sx={{ maxWidth: 660, p: 2.5, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          <Typography fontWeight={800} mb={1.75}>Send New Notification</Typography>
          <Stack gap={1.75}>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {["Announcement", "Route Update", "Alert", "Fare Change", "Booking Update"].map((item, index) => (
                <Chip key={item} label={item} icon={index === 0 ? <NotificationsActiveIcon /> : undefined} sx={{ borderRadius: 1.25, bgcolor: index === 0 ? colors.brandLight : colors.bg, color: index === 0 ? colors.brand : colors.text2, fontWeight: 700 }} />
              ))}
            </Stack>
            <TextField
              id="admin-notification-title"
              label="Title"
              size="small"
              placeholder="Notification title"
            />
            <TextField
              id="admin-notification-message"
              label="Message"
              multiline
              minRows={4}
              placeholder="Write your notification message here"
            />
            <Select id="admin-notification-audience" size="small" defaultValue="all">
              <MenuItem value="all">All Passengers</MenuItem>
              <MenuItem value="route">Passengers on selected route</MenuItem>
              <MenuItem value="bookings">Passengers with upcoming bookings</MenuItem>
            </Select>
            <Stack direction="row" gap={1}>
              <Button variant="outlined" fullWidth>Schedule</Button>
              <Button variant="contained" fullWidth sx={{ bgcolor: colors.brand }}>Send Now</Button>
            </Stack>
          </Stack>
        </Paper>
        <Panel title="Recent Notifications">
          {[
            ["Route", "R-001 Service Delay", "Sent to 320 users · 7 Apr, 8:00 AM"],
            ["Fare", "Holiday fare surcharge applies", "Sent to all users · 5 Apr, 6:00 PM"],
            ["Booking", "Your trip is tomorrow", "Sent to 88 users · 6 Apr, 9:00 AM"],
            ["Alert", "Road closure near Kurunegala", "Sent to 150 users · 4 Apr, 2:00 PM"],
          ].map(([type, title, sub]) => (
            <Stack key={title} direction="row" gap={1.5} sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
              <StatusChip label={type} tone={type === "Alert" ? "error" : type === "Fare" ? "success" : type === "Booking" ? "warning" : "info"} />
              <Box>
                <Typography fontSize={13} fontWeight={700}>{title}</Typography>
                <Typography fontSize={11} color={colors.text3}>{sub}</Typography>
              </Box>
            </Stack>
          ))}
        </Panel>
      </Box>
    </>
  );
}

function ReportsScreen() {
  const routeRows = [
    ["Matara to Colombo", "1,240", 100],
    ["Galle to Kandy", "963", 78],
    ["Colombo to Negombo", "718", 58],
    ["Kurunegala to Colombo", "521", 42],
    ["Trincomalee to Colombo", "405", 33],
  ] as const;
  const typeRows = [
    ["AC Express", "Rs.580K", 100, colors.brand],
    ["Super Luxury", "Rs.412K", 71, colors.accent],
    ["Semi-Luxury", "Rs.316K", 54, colors.text2],
    ["Normal", "Rs.108K", 18, colors.text3],
  ] as const;
  const bars = (rows: readonly (readonly [string, string, number, string?])[]) => (
    <Stack gap={1.15} sx={{ p: 2.25 }}>
      {rows.map(([label, value, width, color]) => (
        <Stack key={label} direction="row" alignItems="center" gap={1.25}>
          <Typography fontSize={12} color={colors.text2} width={140} noWrap>{label}</Typography>
          <Box flex={1} height={8} bgcolor={colors.surface2} borderRadius={99} overflow="hidden">
            <Box height="100%" width={`${width}%`} bgcolor={color ?? colors.brandMid} />
          </Box>
          <Typography fontSize={12} fontWeight={800} width={64} textAlign="right">{value}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <PageHeader screen="reports" />
      <Stack direction="row" gap={1} mb={1.75} justifyContent="flex-end">
        <Select
          id="admin-reports-period"
          size="small"
          defaultValue="month"
          sx={{ bgcolor: "white", minWidth: 140 }}
        >
          <MenuItem value="month">This Month</MenuItem>
          <MenuItem value="year">This Year</MenuItem>
        </Select>
        <Button variant="outlined" startIcon={<DownloadIcon />}>Download</Button>
      </Stack>
      <StatGrid />
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1.75 }}>
        <Panel title="Most Booked Routes">{bars(routeRows)}</Panel>
        <Panel title="Revenue by Bus Type">{bars(typeRows)}</Panel>
      </Box>
    </>
  );
}

function UsersScreen() {
  return (
    <>
      <PageHeader screen="users" actionLabel="Add Admin" />
      <SearchFilters placeholder="Search users" />
      <Panel>
        <DataTable headers={["User", "Email", "Phone", "Role", "Bookings", "Joined", "Status"]} rows={users} actions />
      </Panel>
    </>
  );
}

export function BusAdminScreen({ screen }: { screen: Screen }) {
  if (screen === "dashboard") return <DashboardScreen />;
  if (screen === "buses") {
    return (
      <>
        <PageHeader screen="buses" actionLabel="Add Bus" />
        <SearchFilters placeholder="Search buses" />
        <BusCards />
      </>
    );
  }
  if (screen === "notifications") return <NotificationsScreen />;
  if (screen === "reports") return <ReportsScreen />;
  if (screen === "users") return <UsersScreen />;

  const tables: Record<Exclude<Screen, "dashboard" | "buses" | "notifications" | "reports" | "users">, { action: string; placeholder: string; headers: string[]; rows: string[][] }> = {
    routes: { action: "Add Route", placeholder: "Search routes", headers: ["Route ID", "Origin", "Destination", "Via", "Distance", "Duration", "Buses", "Status"], rows: routes },
    schedules: { action: "Add Schedule", placeholder: "Search schedules", headers: ["Schedule ID", "Bus", "Route", "Depart", "Arrive", "Frequency", "Status"], rows: schedules },
    pricing: { action: "Add Fare", placeholder: "Search pricing", headers: ["Route", "Bus Type", "Base Fare", "Current Fare", "Peak Fare", "Status"], rows: pricing },
    bookings: { action: "", placeholder: "Search bookings", headers: ["Booking ID", "Passenger", "Phone", "Route", "Bus", "Seats", "Date", "Fare", "Payment", "Status"], rows: bookings },
    contributions: { action: "", placeholder: "Search contributions", headers: ["Type", "Submitted By", "Details", "Submitted At", "Notes"], rows: contributions },
  };

  const table = tables[screen];
  return (
    <>
      <PageHeader screen={screen} actionLabel={table.action || undefined} />
      {screen === "bookings" ? <StatGrid /> : null}
      <SearchFilters placeholder={table.placeholder} />
      <Panel>
        <DataTable headers={table.headers} rows={table.rows} actions />
      </Panel>
    </>
  );
}

export function AdminTopbar() {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      sx={{ height: 58, px: 3, bgcolor: "white", borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}
    >
      <Box>
        <Typography fontSize={17} fontWeight={800} color={colors.text}>Highway Bus Mate</Typography>
        <Typography fontSize={12} color={colors.text3}>Admin Portal</Typography>
      </Box>
      <Box flex={1} />
      <TextField
        id="admin-topbar-search"
        size="small"
        placeholder="Search routes, buses, bookings"
        sx={{ display: { xs: "none", md: "block" }, width: 280, bgcolor: colors.bg }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <Button sx={{ minWidth: 36, width: 36, height: 36, border: `1px solid ${colors.border}`, color: colors.text2 }}>
        <NotificationsActiveIcon fontSize="small" />
      </Button>
      <Avatar sx={{ width: 34, height: 34, bgcolor: colors.accent, color: colors.brandDark, fontSize: 12, fontWeight: 800 }}>SA</Avatar>
    </Stack>
  );
}

export { colors };
