import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Loader2, Save } from "lucide-react";
import { Category } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { UseFormReturn } from "react-hook-form";
import { UpdateProductFormType } from "../hooks/useProductDetail";

interface ProductBasicInfoProps {
    form: UseFormReturn<UpdateProductFormType>;
    categories: Category[];
    isSubmitting: boolean;
    onUpdate: () => void;
}

export function ProductBasicInfo({
    form,
    categories,
    isSubmitting,
    onUpdate
}: ProductBasicInfoProps) {
    const {
        register,
        formState: { errors },
        watch,
        setValue,
    } = form;

    return (
        <form onSubmit={onUpdate} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto</Label>
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="Nombre del producto"
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="categoryId">Categoría</Label>
                    <Select
                        value={watch("categoryId")?.toString()}
                        onValueChange={(value) => setValue("categoryId", parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.categoryId && (
                        <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Descripción del producto"
                    rows={4}
                />
                {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="memberPrice">Precio Socio</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="memberPrice"
                            type="number"
                            step="0.01"
                            className="pl-9"
                            {...register("memberPrice", { valueAsNumber: true })}
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
                            className="pl-9"
                            {...register("publicPrice", { valueAsNumber: true })}
                            placeholder="0.00"
                        />
                    </div>
                    {errors.publicPrice && (
                        <p className="text-sm text-destructive">{errors.publicPrice.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="isActive"
                    checked={watch("isActive")}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                />
                <Label htmlFor="isActive">Producto activo</Label>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Actualizando...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Guardar cambios
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}