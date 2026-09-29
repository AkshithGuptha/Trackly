import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, Moon, Bell, Search, User, LogOut, CheckCircle, 
  Sparkles, ShieldCheck, RefreshCw, X, Settings 
} from 'lucide-react';
import AIAdvisorModal from './AIAdvisorModal';

export default function Header({ currentView, setCurrentView }) {
  const { 
    profile, logout, themeMode, toggleTheme, switchDemoRole, 
    notifications, markNotificationRead, markAllNotificationsRead 
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  return (
    <>
      <header className="navbar">
        {/* Search & Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search 
              size={16} 
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
            />
            <input
              type="text"
              placeholder="Search assignments, projects..."
              className="form-input"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.85rem' }}
            />
          </div>

          <button 
            className="btn btn-outline"
            style={{ height: '36px', padding: '0 0.8rem', fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
            onClick={() => setShowAIModal(true)}
          >
            <Sparkles size={14} /> AI Predictor
          </button>
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

          {/* Theme Toggle */}
          <button 
            className="btn btn-secondary" 
            style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px' }}
            onClick={toggleTheme}
            title={`Toggle ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-secondary" 
              style={{ padding: '0.45rem', borderRadius: '50%', width: '36px', height: '36px', position: 'relative' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              {unreadNotifs.length > 0 && (
                <span 
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                    fontSize: '0.65rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div 
                className="card" 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45px',
                  width: '320px',
                  maxHeight: '380px',
                  overflowY: 'auto',
                  zIndex: 50,
                  padding: '1rem',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <h4 style={{ fontSize: '0.9rem' }}>Notifications</h4>
                  {unreadNotifs.length > 0 && (
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                      onClick={markAllNotificationsRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.is_read ? 'transparent' : 'var(--bg-elevated)',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        borderLeft: n.is_read ? 'none' : '3px solid var(--brand-primary)'
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{n.message}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Profile Trigger */}
          <div style={{ position: 'relative' }}>
            <button 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.2rem'
              }}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <img 
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                alt="Avatar" 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--brand-primary)' }}
              />
              <div style={{ textAlign: 'left', display: 'none', smDisplay: 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.full_name || 'User'}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {profile?.role || 'student'}
                </div>
              </div>
            </button>

            {showProfileMenu && (
              <div 
                className="card" 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '45px',
                  width: '200px',
                  padding: '0.5rem',
                  zIndex: 50,
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.3rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{profile?.full_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.email}</div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'none', fontSize: '0.85rem' }}
                  onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }}
                >
                  <User size={15} /> My Profile
                </button>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'none', fontSize: '0.85rem' }}
                  onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                >
                  <Settings size={15} /> Settings
                </button>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'none', fontSize: '0.85rem', color: 'var(--danger)' }}
                  onClick={logout}
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showAIModal && <AIAdvisorModal onClose={() => setShowAIModal(false)} />}
    </>
  );
}
