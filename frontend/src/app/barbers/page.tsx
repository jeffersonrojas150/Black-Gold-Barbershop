'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card } from '@/components/ui/Card';
import { barbersService } from '@/services/api';
import type { Barber } from '@/types';
import { useAuth } from '@/lib/AuthContext';

export default function BarbersPage() {
  const { isAuthenticated } = useAuth();
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const response = await barbersService.getAll(true);
      setBarbers(response.data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
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
              Nuestros Barberos
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
            Profesionales expertos en el arte del cuidado masculino
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
              <p className="text-gray-400 font-light">Cargando barberos...</p>
            </div>
          </div>
        ) : (
          /* Barbers Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {barbers.map((barber) => (
              <Card key={barber.id} className="overflow-hidden hover:scale-105 transition-transform duration-300">
                {/* Barber Image */}
                <div className="relative h-64 overflow-hidden">
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

                {/* Barber Info */}
                <div className="p-6">
                  <div 
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ 
                      backgroundColor: 'var(--color-primary)',
                      color: '#000'
                    }}
                  >
                    {barber.specialty}
                  </div>
                  
                  <p className="text-gray-400 font-light text-sm mb-4">
                    {barber.bio}
                  </p>

                  {barber.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-light">{barber.email}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && barbers.length > 0 && isAuthenticated && (
          <div className="text-center mt-12">
            <a 
              href="/appointments/new"
              className="inline-block px-8 py-4 rounded-lg font-semibold transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-primary)',
                color: '#000'
              }}
            >
              Reservar con tu Barbero Favorito
            </a>
          </div>
        )}

        {!loading && barbers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-light text-lg">
              No hay barberos disponibles en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}