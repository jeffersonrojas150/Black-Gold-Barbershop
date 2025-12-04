'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { appointmentsService } from '@/services/api';
import type { Appointment } from '@/types';
import { useAuth } from '@/lib/AuthContext';

export default function MyAppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const filters = filter === 'all' ? {} : { status: filter };
      const response = await appointmentsService.getAll(filters);
      
      // Ordenar por fecha más reciente primero
      const sorted = (response.data || []).sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
        const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
        return dateB.getTime() - dateA.getTime();
      });
      
      setAppointments(sorted);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: number, appointmentDate: string) => {
    // Verificar que faltan al menos 2 días
    const appointmentDateTime = new Date(appointmentDate);
    const now = new Date();
    const diffTime = appointmentDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 2) {
      alert('Solo puedes cancelar citas con al menos 2 días de anticipación');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      setCancellingId(id);
      await appointmentsService.updateStatus(id, 'cancelled');
      alert('Cita cancelada exitosamente');
      loadAppointments();
    } catch (error: any) {
      alert(error.message || 'Error al cancelar la cita');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pendiente' },
      confirmed: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Confirmada' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Cancelada' },
      completed: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Completada' },
    };

    const badge = badges[status as keyof typeof badges] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const canCancel = (appointment: Appointment) => {
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return false;
    }

    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    const now = new Date();
    const diffTime = appointmentDateTime.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 2;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPastAppointment = (appointment: Appointment) => {
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return appointmentDateTime < new Date();
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ 
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-display)'
              }}
            >
              Mis Citas
            </h1>
            <p className="text-gray-400 font-light">
              Gestiona tus reservas y ve tu historial
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { value: 'all', label: 'Todas' },
              { value: 'pending', label: 'Pendientes' },
              { value: 'confirmed', label: 'Confirmadas' },
              { value: 'completed', label: 'Completadas' },
              { value: 'cancelled', label: 'Canceladas' },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg font-light transition-colors ${
                  filter === filterOption.value
                    ? 'text-black font-semibold'
                    : 'text-white'
                }`}
                style={{
                  backgroundColor: filter === filterOption.value
                    ? 'var(--color-primary)'
                    : 'var(--color-dark-lighter)'
                }}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div 
                  className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                  style={{ borderColor: 'var(--color-primary)' }}
                ></div>
                <p className="text-gray-400 font-light">Cargando citas...</p>
              </div>
            </div>
          ) : appointments.length === 0 ? (
            /* Empty State */
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No tienes citas {filter !== 'all' ? filter : ''}
              </h3>
              <p className="text-gray-400 font-light mb-6">
                ¿Listo para tu próximo corte?
              </p>
              <a 
                href="/appointments/new"
                className="inline-block px-6 py-3 rounded-lg font-semibold transition-all"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: '#000'
                }}
              >
                Reservar Cita
              </a>
            </Card>
          ) : (
            /* Appointments List */
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {appointment.service_name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                        {isPastAppointment(appointment) && appointment.status !== 'completed' && (
                          <span className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400">
                            Pasada
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-light">Barbero: <strong className="text-white">{appointment.barber_name}</strong></span>
                        </div>

                        <div className="flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-light capitalize">
                            {formatDate(appointment.appointment_date)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-light">
                            {appointment.appointment_time.slice(0, 5)} • {appointment.service_duration} min
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                            S/ {Number(appointment.service_price).toFixed(2)}
                          </span>
                        </div>

                        {appointment.notes && (
                          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-dark-lighter)' }}>
                            <p className="text-xs text-gray-400 font-light">
                              <strong>Notas:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col gap-2">
                      {canCancel(appointment) && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelAppointment(appointment.id, appointment.appointment_date)}
                          loading={cancellingId === appointment.id}
                          disabled={cancellingId === appointment.id}
                        >
                          Cancelar Cita
                        </Button>
                      )}

                      {!canCancel(appointment) && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                        <p className="text-xs text-gray-500 text-center font-light">
                          No se puede cancelar<br/>(menos de 2 días)
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CTA for new appointment */}
          {!loading && appointments.length > 0 && (
            <div className="text-center mt-8">
              <a 
                href="/appointments/new"
                className="inline-block px-8 py-4 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: '#000'
                }}
              >
                Reservar Nueva Cita
              </a>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}