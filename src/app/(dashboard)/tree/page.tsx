// src/app/(dashboard)/tree/page.tsx
"use client";
import { useSession } from "next-auth/react";
import TreeLoading from "./components/TreeLoading";
import TreeView from "./components/TreeView";

export default function Tree() {
  const { data: session, status } = useSession();

  if (status === "loading") return <TreeLoading />;
  if (status === "unauthenticated") return <div>Debes iniciar sesión</div>;

  // Asegurarse de que el usuario tenga un ID
  if (!session?.user?.id) {
    return <div>No se pudo obtener la información del usuario</div>;
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Árbol de Red</h1>
        <p className="text-muted-foreground">
          Visualiza y gestiona la estructura de tu red de usuarios
        </p>
      </div>

      <TreeView userId={session.user.id} />
    </div>
  );
}