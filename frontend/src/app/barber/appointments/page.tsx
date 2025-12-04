'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { appointmentsService } from '@/services/api';
import type { Appointment } from '@/types';

export default function BarberAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('today');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      let filters = {};

      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        filters = { date: today };
      } else if (filter !== 'all') {
        filters = { status: filter };
      }

      const response = await appointmentsService.getAll(filters);
      
      const sorted = (response.data || []).sort((a, b) => {
        const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
        const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
        return dateA.getTime() - dateB.getTime();
      });
      
      setAppointments(sorted);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: number) => {
    if (!confirm('¿Marcar esta cita como completada?')) return;

    try {
      setUpdatingId(id);
      await appointmentsService.updateStatus(id, 'completed');
      alert('Cita completada exitosamente');
      loadAppointments();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar');
    } finally {
      setUpdatingId(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={['barber']}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 
              className="text-4xl font-bold mb-2"
              style={{ 
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-display)'
              }}
            >
              Mis Citas Asignadas
            </h1>
            <p className="text-gray-400 font-light">
              Gestiona tus citas programadas
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { value: 'today', label: 'Hoy' },
              { value: 'all', label: 'Todas' },
              { value: 'confirmed', label: 'Confirmadas' },
              { value: 'completed', label: 'Completadas' },
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-4 py-2 rounded-lg font-light transition-colors ${
                  filter === filterOption.value ? 'text-black font-semibold' : 'text-white'
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
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-400 font-light text-lg">
                No tienes citas {filter === 'today' ? 'para hoy' : filter !== 'all' ? filter : ''}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-white">
                          {appointment.service_name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-light">
                            Cliente: <strong className="text-white">{appointment.client_name}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-light capitalize">
                            {formatDate(appointment.appointment_date)} • {appointment.appointment_time.slice(0, 5)}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-light">{appointment.service_duration} min</span>
                        </div>

                        {appointment.client_phone && (
                          <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="font-light">{appointment.client_phone}</span>
                          </div>
                        )}

                        {appointment.notes && (
                          <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-dark-lighter)' }}>
                            <p className="text-xs text-gray-400 font-light">
                              <strong>Notas del cliente:</strong> {appointment.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {appointment.status === 'confirmed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleComplete(appointment.id)}
                        loading={updatingId === appointment.id}
                        disabled={updatingId === appointment.id}
                      >
                        Marcar Completada
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}