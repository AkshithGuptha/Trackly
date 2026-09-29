import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Search, Calendar, Users, CheckCircle, MoreVertical, FileText, Link as LinkIcon, Paperclip, Trash2 } from 'lucide-react';

export default function TeacherAssignments() {
  const { assignments, connectedStudents, addAssignment, deleteAssignment, profile } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Assignment Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('General');
  const [studentId, setStudentId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');

  const filteredAssignments = assignments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // Group by topics
  const groupedAssignments = filteredAssignments.reduce((acc, asg) => {
    const t = asg.topic || 'General';
    if (!acc[t]) acc[t] = [];
    acc[t].push(asg);
    return acc;
  }, {});

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    await addAssignment({
      title,
      description,
      topic,
      student_id: studentId && studentId !== 'all' ? studentId : connectedStudents[0]?.id,
      teacher_id: profile?.id,
      due_date: new Date(dueDate).toISOString(),
      priority,
      status: 'Pending'
    });

    setIsCreating(false);
    setTitle('');
    setDescription('');
    setStudentId('');
    setDueDate('');
    setTopic('General');
    setPriority('Medium');
  };

  const getStudentName = (id) => {
    if (id === 'all' || !id) return 'All Students';
    const student = connectedStudents.find(s => s.id === id);
    return student ? student.full_name : 'Unknown Student';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>Classwork</h2>
          
          <div style={{ position: 'relative', width: '250px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search assignments..."
              style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '50px', padding: '0.6rem 1rem 0.6rem 2.5rem', color: 'var(--text-primary)', outline: 'none' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setIsCreating(!isCreating)}>
          <Plus size={18} /> {isCreating ? 'Cancel' : 'Create'}
        </button>
      </div>

      {/* Dynamic Creation Panel */}
      {isCreating && (
        <div className="card" style={{ padding: '2rem', border: '1px solid rgba(255,0,34,0.3)', boxShadow: '0 10px 40px -10px rgba(255,0,34,0.15)' }}>
          <h3 style={{ marginBottom: '1.5rem', color: '#fff', fontSize: '1.4rem' }}>Create Assignment</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <input 
              type="text" placeholder="Assignment Title" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus
              style={{ width: '100%', background: 'var(--bg-elevated)', border: 'none', borderBottom: '2px solid var(--border-color)', padding: '1rem', color: '#fff', fontSize: '1.2rem', outline: 'none' }}
            />
            
            <textarea 
              placeholder="Instructions (optional)" value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', minHeight: '120px', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-primary)', resize: 'vertical', outline: 'none' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Topic</label>
                <input type="text" placeholder="e.g., Week 1, React Basics" value={topic} onChange={(e) => setTopic(e.target.value)} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assign to Student</label>
                <select value={studentId} onChange={(e) => setStudentId(e.target.value)} style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none' }}>
                  <option value="all">All Students</option>
                  {connectedStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.full_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Due Date</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.8rem', color: '#fff', outline: 'none', colorScheme: 'dark' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-outline" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '50%' }}><Paperclip size={18} color="var(--text-muted)" /></button>
                <button type="button" className="btn btn-outline" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', padding: '0.6rem', borderRadius: '50%' }}><LinkIcon size={18} color="var(--text-muted)" /></button>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign to Class</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Assignment Feed Grouped By Topic */}
      {Object.keys(groupedAssignments).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--text-muted)' }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>No classwork yet</h3>
          <p>Create assignments and questions. Use topics to organize classwork into modules.</p>
        </div>
      ) : (
        Object.keys(groupedAssignments).map(t => (
          <div key={t} style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              {t}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {groupedAssignments[t].map(asg => (
                <div key={asg.id} className="card card-hover" style={{ display: 'flex', padding: '1.2rem 1.5rem', cursor: 'pointer', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 0, 34, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-primary)' }}>
                    <FileText size={20} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '0.3rem' }}>{asg.title}</h4>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Due {new Date(asg.due_date).toLocaleDateString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> {getStudentName(asg.student_id)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>0</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Turned in</div>
                    </div>
                    <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{studentId === 'all' ? connectedStudents.length : 1}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned</div>
                    </div>
                    <button 
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '1rem', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAssignment(asg.id);
                      }}
                      title="Delete Assignment"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

    </div>
  );
}
