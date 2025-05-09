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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MinusCircle, PlusCircle } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { StockUpdateFormType } from "../../hooks/useProductDetail";

interface StockUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: UseFormReturn<StockUpdateFormType>;
    isSubmitting: boolean;
    currentStock: number;
}

export function StockUpdateModal({
    isOpen,
    onClose,
    onSubmit,
    form,
    isSubmitting,
    currentStock,
}: StockUpdateModalProps) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = form;

    const actionType = watch("actionType");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Actualizar Stock</DialogTitle>
                    <DialogDescription>
                        Añada o quite unidades al inventario del producto. Stock actual: <strong>{currentStock}</strong>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <RadioGroup
                            defaultValue={actionType}
                            value={actionType}
                            onValueChange={(value) =>
                                setValue("actionType", value as "INCREASE" | "DECREASE")
                            }
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem
                                    value="INCREASE"
                                    id="increase"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="increase"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <PlusCircle className="mb-3 h-6 w-6 text-green-500" />
                                    <span className="text-center font-medium">Agregar</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="DECREASE"
                                    id="decrease"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="decrease"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <MinusCircle className="mb-3 h-6 w-6 text-red-500" />
                                    <span className="text-center font-medium">Quitar</span>
                                </Label>
                            </div>
                        </RadioGroup>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Cantidad</Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={1}
                                {...register("quantity", { valueAsNumber: true })}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-destructive">{errors.quantity.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción (opcional)</Label>
                            <Textarea
                                id="description"
                                {...register("description")}
                                placeholder="Razón del cambio de inventario..."
                                rows={3}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    {actionType === "INCREASE" ? "Agregar" : "Quitar"} Stock
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}