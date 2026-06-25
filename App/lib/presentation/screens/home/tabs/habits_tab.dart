import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../data/models/habit_model.dart';

class HabitsTab extends ConsumerWidget {
  const HabitsTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final habitsAsync = ref.watch(habitsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Thói quen'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddHabitSheet(context, ref),
          ),
        ],
      ),
      body: habitsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Lỗi: $e', style: const TextStyle(color: AppColors.danger))),
        data: (habits) => _HabitsList(habits: habits),
      ),
    );
  }

  void _showAddHabitSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _AddHabitSheet(onSaved: () => ref.invalidate(habitsProvider)),
    );
  }
}

class _HabitsList extends ConsumerWidget {
  final List<HabitToday> habits;
  const _HabitsList({required this.habits});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final done = habits.where((h) => h.isDoneToday).length;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Progress summary
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.success.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              const Icon(Icons.local_fire_department, color: AppColors.warning, size: 32),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Hôm nay', style: context.textTheme.labelMedium?.copyWith(color: AppColors.grey600)),
                  Text('$done/${habits.length} hoàn thành',
                      style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                ],
              ),
              if (habits.isNotEmpty) ...[
                const Spacer(),
                CircularProgressIndicator(
                  value: done / habits.length,
                  color: AppColors.success,
                  backgroundColor: AppColors.grey200,
                  strokeWidth: 6,
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 24),
        Text('Danh sách thói quen',
            style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 12),
        if (habits.isEmpty)
          const Center(
            child: Padding(
              padding: EdgeInsets.only(top: 40),
              child: Column(
                children: [
                  Icon(Icons.check_circle_outline, size: 48, color: AppColors.grey400),
                  SizedBox(height: 12),
                  Text('Thêm thói quen đầu tiên của bạn',
                      style: TextStyle(color: AppColors.grey600)),
                ],
              ),
            ),
          )
        else
          ...habits.map((h) => _HabitCard(habit: h)),
      ],
    );
  }
}

class _HabitCard extends ConsumerWidget {
  final HabitToday habit;
  const _HabitCard({required this.habit});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: habit.isDoneToday ? AppColors.success : AppColors.grey100),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: ListTile(
        leading: Container(
          width: 42,
          height: 42,
          decoration: BoxDecoration(
            color: habit.isDoneToday ? AppColors.success.withOpacity(0.15) : AppColors.grey100,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(
            child: Text(habit.icon ?? '✅', style: const TextStyle(fontSize: 20)),
          ),
        ),
        title: Text(
          habit.name,
          style: context.textTheme.bodyMedium?.copyWith(
            fontWeight: FontWeight.w600,
            decoration: habit.isDoneToday ? TextDecoration.lineThrough : null,
            color: habit.isDoneToday ? AppColors.grey400 : null,
          ),
        ),
        subtitle: habit.currentStreak > 0
            ? Text('🔥 ${habit.currentStreak} ngày liên tiếp',
                style: context.textTheme.labelSmall?.copyWith(color: AppColors.warning))
            : null,
        trailing: GestureDetector(
          onTap: () => _toggleDone(ref),
          child: Container(
            width: 30,
            height: 30,
            decoration: BoxDecoration(
              color: habit.isDoneToday ? AppColors.success : AppColors.white,
              border: Border.all(
                color: habit.isDoneToday ? AppColors.success : AppColors.grey300,
                width: 2,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
            child: habit.isDoneToday
                ? const Icon(Icons.check, color: Colors.white, size: 18)
                : null,
          ),
        ),
      ),
    );
  }

  Future<void> _toggleDone(WidgetRef ref) async {
    try {
      await ref.read(habitsApiProvider).logToday(habit.id, !habit.isDoneToday);
      ref.invalidate(habitsProvider);
    } catch (_) {}
  }
}

class _AddHabitSheet extends StatefulWidget {
  final VoidCallback onSaved;
  const _AddHabitSheet({required this.onSaved});

  @override
  State<_AddHabitSheet> createState() => _AddHabitSheetState();
}

class _AddHabitSheetState extends State<_AddHabitSheet> {
  final _name = TextEditingController();
  String _icon = '✅';
  bool _saving = false;

  static const _icons = ['✅', '💪', '📚', '🏃', '🧘', '💧', '🍎', '💤', '✏️', '🎯'];

  @override
  Widget build(BuildContext context) {
    return Consumer(builder: (context, ref, _) {
      return Padding(
        padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(context).viewInsets.bottom + 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Thêm thói quen', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 16),
            TextField(
              controller: _name,
              decoration: const InputDecoration(labelText: 'Tên thói quen'),
              autofocus: true,
            ),
            const SizedBox(height: 16),
            Text('Biểu tượng', style: context.textTheme.labelMedium),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: _icons.map((icon) => GestureDetector(
                onTap: () => setState(() => _icon = icon),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: _icon == icon ? AppColors.primary.withOpacity(0.1) : AppColors.grey100,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: _icon == icon ? AppColors.primary : Colors.transparent),
                  ),
                  child: Center(child: Text(icon, style: const TextStyle(fontSize: 20))),
                ),
              )).toList(),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _saving ? null : () => _save(ref),
                child: _saving ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) : const Text('Lưu'),
              ),
            ),
          ],
        ),
      );
    });
  }

  Future<void> _save(WidgetRef ref) async {
    if (_name.text.trim().isEmpty) return;
    setState(() => _saving = true);
    try {
      await ref.read(habitsApiProvider).create({'name': _name.text.trim(), 'icon': _icon, 'frequency': 'daily'});
      widget.onSaved();
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) context.showSnack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }
}
