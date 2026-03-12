import { localService } from './localService';
import { supabaseService } from './supabaseService';

// Change this to true to enable Supabase globally
const USE_SUPABASE = true;

export const apiService = USE_SUPABASE ? supabaseService : localService;
export type { AdminBooking, AdminMessage } from '../types';
