import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Clock, Calendar, Globe, Check, Search, Star, DollarSign, Headphones, Shield, Compass, Map, Heart, Award, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';
import type { Visa } from '../types';
import { Feature } from '../types';

const iconMap: Record<string, any> = {
  DollarSign, Headphones, Users: Globe, Shield, Globe, Compass, Map, Star, Heart, Award, CheckCircle
};
export default function Visas() {
  const { t } = useTranslation();
  const [visas, setVisas] = useState<Visa[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const [visaRes, featRes] = await Promise.all([
        apiService.getVisas(),
        apiService.getFeatures()
      ]);
      if (!visaRes.error && visaRes.data) {
        setVisas(visaRes.data);
      }
      if (!featRes.error && featRes.data) {
        setFeatures(featRes.data);
      }
    } catch (error) {
      console.error('Error fetching visas:', error);
    } finally {
      setLoading(false);
    }
  };
  const filteredVisas = visas.filter((visa: Visa) =>
    visa.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, var(--gold) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('visas.hero.title', 'Visa Services')}
            </h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
              {t('visas.hero.subtitle', 'Complete visa assistance for your dream destinations. We handle the paperwork, you enjoy the journey.')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute start-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('visas.hero.searchPlaceholder', 'Search for a country...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full ps-12 pe-4 py-4 bg-white text-gray-900 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[var(--gold)] shadow-md"
                  dir="auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Visas Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">{t('visas.loading', 'Loading visa information...')}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVisas.map((visa: Visa, index: number) => (
                <motion.div
                  key={visa.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all group"
                >
                  {/* Header */}
                  <div
                    className="p-6 text-white"
                    style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Globe className="w-6 h-6" />
                      <h3 className="text-2xl font-bold">{visa.country}</h3>
                    </div>
                    <p className="text-sm opacity-90">{visa.description}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Price */}
                    <div className="mb-6 text-center py-4 rounded-xl" style={{ backgroundColor: 'var(--gold-light)' }}>
                      <div className="text-sm text-gray-700 mb-1">{t('visas.fee', 'Application Fee')}</div>
                      <div className="text-4xl font-bold" style={{ color: 'var(--gold-dark)' }}>
                        JOD {visa.applicationFee}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <div>
                          <div className="text-sm text-gray-500">{t('visas.processingTime', 'Processing Time')}</div>
                          <div className="font-semibold text-gray-900">{visa.processingTime}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <div>
                          <div className="text-sm text-gray-500">{t('visas.validityPeriod', 'Validity Period')}</div>
                          <div className="font-semibold text-gray-900">{visa.validityPeriod}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                        <div>
                          <div className="text-sm text-gray-500">{t('visas.entryType', 'Entry Type')}</div>
                          <div className="font-semibold text-gray-900">{visa.entryType}</div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 text-gray-900">{t('visas.requirements', 'Required Documents:')}</h4>
                      <ul className="space-y-2">
                        {visa.requirements.map((req: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--gold)' }} />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <a
                      href="/contact"
                      className="block mt-6 w-full text-center px-6 py-3 rounded-full text-white font-semibold transition-all hover:shadow-lg"
                      style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-dark) 100%)' }}
                    >
                      {t('visas.applyNow', 'Apply Now')}
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredVisas.length === 0 && (
            <div className="text-center py-20">
              <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-600">{t('visas.noVisas', 'No visas found matching your search.')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--navy)' }}>
              {t('visas.whyUs.title', 'Why Choose ')}
              <span style={{ color: 'var(--gold)' }}>{t('visas.whyUs.highlight', 'Golden Trip')}</span>
              {t('visas.whyUs.titleEnd', ' for Your Visa?')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('visas.whyUs.subtitle', 'We make visa applications simple, fast, and stress-free')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {features.map((feature: Feature, index: number) => {
              const Icon = iconMap[feature.icon] || Star;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-2xl bg-gray-50 hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%)' }}>
                    <Icon className="w-8 h-8" style={{ color: 'var(--gold-dark)' }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
