import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../data/models/transaction_model.dart';

class FinanceTab extends ConsumerStatefulWidget {
  const FinanceTab({super.key});

  @override
  ConsumerState<FinanceTab> createState() => _FinanceTabState();
}

class _FinanceTabState extends ConsumerState<FinanceTab> {
  late int _year;
  late int _month;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _year = now.year;
    _month = now.month;
  }

  @override
  Widget build(BuildContext context) {
    final summaryAsync = ref.watch(transactionSummaryProvider((_year, _month)));
    final txAsync = ref.watch(transactionsProvider((_year, _month)));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tài chính'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddSheet(context),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(transactionSummaryProvider((_year, _month)));
          ref.invalidate(transactionsProvider((_year, _month)));
        },
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _MonthSelector(
              year: _year,
              month: _month,
              onChanged: (y, m) => setState(() {
                _year = y;
                _month = m;
              }),
            ),
            const SizedBox(height: 16),
            summaryAsync.when(
              loading: () => const _SummaryCardSkeleton(),
              error: (e, _) => const SizedBox.shrink(),
              data: (s) => _SummaryCard(summary: s),
            ),
            const SizedBox(height: 24),
            Text('Giao dịch', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            txAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: AppColors.danger)),
              data: (txs) => txs.isEmpty
                  ? const _EmptyTransactions()
                  : Column(children: txs.map((t) => _TransactionCard(tx: t)).toList()),
            ),
          ],
        ),
      ),
    );
  }

  void _showAddSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _AddTransactionSheet(
        onSaved: () {
          ref.invalidate(transactionSummaryProvider((_year, _month)));
          ref.invalidate(transactionsProvider((_year, _month)));
        },
      ),
    );
  }
}

class _MonthSelector extends StatelessWidget {
  final int year;
  final int month;
  final void Function(int y, int m) onChanged;

  const _MonthSelector({required this.year, required this.month, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () {
            if (month == 1) onChanged(year - 1, 12);
            else onChanged(year, month - 1);
          },
        ),
        Text('Tháng $month/$year',
            style: context.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: () {
            if (month == 12) onChanged(year + 1, 1);
            else onChanged(year, month + 1);
          },
        ),
      ],
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final TransactionSummary summary;
  const _SummaryCard({required this.summary});

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
        boxShadow: [
          BoxShadow(color: AppColors.primary.withOpacity(0.3), blurRadius: 16, offset: const Offset(0, 6)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Số dư', style: context.textTheme.labelMedium?.copyWith(color: Colors.white70)),
          const SizedBox(height: 4),
          Text(summary.balance.vnd,
              style: context.textTheme.headlineSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w700,
              )),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _SummaryItem(label: 'Thu nhập', value: summary.totalIncome, color: const Color(0xFF4DFFD4))),
              Expanded(child: _SummaryItem(label: 'Chi tiêu', value: summary.totalExpense, color: const Color(0xFFFF8F8F))),
            ],
          ),
        ],
      ),
    );
  }
}

class _SummaryItem extends StatelessWidget {
  final String label;
  final double value;
  final Color color;
  const _SummaryItem({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: context.textTheme.labelSmall?.copyWith(color: Colors.white60)),
        const SizedBox(height: 2),
        Text(value.vnd, style: context.textTheme.titleSmall?.copyWith(color: color, fontWeight: FontWeight.w600)),
      ],
    );
  }
}

class _SummaryCardSkeleton extends StatelessWidget {
  const _SummaryCardSkeleton();
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 140,
      decoration: BoxDecoration(color: AppColors.grey200, borderRadius: BorderRadius.circular(20)),
    );
  }
}

class _TransactionCard extends StatelessWidget {
  final Transaction tx;
  const _TransactionCard({required this.tx});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 8, offset: const Offset(0, 2))],
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: tx.isIncome ? AppColors.success.withOpacity(0.1) : AppColors.danger.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(child: Text(tx.categoryIcon, style: const TextStyle(fontSize: 20))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tx.categoryName, style: context.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
                if (tx.note != null && tx.note!.isNotEmpty)
                  Text(tx.note!, style: context.textTheme.bodySmall?.copyWith(color: AppColors.grey500)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${tx.isIncome ? '+' : '-'}${tx.amount.vnd}',
                style: context.textTheme.bodyMedium?.copyWith(
                  color: tx.isIncome ? AppColors.success : AppColors.danger,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Text(tx.date.ddMMyyyy, style: context.textTheme.labelSmall?.copyWith(color: AppColors.grey400)),
            ],
          ),
        ],
      ),
    );
  }
}

class _EmptyTransactions extends StatelessWidget {
  const _EmptyTransactions();
  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Padding(
        padding: EdgeInsets.only(top: 40),
        child: Column(
          children: [
            Icon(Icons.receipt_long_outlined, size: 48, color: AppColors.grey400),
            SizedBox(height: 12),
            Text('Chưa có giao dịch nào', style: TextStyle(color: AppColors.grey600)),
          ],
        ),
      ),
    );
  }
}

class _AddTransactionSheet extends ConsumerStatefulWidget {
  final VoidCallback onSaved;
  const _AddTransactionSheet({required this.onSaved});

  @override
  ConsumerState<_AddTransactionSheet> createState() => _AddTransactionSheetState();
}

class _AddTransactionSheetState extends ConsumerState<_AddTransactionSheet> {
  final _amount = TextEditingController();
  final _note = TextEditingController();
  bool _isIncome = false;
  int? _selectedCategoryId;
  bool _saving = false;

  @override
  Widget build(BuildContext context) {
    final categoriesAsync = ref.watch(categoriesProvider);

    return Padding(
      padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(context).viewInsets.bottom + 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Thêm giao dịch', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _isIncome = false),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: !_isIncome ? AppColors.danger : AppColors.grey100,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text('Chi tiêu', textAlign: TextAlign.center,
                        style: TextStyle(color: !_isIncome ? Colors.white : AppColors.grey600, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _isIncome = true),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: _isIncome ? AppColors.success : AppColors.grey100,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text('Thu nhập', textAlign: TextAlign.center,
                        style: TextStyle(color: _isIncome ? Colors.white : AppColors.grey600, fontWeight: FontWeight.w600)),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _amount,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(labelText: 'Số tiền', suffixText: 'đ'),
          ),
          const SizedBox(height: 12),
          categoriesAsync.when(
            loading: () => const CircularProgressIndicator(),
            error: (_, __) => const SizedBox.shrink(),
            data: (cats) {
              final filtered = cats.where((c) => c.isIncome == _isIncome).toList();
              return DropdownButtonFormField<int>(
                value: _selectedCategoryId,
                decoration: const InputDecoration(labelText: 'Danh mục'),
                items: filtered.map((c) => DropdownMenuItem(
                  value: c.id,
                  child: Text('${c.icon} ${c.name}'),
                )).toList(),
                onChanged: (v) => setState(() => _selectedCategoryId = v),
              );
            },
          ),
          const SizedBox(height: 12),
          TextField(controller: _note, decoration: const InputDecoration(labelText: 'Ghi chú (tùy chọn)')),
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
    final amt = double.tryParse(_amount.text.replaceAll(',', '').replaceAll('.', ''));
    if (amt == null || amt <= 0 || _selectedCategoryId == null) {
      context.showSnack('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setState(() => _saving = true);
    try {
      await ref.read(transactionsApiProvider).create({
        'amount': amt,
        'categoryId': _selectedCategoryId,
        'note': _note.text.trim(),
        'date': DateTime.now().toIso8601String(),
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
