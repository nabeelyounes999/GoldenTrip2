import { createClient } from '@supabase/supabase-js';
import { Destination, Package, Booking, Testimonial, Job, Feature, Visa, TeamMember, JobApplication, AdminBooking, AdminMessage, BlogPost } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Helpers: map DB snake_case rows → camelCase for the app ---
const mapDestination = (row: any): Destination => ({
  ...row,
  groupSize: row.group_size,
  // delete snake_case keys just in case
});

const unmapDestination = (dest: Partial<Destination>): any => {
  const { groupSize, ...rest } = dest;
  return { ...rest, group_size: groupSize };
};

const mapPackage = (row: any): Package => ({
  ...row,
  destinationId: row.destination_id,
  groupSize: row.group_size,
});

const unmapPackage = (pkg: Partial<Package>): any => {
  const { destinationId, groupSize, ...rest } = pkg;
  return { ...rest, destination_id: destinationId, group_size: groupSize };
};

const mapVisa = (row: any): Visa => ({
  ...row,
  processingTime: row.processing_time,
  validityPeriod: row.validity_period,
  entryType: row.entry_type,
  applicationFee: row.application_fee,
});

const unmapVisa = (visa: Partial<Visa>): any => {
  const { processingTime, validityPeriod, entryType, applicationFee, ...rest } = visa;
  return { 
    ...rest, 
    processing_time: processingTime, 
    validity_period: validityPeriod, 
    entry_type: entryType, 
    application_fee: applicationFee 
  };
};

const mapBooking = (row: any): AdminBooking => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  destination: row.destination,
  checkIn: row.check_in,
  checkOut: row.check_out,
  guests: row.guests,
  price: row.price,
  status: row.status,
  createdAt: row.created_at,
});

const mapMessage = (row: any): AdminMessage => ({
  id: row.id,
  name: row.name,
  email: row.email,
  message: row.message,
  status: row.status,
  createdAt: row.created_at,
});

const mapApplication = (row: any): JobApplication => ({
  id: row.id,
  jobId: row.job_id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  resumeUrl: row.resume_url,
  coverLetter: row.cover_letter,
  status: row.status,
  createdAt: row.created_at,
  jobTitle: row.jobs?.title
});

class SupabaseService {
  // --- Auth (mocked: uses localStorage to match localService behavior) ---
  async login(username: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (username === import.meta.env.VITE_ADMIN_USERNAME && password === import.meta.env.VITE_ADMIN_PASSWORD) {
      const token = 'fake-jwt-token-123';
      localStorage.setItem('admin_token', token);
      return { data: { token }, error: null };
    }
    return { data: null, error: { message: 'Invalid username or password.' } };
  }

  logout() {
    localStorage.removeItem('admin_token');
  }

  isAuthenticated() {
    return !!localStorage.getItem('admin_token');
  }

  // --- Destinations ---
  async getDestinations() {
    const { data, error } = await supabase.from('destinations').select('*').order('created_at', { ascending: false });
    return { data: data ? data.map(mapDestination) : null, error };
  }

  async saveDestination(dest: Partial<Destination>) {
    const mapped = unmapDestination(dest);
    // If it's a valid persistent ID (UUID) and not a temporary "dest-" ID, upsert it
    if (mapped.id && /^[0-9a-f-]{36}$/.test(mapped.id) && !mapped.id.startsWith('dest-')) {
      return await supabase.from('destinations').upsert(mapped, { onConflict: 'id' });
    } else {
      // New or temporary ID, let Supabase generate a fresh UUID
      const { id, ...data } = mapped;
      return await supabase.from('destinations').insert(data);
    }
  }

  async deleteDestination(id: string) {
    return await supabase.from('destinations').delete().eq('id', id);
  }

  // --- Packages ---
  async getPackages() {
    const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
    return { data: data ? data.map(mapPackage) : null, error };
  }

  async savePackage(pkg: Partial<Package>) {
    const mapped = unmapPackage(pkg);
    if (mapped.id && /^[0-9a-f-]{36}$/.test(mapped.id) && !mapped.id.startsWith('pkg-')) {
      return await supabase.from('packages').upsert(mapped);
    } else {
      const { id, ...data } = mapped;
      return await supabase.from('packages').insert(data);
    }
  }

  async deletePackage(id: string) {
    return await supabase.from('packages').delete().eq('id', id);
  }

  // --- Visas ---
  async getVisas() {
    const { data, error } = await supabase.from('visas').select('*').order('created_at', { ascending: false });
    return { data: data ? data.map(mapVisa) : null, error };
  }

  async saveVisa(visa: Partial<Visa>) {
    const mapped = unmapVisa(visa);
    if (mapped.id && /^[0-9a-f-]{36}$/.test(mapped.id)) {
      return await supabase.from('visas').upsert(mapped);
    } else {
      const { id, ...data } = mapped;
      return await supabase.from('visas').insert(data);
    }
  }

  async deleteVisa(id: string) {
    return await supabase.from('visas').delete().eq('id', id);
  }

  // --- Bookings ---
  // Supabase columns: id, name, email, phone, destination, check_in, check_out, guests, price, status, created_at
  async getBookings(): Promise<{ data: AdminBooking[] | null; error: any }> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error };
    return { data: (data || []).map(mapBooking), error: null };
  }

  async saveBooking(booking: Partial<AdminBooking>): Promise<{ error: any }> {
    const row = {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      destination: booking.destination,
      check_in: booking.checkIn,
      check_out: booking.checkOut,
      guests: booking.guests,
      price: booking.price,
      status: booking.status || 'pending',
    };
    const { error } = await supabase.from('bookings').insert(row);
    return { error };
  }

  async updateBookingStatus(id: string, status: string): Promise<{ error: any }> {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    return { error };
  }

  async deleteBooking(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    return { error };
  }

  // --- Messages ---
  // Supabase columns: id, name, email, message, status, created_at
  async getMessages(): Promise<{ data: AdminMessage[] | null; error: any }> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error };
    return { data: (data || []).map(mapMessage), error: null };
  }

  async saveMessage(message: Partial<AdminMessage>): Promise<{ error: any }> {
    const row = {
      name: message.name,
      email: message.email,
      message: message.message,
      status: message.status || 'new',
    };
    const { error } = await supabase.from('messages').insert(row);
    return { error };
  }

  async updateMessageStatus(id: string, status: string): Promise<{ error: any }> {
    const { error } = await supabase.from('messages').update({ status }).eq('id', id);
    return { error };
  }

  async deleteMessage(id: string): Promise<{ error: any }> {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    return { error };
  }

  // --- Testimonials ---
  async getTestimonials() {
    return await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
  }

  async saveTestimonial(item: Partial<Testimonial>) {
    if (item.id && /^[0-9a-f-]{36}$/.test(item.id)) {
      return await supabase.from('testimonials').upsert(item);
    } else {
      const { id, ...data } = item as any;
      return await supabase.from('testimonials').insert(data);
    }
  }

  async deleteTestimonial(id: string) {
    return await supabase.from('testimonials').delete().eq('id', id);
  }

  // --- Jobs ---
  async getJobs() {
    return await supabase.from('jobs').select('*').order('created_at', { ascending: false });
  }

  async saveJob(item: Partial<Job>) {
    if (item.id && /^[0-9a-f-]{36}$/.test(item.id)) {
      return await supabase.from('jobs').upsert(item);
    } else {
      const { id, ...data } = item as any;
      return await supabase.from('jobs').insert(data);
    }
  }

  async deleteJob(id: string) {
    return await supabase.from('jobs').delete().eq('id', id);
  }

  // --- Features ---
  async getFeatures() {
    return await supabase.from('features').select('*').order('created_at', { ascending: false });
  }

  async saveFeature(item: Partial<Feature>) {
    if (item.id && /^[0-9a-f-]{36}$/.test(item.id)) {
      return await supabase.from('features').upsert(item);
    } else {
      const { id, ...data } = item as any;
      return await supabase.from('features').insert(data);
    }
  }

  async deleteFeature(id: string) {
    return await supabase.from('features').delete().eq('id', id);
  }

  // --- Settings ---
  async getSettings(): Promise<{ data: any; error: any }> {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) return { data: null, error };

    const settingsObj = (data || []).reduce((acc: any, curr: any) => {
      try {
        acc[curr.key] = typeof curr.value === 'string' ? JSON.parse(curr.value) : curr.value;
      } catch {
        acc[curr.key] = curr.value;
      }
      return acc;
    }, {});

    if (Object.keys(settingsObj).length === 0) {
      return {
        data: {
          firstName: 'Thabet', lastName: '', email: 'admin@goldentrip.com',
          siteName: 'Golden Trip', supportEmail: 'gm@goldentrip.com',
          currency: 'JOD (JD)', timezone: 'UTC+03:00 Amman',
          contactInfo: {
            address: 'Al-Arab St., ABUNSEER 00962 Amman, Jordan',
            phone: '+962 79 804 6662',
            email: 'info@goldentrip.com'
          },
          siteLogo: '',
          legalPages: {},
          notifications: { newBookings: false, newMessages: false, systemUpdates: false }
        },
        error: null
      };
    }

    return { data: settingsObj, error: null };
  }

  async saveSettings(settings: any): Promise<{ error: any }> {
    const promises = Object.entries(settings).map(([key, value]) =>
      supabase.from('settings').upsert(
        { key, value: typeof value === 'object' ? JSON.stringify(value) : String(value) },
        { onConflict: 'key' }
      )
    );
    await Promise.all(promises);
    return { error: null };
  }

  // --- Team Members ---
  async getTeamMembers() {
    return await supabase.from('team_members').select('*').order('created_at', { ascending: true });
  }

  async saveTeamMember(item: Partial<TeamMember>) {
    const row: any = {
      name: item.name,
      role: item.role,
      image: item.image,
      bio: item.bio,
      socials: item.socials || {}
    };
    
    if (item.id && /^[0-9a-f-]{36}$/.test(item.id)) {
      row.id = item.id;
      return await supabase.from('team_members').upsert(row, { onConflict: 'id' });
    } else {
      return await supabase.from('team_members').insert(row);
    }
  }

  async deleteTeamMember(id: string) {
    return await supabase.from('team_members').delete().eq('id', id);
  }

  // --- Applications ---
  async getApplications() {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(title)')
      .order('created_at', { ascending: false });
    return { data: (data || []).map(mapApplication), error };
  }

  async saveApplication(app: Partial<JobApplication>) {
    const row = {
      job_id: app.jobId,
      name: app.name,
      email: app.email,
      phone: app.phone,
      resume_url: app.resumeUrl,
      cover_letter: app.coverLetter,
      status: app.status || 'new'
    };
    return await supabase.from('applications').insert(row);
  }

  async updateApplicationStatus(id: string, status: string) {
    return await supabase.from('applications').update({ status }).eq('id', id);
  }

  // --- Blogs ---
  async getBlogs() {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    // Assuming matching names. If not, map accordingly.
    return { data: data as BlogPost[] | null, error };
  }

  async saveBlog(item: Partial<BlogPost>) {
    // Determine slug if missing or dynamically saving
    const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/[\s\W-]+/g, '-') : `blog-${Date.now()}`);
    const row = { ...item, slug } as any;

    if (item.id && /^[0-9a-f-]{36}$/.test(item.id)) {
      return await supabase.from('blogs').upsert(row, { onConflict: 'id' });
    } else {
      const { id, ...data } = row;
      return await supabase.from('blogs').insert(data);
    }
  }

  async deleteBlog(id: string) {
    return await supabase.from('blogs').delete().eq('id', id);
  }

  async uploadResume(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);

    if (uploadError) return { data: null, error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  }
}

export const supabaseService = new SupabaseService();
