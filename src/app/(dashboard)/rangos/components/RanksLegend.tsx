"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function RanksLegend() {
    return (
        <div className="border rounded-md p-3 bg-muted/10">
            <p className="text-sm font-medium mb-2 text-muted-foreground">Leyenda:</p>
            <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5">
                    <Badge className="bg-primary text-primary-foreground font-medium">
                        Actual
                    </Badge>
                    <span className="text-xs text-muted-foreground">Tu rango actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge className="bg-blue-500 text-white font-medium">
                        Siguiente
                    </Badge>
                    <span className="text-xs text-muted-foreground">Próximo rango a alcanzar</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge className="bg-amber-500 text-white font-medium">
                        Mayor alcanzado
                    </Badge>
                    <span className="text-xs text-muted-foreground">Rango más alto alcanzado</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge className="bg-green-500 text-white flex items-center gap-1 font-medium">
                        <CheckCircle className="h-3 w-3" />
                        <span>Conseguido</span>
                    </Badge>
                    <span className="text-xs text-muted-foreground">Rango ya alcanzado</span>
                </div>
            </div>
        </div>
    );
}