import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import 'tabs/dashboard_tab.dart';
import 'tabs/finance_tab.dart';
import 'tabs/habits_tab.dart';
import 'tabs/journey_tab.dart';
import 'tabs/goals_tab.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _tab = 0;

  final _tabs = const [
    DashboardTab(),
    FinanceTab(),
    HabitsTab(),
    JourneyTab(),
    GoalsTab(),
  ];

  static const _navItems = [
    BottomNavigationBarItem(icon: Icon(Icons.home_outlined),      activeIcon: Icon(Icons.home),      label: 'Home'),
    BottomNavigationBarItem(icon: Icon(Icons.wallet_outlined),    activeIcon: Icon(Icons.wallet),    label: 'Finance'),
    BottomNavigationBarItem(icon: Icon(Icons.check_circle_outline), activeIcon: Icon(Icons.check_circle), label: 'Habits'),
    BottomNavigationBarItem(icon: Icon(Icons.book_outlined),      activeIcon: Icon(Icons.book),      label: 'Journey'),
    BottomNavigationBarItem(icon: Icon(Icons.track_changes_outlined), activeIcon: Icon(Icons.track_changes), label: 'Goals'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _tab,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _tab,
        onTap: (i) => setState(() => _tab = i),
        items: _navItems,
        selectedItemColor: AppColors.primary,
        unselectedItemColor: AppColors.grey400,
        backgroundColor: AppColors.white,
        type: BottomNavigationBarType.fixed,
        selectedFontSize: 11,
        unselectedFontSize: 11,
        elevation: 12,
      ),
    );
  }
}
