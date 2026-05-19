import React from "react";
import { Box } from "@mui/material";
import { Sidebar } from "@/components/sidebar";
import { AdminTopbar } from "./admin/components/bus-admin-ui";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
      >
        <Sidebar />
        <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <AdminTopbar />
        <Box component="main" sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
