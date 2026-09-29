-- ====================================================================
-- TRACKLY SAMPLE SEED DATA & STORAGE CONFIGURATION
-- ====================================================================

-- Storage Buckets Creation (Run in Supabase SQL Editor or Dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated Upload Avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Submissions Access Policy" ON storage.objects FOR SELECT USING (bucket_id = 'submissions' AND auth.role() = 'authenticated');
CREATE POLICY "Submissions Upload Policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'submissions' AND auth.role() = 'authenticated');

CREATE POLICY "Project Files Policy" ON storage.objects FOR SELECT USING (bucket_id = 'project-files' AND auth.role() = 'authenticated');
CREATE POLICY "Project Files Upload Policy" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.role() = 'authenticated');
