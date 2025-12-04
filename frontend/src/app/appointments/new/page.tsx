'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { servicesService, barbersService, appointmentsService } from '@/services/api';
import type { Service, Barber } from '@/types';

export default function NewAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    service_id: 0,
    barber_id: 0,
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);

  useEffect(() => {
    loadServices();
    loadBarbers();
  }, []);

  useEffect(() => {
    if (formData.barber_id && formData.service_id && formData.appointment_date) {
      loadAvailableSlots();
    }
  }, [formData.barber_id, formData.service_id, formData.appointment_date]);

  const loadServices = async () => {
    try {
      const response = await servicesService.getAll(true);
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const loadBarbers = async () => {
    try {
      const response = await barbersService.getAll(true);
      setBarbers(response.data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const response = await barbersService.getAvailability(
        formData.barber_id,
        formData.appointment_date,
        formData.service_id
      );
      setAvailableSlots(response.data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setFormData({ ...formData, service_id: service.id });
    setStep(2);
  };

  const handleBarberSelect = (barber: Barber) => {
    setSelectedBarber(barber);
    setFormData({ ...formData, barber_id: barber.id });
    setStep(3);
  };

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, appointment_date: date, appointment_time: '' });
  };

  const handleTimeSelect = (time: string) => {
    setFormData({ ...formData, appointment_time: time });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await appointmentsService.create({
        service_id: formData.service_id,
        barber_id: formData.barber_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        notes: formData.notes,
      });

      alert('¡Cita reservada exitosamente!');
      router.push('/appointments');
    } catch (error: any) {
      alert(error.message || 'Error al crear la cita');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Mínimo mañana
    return today.toISOString().split('T')[0];
  };

  return (
    <ProtectedRoute allowedRoles={['client']}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
          <div className="inline-block">
            <h1 
              className="text-yellow-400 font-light text-4xl tracking-wider mb-2"
              style={{ fontWeight: 300 }}
            >
              Nueva Cita
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
            Reserva tu próxima visita en 3 simples pasos
          </p>
        </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8 space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= s ? 'text-black' : 'text-gray-500'
                  }`}
                  style={{
                    backgroundColor: step >= s ? 'var(--color-primary)' : 'var(--color-dark-lighter)'
                  }}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className="w-16 h-1"
                    style={{
                      backgroundColor: step > s ? 'var(--color-primary)' : 'var(--color-dark-lighter)'
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Service */}
          {step === 1 && (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                1. Selecciona un Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="p-4 rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-dark-lighter)',
                      borderColor: formData.service_id === service.id ? 'var(--color-primary)' : 'var(--color-dark-light)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                      <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                        S/ {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 font-light mb-2">{service.description}</p>
                    <p className="text-xs text-gray-500">⏱️ {service.duration} minutos</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 2: Select Barber */}
          {step === 2 && (
            <Card className="p-6">
              <button
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-white mb-4 font-light"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                2. Selecciona tu Barbero
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    onClick={() => handleBarberSelect(barber)}
                    className="p-4 rounded-lg border-2 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-dark-lighter)',
                      borderColor: formData.barber_id === barber.id ? 'var(--color-primary)' : 'var(--color-dark-light)'
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={barber.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                        alt={barber.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{barber.name}</h3>
                        <p className="text-sm font-light" style={{ color: 'var(--color-primary)' }}>
                          {barber.specialty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <Card className="p-6">
              <button
                onClick={() => setStep(2)}
                className="text-gray-400 hover:text-white mb-4 font-light"
              >
                ← Volver
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                3. Selecciona Fecha y Hora
              </h2>

              {/* Selected Summary */}
              <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-dark-lighter)' }}>
                <p className="text-sm text-gray-400 font-light mb-2">Resumen de tu reserva:</p>
                <p className="text-white">
                  <strong>{selectedService?.name}</strong> con <strong>{selectedBarber?.name}</strong>
                </p>
                <p className="text-sm" style={{ color: 'var(--color-primary)' }}>
                  S/ {Number(selectedService?.price).toFixed(2)} • {selectedService?.duration} min
                </p>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <label className="block text-sm font-light text-gray-300 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={formData.appointment_date}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 font-light"
                  style={{
                    backgroundColor: 'var(--color-dark-lighter)',
                    borderColor: 'var(--color-dark-light)',
                    color: 'white'
                  }}
                />
              </div>

              {/* Time Selection */}
              {formData.appointment_date && (
                <div className="mb-6">
                  <label className="block text-sm font-light text-gray-300 mb-2">
                    Hora Disponible
                  </label>
                  {loadingSlots ? (
                    <div className="text-center py-4">
                      <p className="text-gray-400 font-light">Cargando horarios...</p>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-gray-400 font-light">No hay horarios disponibles para esta fecha</p>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleTimeSelect(slot)}
                          className={`px-4 py-2 rounded-lg font-light transition-colors ${
                            formData.appointment_time === slot
                              ? 'text-black font-semibold'
                              : 'text-white'
                          }`}
                          style={{
                            backgroundColor: formData.appointment_time === slot
                              ? 'var(--color-primary)'
                              : 'var(--color-dark-lighter)'
                          }}
                        >
                          {slot.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-light text-gray-300 mb-2">
                  Notas adicionales (opcional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Ej: Prefiero corte corto..."
                  className="w-full px-4 py-3 rounded-lg border-2 font-light"
                  style={{
                    backgroundColor: 'var(--color-dark-lighter)',
                    borderColor: 'var(--color-dark-light)',
                    color: 'white'
                  }}
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!formData.appointment_time || loading}
                loading={loading}
                className="w-full"
                variant="primary"
              >
                Confirmar Reserva
              </Button>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}