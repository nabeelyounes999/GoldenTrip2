import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Star, Clock, Users, MapPin, Check, Calendar, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { Destination, Package } from '../types';

export default function PackageDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: 1,
    date: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const [destsReq, pkgsReq] = await Promise.all([
        apiService.getDestinations(),
        apiService.getPackages()
      ]);
      
      if (destsReq.data && pkgsReq.data) {
        const foundDest = destsReq.data.find(d => d.id === id);
        const foundPkg = pkgsReq.data.find(p => p.destinationId === id);
        setDestination(foundDest || null);
        setPkg(foundPkg || null);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">{t('packageDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl mb-4" style={{ color: 'var(--navy)' }}>{t('packageDetails.notFound')}</h2>
          <Link to="/destinations" className="text-[var(--gold)] hover:underline">
            {t('packageDetails.back')}
          </Link>
        </div>
      </div>
    );
  }

  // Fallback data from destination if package is missing
  const displayData = {
    price: pkg?.price || destination.price,
    duration: pkg?.duration || destination.duration,
    description: pkg?.description || destination.description,
    groupSize: pkg?.groupSize || destination.groupSize || '2-10',
    location: pkg?.location || destination.location || destination.country,
    rating: pkg?.rating || destination.rating || 5.0,
    features: pkg?.features || destination.features || [],
    itinerary: pkg?.itinerary || destination.itinerary || [],
    reviews: pkg?.reviews || destination.reviews || []
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await apiService.saveBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: `${destination.name}, ${destination.country}`,
        guests: formData.travelers,
        price: displayData.price * formData.travelers,
        checkIn: formData.date,
        checkOut: new Date(new Date(formData.date).getTime() + 86400000 * 7).toISOString(),
      });
      
      if (!error) {
        alert(t('packageDetails.alerts.success'));
        setFormData({ name: '', email: '', phone: '', travelers: 1, date: '' });
      } else {
        alert(t('packageDetails.alerts.fail'));
      }
    } catch (err) {
      console.error(err);
      alert(t('packageDetails.alerts.error'));
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Image */}
      <section className="relative h-96 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl text-white mb-2">{destination.name}</h1>
              <p className="text-xl text-gray-200">{destination.country}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('packageDetails.overview')}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{displayData.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <Clock className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm text-gray-600">{t('packageDetails.duration')}</p>
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{displayData.duration}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <Users className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm text-gray-600">{t('packageDetails.groupSize')}</p>
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{displayData.groupSize}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm text-gray-600">{t('packageDetails.location')}</p>
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{displayData.location}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <Star className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm text-gray-600">{t('packageDetails.rating')}</p>
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{displayData.rating}</p>
                </div>
              </div>
            </motion.div>

            {/* Features Included */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('packageDetails.whatsIncluded')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayData.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Itinerary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('packageDetails.itinerary')}</h2>
              <div className="space-y-6">
                {displayData.itinerary.map((day: any) => (
                  <div key={day.day} className="border-s-4 ps-6" style={{ borderColor: 'var(--gold)' }}>
                    <h3 className="text-xl mb-3" style={{ color: 'var(--navy)' }}>
                      {t('packageDetails.day')} {day.day}: {day.title}
                    </h3>
                    <ul className="space-y-2">
                      {(day.activities || []).map((activity: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--gold)' }} />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('packageDetails.reviews')}</h2>
              <div className="space-y-6">
                {displayData.reviews.map((review: any) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg" style={{ color: 'var(--navy)' }}>{review.name}</h4>
                        <p className="text-sm text-gray-600">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(review.rating)].map((_: any, i: number) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--gold)]" style={{ color: 'var(--gold)' }} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-8 shadow-2xl sticky top-28"
            >
              <div className="mb-6">
                <div className="text-4xl mb-2" style={{ color: 'var(--gold)' }}>
                  JOD {displayData.price}
                </div>
                <p className="text-gray-600">{t('packageDetails.booking.perPerson')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
                    {t('packageDetails.booking.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
                    {t('packageDetails.booking.email')}
                  </label>
                  <div className="relative">
                    <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full ps-11 pe-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
                    {t('packageDetails.booking.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full ps-11 pe-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
                    {t('packageDetails.booking.travelers')}
                  </label>
                  <div className="relative">
                    <Users className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={formData.travelers}
                      onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) })}
                      className="w-full ps-11 pe-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
                    {t('packageDetails.booking.date')}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full ps-11 pe-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-700">{t('packageDetails.booking.totalPrice')}</span>
                    <span className="text-2xl" style={{ color: 'var(--gold)' }}>
                      JOD {displayData.price * formData.travelers}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-full text-white transition-all hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                  >
                    {t('packageDetails.booking.bookNow')}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center">
                  {t('packageDetails.booking.questions')}<Link to="/contact" className="text-[var(--gold)] hover:underline">{t('packageDetails.booking.contactUs')}</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
