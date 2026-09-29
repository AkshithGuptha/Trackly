import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, CheckCircle2, Bot } from 'lucide-react';

export default function AIAdvisorModal({ onClose }) {
  const { assignments, projects, progressUpdates, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      const now = Date.now();
      const activeAssignments = assignments.filter((a) => !['Completed'].includes(a.status));
      const completedAssignments = assignments.filter((a) => a.status === 'Completed');
      const assignmentProgress = assignments.length
        ? Math.round(assignments.reduce((sum, a) => sum + Number(a.progress_percentage || 0), 0) / assignments.length)
        : 0;
      const projectProgress = projects.length
        ? Math.round(projects.reduce((sum, p) => sum + Number(p.progress_percentage || 0), 0) / projects.length)
        : 0;
      const overallCompletion = assignments.length || projects.length
        ? Math.round(((assignmentProgress * (assignments.length ? 1 : 0)) + (projectProgress * (projects.length ? 1 : 0))) / ((assignments.length ? 1 : 0) + (projects.length ? 1 : 0)))
        : 0;

      const urgent = activeAssignments.filter((a) => {
        const due = new Date(a.due_date).getTime();
        const daysLeft = Math.ceil((due - now) / 86400000);
        return daysLeft <= 2 && Number(a.progress_percentage || 0) < 80;
      });

      const overdue = activeAssignments.filter((a) => new Date(a.due_date).getTime() < now);
      const remainingTasks = projects.reduce((sum, p) => sum + (p.tasks || []).filter((t) => !t.is_completed).length, 0);

      let riskLevel = 'Low';
      if (overdue.length > 0 || urgent.length >= 2) riskLevel = 'High';
      else if (urgent.length > 0 || remainingTasks >= 4) riskLevel = 'Medium';

      const predictedDelayDays = overdue.length
        ? Math.min(7, overdue.length + Math.ceil(remainingTasks / 4))
        : urgent.length
          ? Math.min(5, Math.ceil(urgent.length / 2))
          : 0;

      const recommendations = [];
      if (!assignments.length && !projects.length) {
        recommendations.push('No assignments or projects are loaded yet. Add work to Trackly and run the analysis again.');
      } else if (urgent.length) {
        urgent.slice(0, 3).forEach((a) => {
          const daysLeft = Math.ceil((new Date(a.due_date).getTime() - now) / 86400000);
          recommendations.push(`Prioritize "${a.title}" — ${Math.max(0, daysLeft)} day(s) left with ${Number(a.progress_percentage || 0)}% progress.`);
        });
      } else {
        recommendations.push(`Your current tracked work is averaging ${overallCompletion}% completion. Keep updating progress so the forecast stays accurate.`);
      }

      if (remainingTasks > 0) {
        recommendations.push(`${remainingTasks} project task(s) remain open. Finish the smallest blockers first to improve project velocity.`);
      }
      if (progressUpdates.length) {
        recommendations.push(`${progressUpdates.length} progress log(s) are available for trend analysis. Keep logging work and blockers daily.`);
      }
      if (completedAssignments.length) {
        recommendations.push(`${completedAssignments.length} assignment(s) are already completed — maintain that cadence on the remaining work.`);
      }
      if (!recommendations.length) recommendations.push('Everything is currently on track.');

      setAnalysis({
        riskLevel,
        overallCompletion,
        predictedDelayDays,
        recommendations,
        generatedAt: new Date().toLocaleTimeString()
      });
      setLoading(false);
    }, 700);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Bot size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem' }}>Trackly AI Assistant</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Context-aware progress analysis and completion guidance</p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!analysis && !loading && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Sparkles size={42} color="var(--brand-primary)" style={{ marginBottom: '1rem' }} />
              <h4>Run AI Health & Delay Risk Analysis</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                Analyze active assignments, sub-tasks, daily logs, and historical velocity to predict completion timelines.
              </p>
              <button className="btn btn-primary" onClick={runAnalysis}>
                <Sparkles size={16} /> Analyze Now
              </button>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div className="progress-fill" style={{ width: '100%', height: '4px', animation: 'pulse 1s infinite alternate' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
                Auditing progress logs & training delay prediction heuristics...
              </p>
            </div>
          )}

          {analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {/* Risk Summary Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                <div className="card" style={{ padding: '0.8rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RISK LEVEL</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: analysis.riskLevel === 'Low' ? 'var(--success)' : 'var(--warning)' }}>
                    {analysis.riskLevel}
                  </div>
                </div>

                <div className="card" style={{ padding: '0.8rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED DELAY</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: analysis.predictedDelayDays === 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {analysis.predictedDelayDays === 0 ? '0 Days (On Time)' : `+${analysis.predictedDelayDays} Days`}
                  </div>
                </div>

                <div className="card" style={{ padding: '0.8rem', textAlign: 'center', backgroundColor: 'var(--bg-elevated)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COMPLETION HEALTH</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    {analysis.overallCompletion}%
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem' }}>AI Recommendations & Insights</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {analysis.recommendations.map((rec, index) => (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        gap: '0.6rem',
                        alignItems: 'flex-start',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-elevated)',
                        fontSize: '0.83rem'
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Analyzed at {analysis.generatedAt}</span>
                <button className="btn btn-secondary" onClick={runAnalysis} style={{ fontSize: '0.8rem' }}>
                  Re-Analyze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
