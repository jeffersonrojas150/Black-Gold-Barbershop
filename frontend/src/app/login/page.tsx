'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading mientras verifica autenticación
  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom right, #000000, #1A1A1A, #000000)'
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--color-primary)' }}
          ></div>
          <p className="text-gray-400 font-light">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to bottom right, #000000, #1A1A1A, #000000)'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo2.png"
            alt="Black Gold Barbershop"
            className="w-80 h-auto mx-auto mb-4"
          />
        </div>

        {/* Card de Login */}
        <Card className="p-8">
          <h2
            className="text-2xl font-semibold text-white mb-6 text-center tracking-wide"
            style={{ fontWeight: 400 }}
          >
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-red-500 text-sm font-light">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              name="password"
              label="Contraseña"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              loading={loading}
              disabled={loading}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm font-light">
              ¿No tienes una cuenta?{' '}
              <Link
                href="/register"
                style={{ color: 'var(--color-primary)' }}
                className="hover:opacity-80 font-normal"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Usuarios de prueba */}
          <div
            className="mt-6 p-4 rounded-lg"
            style={{ backgroundColor: 'var(--color-dark-lighter)' }}
          >
            <p className="text-xs text-gray-500 mb-2 font-light">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-gray-400 font-light">
              <p>Admin: admin@barbershop.com</p>
              <p>Cliente: juan@example.com</p>
              <p>Contraseña: password123</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}