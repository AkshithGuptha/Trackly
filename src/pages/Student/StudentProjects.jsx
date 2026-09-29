import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FolderGit2, CheckSquare, Square, Calendar, Clock, UploadCloud } from 'lucide-react';

export default function StudentProjects() {
  const { projects, toggleProjectTask } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>My Projects</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage semester-long projects and sub-tasks.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {projects.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <FolderGit2 size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
            <h3>No Active Projects</h3>
            <p style={{ color: 'var(--text-secondary)' }}>You haven't been assigned any projects yet.</p>
          </div>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Project Header */}
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{project.title}</h3>
                  <span className="badge badge-in-progress">{project.status}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', maxWidth: '800px' }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} /> Start: {new Date(project.start_date).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={14} /> Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Project Progress & Tasks */}
              <div style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem' }}>Project Checklist</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {project.tasks?.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleProjectTask(project.id, task.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.8rem',
                          padding: '0.75rem 1rem',
                          backgroundColor: task.is_completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-elevated)',
                          border: `1px solid ${task.is_completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {task.is_completed ? (
                          <CheckSquare size={18} color="var(--success)" />
                        ) : (
                          <Square size={18} color="var(--text-muted)" />
                        )}
                        <span style={{ 
                          fontSize: '0.9rem', 
                          color: task.is_completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                          textDecoration: task.is_completed ? 'line-through' : 'none'
                        }}>
                          {task.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="card" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Completion</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{project.progress_percentage}%</span>
                    </div>
                    <div className="progress-track" style={{ height: '10px' }}>
                      <div className="progress-fill" style={{ width: `${project.progress_percentage}%` }} />
                    </div>
                  </div>

                  <button className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} onClick={() => alert('Submit Project Deliverable Modal goes here')}>
                    <UploadCloud size={18} /> Submit Deliverable
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
