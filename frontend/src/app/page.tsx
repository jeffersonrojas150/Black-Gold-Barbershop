'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Si está autenticado, redirigir al dashboard
  useEffect(() => {
    if (mounted && !loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return null;
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      {/* Navbar Simple */}
      <nav className="border-b" style={{ borderColor: 'var(--color-dark-lighter)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Black Gold Barbershop"
                className="h-12 w-auto"
              />
              <div className="flex items-center">
                <div className="relative">
                  <span
                    className="text-2xl sm:text-3xl font-bold tracking-wider"
                    style={{
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-display)'
                    }}
                  >
                    Black
                  </span>
                  <div
                    className="absolute top-1/2 left-0 right-0 h-[2px] opacity-30"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      transform: 'translateY(-50%) rotate(-5deg)'
                    }}
                  ></div>
                </div>
                <span
                  className="text-2xl sm:text-3xl font-bold tracking-wider ml-1"
                  style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'var(--font-display)'
                  }}
                >
                  Gold
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors font-light"
              >
                Servicios
              </Link>
              <Link
                href="/barbers"
                className="text-gray-300 hover:text-white transition-colors font-light"
              >
                Barberos
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-80"
                style={{ backgroundColor: 'var(--color-dark-lighter)' }}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-dark)'
                }}
              >
                Registrarse
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu-landing');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--color-primary)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div id="mobile-menu-landing" className="hidden md:hidden pb-4 border-t mt-2" style={{ borderColor: 'var(--color-dark-lighter)' }}>
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
              >
                Servicios
              </Link>
              <Link
                href="/barbers"
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
              >
                Barberos
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-center"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-dark)'
                }}
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div>
              <h1
                className="text-5xl md:text-6xl font-bold mb-6"
                style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'var(--font-display)',
                  lineHeight: '1.2'
                }}
              >
                Tu estilo, nuestra pasión
              </h1>
              <p className="text-xl text-gray-300 font-light mb-8">
                Experimenta el lujo de un corte profesional en Black Gold Barbershop.
                Reserva tu cita en línea y descubre por qué somos los mejores.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  href="/register"
                  className="px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105 text-center"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-dark)'
                  }}
                >
                  Reservar Cita Ahora
                </Link>
                <Link
                  href="/services"
                  className="px-8 py-4 text-lg font-medium text-white rounded-lg transition-all hover:scale-105 border-2 text-center"
                  style={{
                    borderColor: 'var(--color-primary)',
                    backgroundColor: 'transparent'
                  }}
                >
                  Ver Servicios
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    10+
                  </p>
                  <p className="text-sm text-gray-400 font-light">Años de experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    5000+
                  </p>
                  <p className="text-sm text-gray-400 font-light">Clientes satisfechos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    100%
                  </p>
                  <p className="text-sm text-gray-400 font-light">Profesionalismo</p>
                </div>
              </div>
            </div>

            {/* Imagen */}
            <div className="relative">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl border-4"
                style={{ borderColor: 'var(--color-primary)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80"
                  alt="Black Gold Barbershop"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-20 blur-3xl"
                style={{ backgroundColor: 'var(--color-primary)' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          className="py-20 border-t"
          style={{
            backgroundColor: 'var(--color-dark-light)',
            borderColor: 'var(--color-dark-lighter)'
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-4xl font-bold text-center mb-12"
              style={{
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-display)'
              }}
            >
              ¿Por qué elegirnos?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <span className="text-4xl">✂️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Profesionales Expertos</h3>
                <p className="text-gray-400 font-light">
                  Nuestro equipo cuenta con años de experiencia en cortes modernos y clásicos.
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <span className="text-4xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Reserva Online</h3>
                <p className="text-gray-400 font-light">
                  Sistema de reservas fácil y rápido. Elige tu barbero, horario y servicio.
                </p>
              </div>

              <div className="text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <span className="text-4xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Calidad Premium</h3>
                <p className="text-gray-400 font-light">
                  Productos de primera calidad y atención personalizada en cada visita.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{ borderColor: 'var(--color-dark-lighter)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-light text-sm">
              © 2024 Black Gold Barbershop. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/services" className="text-gray-400 hover:text-white text-sm font-light">
                Servicios
              </Link>
              <Link href="/barbers" className="text-gray-400 hover:text-white text-sm font-light">
                Barberos
              </Link>
              <Link href="/login" className="text-gray-400 hover:text-white text-sm font-light">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}