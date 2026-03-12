export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  price: number;
  duration: string;
  description: string;
  featured: boolean;
  groupSize?: string;
  location?: string;
  rating?: number;
  features?: string[];
  itinerary?: ItineraryDay[];
  reviews?: Review[];
}

export interface Package {
  id: string;
  title: string;
  destinationId: string;
  price: number;
  duration: string;
  groupSize: string;
  location: string;
  rating: number;
  features: string[];
  description: string;
  itinerary: ItineraryDay[];
  images: string[];
  reviews: Review[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  image?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  posted: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  status: 'new' | 'read' | 'replied';
}

export interface Booking {
  id: string;
  packageId: string;
  customerName: string;
  email: string;
  phone: string;
  travelers: number;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
  location: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Visa {
  id: string;
  country: string;
  processingTime: string;
  validityPeriod: string;
  entryType: string;
  price: number;
  applicationFee: number;
  requirements: string[];
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socials?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export interface JobApplication {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: string;
  jobTitle?: string; // Virtual field for UI
}
export interface AdminBooking {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  status: 'published' | 'draft';
}
