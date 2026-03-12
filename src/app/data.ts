import { Destination, Package, Testimonial, Job } from './types';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1642947392578-b37fbd9a4d45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlaWZmZWwlMjB0b3dlciUyMHBhcmlzJTIwZnJhbmNlfGVufDF8fHx8MTc3MjY2Mzk1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1299,
    duration: '7 Days',
    description: 'Experience the romantic city of lights with iconic landmarks, world-class cuisine, and timeless art.',
    featured: true,
    location: 'Paris, France',
    groupSize: '2-10 People',
    rating: 5.0,
    features: ['Round-trip flights', 'Luxury hotel accommodation', 'Daily breakfast', 'Guided tours'],
    itinerary: [
      { day: 1, title: 'Arrival & Check-in', activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner'] },
      { day: 2, title: 'City Tour', activities: ['Eiffel Tower visit', 'Seine River cruise'] }
    ]
  },
  {
    id: '2',
    name: 'Maldives',
    country: 'Maldives',
    image: 'https://images.unsplash.com/photo-1699019493395-8a1f0c7883a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxkaXZlcyUyMHRyb3BpY2FsJTIwYmVhY2glMjByZXNvcnR8ZW58MXx8fHwxNzcyNTg3MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 2499,
    duration: '5 Days',
    description: 'Luxury island paradise with crystal-clear waters, pristine beaches, and overwater villas.',
    featured: true,
    location: 'Maldives',
    groupSize: '2-4 People',
    rating: 4.9,
    features: ['Overwater villa', 'Seaplane transfers', 'All-inclusive meals', 'Snorkeling tour'],
    itinerary: [
      { day: 1, title: 'Arrival', activities: ['Seaplane transfer', 'Sunset dinner'] }
    ]
  },
  {
    id: '3',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1651063820152-d3e7a27b4d2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGJ1cmolMjBraGFsaWZhJTIwc2t5bGluZXxlbnwxfHx8fDE3NzI2MDEwODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1899,
    duration: '6 Days',
    description: 'Modern metropolis blending luxury shopping, ultramodern architecture, and desert adventures.',
    featured: true,
    location: 'Dubai, UAE',
    groupSize: '2-12 People',
    rating: 4.8,
    features: ['Luxury hotel', 'Burj Khalifa tickets', 'Desert safari', 'Museum of the Future'],
    itinerary: [
      { day: 1, title: 'Arrival', activities: ['Hotel check-in', 'Dubai Mall visit'] }
    ]
  },
  {
    id: '4',
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1723708489553-655d04168d39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMG1vdW50JTIwZnVqaSUyMGNoZXJyeSUyMGJsb3Nzb21zfGVufDF8fHx8MTc3MjU5NjkyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1699,
    duration: '8 Days',
    description: 'Discover ancient temples, cutting-edge technology, and exquisite cuisine in Japan\'s capital.',
    featured: true,
    location: 'Tokyo, Japan',
    groupSize: '2-8 People',
    rating: 4.8,
    features: ['Luxury hotel', 'Private guide', 'Traditional dinner', 'Mt. Fuji tour'],
    itinerary: [
      { day: 1, title: 'Arrival', activities: ['Narita pickup', 'Shibuya crossing check'] }
    ]
  },
  {
    id: '5',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1671760085670-2be5869f38dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2UlMjBibHVlJTIwZG9tZXN8ZW58MXx8fHwxNzcyNjIwNjc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1499,
    duration: '6 Days',
    description: 'Stunning white-washed villages, blue-domed churches, and spectacular sunsets over the Aegean.',
    featured: true
  },
  {
    id: '6',
    name: 'New York',
    country: 'USA',
    image: 'https://images.unsplash.com/photo-1655845836463-facb2826510b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMG1hbmhhdHRhbiUyMHNreWxpbmV8ZW58MXx8fHwxNzcyNjEyNjQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1399,
    duration: '5 Days',
    description: 'The city that never sleeps, filled with iconic landmarks, Broadway shows, and diverse culture.',
    featured: false
  },
  {
    id: '7',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1656247203824-3d6f99461ba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwcmljZSUyMHRlcnJhY2VzfGVufDF8fHx8MTc3MjY2Mzk2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 999,
    duration: '7 Days',
    description: 'Tropical paradise with lush rice terraces, ancient temples, and beautiful beaches.',
    featured: false
  },
  {
    id: '8',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1705081242921-7ac750a0f8f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2l0emVybGFuZCUyMGFscHMlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzcyNjM5MTMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 2199,
    duration: '8 Days',
    description: 'Breathtaking mountain scenery, charming villages, and world-class skiing resorts.',
    featured: false
  },
  {
    id: '9',
    name: 'Iceland',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1681834418277-b01c30279693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbm9ydGhlcm4lMjBsaWdodHMlMjBhdXJvcmF8ZW58MXx8fHwxNzcyNjIyMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1799,
    duration: '6 Days',
    description: 'Land of fire and ice with stunning waterfalls, geysers, and Northern Lights.',
    featured: false
  },
  {
    id: '10',
    name: 'Barcelona',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1660855562147-2f2eab48c0c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbiUyMHNhZ3JhZGElMjBmYW1pbGlhfGVufDF8fHx8MTc3MjYzMDUwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1199,
    duration: '6 Days',
    description: 'Vibrant city with Gaudí architecture, Mediterranean beaches, and rich cultural heritage.',
    featured: false
  },
  {
    id: '11',
    name: 'Phuket',
    country: 'Thailand',
    image: 'https://images.unsplash.com/flagged/photo-1575834678162-9fd77151f40b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpbGFuZCUyMHRyb3BpY2FsJTIwYmVhY2glMjBzdW5zZXR8ZW58MXx8fHwxNzcyNjYzOTYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    price: 899,
    duration: '7 Days',
    description: 'Tropical beaches, vibrant nightlife, and rich Thai culture at affordable prices.',
    featured: false
  },
  {
    id: '12',
    name: 'Rome',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1662898290891-a6c7f022e851?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwaXRhbHklMjBjb2xvc3NldW0lMjBhbmNpZW50fGVufDF8fHx8MTc3MjU4NzEzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    price: 1099,
    duration: '6 Days',
    description: 'Ancient wonders, Renaissance art, and authentic Italian cuisine in the Eternal City.',
    featured: false
  }
];

export const packages: Package[] = destinations.map(dest => ({
  id: `pkg-${dest.id}`,
  title: `${dest.name} ${dest.duration} Adventure`,
  destinationId: dest.id,
  price: dest.price,
  duration: dest.duration,
  groupSize: dest.id === '1' ? '2-10' : '2-8',
  location: dest.country,
  rating: 5.0,
  features: [
    'Round-trip flights',
    'Luxury hotel accommodation',
    'Daily breakfast',
    'Guided tours',
    '24/7 travel support',
    'Travel insurance'
  ],
  description: dest.description,
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Check-in',
      activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'City orientation']
    },
    {
      day: 2,
      title: 'City Tour',
      activities: ['Breakfast at hotel', 'Guided city tour', 'Visit main attractions', 'Local cuisine lunch']
    },
    {
      day: 3,
      title: 'Cultural Experience',
      activities: ['Museum visits', 'Historical sites', 'Cultural show', 'Shopping time']
    }
  ],
  images: [dest.image],
  reviews: [
    {
      id: '1',
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Amazing experience! Everything was perfectly organized.',
      date: '2026-02-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      rating: 5,
      comment: 'The best vacation we\'ve ever had. Highly recommend!',
      date: '2026-02-10'
    }
  ]
}));

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    comment: 'Absolutely fantastic service! GoldeTrip handled everything from visas to bookings. The trip to Paris was unforgettable. Our guide was knowledgeable and the accommodations exceeded expectations. Will definitely book with them again!',
    location: 'Amman, Jordan'
  },
  {
    id: '2',
    name: 'Ahmed Al-Rashid',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    rating: 5,
    comment: 'Best travel agency in Jordan! They organized our family trip to Maldives perfectly. The visa process was smooth and hassle-free. Professional staff, competitive prices, and excellent customer support. Highly recommend!',
    location: 'Amman, Jordan'
  },
  {
    id: '3',
    name: 'Layla Hassan',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    rating: 5,
    comment: 'Had an amazing honeymoon in Santorini thanks to GoldeTrip! From the initial consultation to returning home, everything was seamless. They took care of all details including visa, flights, and hotels. Outstanding service!',
    location: 'Amman, Jordan'
  },
  {
    id: '4',
    name: 'Mohammed Khalil',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    comment: 'Very professional and reliable! GoldeTrip helped us with Dubai visa and tour packages. Great prices and excellent communication throughout. The team went above and beyond to ensure we had the best experience.',
    location: 'Amman, Jordan'
  },
  {
    id: '5',
    name: 'Noor Abdullah',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    rating: 5,
    comment: 'I cannot thank GoldeTrip enough for making our European tour so smooth! They handled all our Schengen visas professionally. The itinerary was perfect and the customer service was exceptional. Truly the best!',
    location: 'Amman, Jordan'
  },
  {
    id: '6',
    name: 'Omar Mansour',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 5,
    comment: 'Excellent experience with GoldeTrip! Booked a business trip to New York and they handled everything efficiently. Fast visa processing, great flight deals, and responsive team. Will use their services again without hesitation.',
    location: 'Amman, Jordan'
  }
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior Travel Consultant',
    department: 'Sales',
    location: 'New York, USA',
    type: 'Full-time',
    description: 'Join our team as a Senior Travel Consultant and help create unforgettable experiences for our clients.',
    requirements: [
      '5+ years experience in travel industry',
      'Excellent communication skills',
      'Knowledge of global destinations',
      'Customer service expertise'
    ],
    posted: '2026-02-28'
  },
  {
    id: '2',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead our digital marketing efforts to expand GoldeTrip\'s reach globally.',
    requirements: [
      '3+ years in digital marketing',
      'SEO and SEM expertise',
      'Social media management',
      'Analytics proficiency'
    ],
    posted: '2026-02-25'
  },
  {
    id: '3',
    title: 'Customer Support Specialist',
    department: 'Customer Service',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Provide world-class support to our valued customers.',
    requirements: [
      '2+ years customer service',
      'Multilingual preferred',
      'Problem-solving skills',
      'Travel industry knowledge'
    ],
    posted: '2026-02-20'
  }
];