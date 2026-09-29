import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthRefreshNotifier extends ChangeNotifier {
  AuthRefreshNotifier() {
    Supabase.instance.client.auth.onAuthStateChange.listen((_) => notifyListeners());
  }
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final refresh = AuthRefreshNotifier();
  ref.onDispose(refresh.dispose);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: refresh,
    redirect: (context, state) {
      final loggedIn = Supabase.instance.client.auth.currentSession != null;
      if (!loggedIn && state.matchedLocation != '/login') return '/login';
      if (loggedIn && state.matchedLocation == '/login') return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
    ],
  );
});

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  bool loading = false;
  String? error;

  Future<void> submit() async {
    setState(() { loading = true; error = null; });
    try {
      await Supabase.instance.client.auth.signInWithPassword(
        email: email.text.trim(), password: password.text,
      );
      if (mounted) context.go('/dashboard');
    } on AuthException catch (e) {
      setState(() => error = e.message);
    } catch (_) {
      setState(() => error = 'Unable to sign in. Check your connection and try again.');
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 460),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('TRACKLY', style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text('Track your work. See your progress.', style: Theme.of(context).textTheme.bodyLarge),
                const SizedBox(height: 32),
                TextField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email')),
                const SizedBox(height: 14),
                TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password')),
                if (error != null) ...[
                  const SizedBox(height: 12),
                  Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                ],
                const SizedBox(height: 20),
                FilledButton(onPressed: loading ? null : submit, child: Text(loading ? 'Signing in…' : 'Sign in')),
              ],
            ),
          ),
        ),
      ),
    ),
  );

  @override
  void dispose() { email.dispose(); password.dispose(); super.dispose(); }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  Future<Map<String, dynamic>?> loadProfile() async {
    final user = Supabase.instance.client.auth.currentUser;
    if (user == null) return null;
    return Supabase.instance.client.from('profiles').select('full_name,role').eq('id', user.id).maybeSingle();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Trackly'),
      actions: [IconButton(onPressed: () => Supabase.instance.client.auth.signOut(), icon: const Icon(Icons.logout))],
    ),
    body: FutureBuilder<Map<String, dynamic>?>(
      future: loadProfile(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) return const Center(child: CircularProgressIndicator());
        final profile = snapshot.data;
        final name = profile?['full_name'] ?? 'there';
        final role = profile?['role'] ?? 'student';
        return ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text('Welcome, $name', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
            const SizedBox(height: 6),
            Text(role == 'teacher' ? 'Teacher workspace' : 'Student workspace'),
            const SizedBox(height: 24),
            const _StatCard(title: 'Assignments', icon: Icons.assignment_outlined),
            const _StatCard(title: 'Projects', icon: Icons.folder_outlined),
            const _StatCard(title: 'Progress', icon: Icons.trending_up),
          ],
        );
      },
    ),
  );
}

class _StatCard extends StatelessWidget {
  final String title;
  final IconData icon;
  const _StatCard({required this.title, required this.icon});
  @override
  Widget build(BuildContext context) => Card(
    margin: const EdgeInsets.only(bottom: 14),
    child: ListTile(
      leading: CircleAvatar(child: Icon(icon)),
      title: Text(title),
      subtitle: const Text('Open the Trackly workspace to manage this area'),
      trailing: const Icon(Icons.chevron_right),
    ),
  );
}