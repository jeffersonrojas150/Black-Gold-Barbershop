'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { appointmentsService } from '@/services/api';
import type { Appointment } from '@/types';

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const filters = filter === 'all' ? {} : { status: filter };
      const response = await appointmentsService.getAll(filters);
      
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

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    if (!confirm(`¿Cambiar estado a "${newStatus}"?`)) return;

    try {
      setUpdatingId(id);
      await appointmentsService.updateStatus(id, newStatus);
      alert('Estado actualizado exitosamente');
      loadAppointments();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta cita? Esta acción no se puede deshacer.')) return;

    try {
      setUpdatingId(id);
      await appointmentsService.delete(id);
      alert('Cita eliminada exitosamente');
      loadAppointments();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar');
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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-10 text-center">
            <div className="inline-block">
                <h1 
                className="text-gray-400 font-light text-4xl tracking-wider mb-2"
                style={{ fontWeight: 300 }}
                >
                Gestión de Citas
                </h1>
                <div 
                className="h-0.5"
                style={{ 
                    width: '100%',
                    backgroundColor: 'var(--color-primary)'
                }}
                ></div>
            </div>
            <p className="text-gray-400 font-light text-sm mt-2">
                Panel administrativo para gestionar todas las reservas
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
              <p className="text-gray-400 font-light text-lg">
                No hay citas {filter !== 'all' ? filter : 'registradas'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-white">
                          {appointment.service_name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-light">
                              Cliente: <strong className="text-white">{appointment.client_name}</strong>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="font-light">{appointment.client_email}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-light">
                              Barbero: <strong className="text-white">{appointment.barber_name}</strong>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2" style={{ color: 'var(--color-primary)' }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-light">
                              {formatDate(appointment.appointment_date)} • {appointment.appointment_time.slice(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 pt-2 border-t" style={{ borderColor: 'var(--color-dark-lighter)' }}>
                        <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                          S/ {Number(appointment.service_price).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-400 font-light">
                          {appointment.service_duration} min
                        </span>
                      </div>

                      {appointment.notes && (
                        <div className="mt-2 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-dark-lighter)' }}>
                          <p className="text-gray-400 font-light">
                            <strong>Notas:</strong> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                          disabled={updatingId === appointment.id}
                          loading={updatingId === appointment.id}
                        >
                          Confirmar
                        </Button>
                      )}

                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                          disabled={updatingId === appointment.id}
                        >
                          Completar
                        </Button>
                      )}

                      {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                          disabled={updatingId === appointment.id}
                        >
                          Cancelar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(appointment.id)}
                        disabled={updatingId === appointment.id}
                      >
                        Eliminar
                      </Button>
                    </div>
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