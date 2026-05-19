"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AltRoute as AltRouteIcon,
  Dashboard as DashboardIcon,
  DirectionsBus as DirectionsBusIcon,
  EventSeat as EventSeatIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Paid as PaidIcon,
  People as PeopleIcon,
  PriceChange as PriceChangeIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { routes } from "@/lib/routes";

const sidebarColors = {
  brandDark: "#0D3D27",
  accent: "#F5A623",
};

const navItems = [
  { label: "Dashboard", href: routes.admin.dashboard, Icon: DashboardIcon },
  { label: "Routes", href: routes.admin.routes, Icon: AltRouteIcon },
  { label: "Buses", href: routes.admin.buses, Icon: DirectionsBusIcon },
  { label: "Schedules", href: routes.admin.schedules, Icon: ScheduleIcon },
  { label: "Pricing", href: routes.admin.pricing, Icon: PriceChangeIcon },
  { label: "Bookings", href: routes.admin.bookings, Icon: EventSeatIcon },
  { label: "Contributions", href: routes.admin.contributions, Icon: PaidIcon },
  {
    label: "Notifications",
    href: routes.admin.notifications,
    Icon: NotificationsIcon,
  },
  { label: "Reports", href: routes.admin.reports, Icon: TrendingUpIcon },
  { label: "Users", href: routes.admin.users, Icon: PeopleIcon },
  { label: "Settings", href: routes.admin.settings, Icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      component="aside"
      sx={{
        width: 220,
        minHeight: "100vh",
        bgcolor: sidebarColors.brandDark,
        color: "white",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Typography fontSize={18} fontWeight={900} letterSpacing="-0.02em">
          Bus
          <Box component="span" sx={{ color: sidebarColors.accent }}>
            Mate
          </Box>
        </Typography>
        <Typography
          fontSize={10}
          color="rgba(255,255,255,0.42)"
          letterSpacing="0.08em"
          textTransform="uppercase"
        >
          Admin Portal
        </Typography>
      </Box>

      <List sx={{ flex: 1, py: 1.25, px: 1.25, overflow: "auto" }}>
        {navItems.map(({ label, href, Icon }) => {
          const active =
            pathname === href ||
            (href !== routes.admin.dashboard && pathname.startsWith(href));

          return (
            <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
              <Link
                href={href}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <ListItemButton
                  selected={active}
                  sx={{
                    borderRadius: 1,
                    py: 1.05,
                    color: active ? "white" : "rgba(255,255,255,0.62)",
                    "&.Mui-selected": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& .MuiListItemIcon-root": {
                        color: sidebarColors.accent,
                      },
                      "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
                    },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.07)",
                      color: "white",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34, color: "inherit" }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.07)" }} />

      <Box
        sx={{
          px: 1.75,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: sidebarColors.accent,
            color: sidebarColors.brandDark,
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          SA
        </Avatar>
        <Box>
          <Typography fontSize={12} fontWeight={700}>
            Sunil Admin
          </Typography>
          <Typography fontSize={10} color="rgba(255,255,255,0.42)">
            System Administrator
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1, pb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => router.push(routes.login)}
            sx={{
              borderRadius: 2,
              color: "rgba(255,255,255,0.7)",
              "& .MuiListItemIcon-root": { color: "inherit" },
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.07)",
                color: "white",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Sign out"
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}
