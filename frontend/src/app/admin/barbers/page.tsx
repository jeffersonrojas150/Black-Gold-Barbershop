'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { barbersService } from '@/services/api';
import type { Barber } from '@/types';

export default function AdminBarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialty: '',
    bio: '',
    image_url: '',
    is_active: true,
    schedule_type: 'default', // 'default' o 'custom'
    schedule: [
      { day: 'monday', day_label: 'Lunes', start: '09:00', end: '18:00', is_available: true },
      { day: 'tuesday', day_label: 'Martes', start: '09:00', end: '18:00', is_available: true },
      { day: 'wednesday', day_label: 'Miércoles', start: '09:00', end: '18:00', is_available: true },
      { day: 'thursday', day_label: 'Jueves', start: '09:00', end: '18:00', is_available: true },
      { day: 'friday', day_label: 'Viernes', start: '09:00', end: '18:00', is_available: true },
      { day: 'saturday', day_label: 'Sábado', start: '10:00', end: '16:00', is_available: true },
      { day: 'sunday', day_label: 'Domingo', start: '09:00', end: '18:00', is_available: false },
    ],
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      setLoading(true);
      const response = await barbersService.getAll();
      setBarbers(response.data || []);
    } catch (error) {
      console.error('Error loading barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (barber?: Barber) => {
    setError('');
    if (barber) {
      setEditingBarber(barber);
      setFormData({
        name: barber.name,
        email: barber.email || '',
        password: '',
        phone: barber.phone || '',
        specialty: barber.specialty || '',
        bio: barber.bio || '',
        image_url: barber.image_url || '',
        is_active: barber.is_active,
        schedule_type: 'default',
        schedule: [
          { day: 'monday', day_label: 'Lunes', start: '09:00', end: '18:00', is_available: true },
          { day: 'tuesday', day_label: 'Martes', start: '09:00', end: '18:00', is_available: true },
          { day: 'wednesday', day_label: 'Miércoles', start: '09:00', end: '18:00', is_available: true },
          { day: 'thursday', day_label: 'Jueves', start: '09:00', end: '18:00', is_available: true },
          { day: 'friday', day_label: 'Viernes', start: '09:00', end: '18:00', is_available: true },
          { day: 'saturday', day_label: 'Sábado', start: '10:00', end: '16:00', is_available: true },
          { day: 'sunday', day_label: 'Domingo', start: '09:00', end: '18:00', is_available: false },
        ],
      });
    } else {
      setEditingBarber(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        specialty: '',
        bio: '',
        image_url: '',
        is_active: true,
        schedule_type: 'default',
        schedule: [
          { day: 'monday', day_label: 'Lunes', start: '09:00', end: '18:00', is_available: true },
          { day: 'tuesday', day_label: 'Martes', start: '09:00', end: '18:00', is_available: true },
          { day: 'wednesday', day_label: 'Miércoles', start: '09:00', end: '18:00', is_available: true },
          { day: 'thursday', day_label: 'Jueves', start: '09:00', end: '18:00', is_available: true },
          { day: 'friday', day_label: 'Viernes', start: '09:00', end: '18:00', is_available: true },
          { day: 'saturday', day_label: 'Sábado', start: '10:00', end: '16:00', is_available: true },
          { day: 'sunday', day_label: 'Domingo', start: '09:00', end: '18:00', is_available: false },
        ],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBarber(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (editingBarber) {
        // Editar barbero - no enviamos password si está vacío
        const updateData: any = {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          specialty: formData.specialty || null,
          bio: formData.bio || null,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
          schedule_type: formData.schedule_type,
          schedule: formData.schedule,
        };

        await barbersService.update(editingBarber.id, updateData);
        alert('Barbero actualizado exitosamente');
      } else {
        // Crear barbero - validar que password esté presente
        if (!formData.password) {
          setError('La contraseña es requerida para crear un barbero');
          setSaving(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          setSaving(false);
          return;
        }

        const createData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          specialty: formData.specialty || null,
          bio: formData.bio || null,
          image_url: formData.image_url || null,
          is_active: formData.is_active,
          schedule_type: formData.schedule_type,
          schedule: formData.schedule,
        };

        await barbersService.create(createData);
        alert('Barbero creado exitosamente');
      }

      handleCloseModal();
      loadBarbers();
    } catch (error: any) {
      setError(error.message || 'Error al guardar el barbero');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (barber: Barber) => {
    if (!confirm(`¿Estás seguro de eliminar a ${barber.name}?`)) {
      return;
    }

    try {
      await barbersService.delete(barber.id);
      alert('Barbero eliminado exitosamente');
      loadBarbers();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el barbero');
    }
  };

  const handleToggleActive = async (barber: Barber) => {
    try {
      await barbersService.update(barber.id, {
        is_active: !barber.is_active
      });
      alert(`Barbero ${!barber.is_active ? 'activado' : 'desactivado'} exitosamente`);
      loadBarbers();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el estado');
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--color-dark)' }}>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block">
              <h1
                className="text-gray-400 font-light text-4xl tracking-wider mb-2"
                style={{ fontWeight: 300 }}
              >
                Gestión de Barberos
              </h1>
              <div
                className="h-0.5"
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-primary)',
                  margin: '0 auto'
                }}
              ></div>
            </div>
            <p className="text-gray-400 font-light text-sm mt-2">
              Administra el equipo de barberos
            </p>
          </div>

          {/* Botón Nuevo Barbero */}
          <div className="mb-8 text-right">
            <Button variant="primary" onClick={() => handleOpenModal()}>
              + Nuevo Barbero
            </Button>
          </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {barbers.map((barber) => (
                <Card key={barber.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={barber.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'}
                      alt={barber.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleActive(barber)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${barber.is_active
                          ? 'bg-green-500/20 text-green-400 border border-green-500'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500'
                          }`}
                      >
                        {barber.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {barber.name}
                    </h3>

                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 border"
                      style={{
                        backgroundColor: 'rgba(212, 175, 55, 0.2)',
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                    >
                      {barber.specialty || 'Especialista'}
                    </div>

                    <p className="text-sm text-gray-400 font-light mb-3">
                      {barber.bio || 'Barbero profesional con años de experiencia'}
                    </p>

                    {barber.email && (
                      <p className="text-xs text-gray-500 font-light mb-4">
                        {barber.email}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(barber)}
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(barber)}
                        className="flex-1"
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

        {/* Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={handleCloseModal}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border-2"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{
                backgroundColor: 'var(--color-dark-light)',
                borderColor: 'var(--color-primary)'
              }}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}
                </h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
                    <p className="text-red-500 text-sm font-light">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nombre Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ej: Carlos Mendoza"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required={!editingBarber}
                    placeholder="carlos@barbershop.com"
                  />

                  {!editingBarber && (
                    <Input
                      label="Contraseña"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      placeholder="Mínimo 6 caracteres"
                    />
                  )}

                  <Input
                    label="Teléfono"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="987654321"
                  />

                  <Input
                    label="Especialidad"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="Ej: Cortes clásicos y modernos"
                  />

                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">
                      Biografía
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      placeholder="Describe la experiencia del barbero..."
                      className="w-full px-4 py-3 rounded-lg border-2 font-light"
                      style={{
                        backgroundColor: 'var(--color-dark-lighter)',
                        borderColor: 'var(--color-dark-light)',
                        color: 'white'
                      }}
                    />
                  </div>

                  <Input
                    label="URL de Imagen"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/foto.jpg"
                  />

                  {/* Sección de Horarios */}
                  <div className="border-t pt-4 mt-4" style={{ borderColor: 'var(--color-dark-lighter)' }}>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Horarios de Trabajo
                    </label>

                    {/* Selector de tipo de horario */}
                    <div className="mb-4 space-y-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="schedule_type"
                          value="default"
                          checked={formData.schedule_type === 'default'}
                          onChange={() => setFormData({ ...formData, schedule_type: 'default' })}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm text-gray-300 font-light">
                          Horario por defecto (Lun-Vie 9am-6pm, Sáb 10am-4pm)
                        </span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="schedule_type"
                          value="custom"
                          checked={formData.schedule_type === 'custom'}
                          onChange={() => setFormData({ ...formData, schedule_type: 'custom' })}
                          className="w-4 h-4"
                          style={{ accentColor: 'var(--color-primary)' }}
                        />
                        <span className="text-sm text-gray-300 font-light">
                          Horario personalizado
                        </span>
                      </label>
                    </div>

                    {/* Horario personalizado */}
                    {formData.schedule_type === 'custom' && (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {formData.schedule.map((daySchedule, index) => (
                          <div
                            key={daySchedule.day}
                            className="flex items-center space-x-3 p-3 rounded-lg"
                            style={{ backgroundColor: 'var(--color-dark-lighter)' }}
                          >
                            <input
                              type="checkbox"
                              checked={daySchedule.is_available}
                              onChange={(e) => {
                                const newSchedule = [...formData.schedule];
                                newSchedule[index].is_available = e.target.checked;
                                setFormData({ ...formData, schedule: newSchedule });
                              }}
                              className="w-4 h-4"
                              style={{ accentColor: 'var(--color-primary)' }}
                            />
                            <span className="text-sm text-white font-medium w-24">
                              {daySchedule.day_label}
                            </span>
                            <input
                              type="time"
                              value={daySchedule.start}
                              onChange={(e) => {
                                const newSchedule = [...formData.schedule];
                                newSchedule[index].start = e.target.value;
                                setFormData({ ...formData, schedule: newSchedule });
                              }}
                              disabled={!daySchedule.is_available}
                              className="px-3 py-2 rounded-lg text-sm font-light"
                              style={{
                                backgroundColor: 'var(--color-dark)',
                                borderColor: 'var(--color-dark-light)',
                                color: daySchedule.is_available ? 'white' : 'gray',
                              }}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                              type="time"
                              value={daySchedule.end}
                              onChange={(e) => {
                                const newSchedule = [...formData.schedule];
                                newSchedule[index].end = e.target.value;
                                setFormData({ ...formData, schedule: newSchedule });
                              }}
                              disabled={!daySchedule.is_available}
                              className="px-3 py-2 rounded-lg text-sm font-light"
                              style={{
                                backgroundColor: 'var(--color-dark)',
                                borderColor: 'var(--color-dark-light)',
                                color: daySchedule.is_available ? 'white' : 'gray',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-300 font-light">
                      Barbero activo
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleCloseModal}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={saving}
                      className="flex-1"
                    >
                      {editingBarber ? 'Actualizar' : 'Crear'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}