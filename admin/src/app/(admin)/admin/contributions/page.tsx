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
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { getContributions, approveContribution, rejectContribution } from "@/lib/services/contributions";
import type { Contribution } from "@/lib/services/contributions";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
};

const typeColors: Record<string, { bg: string; text: string }> = {
  new_route: { bg: "#EFF4FF", text: "#2563EB" },
  new_bus: { bg: "#FEF3DC", text: "#8A6010" },
  update: { bg: "#E6F5EE", text: "#1A6B45" },
};

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getContributions(100, 0, "pending");
      setContributions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load contributions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveContribution(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectContribution(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject");
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color={colors.text}>
          Community Contributions
        </Typography>
        <Typography fontSize={13} color={colors.text3} mt={0.25}>
          Review and approve passenger-submitted route updates
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography fontWeight={700}>
            Pending Review ({contributions.filter((c) => c.status === "pending").length})
          </Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {["Type", "Submitted By", "Details", "Submitted At", "Notes", "Actions"].map((h) => (
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
                ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Box key={i} component="tr">
                        {Array(6)
                          .fill(0)
                          .map((_, j) => (
                            <Box key={j} component="td" sx={{ p: 1.5 }}>
                              <Skeleton />
                            </Box>
                          ))}
                      </Box>
                    ))
                : contributions.map((contrib) => {
                    const typeColor = typeColors[contrib.type] || { bg: colors.bg, text: colors.text3 };
                    return (
                      <Box key={contrib.id} component="tr" sx={{ "&:hover td": { bgcolor: colors.bg } }}>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          <Chip
                            label={contrib.type.replace(/_/g, " ")}
                            size="small"
                            sx={{
                              bgcolor: typeColor.bg,
                              color: typeColor.text,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          {contrib.submitted_by}
                        </Box>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          {contrib.details}
                        </Box>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          {contrib.submitted_at}
                        </Box>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          {contrib.notes}
                        </Box>
                        <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                          <Button size="small" startIcon={<CheckIcon />} sx={{ color: colors.brand }} onClick={() => handleApprove(contrib.id)}>Approve</Button>
                          <Button size="small" startIcon={<CloseIcon />} sx={{ color: colors.red }} onClick={() => handleReject(contrib.id)}>Reject</Button>
                        </Box>
                      </Box>
                    );
                  })}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
