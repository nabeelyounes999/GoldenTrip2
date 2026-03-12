import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package as PackageIcon, Search, Eye, X, Edit2, Trash2, Plus } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Package } from '../../types';

export default function ManagePackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Package>>({
    title: '',
    price: 0,
    duration: '',
    groupSize: '2-10',
    location: '',
    rating: 5,
    description: '',
    features: ['Round-trip flights', 'Luxury hotel accommodation', 'Daily breakfast'],
    itinerary: [],
    images: [],
    reviews: []
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await apiService.savePackage(editForm);
    await fetchPackages();
    setIsEditing(false);
    setSaving(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await apiService.getPackages();
      if (!error && data) {
        setPackages(data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      await apiService.deletePackage(id);
      setPackages(packages.filter(p => p.id !== id));
      if (selectedPackage?.id === id) setSelectedPackage(null);
    } catch (error) {
      console.error('Error deleting package:', error);
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Manage Packages</h1>
          <p className="text-gray-600">Create and manage travel packages.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedPackage(null);
            setEditForm({ 
              title: '', 
              price: 0, 
              duration: '', 
              groupSize: '2-10', 
              location: '', 
              rating: 5, 
              description: '', 
              features: ['Round-trip flights', 'Luxury hotel accommodation', 'Daily breakfast'], 
              itinerary: [], 
              destinationId: '', 
              images: [],
              reviews: []
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-shadow hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Package
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
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
                <th className="text-left py-4 px-6 font-medium text-gray-600">Package</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Duration</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Price</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Loading packages...</td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No packages found</td>
                </tr>
              ) : (
                filteredPackages.map((pkg: Package) => (
                  <tr key={pkg.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                          <PackageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--navy)' }}>{pkg.title}</p>
                          <p className="text-sm text-gray-500">{(pkg.description || '').substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{pkg.duration}</td>
                    <td className="py-4 px-6 text-gray-600 font-medium">JOD {pkg.price}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedPackage(pkg); setIsEditing(false); }}
                          className="p-2 text-gray-400 hover:text-[var(--navy)] transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { 
                            setSelectedPackage(pkg); 
                            setEditForm(pkg);
                            setIsEditing(true); 
                          }}
                          className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deletePackage(pkg.id)}
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
        {selectedPackage && !isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Package Details</h2>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                    <p className="text-lg" style={{ color: 'var(--navy)' }}>{selectedPackage.title}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                      <p className="text-lg font-medium" style={{ color: 'var(--gold)' }}>JOD {selectedPackage.price}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Duration</h3>
                      <p className="text-lg" style={{ color: 'var(--navy)' }}>{selectedPackage.duration}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                      {selectedPackage.description || 'No description provided.'}
                    </p>
                  </div>
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>
                  {selectedPackage ? 'Edit Package' : 'Add New Package'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                          value={editForm.title || ''}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (JOD)</label>
                          <input
                            type="number"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                            value={editForm.price || 0}
                            onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 7 Days"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                            value={editForm.duration || ''}
                            onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Image URL</label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                          value={editForm.images?.[0] || ''}
                          onChange={(e) => {
                            const newImages = [...(editForm.images || [])];
                            if (newImages.length === 0) newImages.push(e.target.value);
                            else newImages[0] = e.target.value;
                            setEditForm({ ...editForm, images: newImages });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                      <div className="flex-1 min-h-[150px] rounded-xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                        {editForm.images?.[0] ? (
                          <img src={editForm.images[0]} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-gray-400 text-sm p-4 text-center">
                            <Plus className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            No image provided
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. France"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 2-10"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.groupSize || ''}
                        onChange={(e) => setEditForm({ ...editForm, groupSize: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.rating || 5}
                        onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Features Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium text-gray-700">What's Included</label>
                       <button 
                        onClick={() => setEditForm({ ...editForm, features: [...(editForm.features || []), ''] })}
                        className="text-xs text-[var(--gold)] flex items-center gap-1 hover:underline"
                       >
                         <Plus className="w-3 h-3" /> Add Item
                       </button>
                    </div>
                    <div className="space-y-2">
                       {(editForm.features || []).map((feature, idx) => (
                         <div key={idx} className="flex gap-2">
                           <input
                             type="text"
                             className="flex-1 px-3 py-1 text-sm border border-gray-200 rounded-lg"
                             value={feature}
                             onChange={(e) => {
                               const newFeatures = [...(editForm.features || [])];
                               newFeatures[idx] = e.target.value;
                               setEditForm({ ...editForm, features: newFeatures });
                             }}
                           />
                           <button 
                             onClick={() => setEditForm({ ...editForm, features: editForm.features?.filter((_, i) => i !== idx) })}
                             className="p-1 text-gray-400 hover:text-red-500"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Itinerary Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium text-gray-700">Itinerary</label>
                       <button 
                        onClick={() => {
                          const nextDay = (editForm.itinerary?.length || 0) + 1;
                          setEditForm({ 
                            ...editForm, 
                            itinerary: [...(editForm.itinerary || []), { day: nextDay, title: '', activities: [] }] 
                          });
                        }}
                        className="text-xs text-[var(--gold)] flex items-center gap-1 hover:underline"
                       >
                         <Plus className="w-3 h-3" /> Add Day
                       </button>
                    </div>
                    <div className="space-y-4 max-h-60 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50">
                       {(editForm.itinerary || []).map((day, idx) => (
                         <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 space-y-2">
                            <div className="flex gap-2 items-center">
                              <span className="text-xs font-bold text-gray-400">Day {day.day}</span>
                              <input
                                type="text"
                                placeholder="Day title..."
                                className="flex-1 px-2 py-1 text-sm border-b border-gray-100 focus:border-[var(--gold)] focus:outline-none"
                                value={day.title}
                                onChange={(e) => {
                                  const newItinerary = [...(editForm.itinerary || [])];
                                  newItinerary[idx].title = e.target.value;
                                  setEditForm({ ...editForm, itinerary: newItinerary });
                                }}
                              />
                              <button 
                                onClick={() => setEditForm({ ...editForm, itinerary: editForm.itinerary?.filter((_, i) => i !== idx) })}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {/* Activities Editor */}
                            <div className="pl-4 space-y-1">
                              {day.activities.map((act, aIdx) => (
                                <div key={aIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    className="flex-1 px-2 py-1 text-xs border border-gray-50 rounded"
                                    value={act}
                                    onChange={(e) => {
                                      const newItinerary = [...(editForm.itinerary || [])];
                                      newItinerary[idx].activities[aIdx] = e.target.value;
                                      setEditForm({ ...editForm, itinerary: newItinerary });
                                    }}
                                  />
                                  <button onClick={() => {
                                    const newItinerary = [...(editForm.itinerary || [])];
                                    newItinerary[idx].activities = newItinerary[idx].activities.filter((_, i) => i !== aIdx);
                                    setEditForm({ ...editForm, itinerary: newItinerary });
                                  }} className="p-0.5 text-gray-300 hover:text-red-400">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => {
                                  const newItinerary = [...(editForm.itinerary || [])];
                                  newItinerary[idx].activities.push('');
                                  setEditForm({ ...editForm, itinerary: newItinerary });
                                }}
                                className="text-[10px] text-gray-400 hover:text-[var(--gold)]"
                              >
                                + Add Activity
                              </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  {/* Reviews Editor */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                       <label className="block text-sm font-medium text-gray-700">Reviews</label>
                       <button 
                        onClick={() => setEditForm({ 
                          ...editForm, 
                          reviews: [
                            ...(editForm.reviews || []), 
                            { id: Math.random().toString(), name: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }
                          ] 
                        })}
                        className="text-xs text-[var(--gold)] flex items-center gap-1 hover:underline"
                       >
                         <Plus className="w-3 h-3" /> Add Review
                       </button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50">
                       {(editForm.reviews || []).map((review, idx) => (
                         <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Author..."
                                className="flex-1 px-2 py-1 text-xs border border-gray-100 rounded"
                                value={review.name}
                                onChange={(e) => {
                                  const newReviews = [...(editForm.reviews || [])];
                                  newReviews[idx].name = e.target.value;
                                  setEditForm({ ...editForm, reviews: newReviews });
                                }}
                              />
                              <input
                                type="number"
                                min="1" max="5"
                                className="w-12 px-1 py-1 text-xs border border-gray-100 rounded"
                                value={review.rating}
                                onChange={(e) => {
                                  const newReviews = [...(editForm.reviews || [])];
                                  newReviews[idx].rating = Number(e.target.value);
                                  setEditForm({ ...editForm, reviews: newReviews });
                                }}
                              />
                              <button 
                                onClick={() => setEditForm({ ...editForm, reviews: editForm.reviews?.filter((_, i) => i !== idx) })}
                                className="p-1 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <textarea
                              placeholder="Comment..."
                              className="w-full px-2 py-1 text-xs border border-gray-100 rounded"
                              rows={2}
                              value={review.comment}
                              onChange={(e) => {
                                const newReviews = [...(editForm.reviews || [])];
                                newReviews[idx].comment = e.target.value;
                                setEditForm({ ...editForm, reviews: newReviews });
                              }}
                            />
                         </div>
                       ))}
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
                    {saving ? 'Saving...' : 'Save Package'}
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
