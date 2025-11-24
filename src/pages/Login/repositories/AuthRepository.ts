import axiosInstance from '../../../api/axiosInstance';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '../types/types';

export const AuthRepository = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>(
            '/api/v1/users/login',
            credentials
        );
        return response.data;
    },

    refreshToken: async (token: string): Promise<RefreshTokenResponse> => {
        const response = await axiosInstance.post<RefreshTokenResponse>(
            '/api/v1/users/refresh-token',
            {}, // Empty body as per curl request
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    },
};
