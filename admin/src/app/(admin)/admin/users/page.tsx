"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getUsers, suspendUser } from "@/lib/services/users";
import type { User } from "@/lib/services/users";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsers(100);
        setUsers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSuspend = async (id: string) => {
    try {
      await suspendUser(id);
      // Refresh list
      const data = await getUsers(100);
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend user");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            User Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            Registered passengers and admin accounts
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: colors.brand }}>
          Add Admin
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {["User", "Email", "Phone", "Role", "Bookings", "Joined", "Status", "Actions"].map((h) => (
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
                : users.map((user) => (
                    <Box key={user.id} component="tr" sx={{ "&:hover td": { bgcolor: colors.bg } }}>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}`, fontWeight: 600 }}>
                        {user.name}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {user.email}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {user.phone}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        <Chip
                          label={user.role === "admin" ? "Admin" : "User"}
                          size="small"
                          color={user.role === "admin" ? "primary" : "default"}
                        />
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {user.bookings_count}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {user.joined_date}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        <Chip
                          label={user.status === "active" ? "Active" : "Suspended"}
                          size="small"
                          color={user.status === "active" ? "success" : "error"}
                        />
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        <Button size="small" sx={{ color: colors.brandMid }}>View</Button>
                        <Button
                          size="small"
                          sx={{ color: colors.red }}
                          onClick={() => handleSuspend(user.id)}
                        >
                          {user.status === "active" ? "Suspend" : "Activate"}
                        </Button>
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
