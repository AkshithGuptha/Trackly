import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Download, MessageSquare, CheckCircle, AlertTriangle, FileText, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeacherSubmissions() {
  const { submissions, assignments, connectedStudents, reviewSubmission } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingSubmissions = submissions.filter(s => s.status === 'Submitted' || s.status === 'Under Review');
  const reviewedSubmissions = submissions.filter(s => s.status === 'Approved' || s.status === 'Needs Changes');

  const getStudentName = (id) => connectedStudents.find(s => s.id === id)?.full_name || 'Unknown Student';
  const getAssignmentTitle = (id) => assignments.find(a => a.id === id)?.title || 'Unknown Assignment';

  const openReviewModal = (sub) => {
    setSelectedSubmission(sub);
    setFeedback(sub.teacher_feedback || '');
    setReviewStatus('Approved');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(async () => {
      await reviewSubmission(selectedSubmission.id, reviewStatus, feedback);
      
      if (reviewStatus === 'Approved') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setIsSubmitting(false);
      setSelectedSubmission(null);
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Submission Review</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Review student work, provide feedback, and update completion status.</p>
      </div>

      {/* Pending Reviews */}
      <div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={20} color="var(--warning)" /> Needs Review ({pendingSubmissions.length})
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingSubmissions.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p>Inbox zero! No pending submissions to review.</p>
            </div>
          ) : (
            pendingSubmissions.map(sub => (
              <div key={sub.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--warning)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{getAssignmentTitle(sub.assignment_id)}</h4>
                    <span className="badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>{sub.status}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                    <strong>Student:</strong> {getStudentName(sub.student_id)}
                  </p>
                  
                  {sub.comment && (
                    <div style={{ backgroundColor: 'var(--bg-primary)', padding: '0.6rem 0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '2px solid var(--border-color)', marginBottom: '0.8rem' }}>
                      "{sub.comment}"
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={14} /> Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                    </div>
                    {sub.file_name && (
                      <a href={sub.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 600 }}>
                        <FileText size={14} /> {sub.file_name}
                      </a>
                    )}
                  </div>
                </div>

                <button className="btn btn-primary" onClick={() => openReviewModal(sub)}>
                  Review Work
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Previously Reviewed */}
      {reviewedSubmissions.length > 0 && (
        <div style={{ marginTop: '1rem', opacity: 0.85 }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <History size={18} /> Recently Reviewed
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {reviewedSubmissions.slice(0, 5).map(sub => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getAssignmentTitle(sub.assignment_id)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Student: {getStudentName(sub.student_id)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {sub.status === 'Approved' ? (
                    <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}><CheckCircle size={12} style={{ marginRight: '4px' }} /> Approved</span>
                  ) : (
                    <span className="badge" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}><AlertTriangle size={12} style={{ marginRight: '4px' }} /> Needs Changes</span>
                  )}
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => openReviewModal(sub)}>Edit Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setSelectedSubmission(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '0.2rem' }}>Review Submission</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {getAssignmentTitle(selectedSubmission.assignment_id)} • {getStudentName(selectedSubmission.student_id)}
                </p>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => setSelectedSubmission(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Student Comment</div>
              <div style={{ fontSize: '0.9rem' }}>{selectedSubmission.comment || 'No comment provided.'}</div>
              
              {selectedSubmission.file_name && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <a href={selectedSubmission.file_url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ display: 'inline-flex', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                    <Download size={14} /> Download Attached File ({selectedSubmission.file_name})
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Review Decision <span style={{ color: 'var(--danger)' }}>*</span></label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className={`btn ${reviewStatus === 'Approved' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, backgroundColor: reviewStatus === 'Approved' ? 'var(--success)' : '' }}
                    onClick={() => setReviewStatus('Approved')}
                  >
                    <CheckCircle size={16} /> Approve (100%)
                  </button>
                  <button 
                    type="button" 
                    className={`btn ${reviewStatus === 'Needs Changes' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, backgroundColor: reviewStatus === 'Needs Changes' ? 'var(--danger)' : '' }}
                    onClick={() => setReviewStatus('Needs Changes')}
                  >
                    <AlertTriangle size={16} /> Needs Changes
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Teacher Feedback</label>
                <textarea 
                  className="form-textarea"
                  rows="4"
                  placeholder="Provide constructive feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required={reviewStatus === 'Needs Changes'}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setSelectedSubmission(null)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving Review...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
