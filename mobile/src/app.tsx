import React from 'react';
import { SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, StyleSheet, Alert } from 'react-native';
import { apiClient, BusResponse, RouteResponse, TripResponse, BookingResponse } from './services/api';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { SeatSelectionScreen } from './screens/SeatSelectionScreen';
import { TicketScreen } from './screens/TicketScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ContributeScreen } from './screens/ContributeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { BottomNav } from './components/BottomNav';
import { colors } from './styles/colors';

export type Tab = 'home' | 'search' | 'seats' | 'ticket' | 'profile' | 'contribute' | 'login';

export type SearchResult = {
  trip: TripResponse;
  route: RouteResponse;
  bus: BusResponse;
  departure: string;
  arrival: string;
  fare: number;
};

const sampleRoutes: RouteResponse[] = [
  {
    id: 1,
    origin: 'Matara',
    destination: 'Colombo',
    province_origin: 'Southern Province',
    province_destination: 'Western Province',
    estimated_minutes: 165,
  },
  {
    id: 2,
    origin: 'Galle',
    destination: 'Kandy',
    province_origin: 'Southern Province',
    province_destination: 'Central Province',
    estimated_minutes: 290,
  },
];

const sampleBuses: BusResponse[] = [
  {
    id: 1,
    registration_no: 'NB-2241',
    operator_name: 'Kapila Transport',
    operator_phone: '0771234567',
    bus_type: 'ac_express',
    total_seats: 48,
    status: 'active',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    registration_no: 'CP-1187',
    operator_name: 'South Lanka Bus',
    operator_phone: '0714567890',
    bus_type: 'semi_luxury',
    total_seats: 52,
    status: 'active',
    created_at: new Date().toISOString(),
  },
];

const sampleTrips: TripResponse[] = [
  { id: 1, schedule_id: 1, trip_date: '2026-04-27', available_seats: 8, status: 'scheduled', created_at: new Date().toISOString() },
  { id: 2, schedule_id: 2, trip_date: '2026-04-27', available_seats: 22, status: 'scheduled', created_at: new Date().toISOString() },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function buildResults(routeList: RouteResponse[], busList: BusResponse[], tripList: TripResponse[]): SearchResult[] {
  const sourceTrips = tripList.length ? tripList : sampleTrips;
  const sourceRoutes = routeList.length ? routeList : sampleRoutes;
  const sourceBuses = busList.length ? busList : sampleBuses;
  return sourceTrips.slice(0, 8).map((trip, index) => {
    const route = sourceRoutes[index % sourceRoutes.length];
    const bus = sourceBuses[index % sourceBuses.length];
    const fare = bus.bus_type.includes('AC') ? 450 : 320;
    const startHour = 6 + index;
    const minutes = route.estimated_minutes || 165;
    const arrivalHour = startHour + Math.floor(minutes / 60);
    const arrivalMinute = minutes % 60;
    return {
      trip,
      route,
      bus,
      fare,
      departure: `${String(startHour).padStart(2, '0')}:${index % 2 ? '15' : '30'}`,
      arrival: `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`,
    };
  });
}

function App() {
  const [tab, setTab] = React.useState<Tab>('home');
  const [origin, setOrigin] = React.useState('Matara');
  const [destination, setDestination] = React.useState('Colombo');
  const [tripDate, setTripDate] = React.useState(todayIso());
  const [token, setToken] = React.useState('');
  const [routes, setRoutes] = React.useState<RouteResponse[]>(sampleRoutes);
  const [buses, setBuses] = React.useState<BusResponse[]>(sampleBuses);
  const [trips, setTrips] = React.useState<TripResponse[]>(sampleTrips);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedResult, setSelectedResult] = React.useState<SearchResult | null>(null);
  const [selectedSeats, setSelectedSeats] = React.useState<string[]>(['04', '08']);
  const [bookingRef, setBookingRef] = React.useState('BM-20470');
  const [loading, setLoading] = React.useState(false);
  const [apiNote, setApiNote] = React.useState('Using local sample data until the backend responds.');
  const [bookings, setBookings] = React.useState<BookingResponse[]>([]);
  const [loginUsername, setLoginUsername] = React.useState('demo');
  const [loginPassword, setLoginPassword] = React.useState('password');
  const [loginLoading, setLoginLoading] = React.useState(false);

  const activeResult = selectedResult || results[0] || buildResults(sampleRoutes, sampleBuses, sampleTrips)[0];
  const totalFare = selectedSeats.length * activeResult.fare;

  React.useEffect(() => {
    void loadHomeData();
    if (token) {
      apiClient.setToken(token);
    }
  }, [token]);

  async function loadHomeData() {
    try {
      const [routeData, busData, tripData] = await Promise.all([
        apiClient.searchRoutes(origin),
        apiClient.searchBuses(origin),
        apiClient.searchTrips(tripDate),
      ]);
      setRoutes(routeData?.items || sampleRoutes);
      setBuses(busData?.items || sampleBuses);
      setTrips(tripData?.items || sampleTrips);
      setApiNote('✅ Connected to backend');
    } catch (error) {
      setApiNote('📱 Using sample data');
    }
  }

  async function searchTrips() {
    setLoading(true);
    try {
      const [routeData, busData, tripData] = await Promise.all([
        apiClient.searchRoutes(`${origin} ${destination}`),
        apiClient.searchBuses(origin),
        apiClient.searchTrips(tripDate),
      ]);
      const nextRoutes = routeData?.items || routes;
      const nextBuses = busData?.items || buses;
      const nextTrips = tripData?.items || trips;
      const composed = buildResults(nextRoutes, nextBuses, nextTrips);
      setResults(composed);
      setSelectedResult(composed[0] || null);
      setTab('search');
    } catch (error) {
      const composed = buildResults(routes, buses, trips);
      setResults(composed);
      setSelectedResult(composed[0] || null);
      setTab('search');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin() {
    setLoginLoading(true);
    try {
      const tokenData = await apiClient.login(loginUsername, loginPassword);
      apiClient.setToken(tokenData.access_token);
      setToken(tokenData.access_token);
      setTab('home');
      Alert.alert('✅ Logged in successfully!');
    } catch (error) {
      Alert.alert(`❌ Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoginLoading(false);
    }
  }

  async function createBooking() {
    if (!token.trim()) {
      Alert.alert('Please log in first');
      setTab('login');
      return;
    }
    setLoading(true);
    try {
      const booking = await apiClient.createBooking({
        trip_id: activeResult.trip.id,
        seat_ids: [],
        total_fare: totalFare,
      });
      setBookingRef(booking.booking_ref);
      setTab('ticket');
      Alert.alert(`✅ Booking created: ${booking.booking_ref}`);
    } catch (error) {
      Alert.alert(`❌ ${error instanceof Error ? error.message : 'Booking failed'}`);
    } finally {
      setLoading(false);
    }
  }

  async function loadBookings() {
    if (!token.trim()) {
      Alert.alert('Please log in first');
      setTab('login');
      return;
    }
    setLoading(true);
    try {
      const myBookings = await apiClient.listMyBookings();
      setBookings(myBookings);
    } catch (error) {
      Alert.alert(`❌ ${error instanceof Error ? error.message : 'Could not load bookings'}`);
    } finally {
      setLoading(false);
    }
  }

  async function submitContribution(payload: Record<string, string>) {
    if (!token.trim()) {
      Alert.alert('Please log in first');
      setTab('login');
      return;
    }
    setLoading(true);
    try {
      const type = (payload.type as any) || 'update_bus_info';
      await apiClient.submitContribution({
        type,
        payload,
        notes: payload.description || undefined,
      });
      Alert.alert('✅ Contribution submitted for review');
    } catch (error) {
      Alert.alert(`❌ ${error instanceof Error ? error.message : 'Submission failed'}`);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    apiClient.clearToken();
    setTab('home');
    Alert.alert('👋 Logged out');
  }

  const screenProps = {
    origin,
    destination,
    tripDate,
    token,
    routes,
    buses,
    trips,
    results,
    selectedResult,
    selectedSeats,
    bookingRef,
    loading,
    apiNote,
    bookings,
    activeResult,
    totalFare,
    loginUsername,
    loginPassword,
    loginLoading,
  };

  const screenCallbacks = {
    setOrigin,
    setDestination,
    setTripDate,
    setToken,
    setLoginUsername,
    setLoginPassword,
    setSelectedSeats,
    setTab,
    searchTrips,
    handleLogin,
    createBooking,
    loadBookings,
    submitContribution,
    handleLogout,
    selectBus: (result: SearchResult) => {
      setSelectedResult(result);
      setTab('seats');
    },
    confirmSeats: () => setTab('ticket'),
    backToSearch: () => setTab('search'),
    backToSeats: () => setTab('seats'),
  };

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="light-content" backgroundColor={colors.brandDark} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.app}>
        {tab === 'login' && <LoginScreen {...screenProps} {...screenCallbacks} onBack={() => setTab('home')} />}
        {tab === 'home' && <HomeScreen {...screenProps} {...screenCallbacks} isLoggedIn={!!token} />}
        {tab === 'search' && <SearchScreen {...screenProps} {...screenCallbacks} />}
        {tab === 'seats' && activeResult && <SeatSelectionScreen {...screenProps} {...screenCallbacks} />}
        {tab === 'ticket' && activeResult && <TicketScreen {...screenProps} {...screenCallbacks} />}
        {tab === 'profile' && <ProfileScreen {...screenProps} {...screenCallbacks} isLoggedIn={!!token} />}
        {tab === 'contribute' && <ContributeScreen {...screenProps} {...screenCallbacks} />}
        <BottomNav current={tab} onChange={setTab} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: colors.bg },
});

export default App;
