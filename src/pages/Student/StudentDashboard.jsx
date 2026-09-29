import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, MessageSquare, Send, MoreVertical, Sparkles } from 'lucide-react';

export default function StudentDashboard({ setCurrentView }) {
  const { profile, streamPosts, classSettings } = useAuth();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      
      {/* Stream Banner */}
      <div 
        className="card" 
        style={{
          background: 'var(--brand-gradient)', // Uses the new red gradient
          color: 'white',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          border: 'none',
          minHeight: '240px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles size={16} /> {classSettings?.name || 'Computer Science'}
          </div>
          <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            Welcome, {profile?.full_name?.split(' ')[0] || 'Student'}.
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>
            Stay updated with class announcements.
          </p>
        </div>
        
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 1 }}></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        {/* Announce box for students (disabled or minimal) */}
        <div className="card" style={{ padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              {profile?.full_name?.charAt(0) || 'S'}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '1.05rem', opacity: 0.7 }}>
              Students cannot post directly to the stream in this class.
            </div>
          </div>
        </div>

        {/* Dynamic Stream Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {streamPosts.map(post => (
            <div key={post.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: post.role === 'Admin' ? '#3b82f6' : 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{post.author}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{post.time}</div>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <MoreVertical size={20} />
                </button>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {post.content}
              </p>
              
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1.5rem', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {profile?.full_name?.charAt(0) || 'S'}
                </div>
                <input 
                  type="text" 
                  placeholder="Add class comment..." 
                  style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem' }} 
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
