export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    isUserConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
    organizationId: string;
    __v: number;
}

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}