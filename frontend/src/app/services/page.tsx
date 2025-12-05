'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { servicesService } from '@/services/api';
import type { Service } from '@/types';
import { Card } from '@/components/ui/Card';

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesService.getAll(true);
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si está autenticado, usar el Navbar del dashboard
  if (isAuthenticated) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-block">
              <h1 className="text-yellow-400 font-light text-4xl tracking-wider mb-2" style={{ fontWeight: 300 }}>
                Nuestros Servicios
              </h1>
              <div className="h-0.5 mx-auto" style={{ width: '60%', backgroundColor: 'var(--color-primary)' }}></div>
            </div>
            <p className="text-gray-400 font-light text-sm mt-4">
              Descubre nuestra selección de servicios premium de barbería
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
                <p className="text-gray-400 font-light">Cargando servicios...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:scale-105 transition-transform">
                  <div className="relative h-48">
                    <img src={service.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500'} alt={service.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>
                      S/ {Number(service.price).toFixed(2)}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-400 font-light mb-4">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-light">⏱️ {service.duration} min</span>
                      <Link href="/appointments/new" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>
                        Reservar
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si NO está autenticado, mostrar navbar público
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
      {/* Navbar Público */}
      <nav className="border-b" style={{ borderColor: 'var(--color-dark-lighter)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <img src="/logo.png" alt="Black Gold Barbershop" className="h-12 w-auto" />
              <div className="flex items-center">
                <div className="relative">
                  <span className="text-2xl sm:text-3xl font-bold tracking-wider" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Black</span>
                  <div className="absolute top-1/2 left-0 right-0 h-[2px] opacity-30" style={{ backgroundColor: 'var(--color-primary)', transform: 'translateY(-50%) rotate(-5deg)' }}></div>
                </div>
                <span className="text-2xl sm:text-3xl font-bold tracking-wider ml-1" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>Gold</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-light">Inicio</Link>
              <Link href="/services" className="text-yellow-400 font-light">Servicios</Link>
              <Link href="/barbers" className="text-gray-300 hover:text-white transition-colors font-light">Barberos</Link>
              <Link href="/login" className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors hover:opacity-80" style={{ backgroundColor: 'var(--color-dark-lighter)' }}>Iniciar Sesión</Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>Registrarse</Link>
            </div>

            <button onClick={() => { const menu = document.getElementById('mobile-menu-services'); if (menu) menu.classList.toggle('hidden'); }} className="md:hidden p-2 rounded-lg" style={{ color: 'var(--color-primary)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>

          <div id="mobile-menu-services" className="hidden md:hidden pb-4 border-t mt-2" style={{ borderColor: 'var(--color-dark-lighter)' }}>
            <div className="flex flex-col space-y-3 pt-4">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-light py-2">Inicio</Link>
              <Link href="/services" className="text-yellow-400 font-light py-2">Servicios</Link>
              <Link href="/barbers" className="text-gray-300 hover:text-white transition-colors font-light py-2">Barberos</Link>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors font-light py-2">Iniciar Sesión</Link>
              <Link href="/register" className="px-4 py-2 text-sm font-medium rounded-lg transition-colors text-center" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>Registrarse</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content (igual que antes) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-yellow-400 font-light text-4xl tracking-wider mb-2" style={{ fontWeight: 300 }}>Nuestros Servicios</h1>
            <div className="h-0.5 mx-auto" style={{ width: '60%', backgroundColor: 'var(--color-primary)' }}></div>
          </div>
          <p className="text-gray-400 font-light text-sm mt-4">Descubre nuestra selección de servicios premium de barbería</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--color-primary)' }}></div>
              <p className="text-gray-400 font-light">Cargando servicios...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:scale-105 transition-transform">
                <div className="relative h-48">
                  <img src={service.image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500'} alt={service.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>
                    S/ {Number(service.price).toFixed(2)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-400 font-light mb-4">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-light">⏱️ {service.duration} min</span>
                    <Link href="/register" className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>Reservar</Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 p-8 rounded-2xl text-center border-2" style={{ backgroundColor: 'var(--color-dark-light)', borderColor: 'var(--color-primary)' }}>
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para tu próximo corte?</h2>
          <p className="text-gray-400 font-light mb-6">Regístrate ahora y reserva tu cita en minutos</p>
          <Link href="/register" className="inline-block px-8 py-4 text-lg font-medium rounded-lg transition-all hover:scale-105" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}>Crear Cuenta Gratis</Link>
        </div>
      </div>

      <footer className="border-t py-8 mt-12" style={{ borderColor: 'var(--color-dark-lighter)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 font-light text-sm">© 2024 Black Gold Barbershop. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/" className="text-gray-400 hover:text-white text-sm font-light">Inicio</Link>
              <Link href="/services" className="text-gray-400 hover:text-white text-sm font-light">Servicios</Link>
              <Link href="/barbers" className="text-gray-400 hover:text-white text-sm font-light">Barberos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}