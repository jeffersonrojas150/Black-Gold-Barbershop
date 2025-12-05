'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const getRoleBadge = () => {
    const roleColors = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/50',
      barber: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      client: 'bg-green-500/20 text-green-400 border-green-500/50',
    };

    const roleLabels = {
      admin: 'Administrador',
      barber: 'Barbero',
      client: 'Cliente',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs border ${roleColors[user?.role || 'client']}`}
        style={{ fontWeight: 400 }}
      >
        {roleLabels[user?.role || 'client']}
      </span>
    );
  };

  return (
    <nav
      className="border-b sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--color-dark)',
        borderColor: 'var(--color-dark-lighter)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo con línea divisoria elegante */}
          <Link href="/dashboard" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Black Gold Barbershop"
              className="h-12 w-auto"
            />
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <span
                  className="text-3xl font-bold tracking-wider"
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
                className="text-3xl font-bold tracking-wider ml-1"
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
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className={`transition-colors font-light ${isActive('/dashboard')
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              Dashboard
            </Link>

            {user?.role === 'client' && (
              <>
                <Link
                  href="/appointments/new"
                  className={`transition-colors font-light ${isActive('/appointments/new')
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Nueva Cita
                </Link>
                <Link
                  href="/appointments"
                  className={`transition-colors font-light ${pathname === '/appointments'
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Mis Citas
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link
                  href="/admin/services"
                  className={`transition-colors font-light ${isActive('/admin/services')
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Servicios
                </Link>
                <Link
                  href="/admin/barbers"
                  className={`transition-colors font-light ${isActive('/admin/barbers')
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Barberos
                </Link>
                <Link
                  href="/admin/appointments"
                  className={`transition-colors font-light ${isActive('/admin/appointments')
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-white'
                    }`}
                >
                  Citas
                </Link>
              </>
            )}

            {user?.role === 'barber' && (
              <Link
                href="/barber/appointments"
                className={`transition-colors font-light ${isActive('/barber/appointments')
                  ? 'text-yellow-400'
                  : 'text-gray-300 hover:text-white'
                  }`}
              >
                Mis Citas
              </Link>
            )}
          </div>

          {/* User Info + Hamburger */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-4">
              {getRoleBadge()}
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400 font-light">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:block px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-dark-lighter)',
              }}
            >
              Salir
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--color-primary)' }}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu (estilo drawer) */}
      {mobileMenuOpen && (
        <>
          {/* Overlay oscuro */}
          <div
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div
            className="fixed top-0 left-0 bottom-0 w-72 z-50 md:hidden shadow-2xl overflow-y-auto"
            style={{ backgroundColor: 'var(--color-dark)' }}
          >
            {/* Header del Sidebar */}
            <div className="p-6 border-b" style={{ borderColor: 'var(--color-dark-lighter)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="/logo.png"
                    alt="Black Gold Barbershop"
                    className="h-8 w-auto"
                  />
                  <div className="flex items-center">
                    <div className="relative">
                      <span
                        className="text-xl font-bold tracking-wider"
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
                      className="text-xl font-bold tracking-wider ml-1"
                      style={{
                        color: 'var(--color-primary)',
                        fontFamily: 'var(--font-display)'
                      }}
                    >
                      Gold
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 font-light">{user?.email}</p>
                </div>
              </div>
              <div className="mt-3">
                {getRoleBadge()}
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-4">
              <Link
                href="/dashboard"
                className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/dashboard')
                  ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:bg-gray-800'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >

                <span className="font-light">Dashboard</span>
              </Link>

              {user?.role === 'client' && (
                <>
                  <Link
                    href="/appointments/new"
                    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/appointments/new')
                      ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >

                    <span className="font-light">Nueva Cita</span>
                  </Link>
                  <Link
                    href="/appointments"
                    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${pathname === '/appointments'
                      ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >

                    <span className="font-light">Mis Citas</span>
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link
                    href="/admin/services"
                    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/admin/services')
                      ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">✂️</span>
                    <span className="font-light">Servicios</span>
                  </Link>
                  <Link
                    href="/admin/barbers"
                    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/admin/barbers')
                      ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">👨‍💼</span>
                    <span className="font-light">Barberos</span>
                  </Link>
                  <Link
                    href="/admin/appointments"
                    className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/admin/appointments')
                      ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-xl">📅</span>
                    <span className="font-light">Citas</span>
                  </Link>
                </>
              )}

              {user?.role === 'barber' && (
                <Link
                  href="/barber/appointments"
                  className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive('/barber/appointments')
                    ? 'bg-yellow-400/10 border-l-4 border-yellow-400 text-yellow-400'
                    : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">📋</span>
                  <span className="font-light">Mis Citas</span>
                </Link>
              )}

              {/* Botón de Cerrar Sesión */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-6 py-3 w-full text-left text-red-400 hover:bg-red-500/10 transition-colors mt-4"
              >

                <span className="font-light">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};