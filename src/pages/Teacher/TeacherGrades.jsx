import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Download, TrendingUp, CheckCircle, MoreHorizontal } from 'lucide-react';

export default function TeacherGrades() {
  const { connectedStudents, assignments, profile, gradebook, setGradebook } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // We filter out non-completed assignments if we only want graded ones, 
  // but for a gradebook we want to see all assigned tasks.
  const gradebookAssignments = assignments;

  // Generate mock grades for demo
  const getMockGrade = (studentId, asgId) => {
    // Deterministic mock grade based on ID lengths to keep it consistent
    const score = (studentId.length * asgId.length * 7) % 30 + 70; // 70-100 range
    return score;
  };

  const filteredStudents = connectedStudents.filter(
    s => s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid var(--brand-primary)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--brand-primary)' }}>Gradebook</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Track class performance and manage grades.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search students..."
              style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-primary)', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="card" style={{ padding: '0', overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ background: '#0a0a0a', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem', fontWeight: 600, color: '#fff', position: 'sticky', left: 0, background: '#0a0a0a', zIndex: 10, borderRight: '1px solid var(--border-color)', minWidth: '250px' }}>
                Students
              </th>
              <th style={{ padding: '1.2rem', fontWeight: 600, color: '#fff', textAlign: 'center', borderRight: '1px solid var(--border-color)', minWidth: '150px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', marginBottom: '0.2rem' }}>Overall Grade</div>
                <div style={{ fontSize: '0.9rem' }}>Class Average</div>
              </th>
              {gradebookAssignments.map(asg => (
                <th key={asg.id} style={{ padding: '1.2rem', fontWeight: 600, color: '#fff', textAlign: 'center', borderRight: '1px solid var(--border-color)', minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {new Date(asg.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>{asg.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Out of 100</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => {
              // Calculate real average
              let totalScore = 0;
              let gradedCount = 0;
              gradebookAssignments.forEach(asg => {
                const key = `${student.id}-${asg.id}`;
                if (gradebook[key] !== undefined && gradebook[key] !== '') {
                  totalScore += Number(gradebook[key]);
                  gradedCount++;
                }
              });
              const average = gradedCount === 0 ? 0 : Math.round(totalScore / gradedCount);

              return (
                <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <td style={{ padding: '1rem 1.2rem', position: 'sticky', left: 0, background: '#0a0a0a', borderRight: '1px solid var(--border-color)', zIndex: 9, display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <img src={student.avatar_url} alt="Avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontWeight: 500, color: '#fff' }}>{student.full_name}</span>
                  </td>
                  <td style={{ padding: '1rem 1.2rem', textAlign: 'center', borderRight: '1px solid var(--border-color)', fontWeight: 700, color: average >= 90 ? 'var(--success)' : (average >= 75 ? 'var(--warning)' : (average === 0 ? 'var(--text-muted)' : 'var(--danger)')) }}>
                    {average > 0 ? `${average}%` : '-'}
                  </td>
                  {gradebookAssignments.map(asg => {
                    const key = `${student.id}-${asg.id}`;
                    const grade = gradebook[key] !== undefined ? gradebook[key] : '';
                    
                    return (
                      <td key={asg.id} style={{ padding: '1rem 1.2rem', textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <input 
                            type="number" 
                            value={grade}
                            onChange={(e) => setGradebook({...gradebook, [key]: e.target.value})}
                            style={{ width: '60px', background: 'rgba(255,255,255,0.05)', border: '1px solid transparent', color: '#fff', textAlign: 'center', fontSize: '1rem', outline: 'none', transition: 'all 0.2s', borderRadius: '6px', padding: '0.4rem' }}
                            onFocus={(e) => { e.target.style.border = '1px solid var(--brand-primary)'; e.target.style.background = 'rgba(255,0,34,0.1)'; }}
                            onBlur={(e) => { e.target.style.border = '1px solid transparent'; e.target.style.background = 'rgba(255,255,255,0.05)'; }}
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
