"use client";

import { useEffect, useState } from "react";
import { Box, Paper, Typography, Skeleton, Alert, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getPricings } from "@/lib/services/pricing";
import type { Pricing } from "@/lib/services/pricing";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  bg: "#F3F7F5",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
};

export default function PricingPage() {
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPricings(100);
        setPricings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load pricing");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            Pricing Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            Set and update fares for routes and bus types
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: colors.brand }}>
          Set Price
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2 }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {["Route", "Bus Type", "Base Fare", "Surcharge", "Total Fare", "Last Updated", "Actions"].map((h) => (
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
                        {Array(7)
                          .fill(0)
                          .map((_, j) => (
                            <Box key={j} component="td" sx={{ p: 1.5 }}>
                              <Skeleton />
                            </Box>
                          ))}
                      </Box>
                    ))
                : pricings.map((pricing) => (
                    <Box key={pricing.id} component="tr" sx={{ "&:hover td": { bgcolor: colors.bg } }}>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {pricing.route_name}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {pricing.bus_type}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        Rs. {pricing.base_fare}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        Rs. {pricing.surcharge}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}`, fontWeight: 600 }}>
                        Rs. {pricing.total_fare}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        {pricing.last_updated}
                      </Box>
                      <Box component="td" sx={{ px: 2, py: 1.35, borderBottom: `1px solid ${colors.border}` }}>
                        <Button size="small" sx={{ color: colors.brandMid }}>Edit</Button>
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
