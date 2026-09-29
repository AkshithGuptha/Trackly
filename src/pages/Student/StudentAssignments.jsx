import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function StudentAssignments() {
  const { assignments, submitWork } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState('All topics');

  // Group by topics dynamically
  const groupedAssignments = assignments.reduce((acc, asg) => {
    const t = asg.topic || 'General';
    if (!acc[t]) acc[t] = [];
    acc[t].push(asg);
    return acc;
  }, {});

  const topics = ['All topics', ...Object.keys(groupedAssignments)];
  
  const displayGroups = selectedTopic === 'All topics' 
    ? groupedAssignments 
    : { [selectedTopic]: groupedAssignments[selectedTopic] || [] };

  const handleSubmit = (e, id) => {
    e.stopPropagation();
    // Simulate submission
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    // In a real app we'd call submitWork here, but we mock the UI for now.
  };

  return (
    <div style={{ display: 'flex', gap: '3rem', maxWidth: '1100px', margin: '0 auto', width: '100%', alignItems: 'flex-start' }}>
      
      {/* Left Sidebar Topics (Google Classroom Style) */}
      <div style={{ width: '200px', position: 'sticky', top: '90px' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {topics.map(t => (
            <li key={t}>
              <button 
                onClick={() => setSelectedTopic(t)}
                style={{ 
                  width: '100%', textAlign: 'left', background: selectedTopic === t ? 'rgba(255,0,34,0.1)' : 'transparent',
                  border: 'none', padding: '0.8rem 1rem', borderRadius: '0 50px 50px 0',
                  color: selectedTopic === t ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  fontWeight: selectedTopic === t ? 600 : 500, cursor: 'pointer', fontSize: '0.95rem'
                }}
              >
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Classwork Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Quick Filter Bar */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <button className="btn btn-outline" style={{ borderRadius: '50px' }}><FileText size={16}/> View your work</button>
          <button className="btn btn-outline" style={{ borderRadius: '50px' }}><Calendar size={16}/> Google Calendar</button>
        </div>

        {Object.keys(displayGroups).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>No classwork yet</h3>
          </div>
        ) : (
          Object.keys(displayGroups).map(t => (
            <div key={t}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                {t}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {displayGroups[t].map(asg => (
                  <div key={asg.id} className="card card-hover" style={{ display: 'flex', padding: '1.2rem 1.5rem', cursor: 'pointer', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: asg.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 0, 34, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: asg.status === 'Completed' ? 'var(--success)' : 'var(--brand-primary)' }}>
                      {asg.status === 'Completed' ? <CheckCircle size={20} /> : <FileText size={20} />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.15rem', color: asg.status === 'Completed' ? 'var(--text-muted)' : '#fff', marginBottom: '0.3rem' }}>{asg.title}</h4>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Due {new Date(asg.due_date).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: asg.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>
                          <Clock size={14} /> {asg.status}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {asg.status !== 'Completed' && (
                        <button className="btn btn-outline" onClick={(e) => handleSubmit(e, asg.id)} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                          Turn In
                        </button>
                      )}
                      <ChevronRight size={20} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
    </div>
  );
}
