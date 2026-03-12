import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, DollarSign, Package, Users, MapPin, Star, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { apiService, AdminBooking } from '../../api/apiService';
import { Link } from 'react-router';
export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    revenue: 0,
    totalDestinations: 0,
    totalCustomers: 0
  });

  const [recentBookings, setRecentBookings] = useState<AdminBooking[]>([]);
  const [topDestinations, setTopDestinations] = useState<{ name: string, bookings: number, revenue: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: bookings }, { data: destinations }] = await Promise.all([
        apiService.getBookings(),
        apiService.getDestinations()
      ]);

      if (bookings && destinations) {
        setMetrics({
          totalBookings: bookings.length,
          revenue: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
          totalDestinations: destinations.length,
          totalCustomers: new Set(bookings.map(b => b.email)).size
        });

        // Recent bookings (last 4)
        const sortedBookings = [...bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentBookings(sortedBookings.slice(0, 4));

        // Top destinations
        const destStats = (bookings as any[]).reduce((acc: any, b: any) => {
          if (!acc[b.destination]) acc[b.destination] = { count: 0, revenue: 0 };
          acc[b.destination].count += 1;
          acc[b.destination].revenue += (b.price || 0);
          return acc;
        }, {} as Record<string, { count: number, revenue: number }>);

        const sortedDest = Object.entries(destStats)
          .map(([name, stats]: [string, any]) => ({
            name,
            bookings: stats.count,
            revenue: `${(stats.revenue / 1000).toFixed(1)}K JOD`
          }))
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 4);

        setTopDestinations(sortedDest);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: Calendar, label: 'Total Bookings', value: metrics.totalBookings.toString(), change: '+12%', color: 'var(--gold)' },
    { icon: DollarSign, label: 'Revenue', value: `${(metrics.revenue / 1000).toFixed(1)}K JOD`, change: '+18%', color: '#10b981' },
    { icon: MapPin, label: 'Destinations', value: metrics.totalDestinations.toString(), change: '+5%', color: '#3b82f6' },
    { icon: Users, label: 'Total Customers', value: metrics.totalCustomers.toString(), change: '+23%', color: '#8b5cf6' }
  ];

  // Generate chart data from real bookings
  const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = months.slice(0, currentMonth + 1).map((month, idx) => {
      const monthBookings = recentBookings.filter(b => new Date(b.createdAt).getMonth() === idx);
      return {
        month,
        bookings: monthBookings.length,
        revenue: monthBookings.reduce((sum, b) => sum + (b.price || 0), 0) / 1000
      };
    });
    return data;
  };

  const chartData = getChartData();
  const bookingsData = chartData.map(d => ({ month: d.month, bookings: d.bookings }));
  const revenueData = chartData.map(d => ({ month: d.month, revenue: d.revenue }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with Golden Trip.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span className="text-sm px-3 py-1 rounded-full"
                  style={{ background: '#10b98120', color: '#10b981' }}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl" style={{ color: 'var(--navy)' }}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl mb-6" style={{ color: 'var(--navy)' }}>Monthly Bookings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              {/* @ts-ignore */}
              <XAxis dataKey="month" stroke="#888" />
              {/* @ts-ignore */}
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="bookings" fill="var(--gold)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <h3 className="text-xl mb-6" style={{ color: 'var(--navy)' }}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              {/* @ts-ignore */}
              <XAxis dataKey="month" stroke="#888" />
              {/* @ts-ignore */}
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl" style={{ color: 'var(--navy)' }}>Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-sm" style={{ color: 'var(--gold)' }}>View All</Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium" style={{ color: 'var(--navy)' }}>{booking.name}</p>
                  <p className="text-sm text-gray-600">{booking.destination}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium" style={{ color: 'var(--gold)' }}>JOD {booking.price}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Destinations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl" style={{ color: 'var(--navy)' }}>Top Destinations</h3>
            <MapPin className="w-5 h-5" style={{ color: 'var(--gold)' }} />
          </div>
          <div className="space-y-4">
            {topDestinations.map((dest, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'var(--gold-light)' }}>
                    <span style={{ color: 'var(--gold-dark)' }}>{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--navy)' }}>{dest.name}</p>
                    <p className="text-sm text-gray-600">{dest.bookings} bookings</p>
                  </div>
                </div>
                <p className="font-medium" style={{ color: 'var(--gold)' }}>{dest.revenue}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl p-6 shadow-lg"
      >
        <h3 className="text-xl mb-6" style={{ color: 'var(--navy)' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/destinations" className="p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gold)] transition-colors text-left block">
            <MapPin className="w-8 h-8 mb-2" style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--navy)' }}>Manage Destinations</p>
          </Link>
          <Link to="/admin/packages" className="p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gold)] transition-colors text-left block">
            <Package className="w-8 h-8 mb-2" style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--navy)' }}>Manage Packages</p>
          </Link>
          <Link to="/admin/testimonials" className="p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gold)] transition-colors text-left block">
            <Star className="w-8 h-8 mb-2" style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--navy)' }}>Manage Testimonials</p>
          </Link>
          <Link to="/admin/messages" className="p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gold)] transition-colors text-left block">
            <MessageSquare className="w-8 h-8 mb-2" style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--navy)' }}>View Messages</p>
          </Link>
          <Link to="/admin/about" className="p-4 rounded-xl border-2 border-gray-200 hover:border-[var(--gold)] transition-colors text-left block">
            <Users className="w-8 h-8 mb-2" style={{ color: 'var(--gold)' }} />
            <p className="text-sm" style={{ color: 'var(--navy)' }}>Manage Team</p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
