import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell, Shield, Save, CheckCircle } from 'lucide-react';

export default function StudentSettings() {
  const { profile, updateProfile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const fileInputRef = useRef(null);

  // Form State
  const [profileData, setProfileData] = useState({
    name: profile?.full_name || 'Student Name',
    email: profile?.email || 'student@university.edu'
  });

  useEffect(() => {
    setProfileData({ name: profile?.full_name || 'Student Name', email: profile?.email || 'student@university.edu' });
    setAvatarPreview(profile?.avatar_url || '');
  }, [profile]);

  const [notifications, setNotifications] = useState({
    email: true,
    comments: true,
    privateComments: true,
    dueDates: true,
    returnedWork: true
  });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ full_name: profileData.name });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      alert(error.message || 'Could not save profile.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return alert('Profile pictures must be 5 MB or smaller.');
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploading(true);
    try {
      await updateProfile({ avatarFile: file });
    } catch (error) {
      setAvatarPreview(profile?.avatar_url || '');
      alert(error.message || 'Could not upload profile picture.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Account Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your profile and notification preferences.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {isSaved ? <><CheckCircle size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Profile Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--brand-primary)" /> Profile
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--brand-gradient)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '2rem', fontWeight: 700, border: '2px solid var(--brand-primary)' }}>
                {avatarPreview ? <img src={avatarPreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                <button type="button" className="btn btn-outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Change Profile Picture'}
                </button>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>PNG, JPG or WEBP · max 5 MB</div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', fontSize: '1.1rem', outline: 'none' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input type="email" value={profileData.email} disabled style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: 'var(--text-muted)', fontSize: '1.1rem', outline: 'none', cursor: 'not-allowed' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your email is managed by your organization.</p>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--brand-primary)" /> Notifications
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <div style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>Email notifications</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receive email notifications.</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification('email')} style={{ width: '22px', height: '22px', accentColor: 'var(--brand-primary)' }} />
              </label>
            </div>

            <div style={{ opacity: notifications.email ? 1 : 0.5, pointerEvents: notifications.email ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Classes you're enrolled in</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.95rem', color: '#fff' }}>Comments on your posts</div>
                  <input type="checkbox" checked={notifications.comments} onChange={() => toggleNotification('comments')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.95rem', color: '#fff' }}>Private comments on work</div>
                  <input type="checkbox" checked={notifications.privateComments} onChange={() => toggleNotification('privateComments')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.95rem', color: '#fff' }}>Due-date reminders for your work</div>
                  <input type="checkbox" checked={notifications.dueDates} onChange={() => toggleNotification('dueDates')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.95rem', color: '#fff' }}>Returned work and grades from your teachers</div>
                  <input type="checkbox" checked={notifications.returnedWork} onChange={() => toggleNotification('returnedWork')} style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)' }} />
                </div>
              </div>
            </div>

          </div>
        </section>

      </form>
    </div>
  );
}
