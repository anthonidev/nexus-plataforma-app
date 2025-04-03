export default function PageHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Planes de Membresía
        </h1>
        <p className="text-muted-foreground mt-2">
          Selecciona el plan que mejor se ajuste a tus necesidades y comienza tu
          camino al éxito
        </p>
      </div>
    </div>
  );
}
