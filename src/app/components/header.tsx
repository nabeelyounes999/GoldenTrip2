import { Link, useLocation } from 'react-router';
import { Menu, X, Plane, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../api/apiService';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoData, setLogoData] = useState<string>('');
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Load Logo
    const fetchLogo = async () => {
      const { data } = await apiService.getSettings();
      if (data?.siteLogo) setLogoData(data.siteLogo);
      else setLogoData('/logo.png'); // Fallback
    };
    fetchLogo();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminRoute) return null;

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.destinations'), path: '/destinations' },
    { name: t('nav.visas'), path: '/visas' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.careers', 'Careers'), path: '/careers' },
    { name: t('nav.blogs', 'Blog'), path: '/blog' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoData || "/logo.png"} alt="Site Logo" className="h-12 w-auto object-contain" />
            <span className="text-2xl font-bold tracking-tight" style={{ color: 'var(--navy)' }}>
              Golden <span style={{ color: 'var(--gold)' }}>Trip</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative transition-colors ${
                  location.pathname === link.path
                    ? 'text-[var(--gold)]'
                    : 'text-[var(--navy)] hover:text-[var(--gold)]'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5"
                    style={{ background: 'var(--gold)' }}
                  />
                )}
              </Link>
            ))}
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2"
              title={i18n.language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">{i18n.language === 'en' ? 'عربي' : 'En'}</span>
            </button>
            <Link
              to="/destinations"
              className="px-6 py-2.5 rounded-full text-white transition-all hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
            >
              {t('hero.explore', 'Book Now')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            style={{ color: 'var(--navy)' }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="flex flex-col px-4 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? 'bg-[var(--gold-light)] text-[var(--gold-dark)]'
                      : 'text-[var(--navy)] hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                className="px-4 py-2 flex items-center gap-2 text-[var(--navy)] hover:bg-gray-50 rounded-lg"
              >
                <Globe className="w-5 h-5" />
                {i18n.language === 'en' ? 'عربي' : 'English'}
              </button>
              <Link
                to="/destinations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-6 py-2.5 rounded-full text-white text-center"
                style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
              >
                {t('hero.explore', 'Book Now')}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}