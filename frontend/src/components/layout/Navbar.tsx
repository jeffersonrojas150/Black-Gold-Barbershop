'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
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
      className="border-b"
      style={{ 
        backgroundColor: 'var(--color-dark)',
        borderColor: 'var(--color-dark-lighter)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span 
              className="text-3xl font-bold tracking-wider"
              style={{ 
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-display)'
              }}
            >
              Black Gold
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/dashboard" 
              className="text-gray-300 hover:text-white transition-colors font-light"
            >
              Dashboard
            </Link>

            {user?.role === 'client' && (
              <>
                <Link 
                  href="/appointments/new" 
                  className="text-gray-300 hover:text-white transition-colors font-light"
                >
                  Nueva Cita
                </Link>
                <Link 
                  href="/appointments" 
                  className="text-gray-300 hover:text-white transition-colors font-light"
                >
                  Mis Citas
                </Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link 
                  href="/admin/services" 
                  className="text-gray-300 hover:text-white transition-colors font-light"
                >
                  Servicios
                </Link>
                <Link 
                  href="/admin/barbers" 
                  className="text-gray-300 hover:text-white transition-colors font-light"
                >
                  Barberos
                </Link>
                <Link 
                  href="/admin/appointments" 
                  className="text-gray-300 hover:text-white transition-colors font-light"
                >
                  Citas
                </Link>
              </>
            )}

            {user?.role === 'barber' && (
              <Link 
                href="/barber/appointments" 
                className="text-gray-300 hover:text-white transition-colors font-light"
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
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" style={{ borderColor: 'var(--color-dark-lighter)' }}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b" style={{ borderColor: 'var(--color-dark-lighter)' }}>
                {getRoleBadge()}
                <div>
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400 font-light">{user?.email}</p>
                </div>
              </div>

              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white transition-colors font-light py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>

              {user?.role === 'client' && (
                <>
                  <Link 
                    href="/appointments/new" 
                    className="text-gray-300 hover:text-white transition-colors font-light py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Nueva Cita
                  </Link>
                  <Link 
                    href="/appointments" 
                    className="text-gray-300 hover:text-white transition-colors font-light py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mis Citas
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <Link 
                    href="/admin/services" 
                    className="text-gray-300 hover:text-white transition-colors font-light py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Servicios
                  </Link>
                  <Link 
                    href="/admin/barbers" 
                    className="text-gray-300 hover:text-white transition-colors font-light py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Barberos
                  </Link>
                  <Link 
                    href="/admin/appointments" 
                    className="text-gray-300 hover:text-white transition-colors font-light py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Citas
                  </Link>
                </>
              )}

              {user?.role === 'barber' && (
                <Link 
                  href="/barber/appointments" 
                  className="text-gray-300 hover:text-white transition-colors font-light py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Citas
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors mt-4"
                style={{
                  backgroundColor: 'var(--color-dark-lighter)',
                }}
              >
                Salir
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};