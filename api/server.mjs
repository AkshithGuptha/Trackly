import http from 'node:http';
const PORT = Number(process.env.PORT || 10000);
const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
const ALLOWED_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://trackly-5j53.onrender.com';

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method === 'GET' && req.url === '/health') return send(res, 200, { ok: true, aiConfigured: hasOpenAI });
  if (req.method !== 'POST' || req.url !== '/api/ai-assistant') return send(res, 404, { error: 'Not found' });
  if (!hasOpenAI) return send(res, 503, { error: 'AI assistant is not configured on the server yet.' });

  try {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw || '{}');
    const { message = '', profile = {}, assignments = [], projects = [], progressUpdates = [] } = body;
    if (!String(message).trim()) return send(res, 400, { error: 'Message is required.' });

    const context = {
      student: { name: profile.full_name || 'Student', role: profile.role || 'student' },
      assignments: assignments.map(a => ({
        title: a.title, status: a.status, progress: a.progress_percentage, priority: a.priority, due_date: a.due_date
      })),
      projects: projects.map(p => ({
        title: p.title, status: p.status, progress: p.progress_percentage,
        tasks: (p.tasks || []).map(t => ({ title: t.title, completed: t.is_completed }))
      })),
      progressLogs: progressUpdates.slice(0, 20).map(p => ({
        date: p.log_date, work: p.work_done, blockers: p.blockers, hours: p.hours_spent
      }))
    };

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        instructions: [
          'You are Trackly AI Assistant, an academic productivity agent.',
          'Answer using the supplied Trackly context. Never invent assignments, grades, deadlines, progress, or activity.',
          'Give concise, practical guidance. If asked about completion risk, explain the evidence from the data.',
          'If the context does not contain enough information, say what is missing and ask a focused question.',
          'Do not claim to have performed actions you did not perform.',
          'Return plain text suitable for a student dashboard.'
        ].join(' '),
        input: JSON.stringify({ user_message: message, trackly_context: context })
      })
    });
    const response = await openaiResponse.json();
    if (!openaiResponse.ok) throw new Error(response?.error?.message || 'OpenAI request failed.');
    return send(res, 200, { answer: response.output_text || 'I could not generate a response.' });
  } catch (error) {
    console.error('AI assistant error:', error);
    return send(res, 500, { error: error?.message || 'AI assistant request failed.' });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log('Trackly AI service listening on ' + PORT));
