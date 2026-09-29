import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Landing from './pages/Landing/Landing';

// Student Views
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentAssignments from './pages/Student/StudentAssignments';
import StudentProjects from './pages/Student/StudentProjects';
import StudentProgressLog from './pages/Student/StudentProgressLog';
import StudentSettings from './pages/Student/StudentSettings';
import StudentStudy from './pages/Student/StudentStudy';
import StudentPeople from './pages/Student/StudentPeople';

// Teacher Views
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import TeacherStudents from './pages/Teacher/TeacherStudents';
import TeacherAssignments from './pages/Teacher/TeacherAssignments';
import TeacherSubmissions from './pages/Teacher/TeacherSubmissions';
import TeacherSettings from './pages/Teacher/TeacherSettings';
import TeacherGrades from './pages/Teacher/TeacherGrades';

// Inner App Container for authenticated users
function AppContainer() {
  const { user, profile } = useAuth();
  const [currentView, setCurrentView] = useState('stream');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isTeacher = profile?.role === 'teacher';

  const renderView = () => {
    switch (currentView) {
      case 'stream':
        return isTeacher ? <TeacherDashboard setCurrentView={setCurrentView} /> : <StudentDashboard setCurrentView={setCurrentView} />;
      case 'classwork':
        return isTeacher ? <TeacherAssignments /> : <StudentAssignments />;
      case 'people':
        return isTeacher ? <TeacherStudents /> : <StudentPeople />;
      case 'grades':
        return isTeacher ? <TeacherGrades /> : <StudentProgressLog />;
      case 'progress':
        return <StudentProgressLog />;
      case 'study':
        return <StudentStudy />;
      case 'settings':
      case 'profile':
        return isTeacher ? <TeacherSettings /> : <StudentSettings />;
      default:
        return isTeacher ? <TeacherDashboard setCurrentView={setCurrentView} /> : <StudentDashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="main-content">
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        
        <div className="page-body">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

// Router Logic
function AppRoutes() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Initializing Trackly...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing onGetStarted={() => user ? navigate('/dashboard') : navigate('/login')} />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login onSwitchToSignup={() => navigate('/signup')} />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup onSwitchToLogin={() => navigate('/login')} />} />
      <Route path="/dashboard/*" element={<AppContainer />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
