import 'package:dio/dio.dart';
import '../../core/network/dio_client.dart';
import '../models/habit_model.dart';

class HabitsApi {
  final Dio _dio = DioClient.instance;

  Future<List<HabitToday>> getToday() async {
    final res = await _dio.get('/habits/today');
    return (res.data as List).map((e) => HabitToday.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<List<Habit>> getAll() async {
    final res = await _dio.get('/habits');
    return (res.data as List).map((e) => Habit.fromJson(e as Map<String, dynamic>)).toList();
  }

  Future<Habit> create(Map<String, dynamic> data) async {
    final res = await _dio.post('/habits', data: data);
    return Habit.fromJson(res.data as Map<String, dynamic>);
  }

  Future<void> logToday(int habitId, bool completed) async {
    await _dio.post('/habitlogs', data: {
      'habitId': habitId,
      'logDate': DateTime.now().toIso8601String().split('T').first,
      'isCompleted': completed,
    });
  }

  Future<void> delete(int id) async {
    await _dio.delete('/habits/$id');
  }
}
