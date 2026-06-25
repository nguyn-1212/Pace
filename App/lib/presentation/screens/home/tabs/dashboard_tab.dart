import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../data/remote/dashboard_api.dart';

final dashboardProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  return DashboardApi().get();
});

class DashboardTab extends ConsumerWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tổng quan'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(dashboardProvider.future),
        child: state.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Center(child: Text('Lỗi: $e')),
          data: (data) => _DashboardContent(data: data),
        ),
      ),
    );
  }
}

class _DashboardContent extends StatelessWidget {
  final Map<String, dynamic> data;
  const _DashboardContent({required this.data});

  @override
  Widget build(BuildContext context) {
    final finance = data['Finance'] as Map<String, dynamic>? ?? {};
    final goals = data['Goals'] as Map<String, dynamic>? ?? {};
    final habits = data['Habits'] as Map<String, dynamic>? ?? {};
    final debts = data['Debts'] as Map<String, dynamic>? ?? {};

    final income = (finance['Income'] as num?)?.toDouble() ?? 0;
    final expense = (finance['Expense'] as num?)?.toDouble() ?? 0;
    final balance = income - expense;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Finance summary card
        _FinanceCard(income: income, expense: expense, balance: balance),
        const SizedBox(height: 16),

        // Stats row
        Row(
          children: [
            Expanded(
              child: _StatCard(
                icon: Icons.track_changes,
                color: AppColors.primary,
                label: 'Goals đang chạy',
                value: '${goals['Active'] ?? 0}',
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _StatCard(
                icon: Icons.check_circle,
                color: AppColors.success,
                label: 'Habits xong hôm nay',
                value: '${habits['DoneToday'] ?? 0}/${habits['Active'] ?? 0}',
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _StatCard(
                icon: Icons.money_off,
                color: AppColors.danger,
                label: 'Nợ chưa trả',
                value: ((debts['TotalUnpaid'] as num?) ?? 0).toDouble().vnd,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _StatCard(
                icon: Icons.book,
                color: AppColors.secondary,
                label: 'Nhật ký tháng này',
                value: '${data['Journal']?['ThisMonth'] ?? 0}',
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _FinanceCard extends StatelessWidget {
  final double income, expense, balance;
  const _FinanceCard({required this.income, required this.expense, required this.balance});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, Color(0xFF1A3FCC)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tháng này',
            style: context.textTheme.labelMedium?.copyWith(color: Colors.white70),
          ),
          const SizedBox(height: 4),
          Text(
            balance >= 0 ? '+${balance.vnd}đ' : '${balance.vnd}đ',
            style: context.textTheme.headlineMedium?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      const Icon(Icons.arrow_downward, size: 14, color: Color(0xFF86EFAC)),
                      const SizedBox(width: 4),
                      Text('Thu nhập', style: context.textTheme.labelSmall?.copyWith(color: Colors.white70)),
                    ]),
                    Text('${income.vnd}đ',
                        style: context.textTheme.titleSmall?.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      const Icon(Icons.arrow_upward, size: 14, color: Color(0xFFFCA5A5)),
                      const SizedBox(width: 4),
                      Text('Chi tiêu', style: context.textTheme.labelSmall?.copyWith(color: Colors.white70)),
                    ]),
                    Text('${expense.vnd}đ',
                        style: context.textTheme.titleSmall?.copyWith(
                            color: Colors.white, fontWeight: FontWeight.w600)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final Color color;
  final String label;
  final String value;

  const _StatCard({required this.icon, required this.color, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.grey200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 12),
          Text(value,
              style: context.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 2),
          Text(label,
              style: context.textTheme.labelSmall?.copyWith(color: AppColors.grey600)),
        ],
      ),
    );
  }
}
