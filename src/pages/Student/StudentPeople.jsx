import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail } from 'lucide-react';

export default function StudentPeople() {
  const { connectedStudents, profile } = useAuth();
  
  // Exclude the current student from the "Classmates" list
  const classmates = connectedStudents.filter(s => s.id !== profile?.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem 0' }}>
      
      {/* Teachers Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Teachers</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--bg-elevated)' } }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              P
            </div>
            <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#fff' }}>Professor Instructor</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer' }}><Mail size={18} /></button>
        </div>
      </section>

      {/* Classmates Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Classmates</h2>
          <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{classmates.length} students</span>
        </div>

        {/* Student List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {classmates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>You are the only student enrolled in this class.</div>
          ) : (
            classmates.map((student) => (
              <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={student.avatar_url} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#fff' }}>{student.full_name}</span>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
                  <Mail size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      
    </div>
  );
}
