"use client";
import { getMyPoints } from "@/lib/actions/points/point.action";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function usePointsUser() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState({
    availablePoints: 0,
    totalEarnedPoints: 0,
    totalWithdrawnPoints: 0,
    membershipPlan: null as { name: string } | null,
  });

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  // Función para obtener los puntos iniciales
  const fetchInitialPoints = useCallback(async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      const response = await getMyPoints();

      if (response) {
        setPoints({
          availablePoints: response.availablePoints,
          totalEarnedPoints: response.totalEarnedPoints,
          totalWithdrawnPoints: response.totalWithdrawnPoints,
          membershipPlan: response.membershipPlan,
        });
      }
    } catch (err) {
      console.error("Error al obtener los puntos del usuario:", err);
      setError(err instanceof Error ? err.message : "Error al obtener puntos");
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  // Cargar puntos iniciales
  useEffect(() => {
    fetchInitialPoints();
  }, [fetchInitialPoints]);

  // Configuración del socket
  useEffect(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    if (!session?.user?.id) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL no está definido");
      setError("Error de configuración: URL del API no definida");
      return;
    }

    const connectSocket = () => {
      try {
        console.log(
          `Intentando conectar al servidor de puntos: ${apiUrl}/points`
        );

        const socketInstance = io(`${apiUrl}/points`, {
          query: { userId: session.user.id },
          transports: ["websocket"],
          withCredentials: true,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
          console.log("✅ Conectado al servidor de puntos");
          reconnectAttempts.current = 0; // Resetear los intentos al conectar exitosamente
          setIsLoading(false);
        });

        socketInstance.on("connect_error", (err) => {
          console.error("❌ Error al conectar con el servidor de puntos:", err);

          if (reconnectAttempts.current >= maxReconnectAttempts) {
            console.error(
              `Máximo número de intentos de reconexión (${maxReconnectAttempts}) alcanzado.`
            );
            return;
          }

          reconnectAttempts.current += 1;
          const delay = 5000 * Math.pow(2, reconnectAttempts.current - 1);

          console.log(
            `Intentando reconectar en ${delay / 1000} segundos (intento ${
              reconnectAttempts.current
            }/${maxReconnectAttempts})...`
          );

          reconnectTimeout.current = setTimeout(() => {
            if (socketInstance) socketInstance.connect();
          }, delay);
        });

        socketInstance.on("disconnect", (reason) => {
          console.log(`Desconectado del servidor de puntos: ${reason}`);
        });

        socketInstance.on("error", (err) => {
          console.error("Error en el socket:", err);
        });

        socketInstance.on(
          "pointsUpdate",
          (data: {
            availablePoints: number;
            totalEarnedPoints: number;
            totalWithdrawnPoints?: number;
          }) => {
            console.log("Puntos actualizados:", data);
            setPoints((prev) => ({
              ...prev,
              availablePoints: data.availablePoints,
              totalEarnedPoints: data.totalEarnedPoints,
              totalWithdrawnPoints:
                data.totalWithdrawnPoints || prev.totalWithdrawnPoints,
            }));
          }
        );

        setSocket(socketInstance);

        return () => {
          console.log("Desconectando socket...");
          socketInstance.disconnect();

          if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
            reconnectTimeout.current = null;
          }
        };
      } catch (error) {
        console.error("Error al conectar al socket:", error);
        setError("Error de conexión al socket");
        setIsLoading(false);
        return undefined;
      }
    };

    const cleanup = connectSocket();
    return cleanup;
  }, [session?.user?.id]);

  return {
    points,
    isLoading,
    error,
    refreshPoints: fetchInitialPoints,
  };
}
