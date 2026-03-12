import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Plane, Lock, User } from 'lucide-react';
import { apiService } from '../../api/apiService';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoData, setLogoData] = useState<string>('');

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await apiService.getSettings();
      if (data?.siteLogo) setLogoData(data.siteLogo);
      else setLogoData('/logo.png');
    };
    fetchLogo();
  }, []);

  // if we already have a token, verify and redirect to admin dashboard
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    try {
      const { data, error } = await apiService.login(
        credentials.username.trim(),
        credentials.password
      );

      if (error) {
        setError(error.message);
      } else if (data) {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !credentials.username || !credentials.password;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--navy)] to-[var(--navy-lighter)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <img src={logoData || "/logo.png"} alt="Site Logo" className="h-20 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Golden <span style={{ color: 'var(--gold)' }}>Trip</span> Admin
          </h1>
          <p className="text-gray-600">Sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                name="username"
                autoComplete="username"
                value={credentials.username}
                onChange={(e) => {
                  setError('');
                  setCredentials({ ...credentials, username: e.target.value.replace(/^\s+/, '') });
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm" style={{ color: 'var(--navy)' }}>
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                name="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={(e) => {
                  setError('');
                  setCredentials({ ...credentials, password: e.target.value });
                }}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full px-6 py-4 rounded-full text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-sm bg-transparent border-none cursor-pointer" 
            style={{ color: 'var(--gold)' }}
          >
            ← Back to Website
          </button>
        </div>
      </motion.div>
    </div>
  );
}
