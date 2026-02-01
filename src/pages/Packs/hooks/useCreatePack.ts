import { useState, useEffect, useRef } from 'react';
import { PacksRepository } from '../repositories/PacksRepository';
import { InventoryRepository } from '../../Inventory/repositories/InventoryRepository';
import type { Pack, CreatePackRequest, CreatePackProductRequest } from '../types/types';
import type { Product } from '../../Inventory/types/types';

interface SelectedProduct {
    productId: string;
    productName: string;
    quantity: number;
}

export const useCreatePack = (onSuccess: () => void, packToEdit?: Pack | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Available products for selection
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [areProductsLoading, setAreProductsLoading] = useState(true);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [available, setAvailable] = useState(true);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

    // Image handling
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

    // Product selection
    const [selectedProductId, setSelectedProductId] = useState('');
    const [productQuantity, setProductQuantity] = useState(1);

    // Image cropper state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [isMultiCropperOpen, setIsMultiCropperOpen] = useState(false);
    const [tempImageSources, setTempImageSources] = useState<Array<{ id: string; src: string }>>([]);

    // Load products for selection
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await InventoryRepository.getProducts();
                setAvailableProducts(products);
            } catch (err) {
                console.error(err);
                setError("Error al cargar productos");
            } finally {
                setAreProductsLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (packToEdit && availableProducts.length > 0) {
            setName(packToEdit.name);
            setDescription(packToEdit.description || '');
            setPrice((packToEdit.priceInCents / 100).toString());
            setAvailable(packToEdit.available);
            setImagePreviews(packToEdit.photoUrls || []);
            setOriginalImageUrls(packToEdit.photoUrls || []);
            setDeletedImageUrls([]);

            // Map products - we need to find product names from available products
            const mappedProducts: SelectedProduct[] = packToEdit.products.map(p => {
                // Handle case where product might be populated or just an ID
                const productId = typeof p.product === 'object' && p.product !== null
                    ? (p.product as any)._id
                    : p.product;

                const product = availableProducts.find(ap => ap._id === productId);

                // If we have the populated product in the pack, use its name as fallback
                const fallbackName = typeof p.product === 'object' && p.product !== null
                    ? (p.product as any).name
                    : 'Producto desconocido';

                return {
                    productId: productId,
                    productName: product?.name || fallbackName,
                    quantity: p.quantity
                };
            });
            setSelectedProducts(mappedProducts);
        } else {
            resetForm();
        }
    }, [packToEdit, availableProducts]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setAvailable(true);
        setSelectedProducts([]);
        setImageFiles([]);
        setImagePreviews([]);
        setOriginalImageUrls([]);
        setDeletedImageUrls([]);
        setSelectedProductId('');
        setProductQuantity(1);
    };

    const handleAddProduct = () => {
        if (!selectedProductId) return;

        const existingIndex = selectedProducts.findIndex(p => p.productId === selectedProductId);
        if (existingIndex !== -1) {
            // Update quantity if product already exists
            const updated = [...selectedProducts];
            updated[existingIndex].quantity += productQuantity;
            setSelectedProducts(updated);
        } else {
            const product = availableProducts.find(p => p._id === selectedProductId);
            if (product) {
                setSelectedProducts(prev => [...prev, {
                    productId: selectedProductId,
                    productName: product.name,
                    quantity: productQuantity
                }]);
            }
        }
        setSelectedProductId('');
        setProductQuantity(1);
    };

    const handleAddProductById = (productId: string) => {
        const existingIndex = selectedProducts.findIndex(p => p.productId === productId);
        if (existingIndex !== -1) {
            // Update quantity if product already exists
            const updated = [...selectedProducts];
            updated[existingIndex].quantity += 1;
            setSelectedProducts(updated);
        } else {
            const product = availableProducts.find(p => p._id === productId);
            if (product) {
                setSelectedProducts(prev => [...prev, {
                    productId: productId,
                    productName: product.name,
                    quantity: 1
                }]);
            }
        }
    };

    const handleRemoveProduct = (productId: string) => {
        setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    };

    const handleUpdateProductQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setSelectedProducts(prev => prev.map(p =>
            p.productId === productId ? { ...p, quantity } : p
        ));
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImageSrc(reader.result as string);
                setIsCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImage: File) => {
        setImageFiles(prev => [...prev, croppedImage]);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(croppedImage);
        setIsCropperOpen(false);
        setTempImageSrc(null);
    };

    const handleCropperClose = () => {
        setIsCropperOpen(false);
        setTempImageSrc(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            const imageSources = files.map((file, index) => {
                return new Promise<{ id: string; src: string }>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            id: `${Date.now()}-${index}`,
                            src: reader.result as string
                        });
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imageSources).then(sources => {
                setTempImageSources(sources);
                setIsMultiCropperOpen(true);
            });
        }
    };

    const handleMultiCropComplete = (croppedImages: File[]) => {
        setImageFiles(prev => [...prev, ...croppedImages]);

        croppedImages.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setIsMultiCropperOpen(false);
        setTempImageSources([]);
    };

    const handleMultiCropperClose = () => {
        setIsMultiCropperOpen(false);
        setTempImageSources([]);
    };

    const handleRemoveImage = async (index: number) => {
        const imageUrl = imagePreviews[index];
        const isOriginalImage = originalImageUrls.includes(imageUrl);

        if (isOriginalImage) {
            // Mark for deletion on server
            setDeletedImageUrls(prev => [...prev, imageUrl]);
        } else {
            // Remove from local files
            const newFileIndex = imagePreviews.slice(0, index).filter(
                url => !originalImageUrls.includes(url)
            ).length;
            setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
        }

        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('El nombre del pack es requerido');
            return;
        }

        if (!price || parseFloat(price) <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }

        if (selectedProducts.length === 0) {
            setError('Debe agregar al menos un producto al pack');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const priceInCents = Math.round(parseFloat(price) * 100);
            const products: CreatePackProductRequest[] = selectedProducts.map(p => ({
                productId: p.productId,
                quantity: p.quantity
            }));

            let packId: string;

            if (packToEdit) {
                // Update existing pack
                const updateData = {
                    name,
                    description,
                    priceInCents,
                    available,
                    products
                };
                const updatedPack = await PacksRepository.updatePack(packToEdit._id, updateData);
                packId = updatedPack._id;

                // Delete removed images
                for (const imageUrl of deletedImageUrls) {
                    await PacksRepository.deletePackImage(packId, imageUrl);
                }
            } else {
                // Create new pack
                const createData: CreatePackRequest = {
                    name,
                    description,
                    priceInCents,
                    available,
                    products
                };
                const newPack = await PacksRepository.createPack(createData);
                packId = newPack._id;
            }

            // Upload new images
            if (imageFiles.length > 0) {
                await PacksRepository.uploadPackImages(packId, imageFiles);
            }

            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al guardar el pack');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formState: {
            name,
            setName,
            description,
            setDescription,
            price,
            setPrice,
            available,
            setAvailable,
            selectedProducts,
            selectedProductId,
            setSelectedProductId,
            productQuantity,
            setProductQuantity,
            imagePreviews
        },
        cropperState: {
            fileInputRef,
            isCropperOpen,
            tempImageSrc,
            isMultiCropperOpen,
            tempImageSources
        },
        auxData: {
            availableProducts,
            areProductsLoading
        },
        actions: {
            handleAddProduct,
            handleAddProductById,
            handleRemoveProduct,
            handleUpdateProductQuantity,
            handleFileClick,
            handleFileChange,
            handleFileMultipleChange,
            handleCropComplete,
            handleCropperClose,
            handleMultiCropComplete,
            handleMultiCropperClose,
            handleRemoveImage,
            handleSubmit,
            resetForm
        },
        uiState: {
            isLoading,
            error
        }
    };
};
