import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  getCurrentUsuario,
  type TipoUsuario,
  type Usuario,
} from '../api/usuario';
import { setToken as setClientToken } from '../api/client';

interface AuthUser extends Usuario {
  tipo_usuario: TipoUsuario;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  register: (
    nombre: string,
    email: string,
    contrasena: string,
    tipo_usuario: TipoUsuario,
    telefono?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  async function login(email: string, contrasena: string): Promise<void> {
    const { token } = await loginRequest(email, contrasena);
    setClientToken(token);

    const { data } = await getCurrentUsuario();
    setUser(data);
  }

  async function register(
    nombre: string,
    email: string,
    contrasena: string,
    tipo_usuario: TipoUsuario,
    telefono?: string,
  ): Promise<void> {
    await registerRequest(nombre, email, contrasena, tipo_usuario, telefono);
    // El backend no devuelve token al registrar, así que encadenamos el login
    await login(email, contrasena);
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest();
    } catch {
    } finally {
      setClientToken(null);
      setUser(null);
    }
  }

  async function refreshUser(): Promise<void> {
    const { data } = await getCurrentUsuario();
    setUser(data);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return ctx;
}