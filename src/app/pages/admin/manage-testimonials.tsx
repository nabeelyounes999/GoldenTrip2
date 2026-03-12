import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, X, Edit2, Trash2, Plus, Star } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Testimonial } from '../../types';

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Testimonial | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Testimonial>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await apiService.saveTestimonial(editForm);
    await fetchTestimonials();
    setIsEditing(false);
    setSaving(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await apiService.getTestimonials();
      if (!error && data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await apiService.deleteTestimonial(id);
      setTestimonials(testimonials.filter(p => p.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
    }
  };

  const filteredItems = testimonials.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Manage Testimonials</h1>
          <p className="text-gray-600">Review and moderate client testimonials.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setEditForm({ name: '', location: '', rating: 5, comment: '', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-shadow hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Client</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Rating</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Comment snippet</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Loading testimonials...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No testimonials found</td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium" style={{ color: 'var(--navy)' }}>{item.name}</p>
                          <p className="text-sm text-gray-500">{item.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex gap-1">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium">{(item.comment || '').substring(0, 40)}...</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                          className="p-2 text-gray-400 hover:text-[var(--navy)] transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { 
                            setSelectedItem(item); 
                            setEditForm(item);
                            setIsEditing(true); 
                          }}
                          className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTestimonial(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Testimonial Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6 text-center">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-24 h-24 rounded-full mx-auto" />
                  <div>
                    <h3 className="text-xl" style={{ color: 'var(--navy)' }}>{selectedItem.name}</h3>
                    <p className="text-sm text-gray-500">{selectedItem.location}</p>
                  </div>
                  <div className="flex justify-center gap-1">
                    {[...Array(selectedItem.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[var(--gold)] text-[var(--gold)]" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic bg-gray-50 p-6 rounded-xl relative">
                    "{selectedItem.comment || 'No comment.'}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>
                  {selectedItem ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.rating || 5}
                        onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                          value={editForm.image || ''}
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                          value={editForm.comment || ''}
                          onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                    <div className="w-full md:w-32 flex flex-col items-center">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                        {editForm.image ? (
                          <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Plus className="w-8 h-8 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
                    style={{ background: 'var(--gold)' }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
