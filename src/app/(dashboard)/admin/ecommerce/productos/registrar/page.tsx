"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
    AlertCircle,
    DollarSign,
    Image as ImageIcon,
    Loader2,
    Package,
    Plus,
    Trash2
} from "lucide-react";
import { useState } from "react";
import { SuccessModal } from "../../components/modal/SuccessModal";
import { useProductRegistration } from "../../hooks/useProductRegistration";

export default function RegisterProductPage() {
    const {
        form,
        categories,
        loadingCategories,
        images,
        isLoading,
        showSuccessModal,
        registeredProductName,
        addImage,
        removeImage,
        addBenefit,
        removeBenefit,
        closeSuccessModal,
        handleNewProduct,
        onSubmit,
    } = useProductRegistration();

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = form;

    const benefits = watch("benefits") || [];

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            addImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl">
            <PageHeader
                title="Registrar Nuevo Producto"
                subtitle="Complete la información del producto para agregarlo al catálogo"
                variant="gradient"
                icon={Package}
                backUrl="/admin/ecommerce/productos"

            />


            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" />
                                Información Básica
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Ingrese el nombre del producto"
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    {...register("description")}
                                    placeholder="Describe el producto"
                                    rows={4}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="memberPrice">Precio Socio</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="memberPrice"
                                            type="number"
                                            step="0.01"
                                            {...register("memberPrice", { valueAsNumber: true })}
                                            className="pl-9"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.memberPrice && (
                                        <p className="text-sm text-destructive">{errors.memberPrice.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="publicPrice">Precio Público</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="publicPrice"
                                            type="number"
                                            step="0.01"
                                            {...register("publicPrice", { valueAsNumber: true })}
                                            className="pl-9"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    {errors.publicPrice && (
                                        <p className="text-sm text-destructive">{errors.publicPrice.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    {...register("stock", { valueAsNumber: true })}
                                    placeholder="Cantidad en inventario"
                                />
                                {errors.stock && (
                                    <p className="text-sm text-destructive">{errors.stock.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="categoryId">Categoría</Label>
                                <Select
                                    onValueChange={(value) => setValue("categoryId", parseInt(value))}
                                    value={watch("categoryId")?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadingCategories ? (
                                            <SelectItem value="loading" disabled>
                                                Cargando categorías...
                                            </SelectItem>
                                        ) : (
                                            categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {errors.categoryId && (
                                    <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={watch("isActive")}
                                    onCheckedChange={(checked) => setValue("isActive", checked)}
                                />
                                <Label htmlFor="isActive">Producto activo</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-primary" />
                                    Imágenes del Producto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                            disabled={images.length >= 5}
                                        />
                                        <Label
                                            htmlFor="image-upload"
                                            className={`cursor-pointer ${images.length >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
                                        >
                                            <div className="space-y-2">
                                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                                                <p className="text-sm font-medium">
                                                    {images.length >= 5
                                                        ? 'Máximo de imágenes alcanzado'
                                                        : 'Haz clic para subir una imagen'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {images.length}/5 imágenes
                                                </p>
                                            </div>
                                        </Label>
                                    </div>

                                    {images.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4">
                                            {images.map((image, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="relative group"
                                                >
                                                    <div className="aspect-square rounded-lg overflow-hidden border relative">
                                                        <img
                                                            src={URL.createObjectURL(image.file)}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}

                                    {errors.images && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.images.message}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5 text-primary" />
                                    Beneficios del Producto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {benefits.map((benefit, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-2"
                                        >
                                            <Input
                                                {...register(`benefits.${index}.benefit`)}
                                                placeholder="Escriba un beneficio"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => removeBenefit(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </motion.div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={addBenefit}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Agregar Beneficio
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Registrando...
                            </>
                        ) : (
                            "Registrar Producto"
                        )}
                    </Button>
                </div>
            </form>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                onNewProduct={handleNewProduct}
                productName={registeredProductName}
            />
        </div>
    );
}