import { useState, useEffect, useRef } from 'react';
import { InventoryRepository } from '../repositories/InventoryRepository';
import type { Category, Brand, Tag, CreateProductRequest, Product, UpdateProductRequest } from '../types/types';

export const useCreateProduct = (onSuccess: () => void, productToEdit?: Product | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [areAuxDataLoading, setAreAuxDataLoading] = useState(true);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sku, setSku] = useState('');
    const [price, setPrice] = useState('');
    const [available, setAvailable] = useState(true);
    const [categoryId, setCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [originalImageUrls, setOriginalImageUrls] = useState<string[]>([]);
    const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [newTagName, setNewTagName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [isCreatingBrand, setIsCreatingBrand] = useState(false);

    const [createdProductId, setCreatedProductId] = useState<string | null>(null);

    // Image cropper state
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isCropperOpen, setIsCropperOpen] = useState(false);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    const [isMultiCropperOpen, setIsMultiCropperOpen] = useState(false);
    const [tempImageSources, setTempImageSources] = useState<Array<{ id: string; src: string }>>([]);

    useEffect(() => {
        if (productToEdit) {
            setName(productToEdit.name);
            setDescription(productToEdit.description || '');
            setSku(productToEdit.sku || '');
            setPrice((productToEdit.priceInCents / 100).toString());
            setAvailable(productToEdit.available);
            setCategoryId(productToEdit.categoryId?._id || '');
            setBrandId(productToEdit.brandId?._id || '');
            setSelectedTagIds(productToEdit.tags.filter(t => t !== null).map(t => t._id));
            setImagePreview(productToEdit.photoUrl || null);
            setImagePreviews(productToEdit.photoUrls || []);
            setOriginalImageUrls(productToEdit.photoUrls || []);
            setDeletedImageUrls([]);
            setCreatedProductId(null);
        } else {
            setName('');
            setDescription('');
            setSku('');
            setPrice('');
            setAvailable(true);
            setCategoryId('');
            setBrandId('');
            setSelectedTagIds([]);
            setImagePreview(null);
            setImageFile(null);
            setImageFiles([]);
            setImagePreviews([]);
            setOriginalImageUrls([]);
            setDeletedImageUrls([]);
            setCreatedProductId(null);
        }
    }, [productToEdit]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, brs, tgs] = await Promise.all([
                    InventoryRepository.getCategories(),
                    InventoryRepository.getBrands(),
                    InventoryRepository.getTags()
                ]);
                setCategories(cats);
                setBrands(brs);
                setTags(tgs);
            } catch (err) {
                console.error(err);
                setError("Error al cargar datos auxiliares");
            } finally {
                setAreAuxDataLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCreateCategorySubmit = async () => {
        if (!newCategoryName) return;
        try {
            const newCategory = await InventoryRepository.createCategory({ name: newCategoryName });
            setCategories(prev => [...prev, newCategory]);
            setCategoryId(newCategory._id);
            setNewCategoryName('');
            setIsCreatingCategory(false);
        } catch (err) {
            console.error(err);
            setError("Error al crear categoría");
        }
    };

    const handleCreateBrandSubmit = async () => {
        if (!newBrandName) return;
        try {
            const newBrand = await InventoryRepository.createBrand({ name: newBrandName });
            setBrands(prev => [...prev, newBrand]);
            setBrandId(newBrand._id);
            setNewBrandName('');
            setIsCreatingBrand(false);
        } catch (err) {
            console.error(err);
            setError("Error al crear marca");
        }
    };

    const handleAddTag = (tagId: string) => {
        if (tagId && !selectedTagIds.includes(tagId)) {
            setSelectedTagIds(prev => [...prev, tagId]);
        }
    };

    const handleCreateTagSubmit = async () => {
        if (!newTagName) return;
        try {
            const newTag = await InventoryRepository.createTag({ name: newTagName });
            setTags(prev => [...prev, newTag]);
            setSelectedTagIds(prev => [...prev, newTag._id]);
            setNewTagName('');
        } catch (err) {
            console.error(err);
            setError("Error al crear etiqueta");
        }
    };

    const removeTag = (tagId: string) => {
        setSelectedTagIds(prev => prev.filter(id => id !== tagId));
    };

    const handleImageChange = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
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
        handleImageChange(croppedImage);
        setIsCropperOpen(false);
        setTempImageSrc(null);
    };

    const handleCropperClose = () => {
        setIsCropperOpen(false);
        setTempImageSrc(null);
        // Reset file input
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

            Promise.all(imageSources).then((sources) => {
                setTempImageSources(sources);
                setIsMultiCropperOpen(true);
            });
        }
    };

    const handleMultipleCropComplete = (croppedImages: File[]) => {
        setImageFiles(prev => [...prev, ...croppedImages]);

        // Generate previews
        const previewPromises = croppedImages.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then((previews) => {
            setImagePreviews(prev => [...prev, ...previews]);
            setIsMultiCropperOpen(false);
            setTempImageSources([]);
        });
    };

    const handleRemoveImage = (index: number) => {
        const removedImageUrl = imagePreviews[index];

        // Track deleted images if they are original images (URLs not data URLs)
        if (removedImageUrl && originalImageUrls.includes(removedImageUrl)) {
            setDeletedImageUrls(prev => [...prev, removedImageUrl]);
        }

        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleMultiCropperClose = () => {
        setIsMultiCropperOpen(false);
        setTempImageSources([]);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!name || !price || !categoryId || !brandId) {
            setError("Por favor completa los campos requeridos (*)");
            setIsLoading(false);
            return;
        }

        try {
            const priceInCents = Math.round(parseFloat(price) * 100);
            const productData: CreateProductRequest | UpdateProductRequest = {
                name,
                description,
                sku,
                priceInCents,
                available,
                categoryId,
                brandId,
                tagIds: selectedTagIds,
            };

            let productId: string = createdProductId || (productToEdit ? productToEdit._id : '');

            // Delete removed images first if editing
            if (productToEdit && deletedImageUrls.length > 0) {
                try {
                    for (const imageUrl of deletedImageUrls) {
                        await InventoryRepository.deleteProductImage(productId, imageUrl);
                    }
                } catch (deleteErr) {
                    console.error(deleteErr);
                    setError("Error al eliminar las imágenes. Por favor, intenta de nuevo.");
                    setIsLoading(false);
                    return;
                }
            }

            if (productId) {
                const updatedProduct = await InventoryRepository.updateProduct(productId, productData);
                productId = updatedProduct._id;
            } else {
                const createdProduct = await InventoryRepository.createProduct(productData);
                productId = createdProduct._id;
                setCreatedProductId(productId); // Store ID in case image upload fails
            }

            if (imageFiles.length > 0) {
                try {
                    await InventoryRepository.uploadProductImages(productId, imageFiles);
                } catch (uploadErr) {
                    console.error(uploadErr);
                    setError("Producto guardado, pero hubo un error al subir las imágenes. Intenta guardando nuevamente.");
                    setIsLoading(false);
                    return; // Do NOT call onSuccess if image upload fails
                }
            } else if (imageFile) {
                try {
                    await InventoryRepository.uploadProductImage(productId, imageFile);
                } catch (uploadErr) {
                    console.error(uploadErr);
                    setError("Producto guardado, pero hubo un error al subir la imagen. Intenta guardando nuevamente.");
                    setIsLoading(false);
                    return; // Do NOT call onSuccess if image upload fails
                }
            }

            onSuccess();
        } catch (err) {
            console.error(err);
            setError(productToEdit || createdProductId ? "Error al actualizar el producto." : "Error al crear el producto.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formState: {
            name, setName,
            description, setDescription,
            sku, setSku,
            price, setPrice,
            available, setAvailable,
            categoryId, setCategoryId,
            brandId, setBrandId,
            selectedTagIds,
            imageFile, handleImageChange,
            imagePreview,
            imageFiles,
            imagePreviews,
            newCategoryName, setNewCategoryName,
            newBrandName, setNewBrandName,
            newTagName, setNewTagName,
            isCreatingCategory, setIsCreatingCategory,
            isCreatingBrand, setIsCreatingBrand
        },
        cropperState: {
            fileInputRef,
            isCropperOpen,
            tempImageSrc,
            isMultiCropperOpen,
            tempImageSources
        },
        auxData: {
            categories,
            brands,
            tags,
            loading: areAuxDataLoading
        },
        actions: {
            handleCreateCategorySubmit,
            handleCreateBrandSubmit,
            handleAddTag,
            handleCreateTagSubmit,
            removeTag,
            handleSubmit,
            handleFileClick,
            handleFileChange,
            handleCropComplete,
            handleCropperClose,
            handleFileMultipleChange,
            handleMultipleCropComplete,
            handleRemoveImage,
            handleMultiCropperClose
        },
        uiState: {
            isLoading,
            error
        }
    };
};
