import { atomWithStorage } from 'jotai/utils';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
    [key: string]: unknown;
  } | null;
  lastChecked: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  lastChecked: null,
};

// Use atomWithStorage to persist auth state in localStorage
// This allows the app to "remember" the user even when offline
export const authAtom = atomWithStorage<AuthState>('fi-tracker-auth', initialState);
