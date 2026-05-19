import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, Token, UserResponse } from '../services/api';

const TOKEN_KEY = '@busmate_token';
const REFRESH_TOKEN_KEY = '@busmate_refresh_token';
const USER_KEY = '@busmate_user';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserResponse | null;
  isLoading: boolean;
  isSignout: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  isLoggedIn: () => boolean;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(
    (prevState: AuthState, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            token: action.payload.token,
            refreshToken: action.payload.refreshToken,
            user: action.payload.user,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            token: action.payload.token,
            refreshToken: action.payload.refreshToken,
            user: action.payload.user,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            token: null,
            refreshToken: null,
            user: null,
          };
        case 'SIGN_UP':
          return {
            ...prevState,
            isSignout: false,
            token: action.payload.token,
            refreshToken: action.payload.refreshToken,
            user: action.payload.user,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      token: null,
      refreshToken: null,
      user: null,
    },
  );

  // Bootstrap async data when mounting.
  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      let refreshToken: string | null = null;
      let user: UserResponse | null = null;

      try {
        token = await AsyncStorage.getItem(TOKEN_KEY);
        refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
        const userJson = await AsyncStorage.getItem(USER_KEY);
        user = userJson ? JSON.parse(userJson) : null;

        if (token) {
          apiClient.setToken(token);
        }
      } catch (e) {
        // Restoring token failed
      }

      dispatch({
        type: 'RESTORE_TOKEN',
        payload: { token, refreshToken, user },
      });
    };

    bootstrapAsync();
  }, []);

  const authContext: AuthContextType = React.useMemo(
    () => ({
      ...state,
      login: async (username: string, password: string) => {
        try {
          const response = await apiClient.login(username, password);
          apiClient.setToken(response.access_token);
          
          // Optionally fetch user details
          // const user = await apiClient.getCurrentUser();
          
          await AsyncStorage.multiSet([
            [TOKEN_KEY, response.access_token],
            [REFRESH_TOKEN_KEY, response.refresh_token],
          ]);

          dispatch({
            type: 'SIGN_IN',
            payload: {
              token: response.access_token,
              refreshToken: response.refresh_token,
              user: null,
            },
          });
        } catch (e) {
          throw e;
        }
      },
      logout: async () => {
        try {
          await apiClient.logout();
        } catch (e) {
          // Ignore logout errors
        }

        apiClient.clearToken();
        await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);

        dispatch({ type: 'SIGN_OUT' });
      },
      refreshAuthToken: async () => {
        const refreshToken = state.refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await apiClient.refreshToken(refreshToken);
          apiClient.setToken(response.access_token);

          await AsyncStorage.setItem(TOKEN_KEY, response.access_token);
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);

          dispatch({
            type: 'SIGN_IN',
            payload: {
              token: response.access_token,
              refreshToken: response.refresh_token,
              user: state.user,
            },
          });
        } catch (e) {
          // If refresh fails, sign out
          apiClient.clearToken();
          await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
          dispatch({ type: 'SIGN_OUT' });
          throw e;
        }
      },
      isLoggedIn: () => !!state.token,
    }),
    [state],
  );

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
