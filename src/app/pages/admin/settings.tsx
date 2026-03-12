import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, User, Key, Globe, Bell, Image, MapPin, Mail, Phone, FileText, Database, AlertTriangle, X, Plus, Edit2 } from 'lucide-react';
import { apiService } from '../../api/apiService';
import { localService as devService } from '../../api/localService';
import { supabaseService } from '../../api/supabaseService';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [adminPhoto, setAdminPhoto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [settings, setSettings] = useState<any>({
    firstName: 'Thabet', lastName: '', email: 'admin@goldentrip.com',
    siteName: 'Golden Trip', supportEmail: 'support@goldentrip.com', currency: 'JOD (JD)', timezone: 'UTC+03:00 Amman',
    siteLogo: '',
    notifications: { newBookings: false, newMessages: false, systemUpdates: false }
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data } = await apiService.getSettings();
      if (data) setSettings(data);
      // Load saved admin photo
      const savedPhoto = localStorage.getItem('goldentrip_admin_photo');
      if (savedPhoto) setAdminPhoto(savedPhoto);
      setFetching(false);
    };
    loadSettings();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAdminPhoto(dataUrl);
      localStorage.setItem('goldentrip_admin_photo', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    await apiService.saveSettings(settings);
    setLoading(false);
    alert('Settings saved successfully!');
  };

  const handleMigrate = async () => {
    if (!confirm('This will copy all data from local storage to Supabase. Existing Supabase data might be duplicated. Proceed?')) return;
    setLoading(true);
    try {
      // Fetch all local data
      const [
        { data: dests },
        { data: pkgs },
        { data: visas },
        { data: messages },
        { data: bookings },
        { data: testimonials },
        { data: jobs },
        { data: features },
        { data: blogs },
        { data: team },
        { data: localSettings }
      ] = await Promise.all([
        devService.getDestinations(),
        devService.getPackages(),
        devService.getVisas(),
        devService.getMessages(),
        devService.getBookings(),
        devService.getTestimonials(),
        devService.getJobs(),
        devService.getFeatures(),
        devService.getBlogs(),
        devService.getTeamMembers(),
        devService.getSettings()
      ]);

      // Save to Supabase using supabaseService directly to explicitly force cloud save
      const savePromises = [
        ...(dests || []).map(d => supabaseService.saveDestination(d)),
        ...(pkgs || []).map(p => supabaseService.savePackage(p)),
        ...(visas || []).map(v => supabaseService.saveVisa(v)),
        ...(messages || []).map(m => supabaseService.saveMessage(m)),
        ...(bookings || []).map(b => supabaseService.saveBooking(b)),
        ...(testimonials || []).map(t => supabaseService.saveTestimonial(t)),
        ...(jobs || []).map(j => supabaseService.saveJob(j)),
        ...(features || []).map(f => supabaseService.saveFeature(f)),
        ...(blogs || []).map(b => supabaseService.saveBlog(b)),
        ...(team || []).map(tm => supabaseService.saveTeamMember(tm)),
        supabaseService.saveSettings(localSettings || {})
      ];

      await Promise.all(savePromises);
      alert('Migration completed successfully!');
    } catch (err) {
      console.error('Migration error:', err);
      alert('Migration failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'security', icon: Key, label: 'Security' },
    { id: 'site', icon: Globe, label: 'Site Preferences' },
    { id: 'branding', icon: Image, label: 'Branding' },
    { id: 'contact', icon: MapPin, label: 'Contact Info' },
    { id: 'about', icon: Edit2, label: 'About Us Content' },
    { id: 'legal', icon: FileText, label: 'Legal Content' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'system', icon: Database, label: 'System' }
];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2" style={{ color: 'var(--navy)' }}>Settings</h1>
        <p className="text-gray-600">Manage your admin preferences and site configuration.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-2 flex-1 p-4 transition-colors font-medium border-b-2 ${
                  activeTab === tab.id ? 'border-[var(--gold)] text-[var(--gold)] bg-gray-50' : 'border-transparent text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>
        
        <div className="p-8">
          {fetching ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-[var(--gold)] rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && (
              <div className="max-w-2xl space-y-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl mr-4 overflow-hidden shadow-inner border border-gray-200">
                    {adminPhoto ? (
                      <img src={adminPhoto} alt="Admin" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Admin Photo</h3>
                    <p className="text-sm text-gray-500 mb-3">Upload a new picture</p>
                    <input
                      type="file"
                      id="admin-photo-input"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="admin-photo-input"
                      className="text-sm border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors font-medium cursor-pointer inline-block"
                    >
                      Choose File
                    </label>
                    {adminPhoto && (
                      <button
                        onClick={() => { setAdminPhoto(''); localStorage.removeItem('goldentrip_admin_photo'); }}
                        className="ml-3 text-sm text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" value={settings.firstName} onChange={e => setSettings({...settings, firstName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" value={settings.lastName} onChange={e => setSettings({...settings, lastName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-xl space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-6">Change Password</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            )}

            {activeTab === 'site' && (
              <div className="max-w-2xl space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Site Name</label>
                  <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Support Email</label>
                  <input type="email" value={settings.supportEmail} onChange={e => setSettings({...settings, supportEmail: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Currency</label>
                    <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all">
                      <option>JOD (د.أ)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JOD (JD)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <select value={settings.timezone} onChange={e => setSettings({...settings, timezone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all">
                      <option>UTC+00:00 London</option>
                      <option>UTC+03:00 Amman</option>
                      <option>UTC-05:00 Eastern Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Website Logo</h3>
                  <p className="text-sm text-gray-500 mb-6">Enter an image URL or base64 data to replace the global site logo.</p>
                </div>
                
                <div className="flex items-start gap-6 border-b border-gray-100 pb-8">
                  <div className="w-32 h-32 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {settings.siteLogo ? (
                      <img src={settings.siteLogo} alt="Site Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Image className="w-8 h-8 text-gray-300" />
                    )}
                    {settings.siteLogo && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => setSettings({...settings, siteLogo: ''})}
                          className="text-white text-xs bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Logo Image URL</label>
                      <input 
                        type="text" 
                        value={settings.siteLogo || ''} 
                        onChange={e => setSettings({...settings, siteLogo: e.target.value})} 
                        placeholder="https://example.com/logo.png"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" 
                      />
                      <p className="text-xs text-gray-400 mt-1">Leave blank to use the default logo.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="max-w-2xl space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Office Address</label>
                    <div className="flex gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-2" />
                      <input 
                        type="text" 
                        value={settings.contactInfo?.address || ''} 
                        onChange={e => setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), address: e.target.value}})} 
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Numbers</label>
                    <div className="space-y-3">
                      {(settings.contactInfo?.phone || '').split(',').map((p: string) => p.trim()).map((p: string, i: number, arr: string[]) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                          <input 
                            type="text" 
                            value={p} 
                            onChange={e => {
                              const newArr = [...arr];
                              newArr[i] = e.target.value;
                              setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), phone: newArr.join(',')}});
                            }} 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" 
                          />
                          <button onClick={() => {
                            const newArr = arr.filter((_, idx) => idx !== i);
                            setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), phone: newArr.join(',')}});
                          }} className="p-2 text-red-500 hover:text-red-700 shrink-0 bg-red-50 rounded-lg">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const newArr = (settings.contactInfo?.phone || '').split(',').map((s: string) => s.trim());
                        newArr.push('');
                        setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), phone: newArr.join(',')}});
                      }} className="flex items-center gap-2 text-sm text-[var(--gold)] hover:text-[var(--gold-dark)] font-medium mt-2 px-2 py-1 bg-yellow-50 rounded-lg w-max">
                        <Plus className="w-4 h-4" /> Add Phone Number
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Official Emails</label>
                    <div className="space-y-3">
                      {(settings.contactInfo?.email || '').split(',').map((e: string) => e.trim()).map((emailStr: string, i: number, arr: string[]) => (
                        <div key={i} className="flex gap-2 items-center">
                          <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                          <input 
                            type="email" 
                            value={emailStr} 
                            onChange={e => {
                              const newArr = [...arr];
                              newArr[i] = e.target.value;
                              setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), email: newArr.join(',')}});
                            }} 
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" 
                          />
                          <button onClick={() => {
                            const newArr = arr.filter((_, idx) => idx !== i);
                            setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), email: newArr.join(',')}});
                          }} className="p-2 text-red-500 hover:text-red-700 shrink-0 bg-red-50 rounded-lg">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const newArr = (settings.contactInfo?.email || '').split(',').map((s: string) => s.trim());
                        newArr.push('');
                        setSettings({...settings, contactInfo: {...(settings.contactInfo || {}), email: newArr.join(',')}});
                      }} className="flex items-center gap-2 text-sm text-[var(--gold)] hover:text-[var(--gold-dark)] font-medium mt-2 px-2 py-1 bg-yellow-50 rounded-lg w-max">
                        <Plus className="w-4 h-4" /> Add Email Address
                      </button>
                    </div>
                  </div>
                  
                  <hr className="border-gray-100 my-6" />

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[var(--gold)]" />
                      Tawk.to Chat URL
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Paste your Tawk.to Direct Chat Link here to enable the floating widget. Leave empty to disable.</p>
                    <input 
                      type="text" 
                      placeholder="https://embed.tawk.to/YOUR_ID/YOUR_WIDGET"
                      value={settings.tawkToUrl || ''} 
                      onChange={e => setSettings({...settings, tawkToUrl: e.target.value})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="max-w-4xl space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <input type="text" value={settings.aboutContent?.heroTitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), heroTitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Subtitle</label>
                      <input type="text" value={settings.aboutContent?.heroSubtitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), heroSubtitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>

                  <hr className="border-gray-100 my-6" />

                  <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Our Story</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Story Title</label>
                      <input type="text" value={settings.aboutContent?.storyTitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), storyTitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Paragraph 1</label>
                      <textarea rows={3} value={settings.aboutContent?.storyP1 || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), storyP1: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Paragraph 2</label>
                      <textarea rows={3} value={settings.aboutContent?.storyP2 || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), storyP2: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Paragraph 3</label>
                      <textarea rows={3} value={settings.aboutContent?.storyP3 || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), storyP3: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>

                  <hr className="border-gray-100 my-6" />

                  <h3 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>Core Values</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Mission Title</label>
                      <input type="text" value={settings.aboutContent?.missionTitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), missionTitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Mission Text</label>
                      <textarea rows={3} value={settings.aboutContent?.missionText || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), missionText: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Vision Title</label>
                      <input type="text" value={settings.aboutContent?.visionTitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), visionTitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Vision Text</label>
                      <textarea rows={3} value={settings.aboutContent?.visionText || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), visionText: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Values Title</label>
                      <input type="text" value={settings.aboutContent?.valuesTitle || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), valuesTitle: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                     <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Values Text</label>
                      <textarea rows={3} value={settings.aboutContent?.valuesText || ''} onChange={e => setSettings({...settings, aboutContent: {...(settings.aboutContent || {}), valuesText: e.target.value}})} className="w-full px-4 py-2 border rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'legal' && (
              <div className="max-w-4xl space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      Privacy Policy <span>(Markdown supported)</span>
                    </label>
                    <textarea 
                      rows={6}
                      value={settings.legalPages?.privacyPolicy || ''} 
                      onChange={e => setSettings({...settings, legalPages: {...(settings.legalPages || {}), privacyPolicy: e.target.value}})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      Terms of Service <span>(Markdown supported)</span>
                    </label>
                    <textarea 
                      rows={6}
                      value={settings.legalPages?.termsOfService || ''} 
                      onChange={e => setSettings({...settings, legalPages: {...(settings.legalPages || {}), termsOfService: e.target.value}})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      Cookie Policy <span>(Markdown supported)</span>
                    </label>
                    <textarea 
                      rows={6}
                      value={settings.legalPages?.cookiePolicy || ''} 
                      onChange={e => setSettings({...settings, legalPages: {...(settings.legalPages || {}), cookiePolicy: e.target.value}})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all font-mono text-sm" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      Refund Policy <span>(Markdown supported)</span>
                    </label>
                    <textarea 
                      rows={6}
                      value={settings.legalPages?.refundPolicy || ''} 
                      onChange={e => setSettings({...settings, legalPages: {...(settings.legalPages || {}), refundPolicy: e.target.value}})} 
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent outline-none transition-all font-mono text-sm" 
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl space-y-6">
                <h3 className="text-lg font-medium text-gray-800 mb-6">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'newBookings', label: 'New Bookings', desc: 'Get notified when a new booking is made' },
                    { key: 'newMessages', label: 'New Messages', desc: 'Get notified when a new message arrives' },
                    { key: 'systemUpdates', label: 'System Updates', desc: 'Receive system and maintenance updates' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            [item.key]: !settings.notifications?.[item.key]
                          }
                        })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.notifications?.[item.key] ? 'bg-[var(--gold)]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          settings.notifications?.[item.key] ? 'left-[26px]' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="max-w-2xl space-y-6">
                <div className="p-6 border-2 border-yellow-100 bg-yellow-50 rounded-2xl flex gap-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">Data Migration</h3>
                    <p className="text-sm text-yellow-700 mb-6">
                      Use this tool to migrate all existing destinations, packages, and other data from your browser's local storage to the Supabase database.
                    </p>
                    <button 
                      onClick={handleMigrate}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all disabled:opacity-50"
                    >
                      {loading ? 'Migrating...' : 'Migrate Local Data to Supabase'}
                    </button>
                  </div>
                </div>

                <div className="p-6 border-2 border-blue-100 bg-blue-50 rounded-2xl">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">Database Connection</h3>
                    <p className="text-sm text-blue-700 mb-4">
                        Current Status: <span className="font-bold text-green-600 uppercase">Connected to Supabase</span>
                    </p>
                    <p className="text-xs text-blue-600 italic">
                        Projects: lfzumrxprnyakxtulqrx
                    </p>
                </div>

                <div className="p-6 border-2 border-red-100 bg-red-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="text-lg font-medium text-red-800">Fix Database Table Issues</h3>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    If you see errors like <strong>"Could not find table public.team_members"</strong>, it means the table is missing in your Supabase project.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-red-200 mb-6 font-mono text-xs overflow-auto max-h-60 text-gray-800">
                    <p className="mb-2 font-bold text-red-800">Step 1: Copy this SQL script:</p>
                    <pre>
{`-- Run this in the Supabase SQL Editor
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, role text NOT NULL,
  image text, bio text, socials jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, slug text UNIQUE NOT NULL,
  excerpt text, content text, image text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "open_access" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open_access" ON blogs FOR ALL USING (true) WITH CHECK (true);`}
                    </pre>
                  </div>
                  <a 
                    href="https://supabase.com/dashboard/project/lfzumrxprnyakxtulqrx/sql" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all text-center"
                  >
                    Step 2: Go to Supabase SQL Editor & Paste
                  </a>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg transition-all"
                style={{ background: 'var(--gold)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Changes
              </button>
            </div>
          </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
