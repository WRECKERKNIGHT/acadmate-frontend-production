import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ProfileData {
  // Basic Info
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
  
  // Personal Details
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  
  // Educational/Professional Info
  institution: string;
  department?: string;
  class?: string; // For students
  subjects?: string[]; // For teachers
  experience?: number; // For teachers
  qualification: string;
  
  // Additional Info
  avatar: string;
  bio: string;
  languages: string[];
  skills: string[];
  achievements: string[];
  
  // Social Links
  linkedin?: string;
  twitter?: string;
  website?: string;
  
  // Preferences
  theme: 'LIGHT' | 'DARK' | 'AUTO';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    testReminders: boolean;
    resultUpdates: boolean;
    announcements: boolean;
  };
  
  // Privacy Settings
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'INSTITUTION_ONLY';
  showEmail: boolean;
  showPhone: boolean;
  allowMessages: boolean;
  
  // Activity Stats (Read-only)
  testsCreated?: number;
  testsTaken?: number;
  averageScore?: number;
  totalPoints?: number;
  rank?: number;
  joinedDate: string;
  lastActive: string;
}

interface AcadmateProfileProps {
  onClose?: () => void;
}

const AcadmateProfile: React.FC<AcadmateProfileProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'activity' | 'security'>('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    uid: user?.uid || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    role: user?.role || 'STUDENT',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
    institution: 'Acadmate Institute',
    qualification: '',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=667eea&color=fff&size=200`,
    bio: '',
    languages: ['English'],
    skills: [],
    achievements: [],
    theme: 'AUTO',
    notifications: {
      email: true,
      push: true,
      sms: false,
      testReminders: true,
      resultUpdates: true,
      announcements: true
    },
    profileVisibility: 'INSTITUTION_ONLY',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    testsCreated: 0,
    testsTaken: 0,
    averageScore: 0,
    totalPoints: 0,
    rank: 0,
    joinedDate: '2025-01-01',
    lastActive: new Date().toISOString()
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { key: 'profile', label: 'Profile', icon: '👤', description: 'Personal information and bio' },
    { key: 'settings', label: 'Settings', icon: '⚙️', description: 'Preferences and privacy' },
    { key: 'activity', label: 'Activity', icon: '📊', description: 'Your stats and progress' },
    { key: 'security', label: 'Security', icon: '🔒', description: 'Password and security settings' }
  ];

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const skillOptions = ['Problem Solving', 'Critical Thinking', 'Communication', 'Leadership', 'Time Management', 'Research', 'Programming', 'Design'];
  const languageOptions = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Chinese', 'Arabic', 'Japanese'];

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // API call to save profile would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // API call to change password would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileData.avatar}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            {editing && (
              <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg">
                📷
              </button>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profileData.fullName}</h1>
            <p className="text-blue-100 mb-2">
              {profileData.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </p>
            <p className="text-blue-200 text-sm">{profileData.institution}</p>
          </div>
          <div className="text-right">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              {editing ? '❌ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={profileData.gender}
              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value as any })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="tel"
              value={profileData.emergencyContact}
              onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <textarea
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                disabled={!editing}
                rows={2}
                className={`w-full px-4 py-2 rounded-lg border ${
                  editing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  editing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  editing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label>
              <input
                type="text"
                value={profileData.pincode}
                onChange={(e) => setProfileData({ ...profileData, pincode: e.target.value })}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  editing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional/Academic Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          {profileData.role === 'STUDENT' ? 'Academic Information' : 'Professional Information'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
            <input
              type="text"
              value={profileData.institution}
              onChange={(e) => setProfileData({ ...profileData, institution: e.target.value })}
              disabled={!editing}
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
            <input
              type="text"
              value={profileData.qualification}
              onChange={(e) => setProfileData({ ...profileData, qualification: e.target.value })}
              disabled={!editing}
              placeholder="e.g., M.Sc. Mathematics, B.Tech CSE, Class 12"
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          {profileData.role === 'STUDENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <select
                value={profileData.class || ''}
                onChange={(e) => setProfileData({ ...profileData, class: e.target.value })}
                disabled={!editing}
                className={`w-full px-4 py-2 rounded-lg border ${
                  editing 
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <option value="">Select Class</option>
                {[7, 8, 9, 10, 11, 12].map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>
          )}

          {profileData.role !== 'STUDENT' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <input
                  type="number"
                  value={profileData.experience || ''}
                  onChange={(e) => setProfileData({ ...profileData, experience: parseInt(e.target.value) })}
                  disabled={!editing}
                  min="0"
                  max="50"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    editing 
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjects (For Teachers)</label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={profileData.subjects?.includes(subject) || false}
                        onChange={(e) => {
                          const currentSubjects = profileData.subjects || [];
                          if (e.target.checked) {
                            setProfileData({ ...profileData, subjects: [...currentSubjects, subject] });
                          } else {
                            setProfileData({ ...profileData, subjects: currentSubjects.filter(s => s !== subject) });
                          }
                        }}
                        disabled={!editing}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bio and Additional Info */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">About Me</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!editing}
              rows={4}
              placeholder="Tell us about yourself, your interests, goals, and aspirations..."
              className={`w-full px-4 py-2 rounded-lg border ${
                editing 
                  ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map(language => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.languages.includes(language)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfileData({ ...profileData, languages: [...profileData.languages, language] });
                      } else {
                        setProfileData({ ...profileData, languages: profileData.languages.filter(l => l !== language) });
                      }
                    }}
                    disabled={!editing}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills & Interests</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <label key={skill} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profileData.skills.includes(skill)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfileData({ ...profileData, skills: [...profileData.skills, skill] });
                      } else {
                        setProfileData({ ...profileData, skills: profileData.skills.filter(s => s !== skill) });
                      }
                    }}
                    disabled={!editing}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{skill}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <div className="text-center">
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {loading ? '💾 Saving...' : '💾 Save Profile'}
          </button>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-8">
      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
        
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
            { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
            { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts' },
            { key: 'testReminders', label: 'Test Reminders', description: 'Reminders about upcoming tests' },
            { key: 'resultUpdates', label: 'Result Updates', description: 'Notifications when results are available' },
            { key: 'announcements', label: 'Announcements', description: 'Important updates from institution' }
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{setting.label}</h3>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.notifications[setting.key as keyof typeof profileData.notifications]}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    notifications: {
                      ...profileData.notifications,
                      [setting.key]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={profileData.profileVisibility}
              onChange={(e) => setProfileData({ ...profileData, profileVisibility: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="PUBLIC">Public - Anyone can see your profile</option>
              <option value="INSTITUTION_ONLY">Institution Only - Only people in your institution</option>
              <option value="PRIVATE">Private - Only you can see your profile</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Show Email Address</h3>
                <p className="text-sm text-gray-600">Allow others to see your email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.showEmail}
                  onChange={(e) => setProfileData({ ...profileData, showEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Show Phone Number</h3>
                <p className="text-sm text-gray-600">Allow others to see your phone number</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.showPhone}
                  onChange={(e) => setProfileData({ ...profileData, showPhone: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Allow Messages</h3>
                <p className="text-sm text-gray-600">Allow others to send you messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profileData.allowMessages}
                  onChange={(e) => setProfileData({ ...profileData, allowMessages: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
          <select
            value={profileData.theme}
            onChange={(e) => setProfileData({ ...profileData, theme: e.target.value as any })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="LIGHT">Light Mode</option>
            <option value="DARK">Dark Mode</option>
            <option value="AUTO">Auto (System Preference)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{profileData.testsCreated || 0}</div>
          <div className="text-sm text-gray-600">Tests Created</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{profileData.testsTaken || 0}</div>
          <div className="text-sm text-gray-600">Tests Taken</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">{profileData.averageScore || 0}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">#{profileData.rank || 'N/A'}</div>
          <div className="text-sm text-gray-600">Class Rank</div>
        </div>
      </div>

      {/* Achievement Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements & Badges</h2>
        
        {profileData.achievements.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-4">🏆</div>
            <p>No achievements yet. Keep participating in tests to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.achievements.map((achievement, index) => (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-medium text-gray-900">{achievement}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              📝
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Joined Acadmate</p>
              <p className="text-sm text-gray-600">{new Date(profileData.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              ⏰
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Last Active</p>
              <p className="text-sm text-gray-600">{new Date(profileData.lastActive).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>
        
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={handlePasswordChange}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Two-Factor Authentication</h2>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">SMS Authentication</h3>
            <p className="text-sm text-gray-600">Add an extra layer of security with SMS</p>
          </div>
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
            Enable
          </button>
        </div>
      </div>

      {/* Login Sessions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Active Sessions</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                💻
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-600">Windows • Chrome • {new Date().toLocaleString()}</p>
              </div>
            </div>
            <span className="text-sm text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <h2 className="text-xl font-bold text-red-600 mb-6">Danger Zone</h2>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{tab.description}</div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'settings' && renderSettingsTab()}
            {activeTab === 'activity' && renderActivityTab()}
            {activeTab === 'security' && renderSecurityTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcadmateProfile;