import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, X, Edit2, Trash2, Plus, Users, Facebook, Instagram, MessageCircle, AlertTriangle } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { TeamMember } from '../../types';

export default function ManageAbout() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setError(null);
    try {
      const { data, error } = await apiService.getTeamMembers();
      if (error) {
        setError(error.message || 'Failed to fetch team members. Please check if the table exists in Supabase.');
      } else if (data) {
        setTeamMembers(data);
      }
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await apiService.saveTeamMember(editForm);
      if (error) {
        alert('Error saving member: ' + error.message);
      } else {
        await fetchTeamMembers();
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Error saving team member:', err);
      alert('Error saving member: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      const { error } = await apiService.deleteTeamMember(id);
      if (!error) {
        setTeamMembers(teamMembers.filter(m => m.id !== id));
        if (selectedItem?.id === id) setSelectedItem(null);
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const filteredMembers = teamMembers.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Meet Our Team Management</h1>
          <p className="text-gray-600">Passionate travel experts dedicated to your journey.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedItem(null);
            setEditForm({ 
              name: '', 
              role: '', 
              bio: '', 
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
              socials: { facebook: '', instagram: '', whatsapp: '' }
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-shadow hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-lg border-2 border-gray-100 focus:border-[var(--gold)] focus:outline-none transition-colors"
            />
          </div>
          {error && (
            <div className="w-full bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-red-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Database Table Missing</h3>
                  <p className="mb-4">
                    The <strong>"team_members"</strong> table does not exist in your Supabase project. 
                    To fix this, please follow these 2 steps:
                  </p>
                  
                  <div className="bg-white p-4 rounded-xl border border-red-200 mb-6 font-mono text-sm shadow-inner relative group">
                    <p className="text-xs text-gray-500 mb-2 font-sans">Step 1: Copy this SQL command:</p>
                    <pre className="text-gray-900 overflow-x-auto whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  image text,
  bio text,
  socials jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_access" ON team_members FOR ALL USING (true) WITH CHECK (true);`}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <a 
                      href="https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200"
                    >
                      Step 2: Go to Supabase SQL Editor & Run
                    </a>
                    <button 
                      onClick={fetchTeamMembers}
                      className="px-6 py-3 bg-white text-red-600 border-2 border-red-200 rounded-xl font-bold hover:bg-red-50 transition-all"
                    >
                      I've ran it, Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Member</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Role</th>
                <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                <th className="text-right py-4 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Loading members...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No members found</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={member.image} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium" style={{ color: 'var(--navy)' }}>{member.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{member.role}</td>
                    <td className="py-4 px-6 text-gray-600">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Active</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setSelectedItem(member); setIsEditing(false); }}
                          className="p-2 text-gray-400 hover:text-[var(--navy)] transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => { 
                            setSelectedItem(member); 
                            setEditForm(member);
                            setIsEditing(true); 
                          }}
                          className="p-2 text-gray-400 hover:text-[var(--gold)] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
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
                <h2 className="text-2xl" style={{ color: 'var(--navy)' }}>Member Details</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6 text-center">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-24 h-24 rounded-full mx-auto object-cover" />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{selectedItem.name}</h3>
                    <p className="text-[var(--gold)] font-medium">{selectedItem.role}</p>
                  </div>
                  <p className="text-gray-600 bg-gray-50 p-6 rounded-xl relative italic">
                    {selectedItem.bio || 'No bio available.'}
                  </p>
                  <div className="flex justify-center gap-4">
                    {selectedItem.socials?.facebook && <Facebook className="w-5 h-5 text-gray-400" />}
                    {selectedItem.socials?.instagram && <Instagram className="w-5 h-5 text-gray-400" />}
                    {selectedItem.socials?.whatsapp && <MessageCircle className="w-5 h-5 text-gray-400" />}
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
                <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>
                  {selectedItem ? 'Edit Member' : 'Add New Member'}
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role / Position</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                        value={editForm.role || ''}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                        value={editForm.image || ''}
                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--gold)]"
                        value={editForm.bio || ''}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      ></textarea>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                       <div>
                        <label className="block text-[10px] text-gray-500 uppercase">Facebook</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border rounded"
                          value={editForm.socials?.facebook || ''}
                          onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, facebook: e.target.value } })}
                        />
                       </div>
                       <div>
                        <label className="block text-[10px] text-gray-500 uppercase">Instagram</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border rounded"
                          value={editForm.socials?.instagram || ''}
                          onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, instagram: e.target.value } })}
                        />
                       </div>
                       <div>
                        <label className="block text-[10px] text-gray-500 uppercase">WhatsApp</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 text-sm border rounded"
                          value={editForm.socials?.whatsapp || ''}
                          onChange={(e) => setEditForm({ ...editForm, socials: { ...editForm.socials, whatsapp: e.target.value } })}
                        />
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
                    {saving ? 'Saving...' : 'Save Member'}
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
