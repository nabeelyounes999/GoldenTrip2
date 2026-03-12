import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight, Star, DollarSign, Headphones, Shield, Users, Check, Globe, Compass, Map, Heart, Award, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { Destination, Testimonial, Package, Feature } from '../types';

const iconMap: Record<string, any> = {
  DollarSign, Headphones, Users, Shield, Globe, Compass, Map, Star, Heart, Award, CheckCircle
};function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button onClick={onClick} className="slick-arrow slick-next">
      <ChevronRight className="w-6 h-6" style={{ color: 'var(--navy)' }} />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button onClick={onClick} className="slick-arrow slick-prev">
      <ChevronLeft className="w-6 h-6" style={{ color: 'var(--navy)' }} />
    </button>
  );
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [destsReq, testsReq, pkgsReq, featsReq] = await Promise.all([
        apiService.getDestinations(),
        apiService.getTestimonials(),
        apiService.getPackages(),
        apiService.getFeatures()
      ]);
      if (destsReq.data) setDestinations(destsReq.data);
      if (testsReq.data) setTestimonials(testsReq.data);
      if (pkgsReq.data) setPackages(pkgsReq.data);
      if (featsReq.data) setFeatures(featsReq.data);
    };
    fetchData();
  }, []);

  const heroSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: !isRTL,
    rtl: isRTL,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  const dealsSettings = {
    dots: false,
    infinite: destinations.length > 4,
    speed: 500,
    slidesToShow: Math.min(4, destinations.length || 1),
    slidesToScroll: 1,
    autoplay: destinations.length > 1,
    autoplaySpeed: 3000,
    rtl: isRTL,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const testimonialSettings = {
    dots: true,
    infinite: testimonials.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, testimonials.length || 1),
    slidesToScroll: 1,
    autoplay: testimonials.length > 1,
    autoplaySpeed: 4000,
    rtl: isRTL,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const heroDestinations = destinations.slice(0, 5);
  const featuredDestinations = destinations.filter(d => d.featured);
  const pricingPackages = packages.slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <Slider {...heroSettings} className="h-full">
          {heroDestinations.map((dest) => (
            <div key={dest.id} className="relative h-screen">
              <div className="absolute inset-0">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              </div>
              <div className="relative h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                  >
                    <h1 className="text-3xl sm:text-5xl md:text-7xl text-white mb-6 leading-tight">
                      {t('hero.title', 'Discover Your Next Great')} <span style={{ color: 'var(--gold)' }}>{t('hero.highlight', 'Adventure')}</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8">
                      {t('hero.subtitle', 'Expertly crafted journeys, unforgettable experiences, and seamless visa services around the globe.')}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        to="/destinations"
                        className="px-6 py-3 sm:px-8 sm:py-4 rounded-full text-white text-base sm:text-lg transition-all hover:shadow-2xl"
                        style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                      >
                        {t('hero.explore', 'Explore Packages')}
                      </Link>
                      <Link
                        to="/contact"
                        className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-white/10 backdrop-blur-sm text-white text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all"
                      >
                        {t('hero.contact', 'Contact Us')}
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Featured Countries */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl mb-4" style={{ color: 'var(--navy)' }}>
              {t('home.featured.title', 'Featured Destinations')}
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              {t('home.featured.subtitle', 'Handpicked destinations for your next adventure')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/package/${dest.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 end-4 px-4 py-2 rounded-full text-white flex items-center gap-1"
                           style={{ background: 'var(--gold)' }}>
                        <span className="text-xs font-normal opacity-90">{t('destinations.card.startingFrom', 'Starting from')}</span>
                        <span dir="ltr" className="font-semibold">{dest.price} {t('destinations.card.jod', 'JOD')}</span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-2xl mb-2" style={{ color: 'var(--navy)' }}>
                        {dest.name}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2">{dest.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: 'var(--gold)' }}>
                          {dest.duration}
                        </span>
                        <span className="px-4 sm:px-6 py-2 rounded-full text-white text-sm font-semibold flex items-center justify-center gap-1"
                                style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}>
                          <span className="text-xs font-normal opacity-90">{t('destinations.card.startingFrom', 'Starting from')}</span>
                          <span dir="ltr">{dest.price} {t('destinations.card.jod', 'JOD')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: 'var(--navy)' }}>
              {t('home.packages.title', 'Travel Packages')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.packages.subtitle', 'Choose the perfect package for your dream vacation')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border-2 hover:border-[var(--gold)] p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <h3 className="text-2xl mb-2" style={{ color: 'var(--navy)' }}>{pkg.title}</h3>
                <div className="mb-6 flex items-baseline gap-1 justify-center">
                  <span className="text-4xl" style={{ color: 'var(--gold)' }} dir="ltr">{pkg.price} {t('destinations.card.jod', 'JOD')}</span>
                  <span className="text-gray-600"> / {pkg.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/package/${pkg.destinationId}`}
                  className="block w-full px-6 py-3 rounded-full text-white text-center transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                >
                  {t('home.packages.bookNow', 'Book Now')}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Deals Carousel */}
      <section className="py-20 bg-[var(--navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl text-white mb-4">
              {t('home.deals.title', 'Exclusive Travel Deals')}
            </h2>
            <p className="text-xl text-gray-300">
              {t('home.deals.subtitle', 'Limited time offers on popular destinations')}
            </p>
          </motion.div>

          <Slider {...dealsSettings}>
            {destinations.map((dest) => (
              <div key={dest.id} className="px-3">
                <Link to={`/package/${dest.id}`}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
                    <div className="relative h-48">
                      <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white text-xl mb-1">{dest.name}</h4>
                        <p className="text-gray-200 text-sm">{dest.country}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <span style={{ color: 'var(--gold)' }}>{t('home.deals.from', 'From JOD')} {dest.price}</span>
                        <span className="text-sm text-gray-600">{dest.duration}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: 'var(--navy)' }}>
              {t('home.whyUs.title', 'Why Choose Golden Trip?')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.whyUs.subtitle', 'We make your travel dreams come true')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((item, index) => {
              const Icon = iconMap[item.icon] || Star;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-4 sm:p-6"
                >
                  <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%)' }}>
                    <Icon className="w-7 h-7 sm:w-10 sm:h-10" style={{ color: 'var(--gold-dark)' }} />
                  </div>
                  <h3 className="text-base sm:text-xl mb-2 sm:mb-3" style={{ color: 'var(--navy)' }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4" style={{ color: 'var(--navy)' }}>
              {t('home.testimonials.title', 'What Our Travelers Say')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.testimonials.subtitle', 'Real experiences from real travelers')}
            </p>
          </motion.div>

          <Slider {...testimonialSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-3">
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-lg" style={{ color: 'var(--navy)' }}>{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[var(--gold)]" style={{ color: 'var(--gold)' }} />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{testimonial.comment}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}
