import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true
  });
  const [theme, setTheme] = useState('dark');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(data);
        setEditForm({ name: data.name || '', email: data.email || '' });
      } catch (err) {
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ name: user?.name || '', email: user?.email || '' });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      return;
    }

    try {
      const { data } = await axios.put('/users/me', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(data);
      setEditForm({ name: data.name || '', email: data.email || '' });
      setIsEditing(false);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white/90 font-light">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-red-500/20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-white font-medium mb-2">Something went wrong</h3>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10">
          <span className="text-white/90 font-light">No user data found</span>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'activity', label: 'Activity', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-xl backdrop-blur-xl flex items-center space-x-2 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-extralight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-white tracking-widest mb-4">
              Profile
            </h1>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
              <div className="w-6 h-px bg-gradient-to-l from-transparent via-emerald-400 to-transparent"></div>
            </div>
            <p className="text-white/50 mt-4 text-lg font-light">Manage your account and preferences</p>
          </div>

          {/* Profile Header Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
              {/* Avatar Section */}
              <div className="relative group">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-light border-4 border-white/20 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl font-light text-white/90 mb-2">{user.name}</h2>
                <p className="text-white/60 text-xl mb-3">{user.email}</p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <span className="inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm uppercase tracking-wide">
                    {user.role || 'User'}
                  </span>
                  <span className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm uppercase tracking-wide">
                    Member since {memberSince}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-2xl font-light text-white/90 mb-1">12</div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">Projects</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-2xl font-light text-white/90 mb-1">47</div>
                  <div className="text-white/50 text-xs uppercase tracking-wide">AI Queries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-light text-white/90 mb-6">Account Overview</h3>
                
                {isEditing ? (
                  <div className="max-w-md mx-auto space-y-6">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 transition-all"
                        placeholder="Your email"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 px-6 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl border border-emerald-500/20 transition-all duration-300 font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl border border-white/10 transition-all duration-300 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="text-white/90 font-medium mb-4">Personal Information</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-white/50">Name:</span>
                            <span className="text-white/90">{user.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Email:</span>
                            <span className="text-white/90">{user.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/50">Role:</span>
                            <span className="text-emerald-400">{user.role || 'User'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleEdit}
                        className="group flex items-center justify-center space-x-2 w-full px-6 py-3 bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all duration-300"
                      >
                        <svg className="w-5 h-5 text-white/70 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-white/70 group-hover:text-emerald-400 transition-colors font-medium">Edit Profile</span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h4 className="text-white/90 font-medium mb-4">Account Statistics</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/60">AI Queries</span>
                            <span className="text-2xl font-light text-emerald-400">47</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/60">Projects</span>
                            <span className="text-2xl font-light text-blue-400">12</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/60">Last Login</span>
                            <span className="text-white/70">Today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-light text-white/90 mb-6">Preferences</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-white/90 font-medium mb-4">Notifications</h4>
                      <div className="space-y-4">
                        {Object.entries(notifications).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-white/70 capitalize">{key} Notifications</span>
                            <button
                              onClick={() => handleNotificationChange(key)}
                              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                                value ? 'bg-emerald-500' : 'bg-white/10'
                              }`}
                            >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${
                                value ? 'left-7' : 'left-1'
                              }`}></div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-white/90 font-medium mb-4">Appearance</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white/70 text-sm font-medium mb-2">Theme</label>
                          <div className="flex space-x-2">
                            {['dark', 'light', 'system'].map((themeOption) => (
                              <button
                                key={themeOption}
                                onClick={() => handleThemeChange(themeOption)}
                                className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                                  theme === themeOption
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {themeOption}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-light text-white/90 mb-6">Security & Privacy</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-white/90 font-medium mb-4">Password</h4>
                      <p className="text-white/60 text-sm mb-4">Keep your account secure with a strong password</p>
                      <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 transition-all duration-300">
                        Change Password
                      </button>
                    </div>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-white/90 font-medium mb-4">Two-Factor Authentication</h4>
                      <p className="text-white/60 text-sm mb-4">Add an extra layer of security to your account</p>
                      <button className="w-full px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/20 rounded-xl text-emerald-400 transition-all duration-300">
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <h4 className="text-white/90 font-medium mb-4">Login Sessions</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <div className="text-white/80 text-sm">Current Device</div>
                            <div className="text-white/50 text-xs">Windows • Chrome</div>
                          </div>
                          <span className="text-emerald-400 text-xs">Active</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/20 rounded-xl text-red-400 transition-all duration-300 text-sm">
                        Sign Out All Devices
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-light text-white/90 mb-6">Recent Activity</h3>
                
                <div className="space-y-4">
                  {[
                    { action: 'Profile updated', time: '2 hours ago', type: 'profile' },
                    { action: 'AI query processed', time: '5 hours ago', type: 'ai' },
                    { action: 'New project created', time: '1 day ago', type: 'project' },
                    { action: 'Security settings changed', time: '3 days ago', type: 'security' },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'profile' ? 'bg-emerald-500/20 text-emerald-400' :
                        activity.type === 'ai' ? 'bg-blue-500/20 text-blue-400' :
                        activity.type === 'project' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {activity.type === 'profile' && '👤'}
                        {activity.type === 'ai' && '🤖'}
                        {activity.type === 'project' && '📁'}
                        {activity.type === 'security' && '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className="text-white/90">{activity.action}</div>
                        <div className="text-white/50 text-sm">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
