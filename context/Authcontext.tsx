// Ensure this is a client-side component
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  token: string | null;
  role: string | null;
  id: string | null;
  corporationId: string | null;
  login: (documentNumber: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [corporationId, setCorporationId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve token and role from cookies when the app loads
    const storedToken = Cookies.get("token");
    const storedRole = Cookies.get("role");
    const storedId = Cookies.get("id");
    const storedCorporationId = Cookies.get("corporationId");
    
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedRole) {
      setRole(storedRole);
    }
    if (storedId) {
      setId(storedId);
    }
    if (storedCorporationId) {
      setCorporationId(storedCorporationId);
    }
  }, []);

  const login = async (
    documentNumber: string,
    password: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentNumber: documentNumber,
            password: password,
          }),
        }
      );
  
      const data = await response.json();
  
      console.log("Login response:", data);
  
      if (response.ok) { // Check if the response status is OK (2xx)
        if (data.token && data.role && data.id && data.corporationId) {
          // If login is successful, set the token and other state values
          setToken(data.token);
          setRole(data.role);
          setId(data.id);
          setCorporationId(data.corporationId);
  
          // Store token and role in cookies
          Cookies.set("token", data.token, {
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("role", data.role, {
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("id", data.id, {
            secure: true,
            sameSite: "strict",
          });
          Cookies.set("corporationId", data.corporationId, {
            secure: true,
            sameSite: "strict",
          });
  
          // Redirect based on user role
          if (data.role === "ADMIN") {
            router.push("/advice-dashboard");
          } else if (data.role === "ADVICE") {
            router.push("/advice-dashboard");
          } else if (data.role === "IMAGEN") {
            router.push("/");
          } else if (data.role === "SUPER_ADMIN") {
            router.push("/su-admin-home");
          }
  
          return null; // Login was successful, no error
        } else {
          return "Invalid login response from server";
        }
      } else {
        // If response is not ok, return the error message from the server
        return data.message || "Error during login";
      }
    } catch (error) {
      console.error("Error during login", error);
      if (error instanceof Error) {
        return error.message || "Error during login";
      }
      return "Error connecting to server";
    }
  };
  

  const logout = () => {
    setToken(null);
    setRole(null);
    setId(null);
    setCorporationId(null);
    // Remove token and role from cookies
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("id");
    Cookies.remove("corporationId");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, id, corporationId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
