'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { servicesService } from '@/services/api';
import type { Service } from '@/types';
import { useAuth } from '@/lib/AuthContext';

export default function ServicesPage() {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await servicesService.getAll(true);
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
      {isAuthenticated && <Navbar />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 
              className="text-gray-400 font-light text-4xl tracking-wider mb-2"
              style={{ fontWeight: 300 }}
            >
              Nuestros Servicios
            </h1>
            <div 
              className="h-0.5 mx-auto"
              style={{ 
                width: '100%',
                backgroundColor: 'var(--color-primary)'
              }}
            ></div>
          </div>
          <p className="text-gray-400 font-light text-sm mt-4">
            Servicios premium para el caballero moderno
          </p>
</div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div 
                className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ borderColor: 'var(--color-primary)' }}
              ></div>
              <p className="text-gray-400 font-light">Cargando servicios...</p>
            </div>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Service Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500'} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full font-semibold"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: '#000'
                    }}
                  >
                    S/ {Number(service.price).toFixed(2)}
                  </div>
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 font-light mb-4 text-sm">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-dark-lighter)' }}>
                    <div className="flex items-center space-x-2">
                      <svg 
                        className="w-5 h-5" 
                        style={{ color: 'var(--color-primary)' }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-400 font-light">
                        {service.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && services.length > 0 && isAuthenticated && (
          <div className="text-center mt-12">
            <a 
              href="/appointments/new"
              className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-200 hover:opacity-90"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: '#000'
              }}
            >
              Reservar Cita Ahora
            </a>
          </div>
        )}

        {!loading && services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-light text-lg">
              No hay servicios disponibles en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}