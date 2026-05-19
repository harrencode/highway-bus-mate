"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Skeleton,
  Alert,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getBuses, createBus, deleteBus } from "@/lib/services/buses";
import { getRoutes } from "@/lib/services/routes";
import type { Bus, CreateBusPayload } from "@/lib/services/buses";
import type { Route } from "@/lib/services/routes";

const colors = {
  brand: "#1A6B45",
  brandMid: "#2D9E6B",
  brandLight: "#E6F5EE",
  text: "#111B16",
  text3: "#8FA89B",
  border: "rgba(0,0,0,0.08)",
  red: "#D94040",
};

function getInitialFormData(initialData?: Bus): CreateBusPayload {
  if (!initialData) {
    return {
      bus_number: "",
      bus_type: "Normal",
      route_id: "",
      operator_name: "",
      phone: "",
      total_seats: 45,
    };
  }

  return {
    bus_number: initialData.bus_number,
    bus_type: initialData.bus_type,
    route_id: initialData.route_id,
    operator_name: initialData.operator_name,
    phone: initialData.phone,
    total_seats: Number.isFinite(initialData.total_seats) ? initialData.total_seats : 45,
  };
}

function BusForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  routes,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBusPayload) => Promise<void>;
  isLoading: boolean;
  initialData?: Bus;
  routes: Route[];
}) {
  const [formData, setFormData] = useState<CreateBusPayload>(() =>
    getInitialFormData(initialData)
  );

  const handleSubmit = async () => {
    await onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? "Edit Bus" : "Add New Bus"}</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          label="Bus Number"
          value={formData.bus_number}
          onChange={(e) => setFormData({ ...formData, bus_number: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <FormControl fullWidth sx={{ mb: 1.5 }}>
          <InputLabel>Bus Type</InputLabel>
          <Select
            value={formData.bus_type}
            label="Bus Type"
            onChange={(e) => setFormData({ ...formData, bus_type: e.target.value })}
          >
            <MenuItem value="AC">AC Express</MenuItem>
            <MenuItem value="Semi-Luxury">Semi-Luxury</MenuItem>
            <MenuItem value="Luxury">Luxury</MenuItem>
            <MenuItem value="Super Luxury">Super Luxury</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 1.5 }}>
          <InputLabel>Route</InputLabel>
          <Select
            value={formData.route_id}
            label="Route"
            onChange={(e) => setFormData({ ...formData, route_id: e.target.value })}
          >
            {routes.map((route) => (
              <MenuItem key={route.id} value={route.id}>
                {route.origin} → {route.destination}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Operator Name"
          value={formData.operator_name}
          onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          label="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          type="number"
          label="Total Seats"
          value={Number.isFinite(formData.total_seats) ? formData.total_seats : 1}
          onChange={(e) =>
            setFormData({
              ...formData,
              total_seats: e.target.value === "" ? 1 : Number(e.target.value),
            })
          }
        />
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

export default function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [busesData, routesData] = await Promise.all([getBuses(100), getRoutes(100)]);
      setBuses(busesData || []);
      setRoutes(routesData || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAddBus = async (data: CreateBusPayload) => {
    try {
      setIsSubmitting(true);
      await createBus(data);
      setOpenDialog(false);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bus");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBus = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bus?")) return;
    try {
      await deleteBus(id);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete bus");
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
            Bus Management
          </Typography>
          <Typography fontSize={13} color={colors.text3} mt={0.25}>
            All registered buses in the system
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ bgcolor: colors.brand }}
          onClick={() => {
            setSelectedBus(undefined);
            setOpenDialog(true);
          }}
        >
          Add Bus
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => (
                <Box key={i} sx={{ flex: "1 1 calc(33.333% - 16px)", minWidth: "280px" }}>
                  <Card sx={{ border: `1px solid ${colors.border}` }}>
                    <CardContent>
                      <Skeleton width="100%" height={40} sx={{ mb: 1 }} />
                      <Skeleton width="80%" height={20} />
                    </CardContent>
                  </Card>
                </Box>
              ))
          : buses.map((bus) => (
              <Box key={bus.id} sx={{ flex: "1 1 calc(33.333% - 16px)", minWidth: "280px" }}>
                <Card
                  sx={{
                    border: `1px solid ${colors.border}`,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: `1px solid ${colors.border}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box>
                      <Typography fontWeight={700} fontSize={16}>
                        {bus.bus_number}
                      </Typography>
                      <Typography fontSize={11} color={colors.text3}>
                        {bus.bus_type}
                      </Typography>
                    </Box>
                    <Chip
                      label={bus.status === "active" ? "Active" : "Inactive"}
                      size="small"
                      color={bus.status === "active" ? "success" : "default"}
                    />
                  </Box>
                  <CardContent sx={{ pt: 1.5 }}>
                    <Typography fontSize={12} color={colors.text3} sx={{ mb: 1 }}>
                      👤 {bus.operator_name}
                    </Typography>
                    <Typography fontSize={12} color={colors.text3} sx={{ mb: 1 }}>
                      📞 {bus.phone}
                    </Typography>
                    <Typography fontSize={12} color={colors.text3} sx={{ mb: 1 }}>
                      💺 {bus.total_seats} seats · {bus.available_seats} available
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.75, mt: 1.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        sx={{ flex: 1, fontSize: 11 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{ flex: 1, fontSize: 11 }}
                        onClick={() => handleDeleteBus(bus.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
            </Box>
          ))}
      </Box>
      {openDialog && (
        <BusForm
          key={selectedBus?.id || "new-bus"}
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedBus(undefined);
          }}
          onSubmit={handleAddBus}
          isLoading={isSubmitting}
          initialData={selectedBus}
          routes={routes}
        />
      )}
    </Box>
  );
}
