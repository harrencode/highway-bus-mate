"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { getNotifications, sendNotification } from "@/lib/services/notifications";
import type { Notification } from "@/lib/services/notifications";

const colors = {
  brand: "#1A6B45",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: "Announcement",
    title: "",
    message: "",
    target: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications(10);
        setNotifications(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSend = async () => {
    try {
      await sendNotification({
        type: formData.type,
        title: formData.title,
        message: formData.message,
        target_audience: formData.target,
      });
      setFormData({ type: "Announcement", title: "", message: "", target: "all" });
      // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} color={colors.text} mb={3}>
        Notification Management
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ flex: "1 1 60%", minWidth: "300px" }}>
          <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, p: 3 }}>
            <Typography fontWeight={600} mb={2}>Send New Notification</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <MenuItem value="Announcement">📢 Announcement</MenuItem>
                <MenuItem value="Route Update">🛣️ Route Update</MenuItem>
                <MenuItem value="Alert">⚠️ Alert</MenuItem>
                <MenuItem value="Booking">🎫 Booking Update</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Target Audience</InputLabel>
              <Select
                value={formData.target}
                label="Target Audience"
                onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              >
                <MenuItem value="all">All Passengers</MenuItem>
                <MenuItem value="pending">Passengers with upcoming bookings</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="outlined" startIcon={<ScheduleIcon />} sx={{ flex: 1 }}>
                Schedule
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                sx={{ flex: 2, bgcolor: colors.brand }}
                onClick={handleSend}
              >
                Send Now
              </Button>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: "1 1 35%", minWidth: "300px" }}>
          <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
            <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
              <Typography fontWeight={700}>Recent Notifications</Typography>
            </Box>
            <Box sx={{ p: 2, maxHeight: 400, overflow: "auto" }}>
              {notifications.map((notif) => (
                <Box key={notif.id} sx={{ mb: 1.5, pb: 1.5, borderBottom: `1px solid ${colors.border}` }}>
                  <Typography fontSize={13} fontWeight={600}>{notif.title}</Typography>
                  <Typography fontSize={11} color={colors.text3} mt={0.5}>
                    Sent to {notif.users_sent} users · {notif.created_at}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
