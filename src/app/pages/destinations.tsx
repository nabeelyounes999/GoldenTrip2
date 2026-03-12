import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import { Destination } from '../types';

export default function Destinations() {
  const { t } = useTranslation();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await apiService.getDestinations();
      if (!error && data) {
        setDestinations(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const countries: string[] = ['all', ...Array.from(new Set<string>(destinations.map((d: Destination) => d.country)))];

  const filteredDestinations = destinations.filter((dest: Destination) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === 'all' || dest.country === selectedCountry;
    
    let matchesPrice = true;
    if (priceRange === 'budget') matchesPrice = dest.price < 1000;
    else if (priceRange === 'mid') matchesPrice = dest.price >= 1000 && dest.price < 1500;
    else if (priceRange === 'luxury') matchesPrice = dest.price >= 1500;

    return matchesSearch && matchesCountry && matchesPrice;
  });

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative h-80 bg-[var(--navy)] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--gold)] to-[var(--gold-dark)]" />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl text-white mb-4">
                {t('destinations.hero.title')}
              </h1>
              <p className="text-xl text-gray-200">
                {t('destinations.hero.subtitle', { count: destinations.length })}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white shadow-lg sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('destinations.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                dir="auto"
              />
            </div>

            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-6 py-3 rounded-full border-2 flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--gold)', color: 'var(--navy)' }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('destinations.search.filters')}
            </button>

            {/* Filters (Desktop) */}
            <div className="hidden lg:flex gap-4">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-6 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="all">{t('destinations.search.allCountries')}</option>
                {countries.filter(c => c !== 'all').map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-6 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="all">{t('destinations.search.allPrices')}</option>
                <option value="budget">{t('destinations.search.budget')}</option>
                <option value="mid">{t('destinations.search.mid')}</option>
                <option value="luxury">{t('destinations.search.luxury')}</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="lg:hidden mt-4 space-y-4"
            >
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="all">{t('destinations.search.allCountries')}</option>
                {countries.filter(c => c !== 'all').map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
              >
                <option value="all">{t('destinations.search.allPrices')}</option>
                <option value="budget">{t('destinations.search.budget')}</option>
                <option value="mid">{t('destinations.search.mid')}</option>
                <option value="luxury">{t('destinations.search.luxury')}</option>
              </select>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>
              {loading
                ? t('destinations.results.loading')
                : filteredDestinations.length === 1
                  ? t('destinations.results.foundOne')
                  : t('destinations.results.found', { count: filteredDestinations.length })}
            </h2>
          </div>

          {!loading && filteredDestinations.length === 0 ? (
            <div className="text-center py-16">
              <Filter className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-2xl mb-2" style={{ color: 'var(--navy)' }}>{t('destinations.results.noResultsTitle')}</h3>
              <p className="text-gray-600">{t('destinations.results.noResultsDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map((dest: Destination, index: number) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/package/${dest.id}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl mb-1" style={{ color: 'var(--navy)' }}>
                          {dest.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">{dest.country}</p>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{dest.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--gold)' }}>
                            {dest.duration}
                          </span>
                          <span className="text-sm px-4 py-1.5 rounded-full text-white font-semibold flex items-center justify-center gap-1"
                                style={{ background: 'var(--navy)' }}>
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
          )}
        </div>
      </section>
    </div>
  );
}
