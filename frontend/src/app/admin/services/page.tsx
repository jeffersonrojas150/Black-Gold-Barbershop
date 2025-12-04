'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { servicesService } from '@/services/api';
import type { Service } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image_url: '',
    is_active: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await servicesService.getAll();
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration.toString(),
        image_url: service.image_url || '',
        is_active: service.is_active,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        image_url: '',
        is_active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const serviceData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        image_url: formData.image_url || null,
        is_active: formData.is_active,
      };

      if (editingService) {
        await servicesService.update(editingService.id, serviceData);
        alert('Servicio actualizado exitosamente');
      } else {
        await servicesService.create(serviceData);
        alert('Servicio creado exitosamente');
      }

      handleCloseModal();
      loadServices();
    } catch (error: any) {
      alert(error.message || 'Error al guardar el servicio');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      await servicesService.delete(id);
      alert('Servicio eliminado exitosamente');
      loadServices();
    } catch (error: any) {
      alert(error.message || 'Error al eliminar el servicio');
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await servicesService.update(service.id, {
        ...service,
        is_active: !service.is_active,
      });
      loadServices();
    } catch (error: any) {
      alert(error.message || 'Error al actualizar el estado');
    }
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
                Gestión de Servicios
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
                Administra los servicios de la barbería
            </p>
            </div>
            <div className="mb-8 text-right">
            <Button variant="primary" onClick={() => handleOpenModal()}>
                + Nuevo Servicio
            </Button>
            </div>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden rounded-xl transition-all hover:scale-105">
                  <div className="relative h-48">
                    <img 
                      src={service.image_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500'} 
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => handleToggleActive(service)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {service.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-light mb-3">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-sm">
                      <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                        S/ {Number(service.price).toFixed(2)}
                      </span>
                      <span className="text-gray-400 font-light">
                        {service.duration} min
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleOpenModal(service)}
                        className="flex-1"
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(service.id)}
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-6"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--color-dark-light)',
              borderColor: 'var(--color-dark-lighter)',
              borderWidth: '1px'
            }}
          >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Nombre del Servicio"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Ej: Corte Premium"
                  />

                  <div>
                    <label className="block text-sm font-light text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={3}
                      placeholder="Describe el servicio..."
                      className="w-full px-4 py-3 rounded-lg border-2 font-light"
                      style={{
                        backgroundColor: 'var(--color-dark-lighter)',
                        borderColor: 'var(--color-dark-light)',
                        color: 'white'
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Precio (S/)"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="35.00"
                    />

                    <Input
                      label="Duración (minutos)"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                      placeholder="45"
                    />
                  </div>

                  <Input
                    label="URL de Imagen (opcional)"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="is_active" className="text-sm text-gray-300 font-light">
                      Servicio activo
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
                      {editingService ? 'Actualizar' : 'Crear'}
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