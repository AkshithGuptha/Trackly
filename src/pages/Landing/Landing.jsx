import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, BookOpen, Layers, CheckCircle2, TrendingUp, Sparkles, LayoutDashboard, BrainCircuit, Users } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import './Landing.css';

// --- PREMIUM CUSTOM CURSOR ---
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setIsHovering(true);
        setCursorText(target.getAttribute('data-cursor') || '');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      animate={{ x: mousePosition.x - (isHovering ? 40 : 8), y: mousePosition.y - (isHovering ? 40 : 8) }}
      transition={{ type: 'tween', ease: 'linear', duration: 0 }}
    >
      <span className="cursor-text">{cursorText}</span>
    </motion.div>
  );
};

// --- MAGNETIC BUTTON INTERACTION ---
const MagneticButton = ({ children, className, onClick, cursorText = "ENTER" }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      onClick={onClick}
      data-cursor={cursorText}
    >
      {children}
    </motion.button>
  );
};

// --- RED/BLACK FIERY BACKGROUND TYPOGRAPHY ---
const HeroBackground = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '80%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  
  // Interactive Parallax based on mouse
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 40;
      const y = (e.clientY / window.innerHeight - 0.5) * 40;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="hero-massive-bg-wrapper">
      <motion.div style={{ y, opacity }}>
        <motion.div
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="hero-massive-text"
        >
          TRACKLY
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- PREMIUM SAAS UI FRAGMENTS ---
const UIHeader = () => (
  <div className="ui-header-glass">
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <div className="ui-avatar">SJ</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>Sarah Jenkins</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--midu-muted)' }}>Instructor Portal</div>
      </div>
    </div>
    <div className="ui-badge-glass">TRK-8X92P</div>
  </div>
);

const UIStatCard = ({ title, value, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="ui-stat-glass"
  >
    <div style={{ fontSize: '0.7rem', color: 'var(--midu-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>{title}</div>
    <div style={{ fontSize: '1.8rem', fontWeight: 700, color, marginTop: '0.3rem' }}>{value}</div>
  </motion.div>
);

const UITaskList = () => (
  <div className="ui-task-list">
    {[
      { title: 'Neural Networks Final', status: 'Grading', color: '#ff0022', width: '60%' },
      { title: 'Data Structures Quiz', status: 'Active', color: '#10b981', width: '85%' },
      { title: 'React Architecture', status: 'Draft', color: '#ff7d4e', width: '20%' }
    ].map((task, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 + (i * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="ui-task-item"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#fff' }}>{task.title}</span>
          <span style={{ fontSize: '0.75rem', color: task.color }}>{task.status}</span>
        </div>
        <div className="ui-progress-track">
          <div className="ui-progress-fill" style={{ width: task.width, backgroundColor: task.color, boxShadow: `0 0 10px ${task.color}80` }}></div>
        </div>
      </motion.div>
    ))}
  </div>
);

// --- GLOWING BENTO CARD ---
const GlowCard = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={cardRef} className={`glow-card ${className}`} onMouseMove={handleMouseMove}>
      <div 
        className="glow-effect" 
        style={{ background: `radial-gradient(circle 500px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 34, 0.12), transparent 50%)` }}
      />
      <div className="glow-content">{children}</div>
    </div>
  );
};

// --- MAIN LANDING PAGE ---
export default function Landing({ onGetStarted }) {
  
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY1 = useTransform(heroProgress, [0, 1], ['0%', '40%']);
  const heroY2 = useTransform(heroProgress, [0, 1], ['0%', '-20%']);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const showcaseRef = useRef(null);
  const { scrollYProgress: showProgress } = useScroll({ target: showcaseRef, offset: ["start end", "end start"] });
  const floatingY1 = useTransform(showProgress, [0, 1], ['20%', '-20%']);
  const floatingY2 = useTransform(showProgress, [0, 1], ['40%', '-40%']);

  // --- FAQ LOGIC ---
  const FAQItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="faq-item" onClick={() => setIsOpen(!isOpen)} data-cursor="CLICK">
        <div className="faq-q">{q} <span className={`faq-icon ${isOpen ? 'open' : ''}`}>+</span></div>
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }} className="faq-a">
          <p>{a}</p>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="landing-container">
      <CustomCursor />

      {/* NAVBAR */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo">
          <div className="nav-logo-icon">T</div>
          Trackly
        </div>
        <div className="nav-links">
          <span className="nav-link" data-cursor="EXPLORE">Features</span>
          <span className="nav-link" data-cursor="EXPLORE">For Teachers</span>
          <span className="nav-link" data-cursor="EXPLORE">For Students</span>
        </div>
        <MagneticButton className="nav-btn" onClick={onGetStarted}>
          Access Portal
        </MagneticButton>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="hero-section">
        <HeroBackground />
        
        <div className="hero-content-layer">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="hero-badge">
            <span className="dot"></span> Trackly SaaS Public Beta
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hero-title"
          >
            Track workflow. <br/>
            <span className="serif">Elevate education.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hero-desc"
          >
            The beautifully engineered workspace for high-performing classrooms. Manage assignments, track project phases, and provide feedback with unprecedented clarity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hero-actions"
          >
            <MagneticButton className="hero-btn-primary" onClick={onGetStarted} cursorText="START">
              Enter Workspace <ArrowRight size={16} />
            </MagneticButton>
          </motion.div>
        </div>

        {/* HERO DYNAMIC UI COMPOSITION */}
        <motion.div style={{ y: heroY1, scale: heroScale, opacity: heroOpacity }} className="hero-ui-composition">
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="hero-panel-main">
            <UIHeader />
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <UIStatCard title="ACTIVE" value="3" color="#fff" delay={0.7} />
                <UIStatCard title="PENDING" value="12" color="#ff0022" delay={0.8} />
                <UIStatCard title="STUDENTS" value="45" color="#ff7d4e" delay={0.9} />
              </div>
              <UITaskList />
            </div>
          </motion.div>

          <motion.div style={{ y: heroY2 }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 1, ease: [0.16, 1, 0.3, 1] }} className="hero-panel-floating" data-cursor="DRAG">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <Sparkles size={16} color="#ff0022" />
              <span style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}>AI Predictor</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--midu-muted)', lineHeight: 1.5 }}>Alex is struggling with the current phase. Consider reaching out to provide guidance.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE SECTION */}
      <div className="marquee-wrapper" data-cursor="DRAG">
        <motion.div className="marquee-track" animate={{ x: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 25, repeat: Infinity }}>
          <div className="marquee-content">
            <span>REAL-TIME TRACKING</span><span className="dot">•</span>
            <span>MULTI-PHASE PROJECTS</span><span className="dot">•</span>
            <span>AI PROGRESS PREDICTOR</span><span className="dot">•</span>
            <span>SEAMLESS GRADING</span><span className="dot">•</span>
            <span>WORKFLOW AUTOMATION</span><span className="dot">•</span>
            <span>REAL-TIME TRACKING</span><span className="dot">•</span>
            <span>MULTI-PHASE PROJECTS</span><span className="dot">•</span>
            <span>AI PROGRESS PREDICTOR</span><span className="dot">•</span>
            <span>SEAMLESS GRADING</span><span className="dot">•</span>
            <span>WORKFLOW AUTOMATION</span><span className="dot">•</span>
          </div>
        </motion.div>
      </div>

      {/* FLOATING SHOWCASE GRID */}
      <section ref={showcaseRef} className="showcase-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-header center">
          <div className="section-tag">Design System</div>
          <h2 className="section-title">Built for speed. <br/> Designed for focus.</h2>
        </motion.div>

        <div className="showcase-grid">
          <motion.div style={{ y: floatingY1 }} className="showcase-col">
            <GlowCard className="showcase-card">
              <div className="feature-icon"><LayoutDashboard size={20} /></div>
              <h3 className="feature-title">Intuitive Dashboards</h3>
              <p className="feature-desc">Everything you need to see, instantly available. No clutter, just pure workflow.</p>
              <div className="showcase-visual mockup-1"></div>
            </GlowCard>
            <GlowCard className="showcase-card">
              <div className="feature-icon"><CheckCircle2 size={20} /></div>
              <h3 className="feature-title">Seamless Grading</h3>
              <p className="feature-desc">Review submissions and provide rich feedback without ever leaving the platform.</p>
            </GlowCard>
          </motion.div>

          <motion.div style={{ y: floatingY2 }} className="showcase-col mt-large">
            <GlowCard className="showcase-card">
              <div className="feature-icon"><Layers size={20} /></div>
              <h3 className="feature-title">Multi-Phase Tracking</h3>
              <p className="feature-desc">Break down complex projects into manageable phases with independent timelines.</p>
            </GlowCard>
            <GlowCard className="showcase-card">
              <div className="feature-icon"><BrainCircuit size={20} /></div>
              <h3 className="feature-title">AI Powered Insights</h3>
              <p className="feature-desc">Trackly predicts student success rates based on submission velocity and engagement.</p>
              <div className="showcase-visual mockup-2"></div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="testimonial-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <div className="quote-text">
            "Trackly completely transformed how our computer science department handles final projects. We now have unparalleled visibility into student progress."
          </div>
          <div className="quote-author">Dr. Emily Chen — <span>Stanford University</span></div>
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="section-header center" style={{ marginBottom: '4rem' }}>
          <h2 className="section-title">Common questions</h2>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <FAQItem q="Can I import my existing classroom roster?" a="Yes! Trackly integrates directly with Google Classroom and Canvas, allowing you to sync your entire roster with a single click." />
          <FAQItem q="How does the AI Predictor work?" a="The AI Predictor analyzes metadata like submission timestamps, frequency of revision, and peer comparison to identify students who may be quietly struggling." />
          <FAQItem q="Is it suitable for non-coding assignments?" a="Absolutely. While Trackly is loved by CS departments, its multi-phase tracking is perfect for long-form essays, research papers, and design portfolios." />
          <FAQItem q="Do students need to pay?" a="No. Trackly is completely free for students. Institutions or individual instructors handle the subscription." />
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="midu-footer">
        <motion.h2 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="footer-cta-text" data-cursor="START" onClick={onGetStarted}
        >
          Let's track<br/>together.
        </motion.h2>
        
        <div className="footer-bottom">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="nav-logo-icon" style={{ width: 20, height: 20, fontSize: '0.7rem' }}>T</div>
            Trackly © 2026
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span className="footer-link">Product</span>
            <span className="footer-link">Manifesto</span>
            <span className="footer-link">Login</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
