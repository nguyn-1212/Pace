import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../data/models/goal_model.dart';

class GoalsTab extends ConsumerStatefulWidget {
  const GoalsTab({super.key});

  @override
  ConsumerState<GoalsTab> createState() => _GoalsTabState();
}

class _GoalsTabState extends ConsumerState<GoalsTab> {
  String _selectedArea = 'all';

  static const _areas = [
    ('all', 'Tất cả'),
    ('study', '📚 Học tập'),
    ('health', '💪 Sức khỏe'),
    ('finance', '💰 Tài chính'),
    ('personal', '🌟 Cá nhân'),
  ];

  @override
  Widget build(BuildContext context) {
    final goalsAsync = ref.watch(goalsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mục tiêu'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddSheet(context),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _areas.map((a) {
                final selected = _selectedArea == a.$1;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: _AreaChip(
                    label: a.$2,
                    selected: selected,
                    onTap: () => setState(() => _selectedArea = a.$1),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),
          goalsAsync.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: AppColors.danger)),
            data: (goals) {
              final filtered = _selectedArea == 'all'
                  ? goals
                  : goals.where((g) => g.area == _selectedArea).toList();
              if (filtered.isEmpty) {
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.only(top: 40),
                    child: Column(
                      children: [
                        Icon(Icons.track_changes_outlined, size: 48, color: AppColors.grey400),
                        SizedBox(height: 12),
                        Text('Đặt mục tiêu đầu tiên của bạn', style: TextStyle(color: AppColors.grey600)),
                      ],
                    ),
                  ),
                );
              }
              return Column(children: filtered.map((g) => _GoalCard(goal: g)).toList());
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddSheet(context),
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  void _showAddSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _AddGoalSheet(onSaved: () => ref.invalidate(goalsProvider)),
    );
  }
}

class _GoalCard extends StatelessWidget {
  final Goal goal;
  const _GoalCard({required this.goal});

  static const _areaColors = {
    'study': AppColors.primary,
    'health': AppColors.success,
    'finance': AppColors.warning,
    'personal': AppColors.secondary,
  };

  @override
  Widget build(BuildContext context) {
    final color = _areaColors[goal.area] ?? AppColors.primary;
    final hasProgress = goal.targetValue != null && goal.targetValue! > 0;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.grey100),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(goal.title, style: context.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
              ),
              if (goal.deadline != null)
                Text(goal.deadline!.ddMMyyyy,
                    style: context.textTheme.labelSmall?.copyWith(color: AppColors.grey400)),
            ],
          ),
          if (goal.description != null && goal.description!.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(goal.description!, style: context.textTheme.bodySmall?.copyWith(color: AppColors.grey500)),
          ],
          if (hasProgress) ...[
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${(goal.progress * 100).toStringAsFixed(0)}%',
                    style: context.textTheme.labelSmall?.copyWith(color: color, fontWeight: FontWeight.w600)),
                Text('${goal.currentValue?.compact ?? '0'} / ${goal.targetValue?.compact ?? '0'}',
                    style: context.textTheme.labelSmall?.copyWith(color: AppColors.grey500)),
              ],
            ),
            const SizedBox(height: 6),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: goal.progress,
                backgroundColor: AppColors.grey200,
                color: color,
                minHeight: 6,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _AreaChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _AreaChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : AppColors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: selected ? AppColors.primary : AppColors.grey200),
        ),
        child: Text(
          label,
          style: context.textTheme.labelMedium?.copyWith(
            color: selected ? Colors.white : AppColors.grey600,
            fontWeight: selected ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}

class _AddGoalSheet extends ConsumerStatefulWidget {
  final VoidCallback onSaved;
  const _AddGoalSheet({required this.onSaved});

  @override
  ConsumerState<_AddGoalSheet> createState() => _AddGoalSheetState();
}

class _AddGoalSheetState extends ConsumerState<_AddGoalSheet> {
  final _title = TextEditingController();
  final _desc = TextEditingController();
  final _target = TextEditingController();
  String _area = 'personal';
  bool _saving = false;

  static const _areas = [
    ('personal', '🌟 Cá nhân'),
    ('study', '📚 Học tập'),
    ('health', '💪 Sức khỏe'),
    ('finance', '💰 Tài chính'),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(context).viewInsets.bottom + 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Thêm mục tiêu', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          TextField(controller: _title, decoration: const InputDecoration(labelText: 'Tên mục tiêu'), autofocus: true),
          const SizedBox(height: 12),
          TextField(controller: _desc, decoration: const InputDecoration(labelText: 'Mô tả (tùy chọn)')),
          const SizedBox(height: 12),
          DropdownButtonFormField<String>(
            value: _area,
            decoration: const InputDecoration(labelText: 'Lĩnh vực'),
            items: _areas.map((a) => DropdownMenuItem(value: a.$1, child: Text(a.$2))).toList(),
            onChanged: (v) => setState(() => _area = v ?? 'personal'),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _target,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Mục tiêu số (tùy chọn)'),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _saving ? null : _save,
              child: _saving
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
                  : const Text('Lưu'),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _save() async {
    if (_title.text.trim().isEmpty) return;
    setState(() => _saving = true);
    try {
      await ref.read(goalsApiProvider).create({
        'title': _title.text.trim(),
        'description': _desc.text.trim(),
        'area': _area,
        if (_target.text.isNotEmpty) 'targetValue': double.tryParse(_target.text),
      });
      widget.onSaved();
      if (mounted) Navigator.pop(context);
    } catch (e) {
      if (mounted) context.showSnack('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }
}
