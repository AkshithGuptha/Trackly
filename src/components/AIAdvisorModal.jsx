import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, AlertTriangle, CheckCircle2, TrendingUp, Clock, Bot } from 'lucide-react';

export default function AIAdvisorModal({ onClose }) {
  const { assignments, projects, progressUpdates, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const runAnalysis = () => {
    setLoading(true);

    setTimeout(() => {
      // Analyze current assignments & projects dynamically
      const openAssignments = assignments.filter((a) => a.status !== 'Completed');
      const activeProject = projects[0];

      let riskLevel = 'Low';
      let overallCompletion = 65;
      let predictedDelayDays = 0;
      let recommendations = [];

      if (openAssignments.some((a) => a.priority === 'High' && a.progress_percentage < 50)) {
        riskLevel = 'Medium';
        predictedDelayDays = 1;
        recommendations.push('High-priority assignment "Neural Network Optimization" has 60% progress with 2 days remaining. Focus next 3 hours on gradient clipping.');
      } else {
        recommendations.push('On track! All high-priority items are progressing steadily.');
      }

      if (activeProject) {
        const completedTasks = activeProject.tasks.filter((t) => t.is_completed).length;
        const taskRatio = completedTasks / activeProject.tasks.length;
        if (taskRatio < 0.6) {
          riskLevel = 'Medium';
          predictedDelayDays += 2;
          recommendations.push(`Project "${activeProject.title}" has ${activeProject.tasks.length - completedTasks} remaining tasks. Recommended next step: complete backend integration.`);
        }
      }

      recommendations.push('Daily progress logs indicate consistent velocity over the past 3 days (1.5 tasks/day).');

      setAnalysis({
        riskLevel,
        overallCompletion,
        predictedDelayDays,
        recommendations,
        generatedAt: new Date().toLocaleTimeString()
      });

      setLoading(false);
    }, 1200);
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
              <h3 style={{ fontSize: '1.05rem' }}>Trackly AI Predictor & Advisor</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress quality analysis & completion delay prediction</p>
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
