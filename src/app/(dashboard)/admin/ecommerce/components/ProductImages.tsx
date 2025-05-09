import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageProduct } from "@/types/ecommerce/admin/ecommerce-admin.type";
import { motion } from "framer-motion";
import { Check, Edit, Image, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

interface ProductImagesProps {
    images: ImageProduct[];
    productId: number;
    onDelete: (imageId: number) => Promise<void>;
    onUpdateImage: (imageId: number, isMain: boolean, order: number) => Promise<void>;
    imageToDelete: number | null;
    onAddImage: () => void;
}

export function ProductImages({
    images,
    productId,
    onDelete,
    onUpdateImage,
    imageToDelete,
    onAddImage,
}: ProductImagesProps) {
    const [selectedImage, setSelectedImage] = useState<ImageProduct | null>(null);
    const [isMain, setIsMain] = useState(false);
    const [order, setOrder] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEdit = (image: ImageProduct) => {
        setSelectedImage(image);
        setIsMain(image.isMain);
        setOrder(image.order);
    };

    const handleUpdate = async () => {
        if (!selectedImage) return;

        setIsSubmitting(true);
        try {
            await onUpdateImage(selectedImage.id, isMain, order);
            setSelectedImage(null);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Imágenes del Producto</h3>
                    <p className="text-sm text-muted-foreground">
                        {images.length}/5 imágenes utilizadas
                    </p>
                </div>
                <Button onClick={onAddImage} disabled={images.length >= 5}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Imagen
                </Button>
            </div>

            {images.length === 0 ? (
                <div className="text-center p-8 border rounded-lg bg-muted/10">
                    <div className="mx-auto w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                        <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No hay imágenes</h3>
                    <p className="text-muted-foreground">
                        Este producto no tiene imágenes asociadas.
                    </p>
                    <Button onClick={onAddImage} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar primera imagen
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                        <motion.div
                            key={image.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className={`overflow-hidden ${image.isMain ? 'border-primary' : ''}`}>
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={`Imagen ${image.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {image.isMain && (
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-primary">
                                                <Star className="h-3 w-3 mr-1 fill-white" />
                                                Principal
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium">Orden: {image.order}</p>
                                            <p className="text-xs text-muted-foreground">ID: {image.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(image)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => onDelete(image.id)}
                                                disabled={imageToDelete === image.id}
                                            >
                                                {imageToDelete === image.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal para editar imagen */}
            <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Editar Imagen</DialogTitle>
                        <DialogDescription>
                            Actualice las propiedades de la imagen
                        </DialogDescription>
                    </DialogHeader>

                    {selectedImage && (
                        <div className="space-y-4">
                            <div className="aspect-video overflow-hidden rounded-md border">
                                <img
                                    src={selectedImage.url}
                                    alt={`Imagen ${selectedImage.id}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="order">Orden de visualización</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        value={order}
                                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                                        min={0}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isMain"
                                        checked={isMain}
                                        onCheckedChange={setIsMain}
                                    />
                                    <Label htmlFor="isMain">Establecer como imagen principal</Label>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedImage(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdate} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Guardar cambios
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}