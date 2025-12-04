'use client';

import { useAuth } from '@/lib/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useEffect, useState } from 'react';
import { appointmentsService } from '@/services/api';
import type { Appointment } from '@/types';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas si es admin o barber
      if (user?.role === 'admin' || user?.role === 'barber') {
        const statsResponse = await appointmentsService.getStats();
        setStats(statsResponse.data);
      }

      // Cargar próximas citas
      const appointmentsResponse = await appointmentsService.getAll({ 
        status: user?.role === 'client' ? undefined : 'confirmed' 
      });
      
      // Filtrar próximas citas
      const today = new Date().toISOString().split('T')[0];
      const upcomingAppointments = appointmentsResponse.data?.filter(
        (apt: Appointment) => apt.appointment_date >= today
      ).slice(0, 5) || [];
      
      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />
        
        {(authLoading || loading) ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                   style={{ borderColor: 'var(--color-primary)' }}></div>
              <p className="text-gray-400 font-light">Cargando...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block">
                <h1 
                  className="text-yellow-400 font-light text-4xl tracking-wider mb-2"
                  style={{ fontWeight: 300 }}
                >
                  {user?.role === 'admin' && ' Hola Admin 👋'}
                  {user?.role === 'barber' && ` Hola ${user?.name || 'Barbero'}👋`}
                  {user?.role === 'client' && ` Hola ${user?.name || 'Cliente'}👋`}
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
                {user?.role === 'admin' && 'Panel de administración'}
                {user?.role === 'barber' && 'Gestiona tus citas del día'}
                {user?.role === 'client' && 'Reserva tu próxima cita'}
              </p>
            </div>

            {/* Stats Grid (Admin y Barber) */}
            {(user?.role === 'admin' || user?.role === 'barber') && stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 border" style={{ borderColor: 'var(--color-primary)', borderWidth: '1px' }}>
                  <p className="text-gray-400 text-sm font-light mb-2">Total de Citas</p>
                  <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    {stats.total}
                  </p>
                </Card>

                <Card className="p-6 border" style={{ borderColor: 'var(--color-accent-ligh)', borderWidth: '1px' }}>
                  <p className="text-gray-400 text-sm font-light mb-2">Este Mes</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.thisMonth}
                  </p>
                </Card>

                <Card className="p-6 border" style={{ borderColor: 'var(--color-primary)', borderWidth: '1px' }}>
                  <p className="text-gray-400 text-sm font-light mb-2">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {stats.byStatus?.find((s: any) => s.status === 'pending')?.count || 0}
                  </p>
                </Card>

                {user?.role === 'admin' && (
                  <Card className="p-6 border" style={{ borderColor: 'var(--color-accent-ligh)', borderWidth: '1px' }}>
                    <p className="text-gray-400 text-sm font-light mb-2">Ingresos del Mes</p>
                    <p className="text-3xl font-bold text-green-500">
                      S/ {Number(stats.monthlyRevenue || 0).toFixed(2)}
                    </p>
                  </Card>
                )}
              </div>
            )}

            {/* Quick Actions - Solo para clientes */}
            {user?.role === 'client' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/appointments/new">
                  <Card className="p-6 hover:opacity-80 transition-all cursor-pointer border-2 hover:scale-105" style={{ borderColor: 'var(--color-primary)' }}>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <span className="text-2xl">📅</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Nueva Cita</h3>
                        <p className="text-sm text-gray-400 font-light">Reserva tu próximo corte</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/services">
                  <Card className="p-6 hover:opacity-80 transition-all cursor-pointer border-2 hover:scale-105" style={{ borderColor: 'var(--color-primary)' }}>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <span className="text-2xl">✂️</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Servicios</h3>
                        <p className="text-sm text-gray-400 font-light">Ver todos los servicios</p>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link href="/barbers">
                  <Card className="p-6 hover:opacity-80 transition-all cursor-pointer border-2 hover:scale-105" style={{ borderColor: 'var(--color-primary)' }}>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                      >
                        <span className="text-2xl">👨‍💼</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Barberos</h3>
                        <p className="text-sm text-gray-400 font-light">Conoce a nuestro equipo</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            )}

            {/* Próximas Citas */}
            <Card className="p-6 border" style={{ borderColor: 'var(--color-primary)', borderWidth: '1px' }}>
              <h2 className="text-2xl font-bold text-white mb-4">
                Próximas Citas
              </h2>

              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 font-light">No hay citas próximas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: 'var(--color-dark-lighter)',
                        borderColor: 'var(--color-dark-light)'
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{appointment.service_name}</h3>
                          <p className="text-sm text-gray-400 font-light">
                            {user?.role === 'client' ? `Barbero: ${appointment.barber_name}` : `Cliente: ${appointment.client_name}`}
                          </p>
                          <p className="text-sm font-light mt-1" style={{ color: 'var(--color-primary)' }}>
                            {new Date(appointment.appointment_date).toLocaleDateString('es-PE', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} - {appointment.appointment_time.slice(0, 5)}
                          </p>
                        </div>
                        <span 
                          className={`px-3 py-1 rounded-full text-xs ${
                            appointment.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            appointment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {appointment.status === 'confirmed' && 'Confirmada'}
                          {appointment.status === 'pending' && 'Pendiente'}
                          {appointment.status === 'completed' && 'Completada'}
                          {appointment.status === 'cancelled' && 'Cancelada'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}