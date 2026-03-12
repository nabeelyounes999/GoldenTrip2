import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Trash2, Search, Eye, X } from 'lucide-react';
import { apiService } from '../../api/apiService';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'unread';
  createdAt: string;
}

export default function ManageMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await apiService.getMessages();
      if (!error && data) {
        setMessages(data as any);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      const { error } = await apiService.updateMessageStatus(id, status);
      if (!error) {
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const { error } = await apiService.deleteMessage(id);
      if (!error) {
        await fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'new' || (message.status as any) === 'unread') {
      updateStatus(message.id, 'read');
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         msg.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter(m => m.status === 'new' || (m.status as any) === 'unread').length,
    read: messages.filter(m => m.status === 'read').length
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Total Messages</div>
          <div className="text-3xl font-bold" style={{ color: 'var(--navy)' }}>{stats.total}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Unread</div>
          <div className="text-3xl font-bold text-red-600">{stats.unread}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-gray-600 text-sm mb-1">Read</div>
          <div className="text-3xl font-bold text-green-600">{stats.read}</div>
        </div>
      </div>

      <div className="p-4 md:p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)' }}>
              Manage Messages
            </h2>
            <p className="text-gray-600 mt-1">View and manage customer messages</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
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
            <option value="all">All Messages</option>
            <option value="new">New Only</option>
            <option value="read">Read Only</option>
            <option value="replied">Replied Only</option>
          </select>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No messages found
            </div>
          ) : (
            filteredMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`border-2 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-all ${
                  message.status === 'new' 
                    ? 'border-[var(--gold)] bg-[var(--gold-light)]' 
                    : 'border-gray-200 bg-white'
                }`}
                onClick={() => viewMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      {message.status === 'unread' ? (
                        <Mail className="w-5 h-5" style={{ color: 'var(--gold-dark)' }} />
                      ) : (
                        <MailOpen className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-900">{message.name}</span>
                        <span className="text-sm text-gray-500">{message.email}</span>
                        { (message.status === 'new' || (message.status as any) === 'unread') && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMessage(message);
                      }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                      style={{ color: 'var(--gold)' }}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                      title="Delete"
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

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                  Message Details
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 mb-1 block">From</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedMessage.name}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Email</label>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-lg hover:underline"
                    style={{ color: 'var(--gold)' }}
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Date</label>
                  <p className="text-gray-700">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500 mb-1 block">Message</label>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="flex-1 px-6 py-3 rounded-full text-white font-semibold text-center transition-all hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    deleteMessage(selectedMessage.id);
                  }}
                  className="px-6 py-3 rounded-full border-2 border-red-500 text-red-600 font-semibold hover:bg-red-50 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
