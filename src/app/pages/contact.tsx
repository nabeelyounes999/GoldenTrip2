import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';

export default function Contact() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    apiService.getSettings().then(({ data }) => {
      setSettings(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await apiService.saveMessage(formData);
      if (!error) {
        alert(t('contact.form.alertSuccess'));
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert(t('contact.form.alertFail'));
      }
    } catch (err) {
      console.error(err);
      alert(t('contact.form.alertError'));
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero */}
      <section className="bg-[var(--navy)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-5xl text-white mb-4">{t('contact.hero.title')}</h1>
            <p className="text-xl text-gray-200">{t('contact.hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('contact.info.title')}</h2>
              <p className="text-gray-600 mb-8">
                {t('contact.info.desc')}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--gold-light)' }}>
                  <MapPin className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="text-lg mb-1" style={{ color: 'var(--navy)' }}>{t('contact.info.address')}</h3>
                  <p className="text-gray-600">
                    {settings?.contactInfo?.address || 'Al-Arab St., ABUNSEER, Amman, Jordan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--gold-light)' }}>
                  <Phone className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="text-lg mb-1" style={{ color: 'var(--navy)' }}>{t('contact.info.phone')}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    {(settings?.contactInfo?.phone || '+962 79 804 6662').split(',').filter(Boolean).map((phone: string, i: number) => (
                      <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-600 hover:text-[var(--gold)] transition-colors" dir="ltr">
                        {phone.trim()}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--gold-light)' }}>
                  <Mail className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="text-lg mb-1" style={{ color: 'var(--navy)' }}>{t('contact.info.email')}</h3>
                  <div className="flex flex-col gap-1 items-start">
                    {(settings?.contactInfo?.email || 'info@goldentrip.com, gm@goldentrip.com').split(',').map((email: string) => email.trim()).filter(Boolean).map((email: string, i: number) => (
                      <a key={i} href={`mailto:${email}`} className="text-gray-600 hover:text-[var(--gold)] transition-colors" dir="ltr">
                        {email}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-md">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'var(--gold-light)' }}>
                  <Clock className="w-6 h-6" style={{ color: 'var(--gold-dark)' }} />
                </div>
                <div>
                  <h3 className="text-lg mb-1" style={{ color: 'var(--navy)' }}>{t('contact.info.hours')}</h3>
                  <p className="text-gray-600 whitespace-pre-line">{t('contact.info.days')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl mb-6" style={{ color: 'var(--navy)' }}>{t('contact.form.title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block mb-2" style={{ color: 'var(--navy)' }}>
                    {t('contact.form.nameLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: 'var(--navy)' }}>
                    {t('contact.form.emailLabel')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                    placeholder={t('contact.form.emailPlaceholder')}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ color: 'var(--navy)' }}>
                    {t('contact.form.messageLabel')}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none resize-none"
                    placeholder={t('contact.form.messagePlaceholder')}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 rounded-full text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                >
                  <Send className="w-5 h-5" />
                  {t('contact.form.submit')}
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5268!2d35.8968!3d31.9593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1c5de89f867%3A0x8dbf8c4d2f9!2sAl-Arab%20St%2C%20Amman%2C%20Jordan!5e0!3m2!1sen!2s!4v1234567890!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: '1rem' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}