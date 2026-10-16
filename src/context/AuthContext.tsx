
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
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

import { setToken } from '../api/client';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const { data } = await getCurrentUsuario();

        if (active) {
          setUser(data);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  async function login(
    email: string,
    contrasena: string,
  ): Promise<void> {
    setIsLoading(true);

    try {
      const result = await loginRequest(email, contrasena);

      await setToken(result.token);

      const { data } = await getCurrentUsuario();
      setUser(data);
    } catch (error) {
      setUser(null);
      await setToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function register(
    nombre: string,
    email: string,
    contrasena: string,
    tipo_usuario: TipoUsuario,
    telefono?: string,
  ): Promise<void> {
    await registerRequest(
      nombre,
      email,
      contrasena,
      tipo_usuario,
      telefono,
    );

    await login(email, contrasena);
  }

  async function logout(): Promise<void> {
    try {
      await logoutRequest();
    } finally {
      await setToken(null);
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
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }

  return context;
}
