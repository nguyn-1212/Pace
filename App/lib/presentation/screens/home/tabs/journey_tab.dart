import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../data/models/journal_model.dart';

class JourneyTab extends ConsumerWidget {
  const JourneyTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final journalsAsync = ref.watch(journalsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nhật ký'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _MoodCard(),
          const SizedBox(height: 24),
          Text('Nhật ký gần đây',
              style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          journalsAsync.when(
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (e, _) => Text('Lỗi: $e', style: const TextStyle(color: AppColors.danger)),
            data: (journals) => journals.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.only(top: 40),
                      child: Column(
                        children: [
                          Icon(Icons.book_outlined, size: 48, color: AppColors.grey400),
                          SizedBox(height: 12),
                          Text('Viết nhật ký đầu tiên của bạn',
                              style: TextStyle(color: AppColors.grey600)),
                        ],
                      ),
                    ),
                  )
                : Column(children: journals.map((j) => _JournalCard(journal: j)).toList()),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showWriteSheet(context, ref),
        icon: const Icon(Icons.edit),
        label: const Text('Viết nhật ký'),
        backgroundColor: AppColors.secondary,
      ),
    );
  }

  void _showWriteSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => _WriteJournalSheet(onSaved: () => ref.invalidate(journalsProvider)),
    );
  }
}

class _MoodCard extends StatefulWidget {
  @override
  State<_MoodCard> createState() => _MoodCardState();
}

class _MoodCardState extends State<_MoodCard> {
  String? _selected;

  static const _moods = [
    ('happy', '😊', 'Vui'),
    ('sad', '😔', 'Buồn'),
    ('angry', '😤', 'Tức'),
    ('anxious', '😰', 'Lo'),
    ('excited', '🤩', 'Hứng'),
    ('tired', '😴', 'Mệt'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.secondary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Hôm nay bạn cảm thấy thế nào?',
              style: context.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w600)),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: _moods.map((m) => GestureDetector(
              onTap: () => setState(() => _selected = m.$1),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _selected == m.$1 ? AppColors.secondary.withOpacity(0.15) : Colors.transparent,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  children: [
                    Text(m.$2, style: TextStyle(fontSize: _selected == m.$1 ? 32 : 26)),
                    const SizedBox(height: 4),
                    Text(m.$3, style: context.textTheme.labelSmall?.copyWith(
                      color: _selected == m.$1 ? AppColors.secondary : AppColors.grey600,
                      fontWeight: _selected == m.$1 ? FontWeight.w600 : FontWeight.normal,
                    )),
                  ],
                ),
              ),
            )).toList(),
          ),
        ],
      ),
    );
  }
}

class _JournalCard extends StatelessWidget {
  final Journal journal;
  const _JournalCard({required this.journal});

  static const _moodEmojis = {
    'happy': '😊',
    'sad': '😔',
    'angry': '😤',
    'anxious': '😰',
    'excited': '🤩',
    'tired': '😴',
  };

  @override
  Widget build(BuildContext context) {
    final emoji = journal.mood != null ? _moodEmojis[journal.mood] : null;
    final preview = journal.content.length > 80 ? '${journal.content.substring(0, 80)}...' : journal.content;

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
              Expanded(
                child: Text(journal.title,
                    style: context.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w600)),
              ),
              if (emoji != null) Text(emoji, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 4),
              Text(journal.date.ddMMyyyy,
                  style: context.textTheme.labelSmall?.copyWith(color: AppColors.grey400)),
            ],
          ),
          const SizedBox(height: 8),
          Text(preview, style: context.textTheme.bodySmall?.copyWith(color: AppColors.grey600)),
        ],
      ),
    );
  }
}

class _WriteJournalSheet extends ConsumerStatefulWidget {
  final VoidCallback onSaved;
  const _WriteJournalSheet({required this.onSaved});

  @override
  ConsumerState<_WriteJournalSheet> createState() => _WriteJournalSheetState();
}

class _WriteJournalSheetState extends ConsumerState<_WriteJournalSheet> {
  final _title = TextEditingController();
  final _content = TextEditingController();
  String? _mood;
  bool _saving = false;

  static const _moods = [
    ('happy', '😊'),
    ('sad', '😔'),
    ('angry', '😤'),
    ('anxious', '😰'),
    ('excited', '🤩'),
    ('tired', '😴'),
  ];

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(context).viewInsets.bottom + 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Viết nhật ký', style: context.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          TextField(controller: _title, decoration: const InputDecoration(labelText: 'Tiêu đề'), autofocus: true),
          const SizedBox(height: 12),
          TextField(
            controller: _content,
            decoration: const InputDecoration(labelText: 'Nội dung'),
            maxLines: 4,
          ),
          const SizedBox(height: 12),
          Text('Tâm trạng', style: context.textTheme.labelMedium),
          const SizedBox(height: 8),
          Row(
            children: _moods.map((m) => GestureDetector(
              onTap: () => setState(() => _mood = m.$1),
              child: Container(
                margin: const EdgeInsets.only(right: 8),
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: _mood == m.$1 ? AppColors.secondary.withOpacity(0.15) : AppColors.grey100,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _mood == m.$1 ? AppColors.secondary : Colors.transparent),
                ),
                child: Text(m.$2, style: const TextStyle(fontSize: 22)),
              ),
            )).toList(),
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
    if (_title.text.trim().isEmpty || _content.text.trim().isEmpty) {
      context.showSnack('Vui lòng nhập tiêu đề và nội dung');
      return;
    }
    setState(() => _saving = true);
    try {
      await ref.read(journalsApiProvider).create({
        'title': _title.text.trim(),
        'content': _content.text.trim(),
        if (_mood != null) 'mood': _mood,
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
