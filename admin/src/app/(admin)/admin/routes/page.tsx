"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "@/lib/services/routes";
import type { Route, CreateRoutePayload } from "@/lib/services/routes";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  brandLight: "#E6F5EE",
  accent: "#F5A623",
  bg: "#F3F7F5",
  surface2: "#EEF3F0",
  text: "#111B16",
  text2: "#4A6055",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
  redLight: "#FCEAEA",
};

function getInitialFormData(initialData?: Route): CreateRoutePayload {
  if (!initialData) {
    return {
      route_code: "",
      origin: "",
      destination: "",
      distance_km: 0,
      status: "active",
    };
  }

  return {
    route_code: initialData.route_code,
    origin: initialData.origin,
    destination: initialData.destination,
    distance_km: Number.isFinite(initialData.distance_km) ? initialData.distance_km : 0,
    status: initialData.status,
  };
}

function RouteForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoutePayload) => Promise<void>;
  isLoading: boolean;
  initialData?: Route;
}) {
  const [formData, setFormData] = useState<CreateRoutePayload>(() =>
    getInitialFormData(initialData)
  );

  const handleSubmit = async () => {
    await onSubmit(formData);
    setFormData({
      route_code: "",
      origin: "",
      destination: "",
      distance_km: 0,
      status: "active",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Route" : "Add New Route"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Route Code"
          value={formData.route_code}
          onChange={(e) => setFormData({ ...formData, route_code: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          label="Origin"
          value={formData.origin}
          onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          label="Destination"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          type="number"
          label="Distance (km)"
          value={Number.isFinite(formData.distance_km) ? formData.distance_km : 0}
          onChange={(e) =>
            setFormData({
              ...formData,
              distance_km: e.target.value === "" ? 0 : Number(e.target.value),
            })
          }
          sx={{ mb: 1.5 }}
        />
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={formData.status}
            label="Status"
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "active" | "inactive",
              })
            }
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoutes = async () => {
    try {
      setIsLoading(true);
      const data = await getRoutes(100);
      setRoutes(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load routes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRoutes();
  }, []);

  const filteredRoutes = routes.filter((route) => {
    const routeCode = route.route_code || "";
    const origin = route.origin || "";
    const destination = route.destination || "";
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      routeCode.toLowerCase().includes(normalizedSearch) ||
      origin.toLowerCase().includes(normalizedSearch) ||
      destination.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "all" || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddRoute = async (data: CreateRoutePayload) => {
    try {
      setIsSubmitting(true);
      await createRoute(data);
      setOpenDialog(false);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create route");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRoute = async (data: CreateRoutePayload) => {
    if (!selectedRoute) return;
    try {
      setIsSubmitting(true);
      await updateRoute(selectedRoute.id, data);
      setOpenDialog(false);
      setSelectedRoute(undefined);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update route");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      await deleteRoute(id);
      await fetchRoutes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete route");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800} color={colors.text}>
            Route Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            Manage all highway bus routes in the system
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<CloudDownloadIcon />}
            sx={{
              borderColor: colors.border,
              color: colors.text2,
              borderRadius: 1,
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ bgcolor: colors.brand, borderRadius: 1 }}
            onClick={() => {
              setSelectedRoute(undefined);
              setOpenDialog(true);
            }}
          >
            Add Route
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search routes…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: colors.text3 }} />,
          }}
          sx={{ minWidth: 240 }}
        />
        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </Box>

      {/* Routes Table */}
      <Paper elevation={0} sx={{ border: `1px solid ${colors.border}`, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <Box component="thead">
              <Box component="tr" sx={{ bgcolor: colors.bg }}>
                {[
                  "Route Code",
                  "Origin",
                  "Destination",
                  "Distance",
                  "Active Buses",
                  "Avg. Fare",
                  "Status",
                  "Actions",
                ].map((header) => (
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
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Box key={i} component="tr">
                      {Array(8)
                        .fill(0)
                        .map((_, j) => (
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
              ) : filteredRoutes.length === 0 ? (
                <Box component="tr">
                  <Box
                    component="td"
                    colSpan={8}
                    sx={{
                      textAlign: "center",
                      py: 3,
                      color: colors.text3,
                    }}
                  >
                    No routes found
                  </Box>
                </Box>
              ) : (
                filteredRoutes.map((route) => (
                  <Box
                    key={route.id}
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
                      {route.route_code}
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
                      {route.origin}
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
                      {route.destination}
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
                      {route.distance_km} km
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
                      {route.active_buses}
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
                      Rs. {route.avg_fare}
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
                            route.status === "active"
                              ? colors.brandLight
                              : colors.surface2,
                          color:
                            route.status === "active"
                              ? colors.brand
                              : colors.text3,
                        }}
                      >
                        {route.status === "active" ? "Active" : "Inactive"}
                      </Box>
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 2.25,
                        py: 1.35,
                        borderBottom: `1px solid ${colors.border}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        sx={{ color: colors.brandMid, minWidth: 0, px: 0.75 }}
                        onClick={() => {
                          setSelectedRoute(route);
                          setOpenDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DeleteIcon />}
                        sx={{ color: colors.red, minWidth: 0, px: 0.75 }}
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </Paper>

      {openDialog && (
        <RouteForm
          key={selectedRoute?.id || "new-route"}
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedRoute(undefined);
          }}
          onSubmit={selectedRoute ? handleEditRoute : handleAddRoute}
          isLoading={isSubmitting}
          initialData={selectedRoute}
        />
      )}
    </Box>
  );
}
