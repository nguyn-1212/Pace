class Goal {
  final int id;
  final String title;
  final String? description;
  final String area;
  final double? targetValue;
  final double? currentValue;
  final DateTime? deadline;
  final String status;

  const Goal({
    required this.id,
    required this.title,
    this.description,
    required this.area,
    this.targetValue,
    this.currentValue,
    this.deadline,
    required this.status,
  });

  double get progress {
    if (targetValue == null || targetValue == 0) return 0;
    final v = (currentValue ?? 0) / targetValue!;
    return v.clamp(0.0, 1.0);
  }

  factory Goal.fromJson(Map<String, dynamic> j) => Goal(
        id: j['id'] as int,
        title: j['title'] as String,
        description: j['description'] as String?,
        area: j['area'] as String? ?? 'personal',
        targetValue: j['targetValue'] != null ? (j['targetValue'] as num).toDouble() : null,
        currentValue: j['currentValue'] != null ? (j['currentValue'] as num).toDouble() : null,
        deadline: j['deadline'] != null ? DateTime.parse(j['deadline'] as String) : null,
        status: j['status'] as String? ?? 'active',
      );
}
