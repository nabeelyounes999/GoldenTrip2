import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, X, Edit2, Trash2, Plus, Briefcase, MapPin, Download, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { Job, JobApplication } from '../../types';

export default function ManageCareers() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'postings' | 'applications'>('postings');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Job | null>(null);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Job>>({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
      const { error } = await apiService.saveJob({ ...editForm, posted: editForm.posted || new Date().toISOString().split('T')[0] });
    await fetchData();
    setIsEditing(false);
    setSaving(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'postings') {
        const { data, error } = await apiService.getJobs();
        if (!error && data) setJobs(data);
      } else {
        const { data, error } = await apiService.getApplications();
        if (!error && data) setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await apiService.updateApplicationStatus(id, status);
      setApplications(applications.map(app => app.id === id ? { ...app, status: status as any } : app));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await apiService.deleteJob(id);
      setJobs(jobs.filter(p => p.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const filteredJobs = jobs.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApps = applications.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Manage Careers</h1>
          <p className="text-gray-600">Review and moderate job postings.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setEditForm({ title: '', department: '', location: '', type: 'Full-time', description: '', requirements: [] });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-shadow hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Job Posting
        </button>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('postings')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'postings' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Job Postings
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'applications' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Applications
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'postings' ? "Search job postings..." : "Search applications..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'postings' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Position</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Department</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Location</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">Loading careers...</td>
                  </tr>
                ) : filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No jobs found</td>
                  </tr>
                ) : (
                  filteredJobs.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                            <Briefcase className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium" style={{ color: 'var(--navy)' }}>{item.title}</p>
                            <p className="text-sm text-gray-500">{item.type} • Posted {item.posted}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                          {item.department}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {item.location}
                        </div>
                      </td>
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
                            onClick={() => deleteJob(item.id)}
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
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Applicant</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Position</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">Loading applications...</td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No applications found</td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--navy)' }}>{app.name}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-medium">{app.jobTitle || 'Unknown Position'}</p>
                        <p className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'reviewing' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'shortlisted' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 text-gray-400 hover:text-[var(--navy)] transition-colors"
                            title="View Application"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                       {app.resumeUrl ? (
                           <a
                            href={app.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                            title="Download CV"
                          >
                            <Download className="w-5 h-5" />
                          </a>
                        ) : (
                          <span className="p-2 text-gray-300" title="No CV attached">
                            <Download className="w-5 h-5 opacity-30" />
                          </span>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this application?')) {
                              (apiService as any).deleteApplication(app.id).then(() => fetchData());
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete Application"
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
          )}
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Job Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
                    <p className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{selectedItem.title}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Department</h3>
                      <p className="text-gray-700">{selectedItem.department}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <p className="text-gray-700">{selectedItem.location}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                      {selectedItem.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {(selectedItem.requirements || []).map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

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
                  {selectedItem ? 'Edit Job' : 'Add New Job Posting'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                      value={editForm.title || ''}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.department || ''}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Remote or City"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </div>
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
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Requirements</label>
                      <button
                        type="button"
                        onClick={() => setEditForm({ ...editForm, requirements: [...(editForm.requirements || []), ''] })}
                        className="text-sm text-[var(--gold)] font-medium flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {(editForm.requirements || []).map((req, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 3+ years experience"
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-100 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                            value={req}
                            onChange={(e) => {
                              const newReqs = [...(editForm.requirements || [])];
                              newReqs[index] = e.target.value;
                              setEditForm({ ...editForm, requirements: newReqs });
                            }}
                          />
                          <button
                            onClick={() => {
                              const newReqs = [...(editForm.requirements || [])];
                              newReqs.splice(index, 1);
                              setEditForm({ ...editForm, requirements: newReqs });
                            }}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {(editForm.requirements || []).length === 0 && (
                        <p className="text-sm text-gray-400 italic">No requirements added yet.</p>
                      )}
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

        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Application Details</h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Applicant Name</h3>
                      <p className="text-lg font-bold" style={{ color: 'var(--navy)' }}>{selectedApp.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email Address</h3>
                      <p className="text-gray-700">{selectedApp.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Phone Number</h3>
                      <p className="text-gray-700">{selectedApp.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Applied For</h3>
                      <p className="font-bold text-[var(--gold)]">{selectedApp.jobTitle}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Applied Date</h3>
                      <p className="text-gray-700">{new Date(selectedApp.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Current Status</h3>
                      <select 
                        value={selectedApp.status}
                        onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--gold)] focus:border-[var(--gold)] sm:text-sm rounded-md"
                      >
                        <option value="new">New</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Cover Letter</h3>
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap min-h-[100px]">
                    {selectedApp.coverLetter || 'No cover letter provided.'}
                  </div>
                </div>

                 <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Briefcase className="w-5 h-5 text-[var(--gold)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Attachment: CV / Resume</p>
                      <p className="text-xs text-gray-500">{selectedApp.resumeUrl ? 'Document file' : 'No file attached'}</p>
                    </div>
                  </div>
                  {selectedApp.resumeUrl ? (
                    <button
                      onClick={() => {
                        const win = window.open();
                        if (win) {
                          win.document.write(`<iframe src="${selectedApp.resumeUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Resume
                    </button>
                  ) : (
                    <button disabled className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
                      <X className="w-4 h-4" />
                      No Resume
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
