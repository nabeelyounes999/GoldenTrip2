import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, MapPin, Package, Star, Briefcase, MessageSquare, 
  Calendar, Settings, LogOut, Menu, X, Plane, FileText, CheckCircle, Archive, Users, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../api/apiService';

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState('admin@goldentrip.com');
  const [loading, setLoading] = useState(true);
  const [logoData, setLogoData] = useState<string>('');
  const [adminPhoto, setAdminPhoto] = useState<string>('');

  useEffect(() => {
    checkAuth();
    fetchLogo();
    
    // Periodically sync user info from localStorage
    const interval = setInterval(() => {
      syncUserInfo();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const syncUserInfo = async () => {
    const { data } = await apiService.getSettings();
    if (data) {
      if (data.firstName) setUsername(data.firstName);
      if (data.email) setUserEmail(data.email);
    }
    const savedPhoto = localStorage.getItem('goldentrip_admin_photo');
    if (savedPhoto) setAdminPhoto(savedPhoto);
  };

  const fetchLogo = async () => {
    const { data } = await apiService.getSettings();
    if (data?.siteLogo) setLogoData(data.siteLogo);
    else setLogoData('/logo.png');
  };

  const checkAuth = async () => {
    if (apiService.isAuthenticated()) {
      syncUserInfo();
      setLoading(false);
    } else {
      setLoading(false);
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    apiService.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/destinations', icon: MapPin, label: 'Destinations' },
    { path: '/admin/visas', icon: FileText, label: 'Visas' },
    { path: '/admin/packages', icon: Package, label: 'Packages' },
    { path: '/admin/features', icon: CheckCircle, label: 'Features' },
    { path: '/admin/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
    { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/admin/closed-leads', icon: Archive, label: 'Closed Leads' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/about', icon: Users, label: 'About Us' },
    { path: '/admin/blogs', icon: BookOpen, label: 'Blog' }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed top-0 left-0 h-full w-70 bg-[var(--navy)] text-white z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src={logoData || "/logo.png"} alt="Golden Trip Logo" className="h-10 w-auto object-contain bg-white rounded p-1" />
                  <span className="text-xl font-bold">
                    Golden <span style={{ color: 'var(--gold)' }}>Trip</span> Admin
                  </span>
                </div>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active 
                          ? 'bg-[var(--gold)] text-white' 
                          : 'text-gray-300 hover:bg-[var(--navy-lighter)]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-white/10 space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-[var(--navy-lighter)] transition-colors"
                >
                  <Plane className="w-5 h-5" />
                  <span>Back to Website</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-colors w-full text-left cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? 'lg:ml-70' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" style={{ color: 'var(--navy)' }} />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: 'var(--navy)' }}>{username || 'Thabet'}</p>
                <p className="text-[10px] text-gray-500">{userEmail}</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm"
                   style={{ background: 'var(--gold)' }}>
                {adminPhoto ? (
                  <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-bold">{username?.charAt(0) || 'T'}</span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}