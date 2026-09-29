import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-supabase.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder-supabase.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Seed Initial State for Local Demo Fallback when Supabase env is not yet connected
export const DEFAULT_DEMO_STATE = {
  teacher: {
    id: 't-101',
    full_name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'teacher',
    classroom_code: 'TRK-8X92P',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
  },
  student: {
    id: 's-202',
    full_name: 'Alex Rivera',
    email: 'alex.rivera@student.edu',
    role: 'student',
    classroom_code: 'TRK-8X92P',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  assignments: [
    {
      id: 'asg-1',
      title: 'Neural Network Optimization & Loss Analysis',
      description: 'Implement Cross-Entropy Loss from scratch in PyTorch and write a 2-page synthesis report on hyperparameter tuning.',
      teacher_id: 't-101',
      student_id: 's-202',
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
      priority: 'High',
      status: 'In Progress',
      progress_percentage: 60,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    },
    {
      id: 'asg-2',
      title: 'Database Normalization & ERD Design',
      description: 'Convert raw invoice data into 3NF relational tables with explicit primary and foreign key constraints.',
      teacher_id: 't-101',
      student_id: 's-202',
      due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
      priority: 'Medium',
      status: 'Pending',
      progress_percentage: 25,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'asg-3',
      title: 'REST API Authentication & JWT Middleware',
      description: 'Build bearer token authentication with refresh tokens and RBAC middleware.',
      teacher_id: 't-101',
      student_id: 's-202',
      due_date: new Date(Date.now() - 86400000 * 1).toISOString(), // Yesterday
      priority: 'High',
      status: 'Submitted',
      progress_percentage: 100,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'AI Attendance System with Real-Time Recognition',
      description: 'Full-stack computer vision application featuring mobile check-ins, webcam detection, and Supabase analytics dashboard.',
      teacher_id: 't-101',
      student_id: 's-202',
      start_date: new Date(Date.now() - 86400000 * 10).toISOString(),
      deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
      status: 'In Progress',
      progress_percentage: 65,
      tasks: [
        { id: 't1', title: 'Dataset collection & annotation', is_completed: true },
        { id: 't2', title: 'Data preprocessing & augmentation pipeline', is_completed: true },
        { id: 't3', title: 'Model fine-tuning with MobileNetV3', is_completed: true },
        { id: 't4', title: 'Supabase Realtime backend integration', is_completed: false },
        { id: 't5', title: 'Flutter web client UI implementation', is_completed: false },
        { id: 't6', title: 'Unit testing & technical documentation', is_completed: false }
      ]
    }
  ],
  submissions: [
    {
      id: 'sub-1',
      student_id: 's-202',
      assignment_id: 'asg-3',
      comment: 'Submitted complete JWT authentication code with unit tests and Postman collection collection.json',
      file_name: 'trackly_auth_submission.zip',
      file_url: 'https://example.com/files/trackly_auth_submission.zip',
      status: 'Submitted',
      teacher_feedback: '',
      submitted_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  progress_updates: [
    {
      id: 'pu-1',
      student_id: 's-202',
      assignment_id: 'asg-1',
      work_done: 'Implemented PyTorch custom loss function and executed 100 epochs benchmark.',
      completed_items: 'Loss graph generation, hyperparameter grid search script.',
      blockers: 'Slight gradient exploding issue on batch size 64.',
      next_steps: 'Apply gradient clipping and compile final PDF summary.',
      log_date: new Date().toISOString().split('T')[0]
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      user_id: 's-202',
      title: 'New Assignment Assigned',
      message: 'Prof. Sarah Jenkins assigned "Neural Network Optimization". Due in 2 days.',
      type: 'assignment',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'notif-2',
      user_id: 't-101',
      title: 'New Student Submission',
      message: 'Alex Rivera submitted work for "REST API Authentication". Review required.',
      type: 'submission',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ]
};
