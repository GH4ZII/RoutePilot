import { fireEvent, render, screen } from '@testing-library/react-native';
import LoginScreen from './login';

const mockLogin = jest.fn();

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('@/lib/remember-login', () => ({
  getRememberedLogin: jest.fn().mockResolvedValue(null),
  getRememberMeEnabled: jest.fn().mockResolvedValue(false),
}));

describe('LoginScreen', () => {
  it('shows validation error for short password', async () => {
    render(<LoginScreen />);

    fireEvent.changeText(
      screen.getByPlaceholderText('min-bedrift'),
      'test-org',
    );
    fireEvent.changeText(screen.getByPlaceholderText('din@epost.no'), 'a@b.no');
    fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'short');
    fireEvent.press(screen.getByText('Logg inn'));

    expect(await screen.findByText(/minst 8 tegn/i)).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
