import type { AuthProvider } from '@refinedev/core';
import { notification } from 'antd';
import axios from 'axios';

import { disableAutoLogin, enableAutoLogin } from './hooks';

export const TOKEN_KEY = 'o4r-auth';
export const PARTNER_ID = 'o4r-user-id';

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.get(
        `https://api.outfit4rent.online/auth/partners/${email}/${password}`,
      );

      if (response.data.statusCode === 'OK') {
        const { token, id } = response.data.data;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(PARTNER_ID, id.toString());

        enableAutoLogin();
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
    const partnerId = localStorage.getItem(PARTNER_ID);

    if (!token || !partnerId) {
      return null;
    }

    try {
      const response = await axios.get(
        `https://api.outfit4rent.online/partners/${partnerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.statusCode === 'OK') {
        const { id, name, email, address, phone } = response.data.data;
        return {
          id,
          name,
          email,
          address,
          phone,
          avatar: 'https://i.pravatar.cc/150', // You can replace this with an actual avatar if available
        };
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('Error fetching partner details:', error);
      return null;
    }
  },
};
