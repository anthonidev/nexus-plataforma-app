import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
    isSubmitting: boolean;
    currentImagesCount: number;
}

export function ImageUploadModal({
    isOpen,
    onClose,
    onUpload,
    isSubmitting,
    currentImagesCount,
}: ImageUploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setError(null);

        if (!file) return;

        // Validar tamaño (5MB máximo)
        if (file.size > 5 * 1024 * 1024) {
            setError("La imagen no debe superar 5MB");
            return;
        }

        // Validar tipo de archivo
        if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
            setError("Solo se permiten imágenes JPG, JPEG, PNG o WEBP");
            return;
        }

        // Crear URL para previsualización
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSelectedFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Debe seleccionar una imagen");
            return;
        }

        try {
            await onUpload(selectedFile);
            // Limpieza después de subir
            resetForm();
        } catch (err) {
            console.error("Error al subir imagen:", err);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar Nueva Imagen</DialogTitle>
                    <DialogDescription>
                        Seleccione una imagen para añadir al producto.
                        {currentImagesCount > 0 && (
                            <span className="block mt-1">{currentImagesCount}/5 imágenes utilizadas</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="image">Imagen</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleFileChange}
                                disabled={isSubmitting || currentImagesCount >= 5}
                            />
                            {currentImagesCount >= 5 && (
                                <p className="text-sm text-destructive">
                                    Se ha alcanzado el límite máximo de 5 imágenes.
                                </p>
                            )}
                        </div>

                        {previewUrl && (
                            <div className="mt-4">
                                <Label>Vista previa</Label>
                                <div className="mt-2 border rounded-md overflow-hidden aspect-video relative">
                                    <img
                                        src={previewUrl}
                                        alt="Vista previa"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !selectedFile || currentImagesCount >= 5}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="mr-2 h-4 w-4" />
                                    Subir Imagen
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}