class Habit {
  final int id;
  final String name;
  final String? icon;
  final String? color;
  final String frequency;
  final int currentStreak;
  final int longestStreak;
  final bool isActive;

  const Habit({
    required this.id,
    required this.name,
    this.icon,
    this.color,
    required this.frequency,
    required this.currentStreak,
    required this.longestStreak,
    required this.isActive,
  });

  factory Habit.fromJson(Map<String, dynamic> j) => Habit(
        id: j['id'] as int,
        name: j['name'] as String,
        icon: j['icon'] as String?,
        color: j['color'] as String?,
        frequency: j['frequency'] as String? ?? 'daily',
        currentStreak: j['currentStreak'] as int? ?? 0,
        longestStreak: j['longestStreak'] as int? ?? 0,
        isActive: j['isActive'] as bool? ?? true,
      );
}

class HabitToday {
  final int id;
  final String name;
  final String? icon;
  final String? color;
  final bool isDoneToday;
  final int currentStreak;

  const HabitToday({
    required this.id,
    required this.name,
    this.icon,
    this.color,
    required this.isDoneToday,
    required this.currentStreak,
  });

  factory HabitToday.fromJson(Map<String, dynamic> j) => HabitToday(
        id: j['id'] as int,
        name: j['name'] as String,
        icon: j['icon'] as String?,
        color: j['color'] as String?,
        isDoneToday: j['isDoneToday'] as bool? ?? false,
        currentStreak: j['currentStreak'] as int? ?? 0,
      );
}
