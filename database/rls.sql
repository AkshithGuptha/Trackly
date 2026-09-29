-- ====================================================================
-- TRACKLY ROW LEVEL SECURITY (RLS) POLICIES
-- Strict data isolation between Students, Teachers, and Unauthenticated Users
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- --------------------------------------------------------------------
-- Anyone authenticated can view their own profile or profiles connected to them
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.teacher_students
        WHERE (teacher_id = auth.uid() AND student_id = public.profiles.id)
           OR (student_id = auth.uid() AND teacher_id = public.profiles.id)
    ));

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. TEACHER-STUDENT RELATIONSHIPS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Teachers and students can view their linked connections"
    ON public.teacher_students FOR SELECT
    USING (teacher_id = auth.uid() OR student_id = auth.uid());

CREATE POLICY "Students can link themselves using classroom code"
    ON public.teacher_students FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Teachers can remove student linkage"
    ON public.teacher_students FOR DELETE
    USING (teacher_id = auth.uid());

-- --------------------------------------------------------------------
-- 3. ASSIGNMENTS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Students can view assigned assignments"
    ON public.assignments FOR SELECT
    USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Teachers can create assignments for connected students"
    ON public.assignments FOR INSERT
    WITH CHECK (teacher_id = auth.uid() AND EXISTS (
        SELECT 1 FROM public.teacher_students
        WHERE teacher_id = auth.uid() AND student_id = public.assignments.student_id
    ));

CREATE POLICY "Teachers or assigned students can update assignment status/progress"
    ON public.assignments FOR UPDATE
    USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their created assignments"
    ON public.assignments FOR DELETE
    USING (teacher_id = auth.uid());

-- --------------------------------------------------------------------
-- 4. PROJECTS & PROJECT TASKS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "View projects"
    ON public.projects FOR SELECT
    USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "Teachers create projects"
    ON public.projects FOR INSERT
    WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Update projects"
    ON public.projects FOR UPDATE
    USING (student_id = auth.uid() OR teacher_id = auth.uid());

CREATE POLICY "View project tasks"
    ON public.project_tasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_tasks.project_id
          AND (projects.student_id = auth.uid() OR projects.teacher_id = auth.uid())
    ));

CREATE POLICY "Update project tasks"
    ON public.project_tasks FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_tasks.project_id
          AND (projects.student_id = auth.uid() OR projects.teacher_id = auth.uid())
    ));

CREATE POLICY "Insert project tasks"
    ON public.project_tasks FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.projects
        WHERE projects.id = project_tasks.project_id
          AND projects.teacher_id = auth.uid()
    ));

-- --------------------------------------------------------------------
-- 5. SUBMISSIONS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "View submissions"
    ON public.submissions FOR SELECT
    USING (student_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.teacher_students
        WHERE teacher_id = auth.uid() AND student_id = public.submissions.student_id
    ));

CREATE POLICY "Students create submissions"
    ON public.submissions FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Update submissions"
    ON public.submissions FOR UPDATE
    USING (student_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.teacher_students
        WHERE teacher_id = auth.uid() AND student_id = public.submissions.student_id
    ));

-- --------------------------------------------------------------------
-- 6. PROGRESS UPDATES POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "View progress updates"
    ON public.progress_updates FOR SELECT
    USING (student_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.teacher_students
        WHERE teacher_id = auth.uid() AND student_id = public.progress_updates.student_id
    ));

CREATE POLICY "Students create progress updates"
    ON public.progress_updates FOR INSERT
    WITH CHECK (student_id = auth.uid());

-- --------------------------------------------------------------------
-- 7. NOTIFICATIONS POLICIES
-- --------------------------------------------------------------------
CREATE POLICY "Users read own notifications"
    ON public.notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "System/Teachers create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (TRUE);
