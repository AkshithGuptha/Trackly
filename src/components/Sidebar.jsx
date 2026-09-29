import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, FolderGit2, CheckSquare, 
  Users, BarChart3, Bell, User, Settings, Layers, Sparkles 
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const { profile } = useAuth();
  const isTeacher = profile?.role === 'teacher';

  const navItems = isTeacher
    ? [
        { id: 'stream', label: 'Stream', icon: LayoutDashboard },
        { id: 'classwork', label: 'Classwork', icon: BookOpen },
        { id: 'people', label: 'People', icon: Users },
        { id: 'grades', label: 'Grades', icon: BarChart3 },
        { id: 'settings', label: 'Class Settings', icon: Settings },
      ]
    : [
        { id: 'stream', label: 'Stream', icon: LayoutDashboard },
        { id: 'classwork', label: 'Classwork', icon: BookOpen },
        { id: 'people', label: 'People', icon: Users },
        { id: 'progress', label: 'My Progress', icon: Layers },
        { id: 'study', label: 'AI Study Hub', icon: Sparkles },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  return (
    <>
      {/* Desktop Sidebar (Left Navigation) */}
      <aside 
        style={{
          width: '260px',
          height: '100vh',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'none',
          flexDirection: 'column',
          zIndex: 45,
          padding: '1.2rem 1rem'
        }}
        className="desktop-sidebar"
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
            }}
          >
            T
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1 }}>Trackly</h2>
            <span style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
              {isTeacher ? 'Teacher Portal' : 'Student Hub'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  border: 'none',
                  borderLeft: isActive ? '4px solid var(--brand-primary)' : '4px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--brand-primary)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Classroom Badge Card */}
        <div 
          className="card"
          style={{
            padding: '1.2rem',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, var(--bg-elevated) 0%, var(--bg-surface) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--success)' }}></div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>CLASSROOM CODE</div>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
            {profile?.classroom_code || 'TRK-8X92P'}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Rail */}
      <nav 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '64px',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 50
        }}
        className="mobile-bottom-nav"
      >
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontSize: '0.68rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
