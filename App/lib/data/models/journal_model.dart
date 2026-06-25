class Journal {
  final int id;
  final String title;
  final String content;
  final String? mood;
  final DateTime date;

  const Journal({
    required this.id,
    required this.title,
    required this.content,
    this.mood,
    required this.date,
  });

  factory Journal.fromJson(Map<String, dynamic> j) => Journal(
        id: j['id'] as int,
        title: j['title'] as String,
        content: j['content'] as String,
        mood: j['mood'] as String?,
        date: DateTime.parse(j['date'] as String),
      );
}
