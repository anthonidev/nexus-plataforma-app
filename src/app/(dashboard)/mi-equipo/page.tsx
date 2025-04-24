"use client";
import { useSession } from "next-auth/react";
import TreeLoading from "./components/TreeLoading";
import TreeView from "./components/TreeView";
import { PageHeader } from "@/components/common/PageHeader";
import { Network } from "lucide-react";

export default function Tree() {
  const { data: session, status } = useSession();

  if (status === "loading") return <TreeLoading />;
  if (status === "unauthenticated") return <div>Debes iniciar sesión</div>;

  if (!session?.user?.id) {
    return <div>No se pudo obtener la información del usuario</div>;
  }

  return (
    <div className="container py-8">
      <PageHeader
        title="Árbol de Red"
        subtitle="Visualiza y gestiona la estructura de tu red de usuarios"
        variant="gradient"
        icon={Network}

      />

      <TreeView userId={session.user.id} />
    </div>
  );
}