import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Destination, ItineraryDay } from '../../types';

export default function ManageDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Destination>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const { data, error } = await apiService.getDestinations();
      if (!error && data) {
        setDestinations(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (destination: Destination) => {
    setEditingId(destination.id);
    setEditForm(destination);
  };

  const startAdd = () => {
    setEditingId('new');
    setEditForm({
      name: '',
      country: '',
      price: 0,
      duration: '',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
      description: '',
      featured: false,
      location: '',
      groupSize: '',
      rating: 5,
      features: [],
      itinerary: [],
      reviews: []
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveDestination = async () => {
    if (!editingId || !editForm) return;

    setSaving(true);
    try {
      const { error } = await apiService.saveDestination(editForm);
      if (!error) {
        await fetchDestinations();
        setEditingId(null);
        setEditForm({});
      } else {
        alert('Failed to save destination');
      }
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Error saving destination');
    } finally {
      setSaving(false);
    }
  };

  const deleteDestination = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination?')) return;

    try {
      const { error } = await apiService.deleteDestination(id);
      if (!error) {
        await fetchDestinations();
      } else {
        alert('Failed to delete destination');
      }
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Error deleting destination');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)' }}>
            Manage Destinations
          </h2>
          <p className="text-gray-600 mt-1">Edit destination prices and details</p>
        </div>
        <button
          onClick={startAdd}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Destination
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (JOD)
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {editingId === 'new' && (
                  <>
                    <tr>
                      <td colSpan={5} className="px-3 md:px-6 py-4 bg-gray-50/30">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/..."
                              value={editForm.image || ''}
                              onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                            />
                            <p className="mt-1 text-xs text-gray-500 italic">Paste a link to your png/jpg image</p>
                          </div>
                          <div className="w-full md:w-1/3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                            <div className="h-32 rounded-xl overflow-hidden border-2 border-gray-100 bg-white">
                              {editForm.image ? (
                                <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Plus className="w-8 h-8 opacity-20" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="w-full md:w-1/3 space-y-4">
                            <div className="flex items-center gap-2 mt-6">
                              <input
                                type="checkbox"
                                id="featured"
                                checked={editForm.featured || false}
                                onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                                className="w-4 h-4 text-[var(--gold)] focus:ring-[var(--gold)] border-gray-300 rounded"
                              />
                              <label htmlFor="featured" className="text-sm font-medium text-gray-700 cursor-pointer">
                                Feature this destination on Home Page
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                rows={2}
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                                placeholder="Brief overview..."
                              ></textarea>
                            </div>
                          </div>
                        </div>

                        {/* Extended Fields for New Destination */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Location</label>
                            <input
                              type="text"
                              value={editForm.location || ''}
                              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                              placeholder="e.g. Paris, France"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                            <input
                              type="text"
                              value={editForm.groupSize || ''}
                              onChange={(e) => setEditForm({ ...editForm, groupSize: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                              placeholder="e.g. 2-10 People"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1.0 - 5.0)</label>
                            <input
                              type="number"
                              step="0.1"
                              min="1"
                              max="5"
                              value={editForm.rating || 5}
                              onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                              className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                            />
                          </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Features Editor */}
                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                              What's Included
                            </h4>
                            <div className="space-y-3">
                              {(editForm.features || []).map((feature: string, fIdx: number) => (
                                <div key={fIdx} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => {
                                      const newFeatures = [...(editForm.features || [])];
                                      newFeatures[fIdx] = e.target.value;
                                      setEditForm({ ...editForm, features: newFeatures });
                                    }}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                  />
                                  <button
                                    onClick={() => {
                                      const newFeatures = (editForm.features || []).filter((_: any, i: number) => i !== fIdx);
                                      setEditForm({ ...editForm, features: newFeatures });
                                    }}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => setEditForm({ ...editForm, features: [...(editForm.features || []), ''] })}
                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                              >
                                + Add Feature
                              </button>
                            </div>
                          </div>

                          {/* Itinerary Editor */}
                          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                              Itinerary
                            </h4>
                            <div className="space-y-6">
                              {(editForm.itinerary || []).map((day: any, dIdx: number) => (
                                <div key={dIdx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>Day {day.day}</span>
                                    <button
                                      onClick={() => {
                                        const newItinerary = (editForm.itinerary || []).filter((_: any, i: number) => i !== dIdx)
                                          .map((item: any, i: number) => ({ ...item, day: i + 1 }));
                                        setEditForm({ ...editForm, itinerary: newItinerary });
                                      }}
                                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Day Title"
                                    value={day.title}
                                    onChange={(e) => {
                                      const newItinerary = [...(editForm.itinerary || [])];
                                      newItinerary[dIdx].title = e.target.value;
                                      setEditForm({ ...editForm, itinerary: newItinerary });
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg text-sm font-medium"
                                  />
                                  <div className="space-y-2">
                                    {day.activities.map((act: string, aIdx: number) => (
                                      <div key={aIdx} className="flex gap-2">
                                        <input
                                          type="text"
                                          placeholder="Activity..."
                                          value={act}
                                          onChange={(e) => {
                                            const newItinerary = [...(editForm.itinerary || [])];
                                            newItinerary[dIdx].activities[aIdx] = e.target.value;
                                            setEditForm({ ...editForm, itinerary: newItinerary });
                                          }}
                                          className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                                        />
                                        <button 
                                          onClick={() => {
                                            const newItinerary = [...(editForm.itinerary || [])];
                                            newItinerary[dIdx].activities = newItinerary[dIdx].activities.filter((_: any, i: number) => i !== aIdx);
                                            setEditForm({ ...editForm, itinerary: newItinerary });
                                          }}
                                          className="text-gray-400 hover:text-red-500"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const newItinerary = [...(editForm.itinerary || [])];
                                        newItinerary[dIdx].activities.push('');
                                        setEditForm({ ...editForm, itinerary: newItinerary });
                                      }}
                                      className="text-xs text-[var(--gold)] hover:underline"
                                    >
                                      + Add Activity
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <button
                                onClick={() => setEditForm({ 
                                  ...editForm, 
                                  itinerary: [...(editForm.itinerary || []), { day: (editForm.itinerary || []).length + 1, title: '', activities: [] }] 
                                })}
                                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                              >
                                + Add Day
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Reviews Editor for New Destination */}
                        <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                          <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                            Customer Reviews
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(editForm.reviews || []).map((review: any, rIdx: number) => (
                              <div key={rIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                <button
                                  onClick={() => {
                                    const newReviews = (editForm.reviews || []).filter((_: any, i: number) => i !== rIdx);
                                    setEditForm({ ...editForm, reviews: newReviews });
                                  }}
                                  className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    placeholder="Reviewer Name"
                                    value={review.name}
                                    onChange={(e) => {
                                      const newReviews = [...(editForm.reviews || [])];
                                      newReviews[rIdx].name = e.target.value;
                                      setEditForm({ ...editForm, reviews: newReviews });
                                    }}
                                    className="w-full px-3 py-1.5 border rounded-lg text-sm font-medium"
                                  />
                                  <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-500">Rating:</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="5"
                                      value={review.rating}
                                      onChange={(e) => {
                                        const newReviews = [...(editForm.reviews || [])];
                                        newReviews[rIdx].rating = Number(e.target.value);
                                        setEditForm({ ...editForm, reviews: newReviews });
                                      }}
                                      className="w-16 px-2 py-1 border rounded text-xs"
                                    />
                                  </div>
                                  <textarea
                                    placeholder="Review comment..."
                                    value={review.comment}
                                    onChange={(e) => {
                                      const newReviews = [...(editForm.reviews || [])];
                                      newReviews[rIdx].comment = e.target.value;
                                      setEditForm({ ...editForm, reviews: newReviews });
                                    }}
                                    className="w-full px-3 py-2 border rounded-lg text-xs h-20 resize-none"
                                  />
                                  <input
                                    type="date"
                                    value={review.date}
                                    onChange={(e) => {
                                      const newReviews = [...(editForm.reviews || [])];
                                      newReviews[rIdx].date = e.target.value;
                                      setEditForm({ ...editForm, reviews: newReviews });
                                    }}
                                    className="w-full px-3 py-1.5 border rounded-lg text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                            <button
                              onClick={() => setEditForm({ 
                                ...editForm, 
                                reviews: [...(editForm.reviews || []), { id: Math.random().toString(36).substr(2, 9), name: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }] 
                              })}
                              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all min-h-[200px]"
                            >
                              <Plus className="w-8 h-8 mb-2" />
                              <span className="text-sm">Add New Review</span>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Destination Name"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Country"
                          value={editForm.country || ''}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="number"
                          placeholder="Price"
                          value={editForm.price || 0}
                          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                          className="w-full max-w-[100px] px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Duration (e.g. '7 Days')"
                          value={editForm.duration || ''}
                          onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={saveDestination}
                            disabled={saving || !editForm.name}
                            className="p-2 rounded-lg text-white transition-all disabled:opacity-50"
                            style={{ background: 'var(--gold)' }}
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
                {destinations.map((destination: Destination) => (
                  <React.Fragment key={destination.id}>
                    {editingId === destination.id ? (
                      <>
                        <tr className="bg-gray-50/50">
                          <td colSpan={5} className="px-3 md:px-6 py-4">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                              <div className="w-full md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/..."
                                  value={editForm.image || ''}
                                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                                />
                                <p className="mt-1 text-xs text-gray-500 italic">Paste a link to your png/jpg image</p>
                              </div>
                              <div className="w-full md:w-1/3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image Preview</label>
                                <div className="h-32 rounded-xl overflow-hidden border-2 border-gray-100 bg-white">
                                  {editForm.image ? (
                                    <img src={editForm.image} alt="Preview" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                      <Plus className="w-8 h-8 opacity-20" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="w-full md:w-1/3 space-y-4">
                                <div className="flex items-center gap-2 mt-6">
                                  <input
                                    type="checkbox"
                                    id={`featured-${destination.id}`}
                                    checked={editForm.featured || false}
                                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                                    className="w-4 h-4 text-[var(--gold)] focus:ring-[var(--gold)] border-gray-300 rounded"
                                  />
                                  <label htmlFor={`featured-${destination.id}`} className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Feature this destination on Home Page
                                  </label>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                  <textarea
                                    rows={2}
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                                    placeholder="Brief overview..."
                                  ></textarea>
                                </div>
                              </div>
                            </div>

                            {/* Extended Fields for Existing Destination */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specific Location</label>
                                <input
                                  type="text"
                                  value={editForm.location || ''}
                                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                                  placeholder="e.g. Paris, France"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                                <input
                                  type="text"
                                  value={editForm.groupSize || ''}
                                  onChange={(e) => setEditForm({ ...editForm, groupSize: e.target.value })}
                                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                                  placeholder="e.g. 2-10 People"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1.0 - 5.0)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  min="1"
                                  max="5"
                                  value={editForm.rating || 5}
                                  onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                                  className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[var(--gold)]"
                                />
                              </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                              {/* Features Editor */}
                              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                                  What's Included
                                </h4>
                                <div className="space-y-3">
                                  {(editForm.features || []).map((feature: string, fIdx: number) => (
                                    <div key={fIdx} className="flex gap-2">
                                      <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                          const newFeatures = [...(editForm.features || [])];
                                          newFeatures[fIdx] = e.target.value;
                                          setEditForm({ ...editForm, features: newFeatures });
                                        }}
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                      />
                                      <button
                                        onClick={() => {
                                          const newFeatures = (editForm.features || []).filter((_: any, i: number) => i !== fIdx);
                                          setEditForm({ ...editForm, features: newFeatures });
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => setEditForm({ ...editForm, features: [...(editForm.features || []), ''] })}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                                  >
                                    + Add Feature
                                  </button>
                                </div>
                              </div>

                              {/* Itinerary Editor */}
                              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                                  Itinerary
                                </h4>
                                <div className="space-y-6">
                                  {(editForm.itinerary || []).map((day: any, dIdx: number) => (
                                    <div key={dIdx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold" style={{ color: 'var(--gold)' }}>Day {day.day}</span>
                                        <button
                                          onClick={() => {
                                            const newItinerary = (editForm.itinerary || []).filter((_: any, i: number) => i !== dIdx)
                                              .map((item: any, i: number) => ({ ...item, day: i + 1 }));
                                            setEditForm({ ...editForm, itinerary: newItinerary });
                                          }}
                                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Day Title"
                                        value={day.title}
                                        onChange={(e) => {
                                          const newItinerary = [...(editForm.itinerary || [])];
                                          newItinerary[dIdx].title = e.target.value;
                                          setEditForm({ ...editForm, itinerary: newItinerary });
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg text-sm font-medium"
                                      />
                                      <div className="space-y-2">
                                        {(day.activities || []).map((act: string, aIdx: number) => (
                                          <div key={aIdx} className="flex gap-2">
                                            <input
                                              type="text"
                                              placeholder="Activity..."
                                              value={act}
                                              onChange={(e) => {
                                                const newItinerary = [...(editForm.itinerary || [])];
                                                newItinerary[dIdx].activities[aIdx] = e.target.value;
                                                setEditForm({ ...editForm, itinerary: newItinerary });
                                              }}
                                              className="flex-1 px-3 py-1.5 border rounded-lg text-xs"
                                            />
                                            <button 
                                              onClick={() => {
                                                const newItinerary = [...(editForm.itinerary || [])];
                                                newItinerary[dIdx].activities = newItinerary[dIdx].activities.filter((_: any, i: number) => i !== aIdx);
                                                setEditForm({ ...editForm, itinerary: newItinerary });
                                              }}
                                              className="text-gray-400 hover:text-red-500"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                        <button
                                          onClick={() => {
                                            const newItinerary = [...(editForm.itinerary || [])];
                                            newItinerary[dIdx].activities.push('');
                                            setEditForm({ ...editForm, itinerary: newItinerary });
                                          }}
                                          className="text-xs text-[var(--gold)] hover:underline"
                                        >
                                          + Add Activity
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    onClick={() => setEditForm({ 
                                      ...editForm, 
                                      itinerary: [...(editForm.itinerary || []), { day: (editForm.itinerary || []).length + 1, title: '', activities: [] }] 
                                    })}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)]"
                                  >
                                    + Add Day
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Reviews Editor for Existing Destination */}
                            <div className="mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                              <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--navy)' }}>
                                Customer Reviews
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(editForm.reviews || []).map((review: any, rIdx: number) => (
                                  <div key={rIdx} className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 relative">
                                    <button
                                      onClick={() => {
                                        const newReviews = (editForm.reviews || []).filter((_: any, i: number) => i !== rIdx);
                                        setEditForm({ ...editForm, reviews: newReviews });
                                      }}
                                      className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-2">
                                      <input
                                        type="text"
                                        placeholder="Reviewer Name"
                                        value={review.name}
                                        onChange={(e) => {
                                          const newReviews = [...(editForm.reviews || [])];
                                          newReviews[rIdx].name = e.target.value;
                                          setEditForm({ ...editForm, reviews: newReviews });
                                        }}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm font-medium"
                                      />
                                      <div className="flex items-center gap-2">
                                        <label className="text-xs text-gray-500">Rating:</label>
                                        <input
                                          type="number"
                                          min="1"
                                          max="5"
                                          value={review.rating}
                                          onChange={(e) => {
                                            const newReviews = [...(editForm.reviews || [])];
                                            newReviews[rIdx].rating = Number(e.target.value);
                                            setEditForm({ ...editForm, reviews: newReviews });
                                          }}
                                          className="w-16 px-2 py-1 border rounded text-xs"
                                        />
                                      </div>
                                      <textarea
                                        placeholder="Review comment..."
                                        value={review.comment}
                                        onChange={(e) => {
                                          const newReviews = [...(editForm.reviews || [])];
                                          newReviews[rIdx].comment = e.target.value;
                                          setEditForm({ ...editForm, reviews: newReviews });
                                        }}
                                        className="w-full px-3 py-2 border rounded-lg text-xs h-20 resize-none"
                                      />
                                      <input
                                        type="date"
                                        value={review.date}
                                        onChange={(e) => {
                                          const newReviews = [...(editForm.reviews || [])];
                                          newReviews[rIdx].date = e.target.value;
                                          setEditForm({ ...editForm, reviews: newReviews });
                                        }}
                                        className="w-full px-3 py-1.5 border rounded-lg text-xs"
                                      />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  onClick={() => setEditForm({ 
                                    ...editForm, 
                                    reviews: [...(editForm.reviews || []), { id: Math.random().toString(36).substr(2, 9), name: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }] 
                                  })}
                                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all min-h-[200px]"
                                >
                                  <Plus className="w-8 h-8 mb-2" />
                                  <span className="text-sm">Add New Review</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 md:px-6 py-4">
                            <input
                              type="text"
                              value={editForm.name || ''}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm md:text-base"
                            />
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <input
                              type="text"
                              value={editForm.country || ''}
                              onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm md:text-base"
                            />
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <input
                              type="number"
                              value={editForm.price || 0}
                              onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                              className="w-full px-2 py-1 border rounded text-sm md:text-base"
                            />
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <input
                              type="text"
                              value={editForm.duration || ''}
                              onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                              className="w-full px-2 py-1 border rounded text-sm md:text-base"
                            />
                          </td>
                          <td className="px-3 md:px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={saveDestination}
                                disabled={saving}
                                className="p-2 rounded-lg text-white transition-all disabled:opacity-50"
                                style={{ background: 'var(--gold)' }}
                                title="Save"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                                title="Cancel"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base font-medium text-gray-900">{destination.name}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base text-gray-600">{destination.country}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base font-semibold" style={{ color: 'var(--gold)' }}>
                            JOD {destination.price}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base text-gray-600">{destination.duration}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(destination)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                              style={{ color: 'var(--gold)' }}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteDestination(destination.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {destinations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No destinations found
        </div>
      )}
    </div>
  );
}
