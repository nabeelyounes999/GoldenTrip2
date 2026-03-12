import { Destination, Booking, ContactMessage, Package, Testimonial, Job, Feature, TeamMember, AdminBooking, AdminMessage, Visa, BlogPost } from '../types';
import { destinations as initialDestinations, packages as initialPackages, testimonials as initialTestimonials, jobs as initialJobs } from '../data';

const initialBlogs: BlogPost[] = [
  {
    id: 'bl-1',
    slug: 'top-10-destinations-2024',
    title: 'Top 10 Travel Destinations for 2024',
    excerpt: 'Discover the most breathtaking places you must visit this year.',
    content: '<p>From the serene beaches of Bali to the bustling streets of Tokyo, 2024 is the year to explore the unexplored. Join us as we uncover the top 10 destinations...</p>',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80',
    author: 'Travel Expert',
    date: new Date().toISOString(),
    status: 'published'
  }
];

const initialFeatures: Feature[] = [
  { id: 'f1', icon: 'DollarSign', title: 'Best Prices', description: 'Competitive rates and exclusive deals' },
  { id: 'f2', icon: 'Headphones', title: '24/7 Support', description: 'Round-the-clock customer assistance' },
  { id: 'f3', icon: 'Users', title: 'Trusted by Thousands', description: 'Join our satisfied travelers worldwide' },
  { id: 'f4', icon: 'Shield', title: 'Secure Payment', description: 'Safe and encrypted transactions' }
];

const initialVisas: Visa[] = [
  {
    id: 'v1',
    country: 'UAE',
    processingTime: '2-3 Days',
    validityPeriod: '30 Days',
    entryType: 'Single Entry',
    price: 150,
    applicationFee: 150,
    requirements: ['Passport Copy', 'Photo'],
    description: 'Perfect for short business trips or tourism.'
  },
  {
    id: 'v2',
    country: 'Schengen',
    processingTime: '15-20 Days',
    validityPeriod: '90 Days',
    entryType: 'Multiple Entry',
    price: 300,
    applicationFee: 300,
    requirements: ['Passport', 'Photo', 'Bank Statement', 'Travel Insurance'],
    description: 'Explore the beauty of Europe with ease.'
  }
];

const initialBookings: AdminBooking[] = [
  {
    id: 'b1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    destination: 'Paris, France',
    checkIn: new Date().toISOString(),
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString(),
    guests: 2,
    createdAt: new Date().toISOString(),
    status: 'pending',
    price: 2000
  }
];

const initialMessages: AdminMessage[] = [
  {
    id: 'm1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    message: 'I am interested in the Paris package. Can you provide more details?',
    createdAt: new Date().toISOString(),
    status: 'new'
  }
];

class LocalService {
  constructor() {
    this.cleanupStorage();
  }

  private cleanupStorage() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('resume-')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      // Ignored
    }
  }

  private getStorageItem<T>(key: string, initialData: T): T {
    const item = localStorage.getItem(key);
    if (!item) {
      this.setStorageItem(key, initialData);
      return initialData;
    }
    return JSON.parse(item);
  }

  private setStorageItem<T>(key: string, data: T) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e: any) {
      console.error('Failed to save to localStorage:', e);
      if (e.name === 'QuotaExceededError' || e.message?.includes('quota')) {
        alert('Local storage is full! Deletions and saves may fail. Please clear your browser cache.');
      } else {
        alert('Error saving data locally: ' + e.message);
      }
      throw e; // throw so the calling function can catch it and not fake a success
    }
  }

  // --- Auth ---
  async login(username: string, password: string) {
    // Simulate network delay
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
  getDestinations = async (): Promise<{ data: Destination[], error: any }> => {
    const destinations = this.getStorageItem<Destination[]>('goldentrip_destinations', initialDestinations);
    return { data: destinations, error: null };
  };

  saveDestination = async (dest: Partial<Destination>): Promise<{ error: any }> => {
    const destinations = this.getStorageItem<Destination[]>('goldentrip_destinations', initialDestinations);
    if (dest.id) {
      const index = destinations.findIndex(d => String(d.id) === String(dest.id));
      if (index > -1) {
        destinations[index] = { ...destinations[index], ...dest } as Destination;
      }
    } else {
      const newDest = { ...dest, id: Math.random().toString(36).substr(2, 9) } as Destination;
      destinations.push(newDest);
    }
    this.setStorageItem('goldentrip_destinations', destinations);
    return { error: null };
  };

  deleteDestination = async (id: string): Promise<{ error: any }> => {
    console.log('LocalService: Deleting destination', id);
    let destinations = this.getStorageItem<Destination[]>('goldentrip_destinations', initialDestinations);
    const initialCount = destinations.length;
    destinations = destinations.filter(d => String(d.id).trim() !== String(id).trim());
    console.log(`LocalService: Destinations count ${initialCount} -> ${destinations.length}`);
    this.setStorageItem('goldentrip_destinations', destinations);
    return { error: null };
  };

  // --- Visas ---
  getVisas = async (): Promise<{ data: Visa[], error: any }> => {
    const visas = this.getStorageItem<Visa[]>('goldentrip_visas', initialVisas);
    return { data: visas, error: null };
  };

  saveVisa = async (visa: Partial<Visa>): Promise<{ error: any }> => {
    const visas = this.getStorageItem<Visa[]>('goldentrip_visas', initialVisas);
    if (visa.id) {
      const index = visas.findIndex(v => String(v.id) === String(visa.id));
      if (index > -1) {
        visas[index] = { ...visas[index], ...visa } as Visa;
      }
    } else {
      const newVisa = { ...visa, id: Math.random().toString(36).substr(2, 9) } as Visa;
      visas.push(newVisa);
    }
    this.setStorageItem('goldentrip_visas', visas);
    return { error: null };
  };

  deleteVisa = async (id: string): Promise<{ error: any }> => {
    console.log('LocalService: Deleting visa', id);
    let visas = this.getStorageItem<Visa[]>('goldentrip_visas', initialVisas);
    const initialCount = visas.length;
    visas = visas.filter(v => String(v.id).trim() !== String(id).trim());
    console.log(`LocalService: Visas count ${initialCount} -> ${visas.length}`);
    this.setStorageItem('goldentrip_visas', visas);
    return { error: null };
  };

  // --- Bookings ---
  getBookings = async (): Promise<{ data: AdminBooking[], error: any }> => {
    const bookings = this.getStorageItem<AdminBooking[]>('goldentrip_bookings', initialBookings);
    return { data: bookings, error: null };
  };

  updateBookingStatus = async (id: string, status: AdminBooking['status']): Promise<{ error: any }> => {
    const bookings = this.getStorageItem<AdminBooking[]>('goldentrip_bookings', initialBookings);
    const index = bookings.findIndex(b => String(b.id) === String(id));
    if (index > -1) {
      bookings[index].status = status;
      this.setStorageItem('goldentrip_bookings', bookings);
    }
    return { error: null };
  };

  saveBooking = async (booking: Partial<AdminBooking>): Promise<{ error: any }> => {
    const bookings = this.getStorageItem<AdminBooking[]>('goldentrip_bookings', initialBookings);
    const newBooking = { 
      ...booking, 
      id: `bk-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    } as AdminBooking;
    bookings.push(newBooking);
    this.setStorageItem('goldentrip_bookings', bookings);

    // Also save as a message/notification
    await this.saveMessage({
      name: newBooking.name,
      email: newBooking.email,
      message: `New Booking Inquiry for ${newBooking.destination}. Travelers: ${newBooking.guests}. Phone: ${newBooking.phone}`,
      status: 'new'
    });

    return { error: null };
  };

  deleteBooking = async (id: string): Promise<{ error: any }> => {
    console.log('LocalService: Deleting booking request for ID:', id);
    let bookings = this.getStorageItem<AdminBooking[]>('goldentrip_bookings', initialBookings);
    const initialCount = bookings.length;
    
    // Log all current IDs to see what we are comparing against
    console.log('Current booking IDs:', bookings.map(b => b.id));
    
    bookings = bookings.filter(b => String(b.id).trim() !== String(id).trim());
    
    console.log(`LocalService: Bookings count ${initialCount} -> ${bookings.length}`);
    this.setStorageItem('goldentrip_bookings', bookings);
    
    if (bookings.length < initialCount) {
       console.log('Deletion SUCCESSFUL in LocalService');
    } else {
       console.log('Deletion FAILED in LocalService - ID not found');
    }
    
    return { error: null };
  };

  // --- Messages ---
  getMessages = async (): Promise<{ data: AdminMessage[], error: any }> => {
    const messages = this.getStorageItem<AdminMessage[]>('goldentrip_messages', initialMessages);
    return { data: messages, error: null };
  };

  saveMessage = async (message: Partial<AdminMessage>): Promise<{ error: any }> => {
    const messages = this.getStorageItem<AdminMessage[]>('goldentrip_messages', initialMessages);
    const newMessage = { 
      ...message, 
      id: `msg-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    } as AdminMessage;
    messages.push(newMessage);
    this.setStorageItem('goldentrip_messages', messages);
    return { error: null };
  };

  updateMessageStatus = async (id: string, status: 'new' | 'read' | 'replied'): Promise<{ error: any }> => {
    const messages = this.getStorageItem<AdminMessage[]>('goldentrip_messages', initialMessages);
    const index = messages.findIndex(m => String(m.id) === String(id));
    if (index > -1) {
      messages[index].status = status;
      this.setStorageItem('goldentrip_messages', messages);
    }
    return { error: null };
  };

  deleteMessage = async (id: string): Promise<{ error: any }> => {
    console.log('LocalService: Deleting message', id);
    let messages = this.getStorageItem<AdminMessage[]>('goldentrip_messages', initialMessages);
    const initialCount = messages.length;
    messages = messages.filter(m => String(m.id).trim() !== String(id).trim());
    console.log(`LocalService: Messages count ${initialCount} -> ${messages.length}`);
    this.setStorageItem('goldentrip_messages', messages);
    return { error: null };
  };

  // --- Packages ---
  getPackages = async (): Promise<{ data: Package[], error: any }> => {
    const pkgs = this.getStorageItem<Package[]>('goldentrip_packages', initialPackages);
    return { data: pkgs, error: null };
  };

  savePackage = async (pkg: Partial<Package>): Promise<{ error: any }> => {
    const pkgs = this.getStorageItem<Package[]>('goldentrip_packages', initialPackages);
    if (pkg.id) {
      const index = pkgs.findIndex(p => String(p.id) === String(pkg.id));
      if (index > -1) pkgs[index] = { ...pkgs[index], ...pkg } as Package;
    } else {
      pkgs.push({ ...pkg, id: `pkg-${Math.random().toString(36).substr(2, 9)}` } as Package);
    }
    this.setStorageItem('goldentrip_packages', pkgs);
    return { error: null };
  };

  deletePackage = async (id: string): Promise<{ error: any }> => {
    let pkgs = this.getStorageItem<Package[]>('goldentrip_packages', initialPackages);
    const initialCount = pkgs.length;
    pkgs = pkgs.filter(p => String(p.id).trim() !== String(id).trim());
    console.log(`LocalService: Packages count ${initialCount} -> ${pkgs.length}`);
    this.setStorageItem('goldentrip_packages', pkgs);
    return { error: null };
  };

  // --- Testimonials ---
  getTestimonials = async (): Promise<{ data: Testimonial[], error: any }> => {
    const items = this.getStorageItem<Testimonial[]>('goldentrip_testimonials', initialTestimonials);
    return { data: items, error: null };
  };

  saveTestimonial = async (item: Partial<Testimonial>): Promise<{ error: any }> => {
    const items = this.getStorageItem<Testimonial[]>('goldentrip_testimonials', initialTestimonials);
    if (item.id) {
      const index = items.findIndex(t => String(t.id) === String(item.id));
      if (index > -1) items[index] = { ...items[index], ...item } as Testimonial;
    } else {
      items.push({ ...item, id: `tst-${Math.random().toString(36).substr(2, 9)}` } as Testimonial);
    }
    this.setStorageItem('goldentrip_testimonials', items);
    return { error: null };
  };

  deleteTestimonial = async (id: string): Promise<{ error: any }> => {
    let items = this.getStorageItem<Testimonial[]>('goldentrip_testimonials', initialTestimonials);
    const initialCount = items.length;
    items = items.filter(t => String(t.id).trim() !== String(id).trim());
    console.log(`LocalService: Testimonials count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_testimonials', items);
    return { error: null };
  };

  // --- Jobs ---
  getJobs = async (): Promise<{ data: Job[], error: any }> => {
    const items = this.getStorageItem<Job[]>('goldentrip_jobs', initialJobs);
    return { data: items, error: null };
  };

  saveJob = async (item: Partial<Job>): Promise<{ error: any }> => {
    const items = this.getStorageItem<Job[]>('goldentrip_jobs', initialJobs);
    if (item.id) {
      const index = items.findIndex(j => String(j.id) === String(item.id));
      if (index > -1) items[index] = { ...items[index], ...item } as Job;
    } else {
      items.push({ ...item, id: `job-${Math.random().toString(36).substr(2, 9)}` } as Job);
    }
    this.setStorageItem('goldentrip_jobs', items);
    return { error: null };
  };

  deleteJob = async (id: string): Promise<{ error: any }> => {
    let items = this.getStorageItem<Job[]>('goldentrip_jobs', initialJobs);
    const initialCount = items.length;
    items = items.filter(j => String(j.id).trim() !== String(id).trim());
    console.log(`LocalService: Jobs count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_jobs', items);
    return { error: null };
  };

  // --- Features ---
  getFeatures = async (): Promise<{ data: Feature[], error: any }> => {
    const items = this.getStorageItem<Feature[]>('goldentrip_features', initialFeatures);
    return { data: items, error: null };
  };

  saveFeature = async (item: Partial<Feature>): Promise<{ error: any }> => {
    const items = this.getStorageItem<Feature[]>('goldentrip_features', initialFeatures);
    if (item.id) {
      const index = items.findIndex(j => String(j.id) === String(item.id));
      if (index > -1) items[index] = { ...items[index], ...item } as Feature;
    } else {
      items.push({ ...item, id: `feat-${Math.random().toString(36).substr(2, 9)}` } as Feature);
    }
    this.setStorageItem('goldentrip_features', items);
    return { error: null };
  };

  deleteFeature = async (id: string): Promise<{ error: any }> => {
    let items = this.getStorageItem<Feature[]>('goldentrip_features', initialFeatures);
    const initialCount = items.length;
    items = items.filter(j => String(j.id).trim() !== String(id).trim());
    console.log(`LocalService: Features count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_features', items);
    return { error: null };
  };

  // --- Settings ---
  getSettings = async (): Promise<{ data: any, error: any }> => {
    const defaultSettings = {
      firstName: 'Thabet', lastName: '', email: 'CEO@goldentrip.com',
      siteName: 'Golden Trip Travel & Tourism', supportEmail: 'gm@goldentrip.com',
      currency: 'USD ($)', timezone: 'UTC+03:00 Amman',
      notifications: { newBookings: true, newMessages: true, systemUpdates: true },
      contactInfo: {
        address: 'Al-Arab St., ABUNSEER 00962 Amman, Jordan',
        phone: '+962 79 804 6662',
        email: 'info@goldentrip.com'
      },
      aboutContent: {
        heroTitle: 'About Golden Trip',
        heroSubtitle: 'Creating unforgettable travel experiences since 2009',
        storyTitle: 'Our Story',
        storyP1: 'Golden Trip was born from a simple belief: that travel has the power to transform lives, broaden perspectives, and create lasting memories. Founded in 2009 by a group of passionate travelers, we set out to make world-class travel experiences accessible to everyone.',
        storyP2: 'What started as a small travel agency has grown into a trusted global brand, serving over 50,000 satisfied travelers. Our commitment to excellence, attention to detail, and genuine care for our customers has remained unchanged since day one.',
        storyP3: 'Today, we continue to innovate and evolve, offering carefully curated experiences across 100+ destinations worldwide. Every journey we plan is crafted with the same passion and dedication that inspired our founders.',
        missionTitle: 'Our Mission',
        missionText: 'To inspire and enable people to explore the world, creating transformative travel experiences that enrich lives and foster global understanding.',
        visionTitle: 'Our Vision',
        visionText: 'To be the world\'s most trusted and innovative travel company, connecting people with extraordinary destinations and authentic experiences.',
        valuesTitle: 'Our Values',
        valuesText: 'Excellence, integrity, and customer satisfaction guide everything we do. We\'re committed to sustainable and responsible travel practices.'
      },
      legalPages: {
        privacyPolicy: 'Your privacy is important to us...',
        termsOfService: 'By using our services, you agree...',
        cookiePolicy: 'We use cookies to improve your experience...',
        refundPolicy: 'Our refund policy ensures fairness...'
      }
    };
    const items = this.getStorageItem<any>('goldentrip_settings', defaultSettings);
    // Ensure nested objects exist if adding new fields to existing storage
    if (items && !items.aboutContent) {
      items.aboutContent = defaultSettings.aboutContent;
    }
    return { data: items, error: null };
  };

  saveSettings = async (settings: any): Promise<{ error: any }> => {
    this.setStorageItem('goldentrip_settings', settings);
    return { error: null };
  };

  // --- Team Members ---
  getTeamMembers = async (): Promise<{ data: TeamMember[], error: any }> => {
    const defaultTeam: TeamMember[] = [
      {
        id: 'tm-1',
        name: 'Thabet',
        role: 'Founder & CEO',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
        bio: 'Passionate about creating unforgettable travel experiences.',
        socials: { facebook: '#', instagram: '#', whatsapp: '#' }
      },
      {
        id: 'tm-2',
        name: 'Sarah Johnson',
        role: 'Travel Operations Manager',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
        bio: 'Travel enthusiast with 15+ years in the tourism industry.',
        socials: { facebook: '#', instagram: '#', whatsapp: '#' }
      },
      {
        id: 'tm-3',
        name: 'Michael Chen',
        role: 'Chief Travel Officer',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        bio: 'Visited 87 countries and counting, passionate about cultural experiences.',
        socials: { facebook: '#', instagram: '#', whatsapp: '#' }
      },
      {
        id: 'tm-4',
        name: 'Emma Williams',
        role: 'Head of Customer Experience',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        bio: 'Dedicated to making every journey exceptional and memorable.',
        socials: { facebook: '#', instagram: '#', whatsapp: '#' }
      }
    ];
    const items = this.getStorageItem<TeamMember[]>('goldentrip_team', defaultTeam);
    return { data: items, error: null };
  };

  saveTeamMember = async (item: Partial<TeamMember>): Promise<{ error: any }> => {
    const items = this.getStorageItem<TeamMember[]>('goldentrip_team', []);
    if (item.id) {
      const index = items.findIndex(t => String(t.id) === String(item.id));
      if (index > -1) {
        items[index] = { ...items[index], ...item } as TeamMember;
      } else {
        items.push({ ...item } as TeamMember);
      }
    } else {
      items.push({ ...item, id: `tm-${Math.random().toString(36).substr(2, 9)}` } as TeamMember);
    }
    this.setStorageItem('goldentrip_team', items);
    return { error: null };
  };

  deleteTeamMember = async (id: string): Promise<{ error: any }> => {
    let items = this.getStorageItem<TeamMember[]>('goldentrip_team', []);
    const initialCount = items.length;
    items = items.filter(t => String(t.id).trim() !== String(id).trim());
    console.log(`LocalService: Team members count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_team', items);
    return { error: null };
  };

  // --- Applications ---
  getApplications = async (): Promise<{ data: any[], error: any }> => {
    const items = this.getStorageItem<any[]>('goldentrip_applications', []);
    // Attach job title from jobs list
    const { data: jobs } = await this.getJobs();
    const enriched = items.map(app => ({
      ...app,
      jobTitle: jobs?.find(j => j.id === app.jobId)?.title || 'Unknown Position'
    }));
    return { data: enriched, error: null };
  };

  saveApplication = async (app: any): Promise<{ error: any }> => {
    const items = this.getStorageItem<any[]>('goldentrip_applications', []);
    const newApp = {
      ...app,
      id: `app-${Math.random().toString(36).substr(2, 9)}`,
      status: app.status || 'new',
      createdAt: new Date().toISOString()
    };
    items.unshift(newApp);
    this.setStorageItem('goldentrip_applications', items);
    return { error: null };
  };

  updateApplicationStatus = async (id: string, status: string): Promise<{ error: any }> => {
    const items = this.getStorageItem<any[]>('goldentrip_applications', []);
    const index = items.findIndex(a => String(a.id) === String(id));
    if (index > -1) {
      items[index].status = status;
      this.setStorageItem('goldentrip_applications', items);
    }
    return { error: null };
  };

  deleteApplication = async (id: string): Promise<{ error: any }> => {
    console.log('LocalService: Deleting application', id);
    let items = this.getStorageItem<any[]>('goldentrip_applications', []);
    const initialCount = items.length;
    items = items.filter(a => String(a.id).trim() !== String(id).trim());
    console.log(`LocalService: Applications count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_applications', items);
    return { error: null };
  };

  // --- Blogs ---
  getBlogs = async (): Promise<{ data: BlogPost[], error: any }> => {
    const items = this.getStorageItem<BlogPost[]>('goldentrip_blogs', initialBlogs);
    return { data: items, error: null };
  };

  saveBlog = async (item: Partial<BlogPost>): Promise<{ error: any }> => {
    const items = this.getStorageItem<BlogPost[]>('goldentrip_blogs', initialBlogs);
    if (item.id) {
      const index = items.findIndex(j => String(j.id) === String(item.id));
      if (index > -1) items[index] = { ...items[index], ...item } as BlogPost;
    } else {
      // Auto-generate slug if not provided
      const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/[\s\W-]+/g, '-') : `blog-${Date.now()}`);
      items.push({ ...item, slug, id: `blog-${Math.random().toString(36).substr(2, 9)}`, date: item.date || new Date().toISOString() } as BlogPost);
    }
    this.setStorageItem('goldentrip_blogs', items);
    return { error: null };
  };

  deleteBlog = async (id: string): Promise<{ error: any }> => {
    let items = this.getStorageItem<BlogPost[]>('goldentrip_blogs', initialBlogs);
    const initialCount = items.length;
    items = items.filter(j => String(j.id).trim() !== String(id).trim());
    console.log(`LocalService: Blogs count ${initialCount} -> ${items.length}`);
    this.setStorageItem('goldentrip_blogs', items);
    return { error: null };
  };

  uploadResume = async (file: File): Promise<{ data: string | null, error: any }> => {
    // Convert file to base64 data URL and store locally
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Store in localStorage with a reference key
        const key = `resume-${Date.now()}-${file.name}`;
        try {
          localStorage.setItem(key, dataUrl);
        } catch (e) {
          // localStorage might be full for large files, just use the data URL directly
        }
        resolve({ data: dataUrl, error: null });
      };
      reader.onerror = () => {
        resolve({ data: null, error: { message: 'Failed to read file' } });
      };
      reader.readAsDataURL(file);
    });
  };
}

export const localService = new LocalService();
