import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, DEFAULT_DEMO_STATE } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // App state stores
  const [assignments, setAssignments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [connectedStudents, setConnectedStudents] = useState([]);
  
  // NEW DYNAMIC STATES for Stream, Settings, and Grades
  const [streamPosts, setStreamPosts] = useState([
    {
      id: 1,
      author: 'System',
      role: 'Admin',
      content: 'Welcome to the Trackly Stream! This functions exactly like Google Classroom. You can post announcements, attach links, and students can comment below.',
      time: 'Just now',
      type: 'announcement'
    }
  ]);
  const [classSettings, setClassSettings] = useState({
    name: 'Advanced Computer Science 101',
    description: 'An advanced exploration into algorithmic thinking and system design.',
    section: 'Fall 2026',
    room: 'Virtual',
    subject: 'Computer Science',
    code: 'TRK-8X92P',
    streamPermission: 'all'
  });
  const [gradebook, setGradebook] = useState({}); // { 'studentId-assignmentId': score }
  
  const [themeMode, setThemeMode] = useState(localStorage.getItem('trackly_theme') || 'dark');

  // Initialize theme on root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    localStorage.setItem('trackly_theme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateProfile = async ({ full_name, avatarFile } = {}) => {
    if (!profile?.id) throw new Error('You must be signed in to update your profile.');
    let avatar_url = profile.avatar_url || null;
    if (avatarFile && isSupabaseConfigured) {
      const extension = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = profile.id + '/avatar-' + Date.now() + '.' + extension;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { contentType: avatarFile.type || 'image/jpeg', upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      avatar_url = data.publicUrl;
    } else if (avatarFile && !isSupabaseConfigured) {
      avatar_url = URL.createObjectURL(avatarFile);
    }
    const updates = {};
    if (typeof full_name === 'string' && full_name.trim()) updates.full_name = full_name.trim();
    if (avatar_url) updates.avatar_url = avatar_url;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', profile.id).select('*').single();
      if (error) throw error;
      setProfile(data);
      return data;
    }
    const nextProfile = { ...profile, ...updates };
    setProfile(nextProfile);
    return nextProfile;
  };

  // Load Auth state
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          clearUserData();
        }
      }

      setLoading(false);
    };

    initAuth();

    if (isSupabaseConfigured) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      });
      return () => authListener?.subscription.unsubscribe();
    }
  }, []);

  const loadDemoState = (role) => {
    const demoUser = role === 'teacher' ? DEFAULT_DEMO_STATE.teacher : DEFAULT_DEMO_STATE.student;
    setUser({ id: demoUser.id, email: demoUser.email });
    setProfile(demoUser);
    localStorage.setItem('trackly_demo_role', role);

    // Load sample data
    setAssignments(DEFAULT_DEMO_STATE.assignments);
    setProjects(DEFAULT_DEMO_STATE.projects);
    setSubmissions(DEFAULT_DEMO_STATE.submissions);
    setProgressUpdates(DEFAULT_DEMO_STATE.progress_updates);
    setNotifications(DEFAULT_DEMO_STATE.notifications);
    setConnectedStudents([DEFAULT_DEMO_STATE.student]);
  };

  const clearUserData = () => {
    setAssignments([]);
    setProjects([]);
    setSubmissions([]);
    setProgressUpdates([]);
    setNotifications([]);
    setConnectedStudents([]);
    setStreamPosts([]);
    setGradebook({});
  };

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setProfile(data);
        await loadUserData(data);
      } else {
        setProfile(null);
        clearUserData();
      }
    } catch (err) {
      console.warn('Supabase fetchProfile error:', err);
    }
  };

  const loadUserData = async (currentProfile) => {
    if (!isSupabaseConfigured) return;
    try {
      const role = currentProfile.role;
      const isStudent = role === 'student';

      const [asgRes, prjRes, subRes, progRes, notifRes] = await Promise.all([
        supabase.from('assignments').select('*').eq(isStudent ? 'student_id' : 'teacher_id', currentProfile.id),
        supabase.from('projects').select('*, project_tasks(*)').eq(isStudent ? 'student_id' : 'teacher_id', currentProfile.id),
        supabase.from('submissions').select('*').eq('student_id', currentProfile.id),
        supabase.from('progress_updates').select('*').eq('student_id', currentProfile.id),
        supabase.from('notifications').select('*').eq('user_id', currentProfile.id)
      ]);

      if (asgRes.data) setAssignments(asgRes.data);
      if (prjRes.data) setProjects(prjRes.data);
      if (subRes.data) setSubmissions(subRes.data);
      if (progRes.data) setProgressUpdates(progRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  };

  // Auth Operations
  const login = async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Demo authentication switch
      const role = email.includes('teacher') ? 'teacher' : 'student';
      loadDemoState(role);
      return { user: role === 'teacher' ? DEFAULT_DEMO_STATE.teacher : DEFAULT_DEMO_STATE.student };
    }
  };

  const signup = async ({ email, password, fullName, role }) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) throw error;
      return data;
    } else {
      const newProfile = {
        id: 'user-' + Date.now(),
        email,
        full_name: fullName,
        role: role,
        classroom_code: role === 'teacher' ? 'TRK-' + Math.random().toString(36).substring(2, 7).toUpperCase() : '',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
      };
      setUser({ id: newProfile.id, email: newProfile.email });
      setProfile(newProfile);
      localStorage.setItem('trackly_demo_role', role);
      return { user: newProfile };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  // Switching role helper for fast testing
  const switchDemoRole = (role) => {
    loadDemoState(role);
  };

  // Data Mutation Handlers
  const addAssignment = async (assignmentData) => {
    if (!profile?.id) throw new Error('You must be signed in to create assignments.');

    if (!isSupabaseConfigured) {
      const newAsg = {
        id: 'asg-' + Date.now(),
        created_at: new Date().toISOString(),
        status: 'Pending',
        progress_percentage: 0,
        ...assignmentData,
        teacher_id: profile.id
      };
      setAssignments((prev) => [newAsg, ...prev]);
      return newAsg;
    }

    if (!assignmentData.student_id) {
      throw new Error('Select a connected student before assigning the work.');
    }

    const payload = {
      title: assignmentData.title,
      description: assignmentData.description || null,
      teacher_id: profile.id,
      student_id: assignmentData.student_id,
      due_date: assignmentData.due_date,
      priority: assignmentData.priority || 'Medium',
      status: 'Pending',
      progress_percentage: 0
    };

    const { data, error } = await supabase.from('assignments').insert(payload).select('*').single();
    if (error) throw error;

    setAssignments((prev) => [data, ...prev]);
    await supabase.from('notifications').insert({
      user_id: payload.student_id,
      title: 'New Assignment Assigned',
      message: `You have been assigned: ${payload.title}`,
      type: 'assignment',
      is_read: false
    });

    return data;
  };

  const deleteAssignment = async (assignmentId) => {
    setAssignments((prev) => prev.filter(a => a.id !== assignmentId));
    
    // Cleanup any related gradebook entries
    setGradebook((prev) => {
      const newGrades = { ...prev };
      Object.keys(newGrades).forEach(key => {
        if (key.endsWith(`-${assignmentId}`)) {
          delete newGrades[key];
        }
      });
      return newGrades;
    });

    if (isSupabaseConfigured) {
      await supabase.from('assignments').delete().eq('id', assignmentId);
    }
  };

  const updateAssignmentProgress = async (assignmentId, progress, newStatus) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? {
              ...a,
              progress_percentage: progress,
              status: newStatus || (progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : a.status)
            }
          : a
      )
    );

    if (isSupabaseConfigured) {
      await supabase
        .from('assignments')
        .update({
          progress_percentage: progress,
          status: newStatus || (progress === 100 ? 'Completed' : 'In Progress')
        })
        .eq('id', assignmentId);
    }
  };

  const submitWork = async ({ assignment_id, project_id, comment, file_name, file_url }) => {
    const newSub = {
      id: 'sub-' + Date.now(),
      student_id: profile?.id || 's-202',
      assignment_id,
      project_id,
      comment,
      file_name: file_name || 'submission_file.pdf',
      file_url: file_url || '#',
      status: 'Submitted',
      submitted_at: new Date().toISOString()
    };
    setSubmissions((prev) => [newSub, ...prev]);

    // Update assignment status to Submitted
    if (assignment_id) {
      updateAssignmentProgress(assignment_id, 100, 'Submitted');
    }

    // Add teacher notification
    const teacherNotif = {
      id: 'notif-' + Date.now(),
      user_id: profile?.role === 'student' ? DEFAULT_DEMO_STATE.teacher.id : 't-101',
      title: 'Submission Received',
      message: `${profile?.full_name || 'Student'} submitted work for review.`,
      type: 'submission',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications((prev) => [teacherNotif, ...prev]);

    if (isSupabaseConfigured) {
      await supabase.from('submissions').insert([newSub]);
      await supabase.from('notifications').insert([teacherNotif]);
    }
  };

  const reviewSubmission = async (submissionId, newStatus, feedback) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: newStatus, teacher_feedback: feedback, reviewed_at: new Date().toISOString() }
          : s
      )
    );

    const sub = submissions.find((s) => s.id === submissionId);
    if (sub && sub.assignment_id) {
      if (newStatus === 'Approved') {
        updateAssignmentProgress(sub.assignment_id, 100, 'Completed');
      } else if (newStatus === 'Needs Changes') {
        updateAssignmentProgress(sub.assignment_id, 75, 'In Progress');
      }
    }

    // Add student notification
    if (sub) {
      const studentNotif = {
        id: 'notif-' + Date.now(),
        user_id: sub.student_id,
        title: `Submission ${newStatus}`,
        message: `Teacher updated your submission status to ${newStatus}. Feedback: "${feedback}"`,
        type: 'feedback',
        is_read: false,
        created_at: new Date().toISOString()
      };
      setNotifications((prev) => [studentNotif, ...prev]);
    }

    if (isSupabaseConfigured) {
      await supabase
        .from('submissions')
        .update({ status: newStatus, teacher_feedback: feedback, reviewed_at: new Date().toISOString() })
        .eq('id', submissionId);
    }
  };

  const addProgressUpdate = async (logData) => {
    const newLog = {
      id: 'pu-' + Date.now(),
      student_id: profile?.id || 's-202',
      log_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      ...logData
    };
    setProgressUpdates((prev) => [newLog, ...prev]);

    if (isSupabaseConfigured) {
      await supabase.from('progress_updates').insert([newLog]);
    }
  };

  const toggleProjectTask = async (projectId, taskId) => {
    const project = projects.find((p) => p.id === projectId);
    const task = project?.tasks?.find((t) => t.id === taskId);
    if (!project || !task) return;

    const nextCompleted = !task.is_completed;
    const updatedTasks = (project.tasks || []).map((t) =>
      t.id === taskId ? { ...t, is_completed: nextCompleted } : t
    );
    const completedCount = updatedTasks.filter((t) => t.is_completed).length;
    const calcProgress = updatedTasks.length
      ? Math.round((completedCount / updatedTasks.length) * 100)
      : 0;

    if (isSupabaseConfigured) {
      const { error: taskError } = await supabase
        .from('project_tasks')
        .update({ is_completed: nextCompleted })
        .eq('id', taskId)
        .eq('project_id', projectId);
      if (taskError) throw taskError;

      const { error: projectError } = await supabase
        .from('projects')
        .update({
          progress_percentage: calcProgress,
          status: calcProgress === 100 ? 'Completed' : 'In Progress'
        })
        .eq('id', projectId);
      if (projectError) throw projectError;
    }

    setProjects((prev) => prev.map((p) =>
      p.id === projectId
        ? { ...p, tasks: updatedTasks, progress_percentage: calcProgress, status: calcProgress === 100 ? 'Completed' : 'In Progress' }
        : p
    ));
  };

  const markNotificationRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    if (isSupabaseConfigured && profile?.id) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('user_id', profile.id);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    if (isSupabaseConfigured && profile?.id) {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        themeMode,
        toggleTheme,
        updateProfile,
        login,
        signup,
        logout,
        switchDemoRole,
        assignments,
        projects,
        submissions,
        progressUpdates,
        notifications,
        connectedStudents,
        setConnectedStudents,
        addAssignment,
        deleteAssignment,
        updateAssignmentProgress,
        submitWork,
        reviewSubmission,
        addProgressUpdate,
        toggleProjectTask,
        markNotificationRead,
        markAllNotificationsRead,
        streamPosts,
        setStreamPosts,
        classSettings,
        setClassSettings,
        gradebook,
        setGradebook
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
