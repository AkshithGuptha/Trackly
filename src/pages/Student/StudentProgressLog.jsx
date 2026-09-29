import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Send, History, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function StudentProgressLog() {
  const { progressUpdates, addProgressUpdate } = useAuth();
  
  const [workDone, setWorkDone] = useState('');
  const [completedItems, setCompletedItems] = useState('');
  const [blockers, setBlockers] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!workDone) return;
    
    setIsSubmitting(true);
    await addProgressUpdate({
      work_done: workDone,
      completed_items: completedItems,
      blockers,
      next_steps: nextSteps
    });
    
    setWorkDone('');
    setCompletedItems('');
    setBlockers('');
    setNextSteps('');
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
      {/* Log Form */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Log Daily Progress</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Record your achievements, blockers, and next steps for your teacher to review.</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          <div className="form-group">
            <label className="form-label">What I worked on today <span style={{ color: 'var(--danger)' }}>*</span></label>
            <textarea 
              className="form-textarea"
              rows="3"
              placeholder="E.g., Focused on database normalization and setting up Supabase..."
              value={workDone}
              onChange={(e) => setWorkDone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">What I completed</label>
            <textarea 
              className="form-textarea"
              rows="2"
              placeholder="E.g., ERD diagram, SQL schema file."
              value={completedItems}
              onChange={(e) => setCompletedItems(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Problems / Blockers</label>
            <textarea 
              className="form-textarea"
              rows="2"
              placeholder="E.g., Having trouble with RLS policies."
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Next steps</label>
            <textarea 
              className="form-textarea"
              rows="2"
              placeholder="E.g., Will review documentation and test queries tomorrow."
              value={nextSteps}
              onChange={(e) => setNextSteps(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={isSubmitting || !workDone}>
            <Send size={16} /> {isSubmitting ? 'Saving Log...' : 'Submit Progress Log'}
          </button>
        </form>
      </div>

      {/* Log History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
          <History size={22} color="var(--text-muted)" />
          <h3 style={{ fontSize: '1.2rem' }}>Recent Log History</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {progressUpdates.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Layers size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h4 style={{ color: 'var(--text-secondary)' }}>No progress logs yet.</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Start tracking your daily work above.</p>
            </div>
          ) : (
            progressUpdates.map((update) => (
              <div key={update.id} className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {new Date(update.log_date || update.created_at).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(update.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>Worked On</div>
                    <div>{update.work_done}</div>
                  </div>
                  
                  {update.completed_items && (
                    <div>
                      <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
                        <CheckCircle2 size={12} /> Completed
                      </div>
                      <div>{update.completed_items}</div>
                    </div>
                  )}

                  {update.blockers && (
                    <div>
                      <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
                        <AlertTriangle size={12} /> Blockers
                      </div>
                      <div>{update.blockers}</div>
                    </div>
                  )}

                  {update.next_steps && (
                    <div>
                      <div style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase' }}>
                        <ArrowRight size={12} /> Next Steps
                      </div>
                      <div>{update.next_steps}</div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
