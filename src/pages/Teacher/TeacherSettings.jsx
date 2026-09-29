import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, Shield, Bell, CheckCircle } from 'lucide-react';

export default function TeacherSettings() {
  const { profile, classSettings, setClassSettings } = useAuth();
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  // We use local state for editing, and push to global context on save
  const [localSettings, setLocalSettings] = useState(classSettings);

  const [streamSettings, setStreamSettings] = useState(classSettings.streamPermission || 'all');
  const [showDeleted, setShowDeleted] = useState(false);
  const [gradeCalculation, setGradeCalculation] = useState('total_points');

  const handleSave = (e) => {
    e.preventDefault();
    setClassSettings({ ...localSettings, streamPermission: streamSettings });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Class Settings</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage the configuration for your classroom.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          {isSaved ? <><CheckCircle size={18} /> Saved</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Class Details Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--brand-primary)" /> Class Details
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class Name (Required)</label>
              <input type="text" value={localSettings.name} onChange={(e) => setLocalSettings({...localSettings, name: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', fontSize: '1.1rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Class Description</label>
              <textarea value={localSettings.description} onChange={(e) => setLocalSettings({...localSettings, description: e.target.value})} style={{ width: '100%', minHeight: '80px', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Section</label>
                <input type="text" value={localSettings.section} onChange={(e) => setLocalSettings({...localSettings, section: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Room</label>
                <input type="text" value={localSettings.room} onChange={(e) => setLocalSettings({...localSettings, room: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Subject</label>
                <input type="text" value={localSettings.subject} onChange={(e) => setLocalSettings({...localSettings, subject: e.target.value})} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }} />
              </div>
            </div>
          </div>
        </section>

        {/* General Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--brand-primary)" /> General
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Invite Codes</label>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Class Code</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>{profile?.classroom_code || 'TRK-8X92P'}</div>
                </div>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Reset Code</button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Stream Permissions</label>
              <select value={streamSettings} onChange={(e) => setStreamSettings(e.target.value)} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }}>
                <option value="all">Students can post and comment</option>
                <option value="comment_only">Students can only comment</option>
                <option value="none">Only teachers can post or comment</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Show deleted items</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Only teachers can view deleted items.</div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--brand-primary)' }} />
              </label>
            </div>
          </div>
        </section>

        {/* Grading Section */}
        <section>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--brand-primary)" /> Grading
          </h3>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Overall grade calculation</label>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Choose a grading system. Learn more</p>
              <select value={gradeCalculation} onChange={(e) => setGradeCalculation(e.target.value)} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }}>
                <option value="no_overall">No overall grade</option>
                <option value="total_points">Total points</option>
                <option value="weighted">Weighted by category</option>
              </select>
            </div>
          </div>
        </section>

      </form>
    </div>
  );
}
