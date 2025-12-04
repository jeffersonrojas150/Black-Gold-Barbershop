// ==================== API RESPONSE ====================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  count?: number;
  token?: string;
  user?: User;
}

// ==================== USER ====================
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'barber' | 'client';
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

// ==================== SERVICE ====================
export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ==================== BARBER ====================
export interface Barber {
  id: number;
  user_id: number;
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  bio: string;
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BarberSchedule {
  id: number;
  barber_id: number;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  is_available: boolean;
}

// ==================== APPOINTMENT ====================
export interface Appointment {
  id: number;
  client_id: number;
  barber_id: number;
  service_id: number;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Datos combinados de las relaciones
  service_name?: string;
  service_price?: number;
  service_duration?: number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  barber_name?: string;
}

export interface AppointmentStats {
  total: number;
  byStatus: {
    status: string;
    count: number;
  }[];
  thisMonth: number;
  monthlyRevenue?: number;
}

// ==================== AUTH ====================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}