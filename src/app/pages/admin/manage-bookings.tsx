import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, DollarSign, Check, X, Trash2, Search } from 'lucide-react';
import { apiService, AdminBooking as Booking } from '../../api/apiService';



export default function ManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await apiService.getBookings();
      if (!error && data) {
        setBookings(data as Booking[]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const { error } = await apiService.updateBookingStatus(id, status);
      if (!error) {
        await fetchBookings();
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Error updating booking status');
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      const { error } = await apiService.deleteBooking(id);
      if (!error) {
        await fetchBookings();
      } else {
        alert('Failed to delete booking');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking');
    }
  };

  const filteredBookings = bookings.filter((booking: Booking) => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: Booking) => b.status === 'pending').length,
    confirmed: bookings.filter((b: Booking) => b.status === 'confirmed').length,
    cancelled: bookings.filter((b: Booking) => b.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Total Bookings</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Pending</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Confirmed</div>
          <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Cancelled</div>
          <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
        </div>
      </div>

      <div className="p-4 md:p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              Manage Bookings
            </h2>
            <p className="text-gray-600 mt-1">View and manage all customer bookings</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[var(--gold)] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No bookings found
            </div>
          ) : (
            filteredBookings.map((booking: Booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <span className="font-semibold">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <span className="text-sm">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <span className="font-medium">{booking.destination}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <span className="text-sm font-medium">{booking.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                        <span className="font-semibold">JOD {booking.price || '0'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(booking.id, 'pending')}
                          className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Set Pending
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'cancelled')}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                    {booking.status === 'cancelled' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(booking.id, 'confirmed')}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Reactivate
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, 'pending')}
                          className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Set Pending
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
