"use client";

import React from "react";
import { Box, Button, Paper, Stack, Switch, TextField, Typography } from "@mui/material";

export default function SettingsPage() {
  return (
    <Stack gap={2.5} maxWidth={720}>
      <Box>
        <Typography variant="h5" fontWeight={900} color="#111B16">
          Settings
        </Typography>
        <Typography fontSize={13} color="#8FA89B">
          Admin profile and portal preferences
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Typography fontWeight={800} mb={2}>
          Profile
        </Typography>
        <Stack gap={2}>
          <TextField label="Name" defaultValue="Sunil Admin" />
          <TextField label="Email" defaultValue="sunil@busmate.lk" />
          <Button variant="contained" sx={{ alignSelf: "flex-start" }}>
            Save profile
          </Button>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 2, border: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Typography fontWeight={800} mb={1.5}>
          Operations
        </Typography>
        <Stack gap={1.5}>
          {["Email booking alerts", "Contribution review reminders", "Daily revenue digest"].map(
            (label) => (
              <Stack
                key={label}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography color="#4A6055">{label}</Typography>
                <Switch defaultChecked />
              </Stack>
            ),
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
