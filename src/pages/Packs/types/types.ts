export interface PackProduct {
    product: string;
    quantity: number;
}

export interface Pack {
    _id: string;
    organizationId: string;
    name: string;
    description?: string;
    priceInCents: number;
    photoUrls: string[];
    available: boolean;
    products: PackProduct[];
    createdAt: string;
    updatedAt: string;
}

export interface CreatePackProductRequest {
    productId: string;
    quantity: number;
}

export interface CreatePackRequest {
    name: string;
    description?: string;
    priceInCents: number;
    available: boolean;
    products: CreatePackProductRequest[];
}

export interface UpdatePackRequest {
    name?: string;
    description?: string;
    priceInCents?: number;
    available?: boolean;
    products?: CreatePackProductRequest[];
}

export interface PackResponse {
    pack: Pack;
}

export interface PacksListResponse {
    packs: Pack[];
}

export interface UploadImagesResponse {
    message: string;
    pack: Pack;
    imageUrls: string[];
}

export interface DeleteImageResponse {
    message: string;
    pack: Pack;
}

export interface DeletePackResponse {
    message: string;
}
