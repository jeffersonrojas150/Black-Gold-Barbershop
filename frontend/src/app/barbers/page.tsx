'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { barbersService } from '@/services/api';
import type { Barber } from '@/types';
import { Card } from '@/components/ui/Card';

export default function BarbersPublicPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      const response = await barbersService.getAll(true); // Solo barberos activos
      setBarbers(response.data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
      {/* Navbar Simple */}
      <nav className="border-b" style={{ borderColor: 'var(--color-dark-lighter)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
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
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors font-light"
              >
                Inicio
              </Link>
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors font-light"
              >
                Servicios
              </Link>
              <Link
                href="/barbers"
                className="text-yellow-400 font-light"
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
                const menu = document.getElementById('mobile-menu-barbers');
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
          <div id="mobile-menu-barbers" className="hidden md:hidden pb-4 border-t mt-2" style={{ borderColor: 'var(--color-dark-lighter)' }}>
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
              >
                Inicio
              </Link>
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
              >
                Servicios
              </Link>
              <Link
                href="/barbers"
                className="text-yellow-400 font-light py-2"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1
              className="text-yellow-400 font-light text-4xl tracking-wider mb-2"
              style={{ fontWeight: 300 }}
            >
              Nuestros Barberos
            </h1>
            <div
              className="h-0.5 mx-auto"
              style={{
                width: '60%',
                backgroundColor: 'var(--color-primary)'
              }}
            ></div>
          </div>
          <p className="text-gray-400 font-light text-sm mt-4">
            Conoce a nuestro equipo de profesionales expertos
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: 'var(--color-primary)' }}
              ></div>
              <p className="text-gray-400 font-light">Cargando barberos...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <Card key={barber.id} className="overflow-hidden hover:scale-105 transition-transform">
                <div className="relative h-64">
                  <img
                    src={barber.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                    }}
                  >
                    <h3 className="text-2xl font-bold text-white">
                      {barber.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 border"
                    style={{
                      backgroundColor: 'rgba(212, 175, 55, 0.2)',
                      color: 'var(--color-primary)',
                      borderColor: 'var(--color-primary)'
                    }}
                  >
                    {barber.specialty || 'Especialista'}
                  </div>

                  <p className="text-sm text-gray-400 font-light mb-4">
                    {barber.bio || 'Barbero profesional con años de experiencia en cortes modernos y clásicos.'}
                  </p>

                  <Link
                    href="/register"
                    className="block text-center px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-dark)'
                    }}
                  >
                    Reservar con {barber.name.split(' ')[0]}
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div
          className="mt-16 p-8 rounded-2xl text-center border-2"
          style={{
            backgroundColor: 'var(--color-dark-light)',
            borderColor: 'var(--color-primary)'
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Reserva con tu barbero favorito
          </h2>
          <p className="text-gray-400 font-light mb-6">
            Elige el profesional que mejor se adapte a tu estilo
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-dark)'
            }}
          >
            Comenzar Ahora
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t py-8 mt-12"
        style={{ borderColor: 'var(--color-dark-lighter)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-light text-sm">
              © 2024 Black Gold Barbershop. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/" className="text-gray-400 hover:text-white text-sm font-light">
                Inicio
              </Link>
              <Link href="/services" className="text-gray-400 hover:text-white text-sm font-light">
                Servicios
              </Link>
              <Link href="/barbers" className="text-gray-400 hover:text-white text-sm font-light">
                Barberos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}