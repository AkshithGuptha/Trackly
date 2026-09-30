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
    initialLocation: '/',
    refreshListenable: refresh,
    redirect: (context, state) {
      final loggedIn = Supabase.instance.client.auth.currentSession != null;
      if (!loggedIn && state.matchedLocation != '/' && state.matchedLocation != '/login' && state.matchedLocation != '/signup') return '/login';
      if (loggedIn && (state.matchedLocation == '/' || state.matchedLocation == '/login' || state.matchedLocation == '/signup')) return '/dashboard';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (_, __) => const LandingScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/signup', builder: (_, __) => const SignupScreen()),
      GoRoute(path: '/dashboard', builder: (_, __) => const DashboardScreen()),
    ],
  );
});

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  void _start(BuildContext context) => context.go('/login');

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Scaffold(
      backgroundColor: const Color(0xFF08090D),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            elevation: 0,
            backgroundColor: const Color(0xE608090D),
            titleSpacing: 20,
            title: Row(children: [
              Container(width: 34, height: 34, decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF1238), Color(0xFFFF6B3D)]), borderRadius: BorderRadius.circular(10)), alignment: Alignment.center, child: const Text('T', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20))),
              const SizedBox(width: 10),
              const Text('Trackly', style: TextStyle(fontWeight: FontWeight.w800, color: Colors.white)),
            ]),
            actions: [Padding(padding: const EdgeInsets.only(right: 14), child: FilledButton(onPressed: () => _start(context), style: FilledButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF111217), padding: const EdgeInsets.symmetric(horizontal: 16)), child: const Text('Get started')))],
          ),
          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.fromLTRB(22, 54, 22, 30),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8), decoration: BoxDecoration(color: const Color(0x1AFF1238), border: Border.all(color: const Color(0x40FF1238)), borderRadius: BorderRadius.circular(30)), child: const Row(mainAxisSize: MainAxisSize.min, children: [
                SizedBox(width: 7, height: 7, child: DecoratedBox(decoration: BoxDecoration(color: Color(0xFFFF1238), shape: BoxShape.circle))),
                SizedBox(width: 8),
                Text('TRACKLY • EDUCATION WORKSPACE', style: TextStyle(color: Color(0xFFFF6B6B), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 1.1)),
              ])),
              const SizedBox(height: 24),
              const Text('Track your work.\nElevate your progress.', style: TextStyle(color: Colors.white, fontSize: 42, height: 1.03, fontWeight: FontWeight.w900, letterSpacing: -1.5)),
              const SizedBox(height: 18),
              Text('One focused workspace for assignments, projects, progress and feedback — built for students and teachers.', style: TextStyle(color: Colors.white.withValues(alpha: .68), fontSize: 17, height: 1.55)),
              const SizedBox(height: 28),
              SizedBox(width: double.infinity, height: 54, child: FilledButton.icon(onPressed: () => _start(context), icon: const Icon(Icons.arrow_forward_rounded), label: const Text('Enter Trackly', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)), style: FilledButton.styleFrom(backgroundColor: const Color(0xFFFF1238), foregroundColor: Colors.white, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))))),
              const SizedBox(height: 34),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [Color(0xFF181B24), Color(0xFF0F1117)]), borderRadius: BorderRadius.circular(24), border: Border.all(color: Colors.white.withValues(alpha: .09)), boxShadow: const [BoxShadow(color: Color(0x55000000), blurRadius: 30, offset: Offset(0, 18))]),
                child: Column(children: [
                  Row(children: [
                    const CircleAvatar(radius: 18, backgroundColor: Color(0xFFFF1238), child: Text('T', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w800))),
                    const SizedBox(width: 10),
                    const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Student workspace', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)), Text('Your progress at a glance', style: TextStyle(color: Color(0xFF858A99), fontSize: 12))])),
                    Container(padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6), decoration: BoxDecoration(color: const Color(0x19FF1238), borderRadius: BorderRadius.circular(10)), child: const Text('ACTIVE', style: TextStyle(color: Color(0xFFFF667D), fontSize: 10, fontWeight: FontWeight.w800))),
                  ]),
                  const SizedBox(height: 20),
                  Row(children: [const _MiniStat(title: 'ACTIVE', value: '03'), const _MiniStat(title: 'PENDING', value: '12'), const _MiniStat(title: 'PROGRESS', value: '78%')]),
                  const SizedBox(height: 16),
                  const _ProgressRow(title: 'Data Structures Project', value: .82),
                  const _ProgressRow(title: 'ML Assignment', value: .58),
                  const _ProgressRow(title: 'Web Development', value: .34),
                ]),
              ),
            ]),
          )),
          SliverToBoxAdapter(child: Container(
            margin: const EdgeInsets.only(top: 10),
            padding: const EdgeInsets.symmetric(vertical: 24),
            color: const Color(0xFF101219),
            child: const SingleChildScrollView(scrollDirection: Axis.horizontal, child: Row(children: [
              SizedBox(width: 22), _Pill(text: 'REAL-TIME TRACKING'), _Pill(text: 'PROJECT PHASES'), _Pill(text: 'PROGRESS INSIGHTS'), _Pill(text: 'SMART WORKFLOW'),
            ])),
          )),
          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.fromLTRB(22, 54, 22, 20),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('BUILT FOR FOCUS', style: TextStyle(color: scheme.primary, fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1.4)),
              const SizedBox(height: 12),
              const Text('Everything you need.\nNothing you don’t.', style: TextStyle(color: Colors.white, fontSize: 32, height: 1.08, fontWeight: FontWeight.w800)),
              const SizedBox(height: 28),
              const _FeatureCard(icon: Icons.dashboard_customize_rounded, title: 'Intuitive dashboards', body: 'See assignments, projects and progress without digging through clutter.'),
              const _FeatureCard(icon: Icons.layers_rounded, title: 'Multi-phase projects', body: 'Break complex work into clear phases, deadlines and measurable progress.'),
              const _FeatureCard(icon: Icons.insights_rounded, title: 'Progress insights', body: 'Turn daily work updates into a clear picture of what is moving and what needs attention.'),
              const _FeatureCard(icon: Icons.check_circle_outline_rounded, title: 'Seamless feedback', body: 'Keep submissions, reviews and teacher feedback connected to the work.'),
            ]),
          )),
          SliverToBoxAdapter(child: Container(
            margin: const EdgeInsets.fromLTRB(22, 28, 22, 60),
            padding: const EdgeInsets.all(26),
            decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF1238), Color(0xFFB80024)]), borderRadius: BorderRadius.circular(28)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              const Text('READY TO TRACK?', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 1.4)),
              const SizedBox(height: 10),
              const Text('Let’s build better\nworkflows together.', style: TextStyle(color: Colors.white, fontSize: 30, height: 1.08, fontWeight: FontWeight.w900)),
              const SizedBox(height: 20),
              OutlinedButton.icon(onPressed: () => _start(context), icon: const Icon(Icons.arrow_forward_rounded), label: const Text('Get started'), style: OutlinedButton.styleFrom(foregroundColor: Colors.white, side: const BorderSide(color: Colors.white54), padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13))),
            ]),
          )),
          const SliverToBoxAdapter(child: Padding(padding: EdgeInsets.only(bottom: 30), child: Center(child: Text('TRACKLY • 2026', style: TextStyle(color: Color(0xFF666B78), fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 1.2))))),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String title, value;
  const _MiniStat({required this.title, required this.value});
  @override Widget build(BuildContext context) => Expanded(child: Container(
    margin: const EdgeInsets.only(right: 8),
    padding: const EdgeInsets.all(12),
    decoration: BoxDecoration(color: Colors.white.withValues(alpha: .035), borderRadius: BorderRadius.circular(14)),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: const TextStyle(color: Color(0xFF777D8C), fontSize: 9, fontWeight: FontWeight.w700)),
      const SizedBox(height: 5),
      Text(value, style: const TextStyle(color: Colors.white, fontSize: 19, fontWeight: FontWeight.w800)),
    ]),
  ));
}

class _ProgressRow extends StatelessWidget {
  final String title;
  final double value;
  const _ProgressRow({required this.title, required this.value});
  @override Widget build(BuildContext context) => Padding(padding: const EdgeInsets.only(bottom: 13), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Row(children: [Expanded(child: Text(title, style: const TextStyle(color: Color(0xFFB9BDCA), fontSize: 12)), Text((value * 100).round().toString() + '%', style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w700))]),
    const SizedBox(height: 7),
    ClipRRect(borderRadius: BorderRadius.circular(10), child: LinearProgressIndicator(value: value, minHeight: 6, backgroundColor: Colors.white10, valueColor: const AlwaysStoppedAnimation(Color(0xFFFF1238)))),
  ]));
}

class _Pill extends StatelessWidget {
  final String text;
  const _Pill({required this.text});
  @override Widget build(BuildContext context) => Container(margin: const EdgeInsets.only(right: 24), child: Row(children: [const Text('•', style: TextStyle(color: Color(0xFFFF1238), fontSize: 18)), const SizedBox(width: 7), Text(text, style: const TextStyle(color: Color(0xFFD5D7DE), fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: .8)]));
}

class _FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title, body;
  const _FeatureCard({required this.icon, required this.title, required this.body});
  @override Widget build(BuildContext context) => Container(
    margin: const EdgeInsets.only(bottom: 14),
    padding: const EdgeInsets.all(20),
    decoration: BoxDecoration(color: const Color(0xFF11141C), borderRadius: BorderRadius.circular(22), border: Border.all(color: Colors.white10)),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Container(width: 44, height: 44, decoration: BoxDecoration(color: const Color(0x19FF1238), borderRadius: BorderRadius.circular(13)), child: Icon(icon, color: const Color(0xFFFF4561), size: 22)),
      const SizedBox(width: 14),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(title, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
        const SizedBox(height: 6),
        Text(body, style: const TextStyle(color: Color(0xFF8B90A0), fontSize: 13, height: 1.45)),
      ])),
    ]),
  );
}

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