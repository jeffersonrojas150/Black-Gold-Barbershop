import type {
  ApiResponse,
  User,
  Service,
  Barber,
  Appointment,
  AppointmentStats,
  RegisterData,
  UpdateProfileData,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper para manejar errores
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  let data;
  
  // Intentar parsear JSON
  try {
    data = await response.json();
  } catch (parseError) {
    throw new Error('Error al procesar la respuesta del servidor');
  }
  
  // Si la respuesta es exitosa, retornar data
  if (response.ok) {
    return data;
  }
  
  // Si no es exitosa, lanzar error con mensaje apropiado
  const errorMessage = 
    (data?.error && String(data.error)) ||
    (data?.message && String(data.message)) ||
    (Array.isArray(data?.errors) && data.errors.length > 0 
      ? data.errors.map((e: any) => String(e?.msg || e?.message || '')).filter(Boolean).join(', ')
      : '') ||
    'Error en la petición al servidor';
  
  throw new Error(errorMessage);
};

// Helper para obtener el token
const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ==================== AUTH ====================

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ token: string; user: User }>(response);
  },

  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<{ token: string; user: User }>(response);
  },

  async getMe(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeader(),
    });
    return handleResponse<User>(response);
  },

  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(response);
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
  },
};

// ==================== SERVICES ====================

export const servicesService = {
  getAll: async (isActive?: boolean): Promise<ApiResponse<Service[]>> => {
    const params = isActive !== undefined ? `?is_active=${isActive}` : '';
    const response = await fetch(`${API_URL}/services${params}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Service[]>(response);
  },

  getById: async (id: number): Promise<ApiResponse<Service>> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Service>(response);
  },

  create: async (data: {
    name: string;
    description: string;
    price: number;
    duration: number;
    image_url?: string | null;
    is_active?: boolean;
  }): Promise<ApiResponse<Service>> => {
    const response = await fetch(`${API_URL}/services`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(response);
  },

  update: async (id: number, data: {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    image_url?: string | null;
    is_active?: boolean;
  }): Promise<ApiResponse<Service>> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Service>(response);
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(response);
  },
};

// ==================== BARBERS ====================

export const barbersService = {
  async getAll(isActive?: boolean): Promise<ApiResponse<Barber[]>> {
    const url = isActive !== undefined 
      ? `${API_URL}/barbers?is_active=${isActive}`
      : `${API_URL}/barbers`;
    
    const response = await fetch(url);
    return handleResponse<Barber[]>(response);
  },

  async getById(id: number): Promise<ApiResponse<Barber>> {
    const response = await fetch(`${API_URL}/barbers/${id}`);
    return handleResponse<Barber>(response);
  },

  async getAvailability(barberId: number, date: string, serviceId: number): Promise<ApiResponse<string[]>> {
    const response = await fetch(
      `${API_URL}/barbers/${barberId}/availability?date=${date}&service_id=${serviceId}`
    );
    return handleResponse<string[]>(response);
  },

  async create(data: {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    specialty?: string | null;
    bio?: string | null;
    image_url?: string | null;
    is_active?: boolean;
  }): Promise<ApiResponse<Barber>> {
    const response = await fetch(`${API_URL}/barbers`, {
      method: 'POST',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Barber>(response);
  },

  async update(id: number, data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    specialty?: string | null;
    bio?: string | null;
    image_url?: string | null;
    is_active?: boolean;
  }): Promise<ApiResponse<Barber>> {
    const response = await fetch(`${API_URL}/barbers/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Barber>(response);
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_URL}/barbers/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<void>(response);
  },
};

// ==================== APPOINTMENTS ====================

interface AppointmentFilters {
  status?: string;
  date?: string;
  barber_id?: number;
}

interface CreateAppointmentData {
  barber_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  notes?: string;
}

export const appointmentsService = {
  async getAll(filters?: AppointmentFilters): Promise<ApiResponse<Appointment[]>> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.barber_id) params.append('barber_id', filters.barber_id.toString());

    const url = params.toString() 
      ? `${API_URL}/appointments?${params}`
      : `${API_URL}/appointments`;

    const response = await fetch(url, {
      headers: getAuthHeader(),
    });
    return handleResponse<Appointment[]>(response);
  },

  async getById(id: number): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<Appointment>(response);
  },

  async create(data: CreateAppointmentData): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Appointment>(response);
  },

  async updateStatus(id: number, status: string): Promise<ApiResponse<Appointment>> {
    const response = await fetch(`${API_URL}/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse<Appointment>(response);
  },

  async delete(id: number): Promise<ApiResponse> {
    const response = await fetch(`${API_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  },

  async getStats(): Promise<ApiResponse<AppointmentStats>> {
    const response = await fetch(`${API_URL}/appointments/stats`, {
      headers: getAuthHeader(),
    });
    return handleResponse<AppointmentStats>(response);
  },
};