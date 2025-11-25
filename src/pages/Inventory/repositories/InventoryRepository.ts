import type {
    Product,
    CreateProductRequest,
    UpdateProductRequest,
    Category,
    CreateCategoryRequest,
    CategoryResponse,
    Brand,
    CreateBrandRequest,
    BrandResponse,
    Tag,
    CreateTagRequest,
    TagResponse
} from '../types/types';
import axiosInstance from '../../../api/axiosInstance';

export const InventoryRepository = {
    getProducts: async (): Promise<Product[]> => {
        const response = await axiosInstance.get<{ products: Product[] }>('/api/v1/products');
        return response.data.products;
    },

    getProductById: async (id: string): Promise<Product> => {
        const response = await axiosInstance.get<{ product: Product }>(`/api/v1/products/${id}`);
        return response.data.product;
    },

    createProduct: async (data: CreateProductRequest): Promise<Product> => {
        const response = await axiosInstance.post<{ product: Product }>('/api/v1/products', data);
        return response.data.product;
    },

    updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await axiosInstance.put<{ product: Product }>(`/api/v1/products/${id}`, data);
        return response.data.product;
    },

    uploadProductImage: async (productId: string, file: File): Promise<{ imageUrl: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post<{ imageUrl: string }>(`/api/v1/products/${productId}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const response = await axiosInstance.get<CategoryResponse>('/api/v1/catalog/categories');
        return response.data.categories;
    },

    createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
        const response = await axiosInstance.post<{ category: Category }>('/api/v1/catalog/categories', data);
        return response.data.category;
    },

    getBrands: async (): Promise<Brand[]> => {
        const response = await axiosInstance.get<BrandResponse>('/api/v1/catalog/brands');
        return response.data.brands;
    },

    createBrand: async (data: CreateBrandRequest): Promise<Brand> => {
        const response = await axiosInstance.post<{ brand: Brand }>('/api/v1/catalog/brands', data);
        return response.data.brand;
    },

    getTags: async (): Promise<Tag[]> => {
        const response = await axiosInstance.get<TagResponse>('/api/v1/catalog/tags');
        return response.data.tags;
    },

    createTag: async (data: CreateTagRequest): Promise<Tag> => {
        const response = await axiosInstance.post<{ tag: Tag }>('/api/v1/catalog/tags', data);
        return response.data.tag;
    }
};
