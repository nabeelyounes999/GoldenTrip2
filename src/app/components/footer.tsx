import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';

export function Footer() {
  const { t } = useTranslation();
  const location = useLocation();
  const [settings, setSettings] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      await fetch("https://formsubmit.co/ajax/nabeeltaha999@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            email,
            _subject: "New Newsletter Subscription!"
        })
      });
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await apiService.getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, [location.pathname]);

  if (isAdminRoute) return null;

  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={settings?.siteLogo || "/logo.png"} alt="Site Logo" className="h-12 w-auto object-contain bg-white rounded-lg p-1" />
              <span className="text-2xl font-bold tracking-tight text-white">
                Golden <span style={{ color: 'var(--gold)' }}>Trip</span>
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              {t('footer.brandDesc', 'Creating unforgettable travel experiences around the world since 2009.')}
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/golden.jo8/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--gold)] flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/golden_trip_travel_jo" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-[var(--gold)] flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-4" style={{ color: 'var(--gold)' }}>{t('footer.quickLinks', 'Quick Links')}</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.home', 'Home')}</Link></li>
              <li><Link to="/destinations" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.destinations', 'Destinations')}</Link></li>
              <li><Link to="/visas" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.visas', 'Visas')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.about', 'About Us')}</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.careers', 'Careers')}</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.blogs', 'Blog')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('nav.contact', 'Contact')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg mb-4" style={{ color: 'var(--gold)' }}>{t('footer.legal', 'Legal')}</h4>
            <ul className="space-y-3">
              <li><Link to="/legal/privacy" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link></li>
              <li><Link to="/legal/terms" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('footer.terms', 'Terms of Service')}</Link></li>
              <li><Link to="/legal/cookies" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('footer.cookies', 'Cookie Policy')}</Link></li>
              <li><Link to="/legal/refund" className="text-gray-300 hover:text-[var(--gold)] transition-colors">{t('footer.refund', 'Refund Policy')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg mb-4" style={{ color: 'var(--gold)' }}>{t('footer.contact', 'Contact Us')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: 'var(--gold)' }} />
                <span className="text-gray-300" dir="ltr">{settings?.contactInfo?.address || 'Al-Arab St., ABUNSEER 00962 Amman, Jordan'}</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--gold)' }} />
                <div className="flex flex-col gap-1 items-start">
                  {(settings?.contactInfo?.phone || '+962 79 804 6662').split(',').map((phone: string, i: number) => (
                    <a key={i} href={`tel:${phone.replace(/\s/g, '')}`} className="text-gray-300 hover:text-[var(--gold)] transition-colors" dir="ltr">
                      {phone.trim()}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: 'var(--gold)' }} />
                <div className="flex flex-col gap-1 items-start">
                  <a href={`mailto:${settings?.contactInfo?.email || 'info@goldentrip.com'}`} className="text-gray-300 hover:text-[var(--gold)] transition-colors" dir="ltr">
                    {settings?.contactInfo?.email || 'info@goldentrip.com'}
                  </a>
                  <a href={`mailto:${settings?.supportEmail || 'gm@goldentrip.com'}`} className="text-gray-300 hover:text-[var(--gold)] transition-colors" dir="ltr">
                    {settings?.supportEmail || 'gm@goldentrip.com'}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="text-xl mb-4" style={{ color: 'var(--gold)' }}>{t('footer.newsletter.title', 'Subscribe to Our Newsletter')}</h4>
            <p className="text-gray-300 mb-6">{t('footer.newsletter.desc', 'Get the latest travel deals and destination guides delivered to your inbox.')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.placeholder', 'Enter your email')}
                  dir="ltr"
                  className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-[var(--gold)] text-start"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-8 py-3 rounded-full text-white whitespace-nowrap transition-all hover:shadow-lg disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                >
                  {status === 'loading' ? t('footer.newsletter.subscribing', 'Subscribing...') : t('footer.newsletter.button', 'Subscribe')}
                </button>
              </div>
              {status === 'success' && <p className="text-sm text-green-400">{t('footer.newsletter.success', 'Successfully subscribed! Please check your email to confirm.')}</p>}
              {status === 'error' && <p className="text-sm text-red-400">{t('footer.newsletter.error', 'Failed to subscribe. Please try again.')}</p>}
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400" dir="ltr">
          <p>&copy; {new Date().getFullYear()} {t('footer.copyright', 'Golden Trip. All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
}