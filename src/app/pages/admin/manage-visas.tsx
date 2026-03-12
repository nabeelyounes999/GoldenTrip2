import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Edit, Trash2, Plus, Save, X } from 'lucide-react';
import { apiService } from '../../api/apiService';

interface Visa {
  id: string;
  country: string;
  processingTime: string;
  validityPeriod: string;
  entryType: string;
  price: number;
  applicationFee: number;
  requirements: string[];
  description: string;
}

export default function ManageVisas() {
  const [visas, setVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Visa>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    try {
      const { data, error } = await apiService.getVisas();
      if (!error && data) {
        setVisas(data);
      }
    } catch (error) {
      console.error('Error fetching visas:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (visa: Visa) => {
    setEditingId(visa.id);
    setEditForm(visa);
  };

  const startAdd = () => {
    setEditingId('new');
    setEditForm({
      country: '',
      processingTime: '',
      validityPeriod: '',
      entryType: '',
      applicationFee: 0,
      price: 0,
      requirements: [],
      description: ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveVisa = async () => {
    if (!editingId || !editForm) return;

    setSaving(true);
    try {
      const { error } = await apiService.saveVisa(editForm);
      if (!error) {
        await fetchVisas();
        setEditingId(null);
        setEditForm({});
      } else {
        alert('Failed to save visa');
      }
    } catch (error) {
      console.error('Error saving visa:', error);
      alert('Error saving visa');
    } finally {
      setSaving(false);
    }
  };

  const deleteVisa = async (id: string) => {
    if (!confirm('Are you sure you want to delete this visa?')) return;

    try {
      const { error } = await apiService.deleteVisa(id);
      if (!error) {
        await fetchVisas();
      } else {
        alert('Failed to delete visa');
      }
    } catch (error) {
      console.error('Error deleting visa:', error);
      alert('Error deleting visa');
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading visas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--navy)' }}>
            Manage Visas
          </h2>
          <p className="text-gray-600 mt-1">Edit visa prices and details</p>
        </div>
        <button
          onClick={startAdd}
          className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Visa
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Fee (JOD)
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entry Type
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Validity Period
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
                          placeholder="Fee"
                          value={editForm.applicationFee || 0}
                          onChange={(e) => setEditForm({ ...editForm, applicationFee: Number(e.target.value), price: Number(e.target.value) })}
                          className="w-full max-w-[100px] px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Processing Time (e.g. '2-3 Days')"
                          value={editForm.processingTime || ''}
                          onChange={(e) => setEditForm({ ...editForm, processingTime: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Entry Type (e.g. 'Tourist')"
                          value={editForm.entryType || ''}
                          onChange={(e) => setEditForm({ ...editForm, entryType: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <input
                          type="text"
                          placeholder="Validity Period (e.g. '30 Days')"
                          value={editForm.validityPeriod || ''}
                          onChange={(e) => setEditForm({ ...editForm, validityPeriod: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-sm md:text-base focus:border-[var(--gold)] focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                        />
                      </td>
                      <td className="px-3 md:px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={saveVisa}
                            disabled={saving || !editForm.country}
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
                    <tr className="bg-gray-50/50">
                      <td colSpan={6} className="px-3 md:px-6 py-4 border-t border-gray-100">
                        <div className="max-w-3xl">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents *</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {['Passport Copy', 'Photo', 'Bank Statement', 'Travel Insurance', 'Flight Booking', 'Hotel Reservation'].map(common => (
                                <button
                                  key={common}
                                  type="button"
                                  onClick={() => {
                                    if (!(editForm.requirements || []).includes(common)) {
                                      setEditForm({...editForm, requirements: [...(editForm.requirements || []), common]});
                                    }
                                  }}
                                  className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-[var(--gold-light)] hover:text-[var(--gold-dark)] transition-colors"
                                >
                                  + {common}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2">
                              {(editForm.requirements || []).length === 0 && (
                                <p className="text-sm text-gray-400 italic mb-2">No requirements added yet. Use quick add or add custom below.</p>
                              )}
                              {(editForm.requirements || []).map((req, index) => (
                                <div key={index} className="flex gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. Valid Passport"
                                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                                    value={req}
                                    onChange={(e) => {
                                      const newReqs = [...(editForm.requirements || [])];
                                      newReqs[index] = e.target.value;
                                      setEditForm({...editForm, requirements: newReqs});
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const newReqs = [...(editForm.requirements || [])];
                                      newReqs.splice(index, 1);
                                      setEditForm({...editForm, requirements: newReqs});
                                    }}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => setEditForm({...editForm, requirements: [...(editForm.requirements || []), '']})}
                                className="text-sm text-[var(--gold)] font-medium flex items-center gap-1 mt-2"
                              >
                                <Plus className="w-4 h-4" /> Add Custom Requirement
                              </button>
                            </div>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
                {visas.map((visa) => (
                  <React.Fragment key={visa.id}>
                    <tr>
                      {editingId === visa.id ? (
                      <>
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
                            value={editForm.applicationFee || 0}
                            onChange={(e) => setEditForm({ ...editForm, applicationFee: Number(e.target.value), price: Number(e.target.value) })}
                            className="w-full px-2 py-1 border rounded text-sm md:text-base"
                          />
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <input
                            type="text"
                            value={editForm.processingTime || ''}
                            onChange={(e) => setEditForm({ ...editForm, processingTime: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm md:text-base"
                          />
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <input
                            type="text"
                            value={editForm.entryType || ''}
                            onChange={(e) => setEditForm({ ...editForm, entryType: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm md:text-base"
                          />
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <input
                            type="text"
                            value={editForm.validityPeriod || ''}
                            onChange={(e) => setEditForm({ ...editForm, validityPeriod: e.target.value })}
                            className="w-full px-2 py-1 border rounded text-sm md:text-base"
                          />
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={saveVisa}
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
                      </>
                    ) : (
                      <>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base font-medium text-gray-900">{visa.country}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base font-semibold" style={{ color: 'var(--gold)' }}>
                            JOD {visa.applicationFee}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base text-gray-600">{visa.processingTime}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base text-gray-600">{visa.entryType}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="text-sm md:text-base text-gray-600">{visa.validityPeriod}</div>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(visa)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                              style={{ color: 'var(--gold)' }}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteVisa(visa.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                    </tr>
                    {editingId === visa.id && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={6} className="px-3 md:px-6 py-4 border-t border-gray-100">
                          <div className="max-w-3xl">
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium text-gray-700">Required Documents</label>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {['Passport Copy', 'Photo', 'Bank Statement', 'Travel Insurance', 'Flight Booking', 'Hotel Reservation'].map(common => (
                                <button
                                  key={common}
                                  type="button"
                                  onClick={() => {
                                    if (!(editForm.requirements || []).includes(common)) {
                                      setEditForm({...editForm, requirements: [...(editForm.requirements || []), common]});
                                    }
                                  }}
                                  className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-[var(--gold-light)] hover:text-[var(--gold-dark)] transition-colors"
                                >
                                  + {common}
                                </button>
                              ))}
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                              {(editForm.requirements || []).length === 0 && (
                                <p className="text-sm text-gray-400 italic">No requirements specified.</p>
                              )}
                              {(editForm.requirements || []).map((req, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="e.g. Passport valid for 6 months"
                                    className="flex-1 w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                                    value={req}
                                    onChange={(e) => {
                                      const newReqs = [...(editForm.requirements || [])];
                                      newReqs[index] = e.target.value;
                                      setEditForm({...editForm, requirements: newReqs});
                                    }}
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      const newReqs = [...(editForm.requirements || [])];
                                      newReqs.splice(index, 1);
                                      setEditForm({...editForm, requirements: newReqs});
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded bg-white border border-gray-200 hover:bg-red-50 transition-colors w-full sm:w-auto flex justify-center"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setEditForm({
                                  ...editForm,
                                  requirements: [...(editForm.requirements || []), '']
                                });
                              }}
                              className="mt-3 flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-dark)] text-sm font-medium"
                            >
                              <Plus className="w-4 h-4" /> Add Custom Requirement
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

      {visas.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No visas found
        </div>
      )}
    </div>
  );
}
