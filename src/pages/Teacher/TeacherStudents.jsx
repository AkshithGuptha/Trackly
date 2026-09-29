import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Mail, MoreVertical } from 'lucide-react';

export default function TeacherStudents() {
  const { profile, connectedStudents, setConnectedStudents } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);

  const filteredStudents = connectedStudents.filter(
    s => s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
         s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(filteredStudents.map(s => s.id));
    } else {
      setSelected([]);
    }
  };

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleEmail = () => {
    if (selected.length === 0) return;
    alert(`Opening email client for ${selected.length} students...`);
    setSelected([]);
  };

  const handleRemove = () => {
    if (selected.length === 0) return;
    if (window.confirm(`Are you sure you want to remove ${selected.length} students from the class?`)) {
      setConnectedStudents(prev => prev.filter(s => !selected.includes(s.id)));
      setSelected([]);
    }
  };

  const handleMute = () => {
    if (selected.length === 0) return;
    alert(`${selected.length} students have been muted. They can no longer post in the stream.`);
    setSelected([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem 0' }}>
      
      {/* Teachers Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Teachers</h2>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><UserPlus size={20} /></button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--bg-elevated)' } }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
              {profile?.full_name?.charAt(0) || 'P'}
            </div>
            <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#fff' }}>{profile?.full_name || 'Professor'}</span>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Mail size={18} /></button>
        </div>
      </section>

      {/* Students Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Students</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{filteredStudents.length} students</span>
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><UserPlus size={20} /></button>
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '0 1rem', opacity: selected.length > 0 ? 1 : 0.5, transition: 'opacity 0.2s' }}>
          <input 
            type="checkbox" 
            style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }} 
            onChange={toggleSelectAll}
            checked={filteredStudents.length > 0 && selected.length === filteredStudents.length}
          />
          <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleEmail} disabled={selected.length === 0}>Email</button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleRemove} disabled={selected.length === 0}>Remove</button>
          <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={handleMute} disabled={selected.length === 0}>Mute</button>
        </div>
        
        {/* Student List */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No students enrolled.</div>
          ) : (
            filteredStudents.map((student) => (
              <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', backgroundColor: selected.includes(student.id) ? 'rgba(255, 0, 34, 0.05)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="checkbox" 
                    style={{ width: '18px', height: '18px', accentColor: 'var(--brand-primary)', cursor: 'pointer' }} 
                    checked={selected.includes(student.id)}
                    onChange={() => toggleSelect(student.id)}
                  />
                  <img src={student.avatar_url} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <span style={{ fontWeight: 500, fontSize: '1.1rem', color: '#fff' }}>{student.full_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><MoreVertical size={18} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      
    </div>
  );
}
