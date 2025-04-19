
"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TermsAndConditionsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: (accepted: boolean) => void;
    isAccepted: boolean;
}

export default function TermsAndConditionsModal({
    open,
    onOpenChange,
    onAccept,
    isAccepted,
}: TermsAndConditionsModalProps) {
    const [accepted, setAccepted] = useState(isAccepted);
    const [showError, setShowError] = useState(false);
    const [termsContent, setTermsContent] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTerms() {
            try {
                setLoading(true);
                const response = await fetch('/api/terms');
                if (!response.ok) {
                    throw new Error('No se pudo cargar el archivo de términos y condiciones');
                }
                const data = await response.json();
                setTermsContent(data.content);
            } catch (error) {
                console.error("Error cargando términos y condiciones:", error);
                setTermsContent("Error al cargar los términos y condiciones. Por favor, inténtelo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        }

        if (open) {
            fetchTerms();
        }
    }, [open]);

    const handleAccept = () => {
        if (!accepted) {
            setShowError(true);
            return;
        }
        setShowError(false);
        onAccept(true);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl">Términos y Condiciones</DialogTitle>
                    <DialogDescription>
                        Por favor lee detenidamente nuestros términos y condiciones antes de continuar.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 border rounded-md overflow-hidden">
                    <ScrollArea className="h-[50vh] p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert prose-headings:font-semibold prose-headings:text-primary max-w-none">
                                <ReactMarkdown
                                    rehypePlugins={[rehypeRaw]}
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {termsContent}
                                </ReactMarkdown>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="mt-4 flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        checked={accepted}
                        onCheckedChange={(checked) => setAccepted(checked === true)}
                        className="mt-1"
                    />
                    <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none cursor-pointer"
                    >
                        Acepto los términos y condiciones
                    </Label>
                </div>

                {showError && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            Debes aceptar los términos y condiciones para continuar.
                        </AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleAccept}>Aceptar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}