import { render, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import type { DriverRoute } from '@/types/routes';

const mockRoute: DriverRoute = {
  id: 'route-1',
  organizationId: 'org-1',
  driverId: 'drv-1',
  vehicleId: 'veh-1',
  status: 'ASSIGNED',
  plannedDate: '2026-05-20',
  totalDistanceMeters: 5000,
  totalDurationSeconds: 3600,
  capacityUsedKg: 10,
  startedAt: null,
  finishedAt: null,
  createdAt: '2026-05-20T08:00:00.000Z',
  updatedAt: '2026-05-20T08:00:00.000Z',
  driver: { id: 'drv-1', name: 'Ola Nordmann', phone: null },
  vehicle: {
    id: 'veh-1',
    name: 'Varebil 1',
    startAddress: 'Depot',
    endAddress: 'Depot',
    startLatitude: 59.91,
    startLongitude: 10.75,
    endLatitude: 59.91,
    endLongitude: 10.75,
  },
  stops: [
    {
      id: 'stop-1',
      stopOrder: 1,
      status: 'PENDING',
      estimatedArrival: '2026-05-20T10:00:00.000Z',
      actualArrival: null,
      delivery: {
        id: 'del-1',
        customerName: 'Kunde AS',
        address: 'Karl Johans gate 1',
        phone: null,
        latitude: 59.91,
        longitude: 10.75,
        weightKg: 5,
        volumeM3: null,
        notes: null,
        status: 'ASSIGNED',
        priority: 'NORMAL',
      },
    },
  ],
};

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'DRIVER', name: 'Ola', organizationId: 'org-1' },
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: [mockRoute],
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
    error: null,
  }),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

jest.mock('@/components/StaffWebNotice', () => () => null);

describe('HomeScreen', () => {
  it('renders route and next stop for driver', () => {
    render(<HomeScreen />);
    expect(screen.getByText(/Kunde AS/)).toBeTruthy();
  });
});
