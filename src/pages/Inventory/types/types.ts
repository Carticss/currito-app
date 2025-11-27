export interface Category {
    _id: string;
    organizationId: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Brand {
    _id: string;
    organizationId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Tag {
    _id: string;
    organizationId: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Product {
    _id: string;
    organizationId: string;
    name: string;
    description: string;
    sku: string;
    priceInCents: number;
    photoUrl: string;
    available: boolean;
    categoryId: Category | null;
    brandId: Brand | null;
    tags: (Tag | null)[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    sku?: string;
    priceInCents: number;
    available: boolean;
    categoryId: string | null;
    brandId: string | null;
    tagIds: string[];
    photoUrl?: string;
}

export type UpdateProductRequest = CreateProductRequest;

export interface CreateCategoryRequest {
    name: string;
    description?: string;
}

export interface CreateBrandRequest {
    name: string;
}

export interface CreateTagRequest {
    name: string;
    description?: string;
}

export interface CategoryResponse {
    categories: Category[];
}

export interface BrandResponse {
    brands: Brand[];
}

export interface TagResponse {
    tags: Tag[];
}

export interface ProductListResponse {
    products: Product[];
}
