"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/Authcontext";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, requiredRoles }: { children: React.ReactNode; requiredRoles: string[] }) => {
  const { token: contextToken, role } = useAuth();
  const router = useRouter();
  
  // Obtener token de la cookie en caso de que no esté en el contexto
  const cookieToken = Cookies.get("token");
  const token = contextToken || cookieToken;

  useEffect(() => {
    if (!token) {
      // Redirigir al inicio de sesión si no hay token
      router.push("/access-denied");
    } else if (role && !requiredRoles.includes(role)) {
      // Redirigir a acceso denegado si el rol no está permitido
      router.push("/access-denied");
    }
  }, [token, role, router, requiredRoles]);

  // Renderizar el contenido solo si el usuario tiene token y rol adecuado
  if (!token || !role || !requiredRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
