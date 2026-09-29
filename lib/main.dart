import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'core/constants/env.dart';
import 'core/theme/app_theme.dart';
import 'routing/app_router.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (Env.supabaseUrl.isNotEmpty && Env.supabaseAnonKey.isNotEmpty) {
    await Supabase.initialize(url: Env.supabaseUrl, anonKey: Env.supabaseAnonKey);
  }
  runApp(const ProviderScope(child: TracklyApp()));
}

class TracklyApp extends ConsumerWidget {
  const TracklyApp({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) => MaterialApp.router(
    title: 'Trackly', debugShowCheckedModeBanner: false,
    theme: AppTheme.lightTheme, darkTheme: AppTheme.darkTheme,
    themeMode: ThemeMode.system, routerConfig: ref.watch(appRouterProvider),
  );
}