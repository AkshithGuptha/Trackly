import React, { useState, useRef, useEffect } from 'react';
import { Search, PlayCircle, BookOpen, HelpCircle, Sparkles, Loader, Send, MessageSquare } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function StudentStudy() {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  
  // Gemini API Key from .env
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Chat State
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatScrollRef = useRef(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isChatting]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim()) return;

    const newQuestion = { id: Date.now(), role: 'user', content: currentQuestion };
    setChatHistory(prev => [...prev, newQuestion]);
    setCurrentQuestion('');
    setIsChatting(true);

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are a helpful AI tutor explaining the topic "${topic}". A student asks: "${newQuestion.content}". Answer concisely, directly, and naturally. Keep it under 4 sentences if possible.`;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        setChatHistory(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: responseText }]);
      } catch (err) {
        setChatHistory(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: `[API Error]: ${err.message}` }]);
      }
      setIsChatting(false);
    } else {
      // Simulate AI Response if no key
      setTimeout(() => {
        const qLower = newQuestion.content.toLowerCase();
        let answerText = `[Demo Mode] Please enter a Gemini API Key below to enable real AI. In the context of ${topic}, this heavily relies on best practices. Always ensure you are following the core documentation and avoiding memory leaks!`;
        
        if (qLower.includes('why')) {
          answerText = `[Demo Mode] That's a great question about ${topic}. The main reason is efficiency and modularity. By decoupling the architecture, we avoid cascading failures and ensure the system scales horizontally without bottlenecks.`;
        } else if (qLower.includes('how')) {
          answerText = `[Demo Mode] To implement that in ${topic}, you typically start by initializing the core dependencies, mapping out your state tree, and then using isolated functions to interact with the API layer asynchronously.`;
        } else if (qLower.includes('what')) {
          answerText = `[Demo Mode] Essentially, in ${topic}, it acts as a structural pattern that helps developers build scalable, high-performance systems with predictable state mutations and strict data flow.`;
        } else if (qLower.includes('example')) {
          answerText = `[Demo Mode] Sure! Imagine a real-world scenario with ${topic} where you have thousands of concurrent users. Instead of blocking the main thread, it batches updates into a queue, processing them sequentially to guarantee O(1) time complexity.`;
        }

        const aiResponse = { id: Date.now() + 1, role: 'ai', content: answerText };
        setChatHistory(prev => [...prev, aiResponse]);
        setIsChatting(false);
      }, 1500);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setIsSearching(true);
    setResults(null);
    
    // Simulate AI Generation Delay
    setTimeout(() => {
      setResults({
        topic: topic,
        video: {
          title: `${topic} Masterclass - Complete Guide`,
          views: '1.2M Views',
          likes: '45K Likes',
          duration: '18:45',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600'
        },
        notes: [
          {
            title: `Introduction & Fundamentals of ${topic}`,
            content: `The conceptual foundation of ${topic} is built upon decades of continuous refinement in structural modeling and analytical problem-solving. At its core, it represents a paradigm shift in how we approach scalability, modularity, and high-performance computing. Before diving into advanced mechanisms, it is critical to understand that ${topic} does not exist in isolation—it heavily relies on deterministic logic, memory management optimization, and asynchronous processing architectures. By isolating discrete variables and reducing tight coupling, systems designed around this principle can achieve theoretical efficiencies approaching O(1) in ideal scenarios.`
          },
          {
            title: "Advanced Architectural Patterns",
            content: `When scaling ${topic} across distributed environments, standard procedural approaches fall apart. Enterprise-grade implementations utilize the 'Observer Pattern' and 'Event-Driven Microservices' to decouple the rendering lifecycle from the data-fetching layer. This allows for horizontal scaling across cloud infrastructures. Furthermore, immutable data structures are frequently paired with ${topic} to eliminate side effects during concurrent thread execution, essentially guaranteeing predictable states across millions of rapid transactions.`
          },
          {
            title: "Performance Optimization Strategies",
            content: `One of the most complex aspects of mastering ${topic} is identifying bottlenecks. Memory leaks, unbounded array traversals, and redundant computational cycles can cripple system performance. Advanced developers mitigate this through aggressive memoization, lazy loading, and garbage collection tuning. Profiling tools should be used to trace the execution stack. A golden rule when optimizing ${topic}: "Never calculate on the main thread what can be deferred to a background worker."`
          },
          {
            title: "Common Pitfalls & Anti-Patterns",
            content: `A significant portion of bugs related to ${topic} stem from fundamental misunderstandings of its event loop and lifecycle constraints. Avoid 'God Objects'—massive, monolithic configurations that attempt to control every aspect of the state. Instead, enforce the Single Responsibility Principle. Additionally, blindly applying ${topic} to every problem is an anti-pattern. If a system requires simple, linear synchronous execution, the overhead introduced by ${topic}'s complexity will actually degrade performance.`
          },
          {
            title: "Real-World Application & Future Scope",
            content: `In the modern tech ecosystem, ${topic} is actively utilized in high-frequency trading platforms, massive multiplayer servers, and real-time biometric analytics. As hardware constraints shrink, the theoretical limits of ${topic} continue to expand. Future iterations will likely integrate natively with WebAssembly and Rust to provide near-native execution speeds directly within sandboxed virtual environments, paving the way for the next generation of seamless web architectures.`
          }
        ],
        quiz: [
          { q: `What is the primary function of ${topic}?`, a: "To optimize system efficiency." },
          { q: "Which design pattern is most commonly associated with it?", a: "The Observer Pattern." }
        ]
      });
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto', width: '100%', paddingBottom: '3rem' }}>
      
      {/* Header & Search */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,0,34,0.1)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', marginBottom: '1.5rem', border: '1px solid rgba(255,0,34,0.2)' }}>
          <Sparkles size={16} /> Trackly AI Tutor
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          What do you want to learn?
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
          Search for any concept. Our AI will instantly curate the best video tutorial, generate summary notes, and build a quiz to test your knowledge.
        </p>

        <form onSubmit={handleSearch} style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="e.g., React Hooks, Thermodynamics, Machine Learning..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
              width: '100%',
              padding: '1.2rem 2rem 1.2rem 3.5rem',
              fontSize: '1.2rem',
              background: 'var(--bg-elevated)',
              border: '2px solid var(--border-color)',
              borderRadius: '50px',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
          <Search size={24} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', borderRadius: '50px', padding: '0.8rem 2rem' }}
            disabled={isSearching}
          >
            {isSearching ? <Loader size={20} className="spin" /> : 'Generate'}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--brand-primary)' }}>
          <Sparkles size={48} style={{ margin: '0 auto 1rem', animation: 'pulse 2s infinite' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Analyzing knowledge base...</h3>
          <p style={{ color: 'var(--text-muted)' }}>Curating the perfect study materials for "{topic}"</p>
        </div>
      )}

      {/* AI Generated Results */}
      {results && !isSearching && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
          
          {/* Top Video Suggestion */}
          <div className="card" style={{ gridColumn: '1 / -1', display: 'flex', gap: '2rem', padding: '1.5rem' }}>
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(results.video.title)}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative', width: '300px', height: '180px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={results.video.thumbnail} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayCircle size={64} color="#fff" style={{ opacity: 0.8, cursor: 'pointer', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{results.video.duration}</span>
            </a>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Sparkles size={14} /> AI Top Recommendation
              </div>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(results.video.title)}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <h3 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1rem', fontWeight: 700, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = '#fff'}>{results.video.title}</h3>
              </a>
              <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>⭐ {results.video.views}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>👍 {results.video.likes}</span>
              </div>
            </div>
          </div>

          {/* AI Notes */}
          <div className="card" style={{ padding: '2.5rem', maxHeight: '600px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <BookOpen size={28} color="var(--brand-primary)" /> Comprehensive Study Guide
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {results.notes.map((section, idx) => (
                <div key={idx}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--brand-primary)', marginBottom: '0.8rem', fontWeight: 600 }}>
                    {idx + 1}. {section.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', textAlign: 'justify' }}>
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Quiz */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <HelpCircle size={24} color="var(--brand-primary)" /> Knowledge Check
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {results.quiz.map((q, idx) => (
                <div key={idx} style={{ background: 'var(--bg-elevated)', padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '0.8rem' }}>Q: {q.q}</div>
                  <div style={{ color: 'var(--brand-primary)', fontSize: '0.95rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <Sparkles size={16} style={{ marginTop: '3px', flexShrink: 0 }} /> {q.a}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Assistant */}
          <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <MessageSquare size={24} color="var(--brand-primary)" /> Ask Follow-Up Questions
            </h3>
            
            <div 
              ref={chatScrollRef}
              style={{ 
                flex: 1, 
                minHeight: '200px', 
                maxHeight: '400px', 
                overflowY: 'auto', 
                background: 'rgba(0,0,0,0.2)', 
                borderRadius: '12px', 
                padding: '1.5rem', 
                marginBottom: '1.5rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {chatHistory.length === 0 ? (
                <div style={{ margin: 'auto', color: 'var(--text-muted)', textAlign: 'center' }}>
                  <Sparkles size={32} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                  <p>Ask anything about {results.topic}. I'm here to help clarify!</p>
                </div>
              ) : (
                chatHistory.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{ 
                      background: msg.role === 'user' ? 'var(--brand-primary)' : 'var(--bg-elevated)', 
                      padding: '1rem', 
                      borderRadius: '12px',
                      borderBottomRightRadius: msg.role === 'user' ? '2px' : '12px',
                      borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px',
                      color: '#fff',
                      border: msg.role === 'ai' ? '1px solid var(--border-color)' : 'none'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isChatting && (
                <div style={{ alignSelf: 'flex-start', background: 'var(--bg-elevated)', padding: '1rem', borderRadius: '12px', color: 'var(--text-muted)' }}>
                  <Loader size={16} className="spin" />
                </div>
              )}
            </div>

            <form onSubmit={handleAskQuestion} style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                placeholder="Ask a question..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  fontSize: '1rem',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '50px',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ borderRadius: '50px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                disabled={!currentQuestion.trim() || isChatting}
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
