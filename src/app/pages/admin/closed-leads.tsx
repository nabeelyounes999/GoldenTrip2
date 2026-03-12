import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Archive, Search, CheckCircle, XCircle, MessageSquare, Calendar, MapPin, Trash2 } from 'lucide-react';
import { apiService, AdminBooking } from '../../api/apiService';

type AdminMessage = { id: string; name: string; email: string; message: string; status: 'new' | 'read' | 'replied'; createdAt: string; };

export default function ClosedLeads() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages'>('bookings');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookRes, msgRes] = await Promise.all([
        apiService.getBookings(),
        apiService.getMessages()
      ]);
      
      if (!bookRes.error && bookRes.data) {
        setBookings((bookRes.data as AdminBooking[]).filter(b => b.status === 'confirmed' || b.status === 'cancelled'));
      }
      
      if (!msgRes.error && msgRes.data) {
        setMessages((msgRes.data as any[]).filter(m => m.status === 'replied' || m.status === 'read'));
      }
    } catch (error) {
      console.error('Error fetching closed leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    await apiService.updateBookingStatus(id, status);
    fetchData();
  };

  const deleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    await apiService.deleteBooking(id);
    fetchData();
  };

  const handleMessageStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    // Assuming updateMessageStatus exists in apiService (I should check)
    await (apiService as any).updateMessageStatus(id, status);
    fetchData();
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    await apiService.deleteMessage(id);
    fetchData();
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Closed Leads</h1>
          <p className="text-gray-600">Archived and processed inquiries for your reference.</p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'bookings' ? 'bg-[var(--gold)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Closed Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${activeTab === 'messages' ? 'bg-[var(--gold)] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            Processed Messages ({messages.length})
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--gold)] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading archives...</p>
            </div>
          ) : activeTab === 'bookings' ? (
            <div className="grid gap-4">
              {filteredBookings.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <Archive className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No closed bookings found.</p>
                </div>
              ) : (
                filteredBookings.map(booking => (
                  <div key={booking.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[var(--gold-light)] transition-colors">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {booking.status === 'confirmed' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="font-bold" style={{ color: 'var(--navy)' }}>{booking.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {booking.destination}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 font-medium text-[var(--gold-dark)]">JOD {booking.price}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button
                        onClick={() => handleBookingStatus(booking.id, 'pending')}
                        className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                        title="Move back to Pending"
                       >
                         <Calendar className="w-4 h-4" />
                       </button>
                       <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No processed messages found.</p>
                </div>
              ) : (
                filteredMessages.map(msg => (
                  <div key={msg.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[var(--gold-light)] transition-colors">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold-dark)] font-bold text-xs">
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{msg.name}</p>
                            <p className="text-[10px] text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                          {msg.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 pl-10 line-clamp-2">{msg.message}</p>
                    </div>
                    <div className="flex gap-2">
                       <button
                        onClick={() => handleMessageStatus(msg.id, 'new')}
                        className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                        title="Move back to New"
                       >
                         <MessageSquare className="w-4 h-4" />
                       </button>
                       <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
