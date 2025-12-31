import axiosInstance from '../../../config/axiosInstance';

export interface OrganizationResponse {
    _id: string;
    name: string;
    description: string;
    logoUrl?: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    socialLinks: string[];
    status: string;
}

export const OrganizationRepository = {
    getOrganization: async (): Promise<OrganizationResponse> => {
        const response = await axiosInstance.get<OrganizationResponse>('/api/v1/organization');
        return response.data;
    }
};
