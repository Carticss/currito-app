import axiosInstance from '../../../config/axiosInstance';
import type {
    Pack,
    CreatePackRequest,
    UpdatePackRequest,
    PackResponse,
    PacksListResponse,
    UploadImagesResponse,
    DeleteImageResponse,
    DeletePackResponse
} from '../types/types';

export const PacksRepository = {
    getPacks: async (): Promise<Pack[]> => {
        const response = await axiosInstance.get<PacksListResponse>('/api/v1/packs');
        return response.data.packs;
    },

    getPackById: async (id: string): Promise<Pack> => {
        const response = await axiosInstance.get<PackResponse>(`/api/v1/packs/${id}`);
        return response.data.pack;
    },

    createPack: async (data: CreatePackRequest): Promise<Pack> => {
        const response = await axiosInstance.post<PackResponse>('/api/v1/packs', data);
        return response.data.pack;
    },

    updatePack: async (id: string, data: UpdatePackRequest): Promise<Pack> => {
        const response = await axiosInstance.put<PackResponse>(`/api/v1/packs/${id}`, data);
        return response.data.pack;
    },

    deletePack: async (id: string): Promise<DeletePackResponse> => {
        const response = await axiosInstance.delete<DeletePackResponse>(`/api/v1/packs/${id}`);
        return response.data;
    },

    uploadPackImages: async (packId: string, files: File[]): Promise<UploadImagesResponse> => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });
        const response = await axiosInstance.post<UploadImagesResponse>(
            `/api/v1/packs/${packId}/image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    deletePackImage: async (packId: string, imageUrl: string): Promise<DeleteImageResponse> => {
        const response = await axiosInstance.delete<DeleteImageResponse>(
            `/api/v1/packs/${packId}/image`,
            {
                data: { imageUrl },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }
};
