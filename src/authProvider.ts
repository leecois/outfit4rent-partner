import type { AuthProvider } from '@refinedev/core';
import { notification } from 'antd';
import axios from 'axios';

import { disableAutoLogin } from './hooks';

export const TOKEN_KEY = 'o4r-auth';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.get(
        `https://api.outfit4rent.online/auth/admin/${email}/${password}`,
      );

      if (response.data.statusCode === 'OK') {
        const { token } = response.data.data;
        localStorage.setItem(TOKEN_KEY, token);
        // enableAutoLogin();
        return {
          success: true,
          redirectTo: '/',
        };
      }
      throw new Error(response.data.message);
    } catch (error) {
      notification.error({
        message: 'Login failed',
      });
      return {
        success: false,
        error: {
          message: 'Login failed',
          name: 'Invalid email or password',
        },
      };
    }
  },
  register: async ({ email, password }) => {
    try {
      await authProvider.login({ email, password });
      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: {
          message: 'Register failed',
          name: 'Invalid email or password',
        },
      };
    }
  },
  updatePassword: async () => {
    notification.success({
      message: 'Updated Password',
      description: 'Password updated successfully',
    });
    return {
      success: true,
    };
  },
  forgotPassword: async ({ email }) => {
    notification.success({
      message: 'Reset Password',
      description: `Reset password link sent to "${email}"`,
    });
    return {
      success: true,
    };
  },
  logout: async () => {
    disableAutoLogin();
    localStorage.removeItem(TOKEN_KEY);
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      error: {
        message: 'Check failed',
        name: 'Token not found',
      },
      logout: true,
      redirectTo: '/login',
    };
  },
  getPermissions: async () => null,
  getIdentity: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      return null;
    }

    return {
      id: 1,
      name: 'Ackerman',
      avatar: 'https://i.pravatar.cc/150',
    };
  },
};
