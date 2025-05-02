import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ProductBenefitsProps {
    benefits: string[];
    onAdd: (benefit: string) => void;
    onRemove: (index: number) => void;
    onUpdate: () => void;
    isSubmitting: boolean;
}

export function ProductBenefits({
    benefits,
    onAdd,
    onRemove,
    onUpdate,
    isSubmitting,
}: ProductBenefitsProps) {
    const [newBenefit, setNewBenefit] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleAddBenefit = () => {
        if (!newBenefit.trim()) {
            setError("El beneficio no puede estar vacío");
            return;
        }

        setError(null);
        onAdd(newBenefit.trim());
        setNewBenefit("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddBenefit();
        }
    };

    return (
        <div className="space-y-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAddBenefit();
                }}
                className="flex gap-2"
            >
                <div className="flex-1">
                    <Input
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escriba un nuevo beneficio..."
                        className={error ? "border-red-500" : ""}
                    />
                    {error && (
                        <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {error}
                        </p>
                    )}
                </div>
                <Button type="submit" variant="outline">
                    <Plus className="h-4 w-4 mr-1" /> Añadir
                </Button>
            </form>

            <div className="space-y-4">
                <h3 className="text-sm font-medium">
                    Beneficios del producto{" "}
                    <Badge variant="outline">{benefits.length}</Badge>
                </h3>

                {benefits.length === 0 ? (
                    <div className="text-center p-6 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground">
                            No hay beneficios definidos para este producto
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <AnimatePresence initial={false}>
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2"
                                >
                                    <div className="flex-1 p-3 border rounded-md bg-muted/5">
                                        {benefit}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemove(index)}
                                        className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive/80"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {benefits.length > 0 && (
                <div className="flex justify-end">
                    <Button onClick={onUpdate} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}