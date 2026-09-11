import type { AuthLoginRequest, AuthTokenResponse } from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export const authApi = {
  login: (body: AuthLoginRequest) =>
    apiClient.post<AuthTokenResponse>(ENDPOINTS.auth.login, body),
};
