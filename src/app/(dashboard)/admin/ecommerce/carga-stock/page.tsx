
"use client";
export default function LoadStockMasive() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 max-w-md mx-auto text-center">
            <div className="w-16 h-16 mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-foreground">Carga Masiva de Stock</h1>
            <div className="h-1 w-16 bg-primary rounded-full mx-auto mb-6"></div>
            <p className="text-muted-foreground mb-6">
                Estamos desarrollando esta funcionalidad para mejorar tu experiencia.
            </p>
            <div className="bg-muted/40 border rounded-lg p-4 mb-6">
                <p className="text-sm">
                    Por el momento puedes cargar stock de forma individual desde la sección de detalles de producto.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    onClick={() => window.history.back()}
                >
                    Volver a Productos
                </button>
                <button
                    className="px-4 py-2 border border-primary/50 text-primary rounded-md hover:bg-primary/10 transition-colors"
                    onClick={() => window.location.href = "/admin/ecommerce/productos"}
                >
                    Ver Catálogo
                </button>
            </div>
        </div>
    );
}