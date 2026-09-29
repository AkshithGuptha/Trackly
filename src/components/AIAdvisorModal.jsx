import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, CheckCircle2, Bot } from 'lucide-react';

export default function AIAdvisorModal({ onClose }) {
  const { assignments, projects, progressUpdates, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const runAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch((import.meta.env.VITE_AI_API_URL || 'https://trackly-ai.onrender.com') + '/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Analyze my current workload, completion risk, deadlines, project tasks, and progress logs. Give me the most important actions I should take next.',
          profile,
          assignments,
          projects,
          progressUpdates
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI assistant request failed.');
      setAnalysis({ answer: data.answer, generatedAt: new Date().toLocaleTimeString() });
    } catch (error) {
      setError(error.message || 'AI assistant is unavailable right now.');
    } finally {
      setLoading(false);
    }
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
          {error && !loading && (
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,0,34,0.08)', border: '1px solid rgba(255,0,34,0.25)', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              <strong>AI Assistant unavailable</strong>
              <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{error}</p>
              <button className="btn btn-secondary" onClick={runAnalysis} style={{ marginTop: '0.8rem', fontSize: '0.8rem' }}>Try Again</button>
            </div>
          )}

          {!analysis && !loading && !error && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <Sparkles size={42} color="var(--brand-primary)" style={{ marginBottom: '1rem' }} />
              <h4>Ask Trackly AI about your workload</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0' }}>
                The AI agent reads your current Trackly data and gives personalized guidance instead of using demo predictions.
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-elevated)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <Bot size={18} color="var(--brand-primary)" />
                  <strong>Trackly AI</strong>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: 1.7 }}>{analysis.answer}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Generated at {analysis.generatedAt}</span>
                <button className="btn btn-secondary" onClick={runAnalysis} style={{ fontSize: '0.8rem' }}>Re-Analyze</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
