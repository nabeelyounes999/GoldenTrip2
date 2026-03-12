import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, X, Edit2, Trash2, Plus, DollarSign, Headphones, Users, Shield, Globe, Compass, Map, Star, Heart, Award, CheckCircle } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Feature } from '../../types';

const iconMap: Record<string, any> = {
  DollarSign, Headphones, Users, Shield, Globe, Compass, Map, Star, Heart, Award, CheckCircle
};

export default function ManageFeatures() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Feature | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Feature>>({});
  const [saving, setSaving] = useState(false);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await apiService.getFeatures();
      if (!error && data) {
        setFeatures(data);
      }
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await apiService.saveFeature(editForm);
    await fetchFeatures();
    setIsEditing(false);
    setSaving(false);
  };

  const deleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      await apiService.deleteFeature(id);
      setFeatures(features.filter(p => p.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting feature:', error);
    }
  };

  const filteredItems = features.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Manage Features</h1>
          <p className="text-gray-600">Edit the 'Why Choose Us' features on the main pages.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setEditForm({ title: '', description: '', icon: 'Star' });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-shadow hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Feature
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search features..."
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
                <th className="text-left py-4 px-6 font-medium text-gray-600">Icon</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Title</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Description</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Loading features...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No features found</td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const Icon = iconMap[item.icon] || Star;
                  return (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--gold-light)]">
                          <Icon className="w-5 h-5 text-[var(--gold-dark)]" />
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium" style={{ color: 'var(--navy)' }}>{item.title}</td>
                      <td className="py-4 px-6 text-gray-600">{(item.description || '').substring(0, 40)}...</td>
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
                            onClick={() => deleteFeature(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                  {selectedItem ? 'Edit Feature' : 'Add New Feature'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon Style</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      value={editForm.icon || 'Star'}
                      onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                    >
                      {Object.keys(iconMap).map(iconName => (
                        <option key={iconName} value={iconName}>{iconName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    ></textarea>
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
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Feature Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                       style={{ background: 'linear-gradient(135deg, var(--gold-light) 0%, var(--gold) 100%)' }}>
                    {(() => {
                      const Icon = iconMap[selectedItem.icon || 'Star'] || Star;
                      return <Icon className="w-10 h-10" style={{ color: 'var(--gold-dark)' }} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-xl" style={{ color: 'var(--navy)' }}>{selectedItem.title}</h3>
                  </div>
                  <p className="text-gray-700 italic bg-gray-50 p-6 rounded-xl relative">
                    "{selectedItem.description || 'No description.'}"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
