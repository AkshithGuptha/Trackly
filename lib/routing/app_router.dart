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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 40),
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
                const SizedBox(height: 12),
                TextButton(
                  onPressed: loading ? null : () => context.go('/signup'),
                  child: const Text("Don't have an account? Sign up"),
                ),
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

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});
  @override State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final name = TextEditingController();
  final email = TextEditingController();
  final password = TextEditingController();
  String role = 'student';
  bool loading = false;
  String? error;
  String? success;

  Future<void> submit() async {
    final fullName = name.text.trim();
    final userEmail = email.text.trim();
    if (fullName.isEmpty || userEmail.isEmpty || password.text.isEmpty) {
      setState(() { error = 'Please fill in all fields.'; success = null; });
      return;
    }
    if (password.text.length < 6) {
      setState(() { error = 'Password must be at least 6 characters.'; success = null; });
      return;
    }

    setState(() { loading = true; error = null; success = null; });
    try {
      final response = await Supabase.instance.client.auth.signUp(
        email: userEmail,
        password: password.text,
        data: {'full_name': fullName, 'role': role},
      );

      if (!mounted) return;
      if (response.session != null) {
        context.go('/dashboard');
      } else {
        setState(() {
          success = 'Account created. Check your email to confirm your account, then sign in.';
        });
      }
    } on AuthException catch (e) {
      setState(() => error = e.message);
    } catch (_) {
      setState(() => error = 'Unable to create your account. Check your connection and try again.');
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
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 24),
                Text('CREATE ACCOUNT', style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                Text('Join Trackly and start tracking your work.', style: Theme.of(context).textTheme.bodyLarge),
                const SizedBox(height: 28),
                TextField(controller: name, textCapitalization: TextCapitalization.words, decoration: const InputDecoration(labelText: 'Full name')),
                const SizedBox(height: 14),
                TextField(controller: email, keyboardType: TextInputType.emailAddress, decoration: const InputDecoration(labelText: 'Email')),
                const SizedBox(height: 14),
                TextField(controller: password, obscureText: true, decoration: const InputDecoration(labelText: 'Password (minimum 6 characters)')),
                const SizedBox(height: 14),
                DropdownButtonFormField<String>(
                  value: role,
                  decoration: const InputDecoration(labelText: 'Account type'),
                  items: const [
                    DropdownMenuItem(value: 'student', child: Text('Student')),
                    DropdownMenuItem(value: 'teacher', child: Text('Teacher')),
                  ],
                  onChanged: loading ? null : (value) => setState(() => role = value ?? 'student'),
                ),
                if (error != null) ...[
                  const SizedBox(height: 12),
                  Text(error!, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                ],
                if (success != null) ...[
                  const SizedBox(height: 12),
                  Text(success!, style: TextStyle(color: Theme.of(context).colorScheme.primary)),
                ],
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: loading ? null : submit,
                  child: Text(loading ? 'Creating account…' : 'Create account'),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: loading ? null : () => context.go('/login'),
                  child: const Text('Already have an account? Sign in'),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );

  @override
  void dispose() { name.dispose(); email.dispose(); password.dispose(); super.dispose(); }
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